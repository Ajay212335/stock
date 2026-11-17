from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
import uuid
from app.database import get_database
from app.models import RelocateRequest

router = APIRouter(prefix="/api/arrangement", tags=["Stock Arrangement & Slotting"])

@router.get("/zones")
def get_zones():
    db = get_database()
    zones = list(db["warehouse_zones"].find())
    stock_items = list(db["stock_items"].find())
    bins = list(db["bin_slots"].find())

    # Calculate real-time occupied bins per zone
    zone_stats = []
    for z in zones:
        z_id = z.get("id")
        z_bins = [b for b in bins if b.get("zone_id") == z_id]
        total_bins = len(z_bins) or z.get("total_bins", 10)
        
        # Bins that have at least one stock item
        occupied_bin_codes = set(
            i.get("bin_id") for i in stock_items 
            if i.get("zone_id") == z_id and i.get("quantity", 0) > 0
        )
        occupied_count = len(occupied_bin_codes)
        utilization_pct = round((occupied_count / total_bins * 100), 1) if total_bins > 0 else 0

        z_copy = dict(z)
        if "_id" in z_copy:
            z_copy["_id"] = str(z_copy["_id"])
        z_copy["total_bins"] = total_bins
        z_copy["occupied_bins"] = occupied_count
        z_copy["utilization_pct"] = utilization_pct
        zone_stats.append(z_copy)

    return zone_stats

@router.get("/bins")
def get_bins(zone_id: Optional[str] = None):
    db = get_database()
    query = {}
    if zone_id and zone_id != "All":
        query["zone_id"] = zone_id

    bins = list(db["bin_slots"].find(query))
    stock_items = list(db["stock_items"].find())

    # Map stock items to their respective bins
    item_map = {}
    for item in stock_items:
        b_id = item.get("bin_id")
        if b_id:
            if b_id not in item_map:
                item_map[b_id] = []
            item_clean = dict(item)
            if "_id" in item_clean:
                item_clean["_id"] = str(item_clean["_id"])
            item_map[b_id].append(item_clean)

    enriched_bins = []
    for b in bins:
        b_clean = dict(b)
        if "_id" in b_clean:
            b_clean["_id"] = str(b_clean["_id"])
        
        bin_code = b_clean.get("bin_code")
        items_in_bin = item_map.get(bin_code, [])
        b_clean["current_items"] = items_in_bin

        # Calculate live occupied weight and volume
        total_weight = sum(it.get("quantity", 0) * it.get("weight_per_unit_kg", 1.0) for it in items_in_bin)
        total_vol = sum(it.get("quantity", 0) * it.get("volume_per_unit_m3", 0.05) for it in items_in_bin)

        b_clean["current_weight_kg"] = round(total_weight, 1)
        b_clean["current_volume_m3"] = round(total_vol, 2)
        
        max_wt = b_clean.get("max_weight_kg", 1000.0)
        max_vol = b_clean.get("max_volume_m3", 5.0)

        weight_pct = round((total_weight / max_wt * 100), 1) if max_wt > 0 else 0
        vol_pct = round((total_vol / max_vol * 100), 1) if max_vol > 0 else 0
        b_clean["weight_occupancy_pct"] = min(weight_pct, 100.0)
        b_clean["volume_occupancy_pct"] = min(vol_pct, 100.0)

        # Status determination
        if len(items_in_bin) == 0:
            b_clean["status"] = "Available"
        elif weight_pct >= 90 or vol_pct >= 90:
            b_clean["status"] = "Full"
        else:
            b_clean["status"] = "Partially Full"

        enriched_bins.append(b_clean)

    return enriched_bins

