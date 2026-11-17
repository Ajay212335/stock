from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class StockItem(BaseModel):
    id: Optional[str] = None
    sku: str
    name: str
    category: str
    quantity: int = 0
    min_threshold: int = 20
    max_capacity: int = 500
    unit: str = "units"
    zone_id: str
    bin_id: str
    velocity_class: str = "B"  # A (Fast), B (Medium), C (Slow)
    batch_number: Optional[str] = None
    expiry_date: Optional[str] = None
    weight_per_unit_kg: float = 1.0
    volume_per_unit_m3: float = 0.05
    status: str = "In Stock"  # "In Stock", "Low Stock", "Out of Stock", "Reserved", "In Transit"
    qr_code_data: Optional[str] = None
    supplier: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class BinSlot(BaseModel):
    id: str
    zone_id: str
    aisle: str
    rack: int
    shelf_level: int
    bin_code: str
    max_weight_kg: float = 1000.0
    current_weight_kg: float = 0.0
    max_volume_m3: float = 5.0
    current_volume_m3: float = 0.0
    max_pallets: int = 4
    current_pallets: int = 0
    current_items: List[Dict[str, Any]] = []
    status: str = "Available"  # "Available", "Partially Full", "Full", "Maintenance"
    suitable_for: List[str] = []

class WarehouseZone(BaseModel):
    id: str
    name: str
    code: str
    type: str  # "Racking", "Cold Storage", "Bulk Staging", "Hazmat", "Dispatch Bay", "Receiving Dock"
    total_bins: int = 12
    occupied_bins: int = 0
    temperature_c: Optional[float] = None
    humidity_pct: Optional[float] = None
    color: str = "#3b82f6"
    coordinates: Dict[str, Any] = {}

class MovementLog(BaseModel):
    id: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    sku: str
    item_name: str
    action: str  # "RECEIVE", "SLOT_ASSIGN", "RELOCATE", "DISPATCH", "ADJUSTMENT"
    from_location: str
    to_location: str
    quantity: int
    user: str = "Dispatcher-01"
    notes: Optional[str] = None

class ShipmentOrderItem(BaseModel):
    sku: str
    name: str
    expected_qty: int
    processed_qty: int = 0
    bin_assigned: Optional[str] = None

class ShipmentOrder(BaseModel):
    id: Optional[str] = None
    order_number: str
    type: str  # "INBOUND", "OUTBOUND"
    client_or_supplier: str
    carrier: str
    vehicle_plate: Optional[str] = None
    dock_door: str
    scheduled_time: str
    status: str = "Scheduled"  # "Scheduled", "At Dock", "In Progress", "Completed", "Cancelled"
    items: List[ShipmentOrderItem] = []
    tracking_number: Optional[str] = None
    created_at: Optional[str] = None

class RelocateRequest(BaseModel):
    sku: str
    from_bin: str
    to_bin: str
    quantity: int
    reason: Optional[str] = "Optimization"
    user: Optional[str] = "Logistics Lead"
