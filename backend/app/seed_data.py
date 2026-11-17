import uuid
from datetime import datetime, timedelta

def populate_seed_data(db):
    zones_col = db["warehouse_zones"]
    bins_col = db["bin_slots"]
    stock_col = db["stock_items"]
    shipments_col = db["shipment_orders"]
    logs_col = db["movement_logs"]
    users_col = db["users"]

    # 1. Warehouse Zones
    if zones_col.count_documents({}) == 0:
        print("Initializing warehouse rack zones in MongoDB Atlas...")
        zones = [
            {
                "id": "ZONE-A",
                "name": "Velocity Aisle A (High-Turnover)",
                "code": "A",
                "type": "Racking",
                "total_bins": 12,
                "occupied_bins": 5,
                "color": "#ea580c",
                "coordinates": {"gridX": 1, "gridY": 2, "width": 4, "height": 3},
                "description": "Closest to dispatch docks; optimized for Class-A fast movers."
            },
            {
                "id": "ZONE-B",
                "name": "High-Bay Racking B (General Cargo)",
                "code": "B",
                "type": "Racking",
                "total_bins": 12,
                "occupied_bins": 3,
                "color": "#10b981",
                "coordinates": {"gridX": 6, "gridY": 2, "width": 4, "height": 3},
                "description": "Multi-tier pallet racking for Class-B consumer goods and automotive spares."
            },
            {
                "id": "ZONE-C",
                "name": "Heavy & Bulk Pallet Storage C",
                "code": "C",
                "type": "Bulk Staging",
                "total_bins": 8,
                "occupied_bins": 2,
                "color": "#8b5cf6",
                "coordinates": {"gridX": 1, "gridY": 6, "width": 4, "height": 3},
                "description": "Reinforced flooring for industrial machinery parts and bulk crating."
            },
            {
                "id": "ZONE-COLD",
                "name": "Cold Chain Storage (-18°C)",
                "code": "COLD",
                "type": "Cold Storage",
                "total_bins": 6,
                "occupied_bins": 2,
                "temperature_c": -18.4,
                "humidity_pct": 82.0,
                "color": "#06b6d4",
                "coordinates": {"gridX": 6, "gridY": 6, "width": 4, "height": 3},
                "description": "Climate-controlled zone for temperature-sensitive biologics and vaccines."
            },
            {
                "id": "ZONE-STAGE",
                "name": "Inbound Dock & Receiving Staging",
                "code": "STAGE",
                "type": "Receiving Dock",
                "total_bins": 4,
                "occupied_bins": 1,
                "color": "#f59e0b",
                "coordinates": {"gridX": 1, "gridY": 10, "width": 4, "height": 2},
                "description": "Unloading buffer for cross-dock inspections and intake sorting."
            },
            {
                "id": "ZONE-DISPATCH",
                "name": "Outbound Marshalling & Staging",
                "code": "DISP",
                "type": "Dispatch Dock",
                "total_bins": 4,
                "occupied_bins": 0,
                "color": "#64748b",
                "coordinates": {"gridX": 6, "gridY": 10, "width": 4, "height": 2},
                "description": "Order consolidation and freight palletizing before truck loading."
            }
        ]
        for z in zones:
            z["_id"] = z["id"]
            zones_col.insert_one(z)

    # 2. Warehouse Bin Slots
    if bins_col.count_documents({}) == 0:
        print("Initializing bin slots in MongoDB Atlas...")
        bins = []
        for aisle in [1, 2, 3]:
            for shelf in [1, 2, 3, 4]:
                code = f"A-0{aisle}-0{shelf}"
                bins.append({
                    "_id": f"BIN-{code}",
                    "id": f"BIN-{code}",
                    "zone_id": "ZONE-A",
                    "aisle": f"Aisle {aisle}",
                    "rack": 1,
                    "shelf_level": shelf,
                    "bin_code": code,
                    "max_weight_kg": 850.0,
                    "current_weight_kg": 0.0,
                    "max_volume_m3": 4.5,
                    "current_volume_m3": 0.0,
                    "max_pallets": 2,
                    "current_pallets": 0,
                    "status": "Available",
                    "suitable_for": ["Electronics", "FMCG", "Apparel"]
                })
        for aisle in [1, 2, 3]:
            for shelf in [1, 2, 3, 4]:
                code = f"B-0{aisle}-0{shelf}"
                bins.append({
                    "_id": f"BIN-{code}",
                    "id": f"BIN-{code}",
                    "zone_id": "ZONE-B",
                    "aisle": f"High-Bay {aisle}",
                    "rack": 1,
                    "shelf_level": shelf,
                    "bin_code": code,
                    "max_weight_kg": 1200.0,
                    "current_weight_kg": 0.0,
                    "max_volume_m3": 6.0,
                    "current_volume_m3": 0.0,
                    "max_pallets": 3,
                    "current_pallets": 0,
                    "status": "Available",
                    "suitable_for": ["Automotive", "Industrial", "Consumer Goods"]
                })
        for aisle in [1, 2]:
            for shelf in [1, 2, 3, 4]:
                code = f"C-0{aisle}-0{shelf}"
                bins.append({
                    "_id": f"BIN-{code}",
                    "id": f"BIN-{code}",
                    "zone_id": "ZONE-C",
                    "aisle": f"Heavy Floor {aisle}",
                    "rack": 1,
                    "shelf_level": shelf,
                    "bin_code": code,
                    "max_weight_kg": 2500.0,
                    "current_weight_kg": 0.0,
                    "max_volume_m3": 12.0,
                    "current_volume_m3": 0.0,
                    "max_pallets": 4,
                    "current_pallets": 0,
                    "status": "Available",
                    "suitable_for": ["Industrial", "Heavy Metals"]
                })
        for aisle in [1, 2]:
            for shelf in [1, 2, 3]:
                code = f"COLD-0{aisle}-0{shelf}"
                bins.append({
                    "_id": f"BIN-{code}",
                    "id": f"BIN-{code}",
                    "zone_id": "ZONE-COLD",
                    "aisle": f"Cold Bay {aisle}",
                    "rack": aisle,
                    "shelf_level": shelf,
                    "bin_code": code,
                    "max_weight_kg": 600.0,
                    "current_weight_kg": 0.0,
                    "max_volume_m3": 3.5,
                    "current_volume_m3": 0.0,
                    "max_pallets": 2,
                    "current_pallets": 0,
                    "status": "Available",
                    "suitable_for": ["Pharmaceuticals & Cold Chain", "Perishables"]
                })
        for i in range(1, 5):
            bins.append({
                "_id": f"BIN-STAGE-0{i}",
                "id": f"BIN-STAGE-0{i}",
                "zone_id": "ZONE-STAGE",
                "aisle": "Dock Inbound",
                "rack": 1,
                "shelf_level": i,
                "bin_code": f"STAGE-0{i}",
                "max_weight_kg": 5000.0,
                "current_weight_kg": 0.0,
                "max_volume_m3": 15.0,
                "current_volume_m3": 0.0,
                "max_pallets": 8,
                "current_pallets": 0,
                "status": "Available",
                "suitable_for": ["All"]
            })
            bins.append({
                "_id": f"BIN-DISP-0{i}",
                "id": f"BIN-DISP-0{i}",
                "zone_id": "ZONE-DISPATCH",
                "aisle": "Dispatch Staging",
                "rack": 1,
                "shelf_level": i,
                "bin_code": f"DISP-0{i}",
                "max_weight_kg": 5000.0,
                "current_weight_kg": 0.0,
                "max_volume_m3": 15.0,
                "current_volume_m3": 0.0,
                "max_pallets": 8,
                "current_pallets": 0,
                "status": "Available",
                "suitable_for": ["All"]
            })

        for b in bins:
            bins_col.insert_one(b)

    # 3. Store Real Logistics Stock Items into MongoDB
    if stock_col.count_documents({}) == 0:
        print("Storing warehouse stock items into MongoDB Atlas...")
        items = [
            {
                "id": "STOCK-SKU-ELC-4921",
                "_id": "STOCK-SKU-ELC-4921",
                "sku": "SKU-ELC-4921",
                "name": "Industrial IoT Telematics Gateway Hubs",
                "category": "High-Value Electronics",
                "quantity": 140,
                "min_threshold": 30,
                "max_capacity": 300,
                "unit": "boxes",
                "zone_id": "ZONE-A",
                "bin_id": "A-01-01",
                "velocity_class": "A",
                "batch_number": "BAT-2026-9901",
                "weight_per_unit_kg": 1.4,
                "volume_per_unit_m3": 0.008,
                "supplier": "OmniSense Systems GmbH",
                "status": "In Stock",
                "qr_code_data": "LOGIX|SKU-ELC-4921|BAT-2026-9901|A-01-01",
                "created_at": (datetime.now() - timedelta(days=7)).isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            {
                "id": "STOCK-SKU-MED-8812",
                "_id": "STOCK-SKU-MED-8812",
                "sku": "SKU-MED-8812",
                "name": "Lyophilized Vaccine Ampoules (Cold Chain)",
                "category": "Pharmaceuticals & Cold Chain",
                "quantity": 850,
                "min_threshold": 200,
                "max_capacity": 2000,
                "unit": "vials",
                "zone_id": "ZONE-COLD",
                "bin_id": "COLD-01-02",
                "velocity_class": "A",
                "batch_number": "BIO-VAX-774",
                "expiry_date": (datetime.now() + timedelta(days=140)).strftime("%Y-%m-%d"),
                "weight_per_unit_kg": 0.08,
                "volume_per_unit_m3": 0.0003,
                "supplier": "Novartis Global Biotech",
                "status": "In Stock",
                "qr_code_data": "LOGIX|SKU-MED-8812|BIO-VAX-774|COLD-01-02",
                "created_at": (datetime.now() - timedelta(days=5)).isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            {
                "id": "STOCK-SKU-AUT-3310",
                "_id": "STOCK-SKU-AUT-3310",
                "sku": "SKU-AUT-3310",
                "name": "Ceramic Brake Rotor Assemblies (Heavy Duty)",
                "category": "Automotive Spares",
                "quantity": 64,
                "min_threshold": 15,
                "max_capacity": 150,
                "unit": "crates",
                "zone_id": "ZONE-B",
                "bin_id": "B-02-01",
                "velocity_class": "B",
                "batch_number": "BRK-HD-552",
                "weight_per_unit_kg": 14.5,
                "volume_per_unit_m3": 0.045,
                "supplier": "Brembo Commercial Parts",
                "status": "In Stock",
                "qr_code_data": "LOGIX|SKU-AUT-3310|BRK-HD-552|B-02-01",
                "created_at": (datetime.now() - timedelta(days=24)).isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            {
                "id": "STOCK-SKU-IND-7714",
                "_id": "STOCK-SKU-IND-7714",
                "sku": "SKU-IND-7714",
                "name": "Hydraulic Servo Cylinder Valve Manifolds",
                "category": "Industrial Machinery Parts",
                "quantity": 18,
                "min_threshold": 20,
                "max_capacity": 80,
                "unit": "pallets",
                "zone_id": "ZONE-C",
                "bin_id": "C-01-02",
                "velocity_class": "C",
                "batch_number": "HYD-VAL-309",
                "weight_per_unit_kg": 85.0,
                "volume_per_unit_m3": 0.65,
                "supplier": "Bosch Rexroth Logistics",
                "status": "Low Stock",
                "qr_code_data": "LOGIX|SKU-IND-7714|HYD-VAL-309|C-01-02",
                "created_at": (datetime.now() - timedelta(days=14)).isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            {
                "id": "STOCK-SKU-ELC-1092",
                "_id": "STOCK-SKU-ELC-1092",
                "sku": "SKU-ELC-1092",
                "name": "Solid State Li-Ion Powerpacks 48V 100Ah",
                "category": "High-Value Electronics",
                "quantity": 28,
                "min_threshold": 25,
                "max_capacity": 100,
                "unit": "units",
                "zone_id": "ZONE-A",
                "bin_id": "A-01-03",
                "velocity_class": "A",
                "batch_number": "BATT-48V-018",
                "weight_per_unit_kg": 32.0,
                "volume_per_unit_m3": 0.09,
                "supplier": "EnerSys Power Distribution",
                "status": "Low Stock",
                "qr_code_data": "LOGIX|SKU-ELC-1092|BATT-48V-018|A-01-03",
                "created_at": (datetime.now() - timedelta(days=21)).isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            {
                "id": "STOCK-SKU-FMC-9021",
                "_id": "STOCK-SKU-FMC-9021",
                "sku": "SKU-FMC-9021",
                "name": "Organic Roasted Espresso Beans (Commercial 5kg)",
                "category": "Fast Moving Consumer Goods",
                "quantity": 420,
                "min_threshold": 100,
                "max_capacity": 800,
                "unit": "bags",
                "zone_id": "ZONE-A",
                "bin_id": "A-02-01",
                "velocity_class": "A",
                "batch_number": "COF-2026-X8",
                "expiry_date": (datetime.now() + timedelta(days=280)).strftime("%Y-%m-%d"),
                "weight_per_unit_kg": 5.1,
                "volume_per_unit_m3": 0.015,
                "supplier": "Lavazza Commercial Supply",
                "status": "In Stock",
                "qr_code_data": "LOGIX|SKU-FMC-9021|COF-2026-X8|A-02-01",
                "created_at": (datetime.now() - timedelta(days=28)).isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            {
                "id": "STOCK-SKU-MED-9931",
                "_id": "STOCK-SKU-MED-9931",
                "sku": "SKU-MED-9931",
                "name": "Insulin Glargine Pen Cartridges (-4°C)",
                "category": "Pharmaceuticals & Cold Chain",
                "quantity": 380,
                "min_threshold": 150,
                "max_capacity": 1200,
                "unit": "packs",
                "zone_id": "ZONE-COLD",
                "bin_id": "COLD-01-01",
                "velocity_class": "A",
                "batch_number": "INS-779-GL",
                "expiry_date": (datetime.now() + timedelta(days=95)).strftime("%Y-%m-%d"),
                "weight_per_unit_kg": 0.25,
                "volume_per_unit_m3": 0.001,
                "supplier": "Sanofi Healthcare Logistics",
                "status": "In Stock",
                "qr_code_data": "LOGIX|SKU-MED-9931|INS-779-GL|COLD-01-01",
                "created_at": (datetime.now() - timedelta(days=22)).isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            {
                "id": "STOCK-SKU-AUT-6641",
                "_id": "STOCK-SKU-AUT-6641",
                "sku": "SKU-AUT-6641",
                "name": "Twin-Scroll Turbocharger Kits 2.0L TDI",
                "category": "Automotive Spares",
                "quantity": 35,
                "min_threshold": 10,
                "max_capacity": 80,
                "unit": "boxes",
                "zone_id": "ZONE-B",
                "bin_id": "B-01-02",
                "velocity_class": "B",
                "batch_number": "TRB-GAR-99",
                "weight_per_unit_kg": 9.2,
                "volume_per_unit_m3": 0.03,
                "supplier": "Garrett Motion Corp",
                "status": "In Stock",
                "qr_code_data": "LOGIX|SKU-AUT-6641|TRB-GAR-99|B-01-02",
                "created_at": (datetime.now() - timedelta(days=9)).isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            {
                "id": "STOCK-SKU-IND-4420",
                "_id": "STOCK-SKU-IND-4420",
                "sku": "SKU-IND-4420",
                "name": "Helical Bevel Gearboxes 1:30 Ratio",
                "category": "Industrial Machinery Parts",
                "quantity": 12,
                "min_threshold": 10,
                "max_capacity": 40,
                "unit": "pallets",
                "zone_id": "ZONE-C",
                "bin_id": "C-02-01",
                "velocity_class": "C",
                "batch_number": "GBX-SEW-44",
                "weight_per_unit_kg": 110.0,
                "volume_per_unit_m3": 0.8,
                "supplier": "SEW Eurodrive Parts",
                "status": "In Stock",
                "qr_code_data": "LOGIX|SKU-IND-4420|GBX-SEW-44|C-02-01",
                "created_at": (datetime.now() - timedelta(days=20)).isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            {
                "id": "STOCK-SKU-ELC-8819",
                "_id": "STOCK-SKU-ELC-8819",
                "sku": "SKU-ELC-8819",
                "name": "Ruggedized Logistics Barcode Scanners (WiFi 6)",
                "category": "High-Value Electronics",
                "quantity": 90,
                "min_threshold": 20,
                "max_capacity": 200,
                "unit": "units",
                "zone_id": "ZONE-A",
                "bin_id": "A-02-04",
                "velocity_class": "A",
                "batch_number": "SCN-ZBR-2026",
                "weight_per_unit_kg": 0.65,
                "volume_per_unit_m3": 0.003,
                "supplier": "Zebra Technologies",
                "status": "In Stock",
                "qr_code_data": "LOGIX|SKU-ELC-8819|SCN-ZBR-2026|A-02-04",
                "created_at": (datetime.now() - timedelta(days=39)).isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            {
                "id": "STOCK-SKU-STAGE-01",
                "_id": "STOCK-SKU-STAGE-01",
                "sku": "SKU-STAGE-01",
                "name": "Palletized Solar Micro-Inverters (Uninspected)",
                "category": "High-Value Electronics",
                "quantity": 40,
                "min_threshold": 10,
                "max_capacity": 100,
                "unit": "pallets",
                "zone_id": "ZONE-STAGE",
                "bin_id": "STAGE-01",
                "velocity_class": "B",
                "batch_number": "INB-REC-8841",
                "weight_per_unit_kg": 45.0,
                "volume_per_unit_m3": 0.35,
                "supplier": "Enphase Energy Europe",
                "status": "In Transit",
                "qr_code_data": "LOGIX|SKU-STAGE-01|INB-REC-8841|STAGE-01",
                "created_at": (datetime.now() - timedelta(days=42)).isoformat(),
                "updated_at": datetime.now().isoformat()
            }
        ]
        for itm in items:
            stock_col.insert_one(itm)

        # Update bin slot weights and statuses
        for itm in items:
            b_code = itm["bin_id"]
            total_wt = itm["quantity"] * itm["weight_per_unit_kg"]
            bins_col.update_one(
                {"bin_code": b_code},
                {"$set": {
                    "current_weight_kg": total_wt,
                    "status": "Full" if total_wt > 700 else "Partially Full"
                }}
            )

    # 4. Inbound & Outbound Shipments
    if shipments_col.count_documents({}) == 0:
        print("Initializing shipment manifests...")
        shipments = [
            {
                "id": "ORD-INB-7021",
                "_id": "ORD-INB-7021",
                "order_number": "INB-7021",
                "type": "INBOUND",
                "client_or_supplier": "OmniSense Systems GmbH",
                "carrier": "DHL Freight Express",
                "vehicle_plate": "MH-04-DX-7712",
                "dock_door": "Bay 1 (Receiving)",
                "scheduled_time": datetime.now().strftime("%Y-%m-%d %H:%M"),
                "status": "Unloading",
                "tracking_number": "DHL-EXP-90021389",
                "items": [
                    {"sku": "SKU-ELC-4921", "name": "Industrial IoT Telematics Gateway Hubs", "expected_qty": 60, "processed_qty": 45, "bin_assigned": "STAGE-01"},
                    {"sku": "SKU-ELC-1092", "name": "Solid State Li-Ion Powerpacks", "expected_qty": 15, "processed_qty": 0, "bin_assigned": "STAGE-02"}
                ],
                "created_at": datetime.now().isoformat()
            },
            {
                "id": "ORD-OUT-9912",
                "_id": "ORD-OUT-9912",
                "order_number": "OUT-9912",
                "type": "OUTBOUND",
                "client_or_supplier": "Amazon Fulfillment Center IXD3",
                "carrier": "Apex Fleet Carrier #08",
                "vehicle_plate": "DL-1C-AP-9901",
                "dock_door": "Bay 3 (Dispatch)",
                "scheduled_time": (datetime.now() + timedelta(hours=3)).strftime("%Y-%m-%d %H:%M"),
                "status": "In Progress",
                "tracking_number": "APX-TRK-449102",
                "items": [
                    {"sku": "SKU-FMC-9021", "name": "Organic Roasted Espresso Beans", "expected_qty": 120, "processed_qty": 120, "bin_assigned": "DISP-01"},
                    {"sku": "SKU-ELC-8819", "name": "Logistics Barcode Scanners", "expected_qty": 30, "processed_qty": 30, "bin_assigned": "DISP-02"}
                ],
                "created_at": datetime.now().isoformat()
            }
        ]
        for s in shipments:
            shipments_col.insert_one(s)

    # 5. Default User
    if users_col.count_documents({}) == 0:
        users_col.insert_one({
            "id": "usr-admin-01",
            "_id": "usr-admin-01",
            "name": "Ajay Vishwa",
            "email": "admin@logixflow.com",
            "password": "password123",
            "role": "Warehouse Manager",
            "facility": "Apex Central DC-01",
            "created_at": datetime.now().isoformat()
        })