@router.post("/relocate")
def relocate_stock(req: RelocateRequest):
    db = get_database()
    item = db["stock_items"].find_one({"sku": req.sku})
    if not item:
        raise HTTPException(status_code=404, detail="Stock item not found")

    target_bin = db["bin_slots"].find_one({"bin_code": req.to_bin})
    if not target_bin:
        raise HTTPException(status_code=404, detail=f"Target bin slot '{req.to_bin}' does not exist")

    old_bin = item.get("bin_id", req.from_bin)
    new_zone_id = target_bin.get("zone_id")

    # Update item bin and zone
    db["stock_items"].update_one(
        {"sku": req.sku},
        {"$set": {
            "bin_id": req.to_bin,
            "zone_id": new_zone_id,
            "qr_code_data": f"LOGIX|{req.sku}|{item.get('batch_number', 'LOT')}|{req.to_bin}",
            "updated_at": datetime.now().isoformat()
        }}
    )

    # Log relocation audit
    log_entry = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.now().isoformat(),
        "sku": req.sku,
        "item_name": item.get("name"),
        "action": "RELOCATE",
        "from_location": old_bin,
        "to_location": req.to_bin,
        "quantity": req.quantity or item.get("quantity", 0),
        "user": req.user or "Logistics Coordinator",
        "notes": req.reason or f"Warehouse slot arrangement re-allocation from {old_bin} to {req.to_bin}"
    }
    db["movement_logs"].insert_one(log_entry)

    return {
        "success": True,
        "message": f"Successfully relocated {item.get('name')} from {old_bin} to {req.to_bin}",
        "new_location": req.to_bin,
        "zone_id": new_zone_id
    }

@router.get("/heat-map")
def get_slotting_heat_map():
    """Velocity ABC Slotting Analysis for warehouse optimization."""
    db = get_database()
    stock_items = list(db["stock_items"].find())
    bins = list(db["bin_slots"].find())
    
    # Analyze alignment:
    # Class A: Fast-moving should be in Zone A (near dispatch/receiving docks)
    # Class C: Slow-moving should NOT occupy Zone A
    misplaced_items = []
    perfect_items = []

    for item in stock_items:
        v_class = item.get("velocity_class", "B")
        zone_id = item.get("zone_id", "")
        sku = item.get("sku")
        name = item.get("name")
        bin_id = item.get("bin_id")

        if v_class == "A" and zone_id not in ["ZONE-A", "ZONE-COLD", "ZONE-STAGE"]:
            misplaced_items.append({
                "sku": sku,
                "name": name,
                "velocity_class": v_class,
                "current_bin": bin_id,
                "current_zone": zone_id,
                "issue": "Fast-moving Class-A item slotted deep in secondary storage. Increases forklift pick time.",
                "recommendation": "Relocate to Zone A (e.g. A-01 or A-02 bays) near dispatch docks."
            })
        elif v_class == "C" and zone_id in ["ZONE-A"]:
            misplaced_items.append({
                "sku": sku,
                "name": name,
                "velocity_class": v_class,
                "current_bin": bin_id,
                "current_zone": zone_id,
                "issue": "Slow-moving Class-C item taking up prime dock-adjacent racking.",
                "recommendation": "Relocate to Zone C (Heavy/Bulk) or upper racks in Zone B to free high-frequency bays."
            })
        else:
            perfect_items.append({
                "sku": sku,
                "velocity_class": v_class,
                "current_bin": bin_id,
                "status": "Optimal"
            })

    total_items = len(stock_items)
    optimal_count = len(perfect_items)
    slotting_efficiency_pct = round((optimal_count / total_items * 100), 1) if total_items > 0 else 100.0

    return {
        "slotting_efficiency_score": slotting_efficiency_pct,
        "total_analyzed": total_items,
        "optimal_count": optimal_count,
        "misplaced_count": len(misplaced_items),
        "recommendations": misplaced_items,
        "velocity_summary": {
            "class_a_fast": len([i for i in stock_items if i.get("velocity_class") == "A"]),
            "class_b_medium": len([i for i in stock_items if i.get("velocity_class") == "B"]),
            "class_c_slow": len([i for i in stock_items if i.get("velocity_class") == "C"])
        }
    }
