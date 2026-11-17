from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from datetime import datetime
import uuid
from app.database import get_database
from app.models import StockItem

router = APIRouter(prefix="/api/inventory", tags=["Inventory"])

@router.get("/")
def get_inventory(
    search: Optional[str] = None,
    category: Optional[str] = None,
    zone: Optional[str] = None,
    status: Optional[str] = None
):
    db = get_database()
    col = db["stock_items"]
    query = {}
    if category and category != "All":
        query["category"] = category
    if zone and zone != "All":
        query["zone_id"] = zone
    if status and status != "All":
        query["status"] = status
    
    items = list(col.find(query))
    if search:
        s = search.lower()
        items = [
            i for i in items
            if s in i.get("name", "").lower() 
            or s in i.get("sku", "").lower()
            or s in i.get("bin_id", "").lower()
            or s in i.get("batch_number", "").lower()
        ]
    # Clean Mongo _id for JSON response
    for item in items:
        if "_id" in item:
            item["_id"] = str(item["_id"])
    return items

@router.get("/alerts/low-stock")
def get_low_stock_alerts():
    db = get_database()
    items = list(db["stock_items"].find())
    low_stock = [i for i in items if i.get("quantity", 0) <= i.get("min_threshold", 0)]
    for item in low_stock:
        if "_id" in item:
            item["_id"] = str(item["_id"])
    return low_stock

@router.get("/{sku}")
def get_stock_by_sku(sku: str):
    db = get_database()
    item = db["stock_items"].find_one({"sku": sku})
    if not item:
        raise HTTPException(status_code=404, detail="Stock item not found")
    if "_id" in item:
        item["_id"] = str(item["_id"])
    return item

@router.post("/")
def create_stock_item(item: StockItem):
    db = get_database()
    existing = db["stock_items"].find_one({"sku": item.sku})
    if existing:
        raise HTTPException(status_code=400, detail="Item with this SKU already exists")

    item_dict = item.dict()
    item_dict["id"] = f"STOCK-{item.sku}"
    item_dict["created_at"] = datetime.now().isoformat()
    item_dict["updated_at"] = datetime.now().isoformat()
    if not item_dict.get("qr_code_data"):
        item_dict["qr_code_data"] = f"LOGIX|{item.sku}|{item.batch_number or 'LOT'}|{item.bin_id}"

    # Auto status based on quantity
    if item.quantity == 0:
        item_dict["status"] = "Out of Stock"
    elif item.quantity <= item.min_threshold:
        item_dict["status"] = "Low Stock"
    else:
        item_dict["status"] = "In Stock"

    db["stock_items"].insert_one(item_dict)

    # Log initial intake movement
    db["movement_logs"].insert_one({
        "id": str(uuid.uuid4()),
        "timestamp": datetime.now().isoformat(),
        "sku": item.sku,
        "item_name": item.name,
        "action": "RECEIVE",
        "from_location": "Dock Intake",
        "to_location": item.bin_id,
        "quantity": item.quantity,
        "user": "Inventory Controller",
        "notes": f"Initial stock receipt into {item.bin_id}"
    })

    if "_id" in item_dict:
        item_dict["_id"] = str(item_dict["_id"])
    return item_dict

@router.put("/{sku}")
def update_stock_item(sku: str, update_data: dict):
    db = get_database()
    item = db["stock_items"].find_one({"sku": sku})
    if not item:
        raise HTTPException(status_code=404, detail="Stock item not found")

    update_data["updated_at"] = datetime.now().isoformat()
    if "quantity" in update_data:
        qty = update_data["quantity"]
        min_t = update_data.get("min_threshold", item.get("min_threshold", 20))
        if qty == 0:
            update_data["status"] = "Out of Stock"
        elif qty <= min_t:
            update_data["status"] = "Low Stock"
        else:
            update_data["status"] = "In Stock"

    db["stock_items"].update_one({"sku": sku}, {"$set": update_data})
    updated = db["stock_items"].find_one({"sku": sku})
    if "_id" in updated:
        updated["_id"] = str(updated["_id"])
    return updated

@router.delete("/{sku}")
def delete_stock_item(sku: str):
    db = get_database()
    item = db["stock_items"].find_one({"sku": sku})
    if not item:
        raise HTTPException(status_code=404, detail="Stock item not found")
    db["stock_items"].delete_one({"sku": sku})
    return {"message": f"Item {sku} deleted successfully"}
