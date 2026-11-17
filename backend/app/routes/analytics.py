from fastapi import APIRouter
from app.database import get_database, get_status

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/dashboard")
def get_dashboard_metrics():
    db = get_database()
    stock_items = list(db["stock_items"].find())
    zones = list(db["warehouse_zones"].find())
    bins = list(db["bin_slots"].find())
    shipments = list(db["shipment_orders"].find())
    logs = list(db["movement_logs"].find())

    total_skus = len(stock_items)
    total_units = sum(i.get("quantity", 0) for i in stock_items)
    total_weight_kg = sum(i.get("quantity", 0) * i.get("weight_per_unit_kg", 1.0) for i in stock_items)
    low_stock_count = sum(1 for i in stock_items if i.get("quantity", 0) <= i.get("min_threshold", 0))

    total_bins_count = len(bins)
    occupied_bins_count = len(set(i.get("bin_id") for i in stock_items if i.get("quantity", 0) > 0))
    warehouse_utilization_pct = round((occupied_bins_count / total_bins_count * 100), 1) if total_bins_count > 0 else 0

    # Categories breakdown
    categories = {}
    for i in stock_items:
        cat = i.get("category", "General")
        categories[cat] = categories.get(cat, 0) + i.get("quantity", 0)

    # Inbound / Outbound shipments breakdown
    inbound_count = sum(1 for s in shipments if s.get("type") == "INBOUND")
    outbound_count = sum(1 for s in shipments if s.get("type") == "OUTBOUND")
    active_dock_shipments = sum(1 for s in shipments if s.get("status") in ["At Dock", "Unloading", "In Progress"])

    # Velocity distribution
    velocity_counts = {
        "Class A (Fast)": sum(1 for i in stock_items if i.get("velocity_class") == "A"),
        "Class B (Medium)": sum(1 for i in stock_items if i.get("velocity_class") == "B"),
        "Class C (Slow)": sum(1 for i in stock_items if i.get("velocity_class") == "C"),
    }

    return {
        "database_info": get_status(),
        "summary": {
            "total_skus": total_skus,
            "total_units": total_units,
            "total_weight_tonnes": round(total_weight_kg / 1000.0, 2),
            "low_stock_alerts": low_stock_count,
            "warehouse_utilization_pct": warehouse_utilization_pct,
            "total_bins": total_bins_count,
            "occupied_bins": occupied_bins_count,
            "available_bins": total_bins_count - occupied_bins_count,
            "inbound_shipments": inbound_count,
            "outbound_shipments": outbound_count,
            "active_dock_operations": active_dock_shipments,
            "movement_logs_count": len(logs)
        },
        "category_distribution": [
            {"category": k, "units": v} for k, v in categories.items()
        ],
        "velocity_distribution": [
            {"label": k, "count": v} for k, v in velocity_counts.items()
        ]
    }
