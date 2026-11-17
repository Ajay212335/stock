from fastapi import APIRouter, HTTPException
from typing import Optional
from datetime import datetime
import uuid
from app.database import get_database
from app.models import ShipmentOrder

router = APIRouter(prefix="/api/shipments", tags=["Logistics Shipments"])

@router.get("/")
def get_shipments(type: Optional[str] = None):
    db = get_database()
    query = {}
    if type and type != "ALL":
        query["type"] = type.upper()
    orders = list(db["shipment_orders"].find(query))
    for o in orders:
        if "_id" in o:
            o["_id"] = str(o["_id"])
    return orders

import random

def random_num():
    return str(random.randint(100000, 999999))

@router.post("/")
def create_shipment(shipment: ShipmentOrder):
    db = get_database()
    shipment_dict = shipment.dict()
    if not shipment_dict.get("id"):
        shipment_dict["id"] = f"ORD-{shipment.type[:3]}-{random_num()}"
    shipment_dict["created_at"] = datetime.now().isoformat()
    if not shipment_dict.get("tracking_number"):
        shipment_dict["tracking_number"] = f"TRK-{random_num()}"
    
    db["shipment_orders"].insert_one(shipment_dict)
    if "_id" in shipment_dict:
        shipment_dict["_id"] = str(shipment_dict["_id"])
    return shipment_dict

@router.put("/{order_id}/status")
def update_shipment_status(order_id: str, payload: dict):
    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status is required")
    
    db = get_database()
    order = db["shipment_orders"].find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    db["shipment_orders"].update_one(
        {"id": order_id},
        {"$set": {"status": new_status, "updated_at": datetime.now().isoformat()}}
    )

    # If completing inbound, log audit
    if new_status == "Completed":
        db["movement_logs"].insert_one({
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "sku": order.get("order_number", "SHIPMENT"),
            "item_name": f"{order.get('type')} Manifest - {order.get('carrier')}",
            "action": "RECEIVE" if order.get("type") == "INBOUND" else "DISPATCH",
            "from_location": order.get("dock_door", "Dock"),
            "to_location": "Warehouse Bins" if order.get("type") == "INBOUND" else "Fleet Vehicle",
            "quantity": sum(i.get("expected_qty", 0) for i in order.get("items", [])),
            "user": "Dock Master",
            "notes": f"Manifest {order.get('order_number')} marked {new_status}"
        })

    updated = db["shipment_orders"].find_one({"id": order_id})
    if "_id" in updated:
        updated["_id"] = str(updated["_id"])
    return updated
