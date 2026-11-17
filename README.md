# LogixFlow WMS | Stock Tracking & Warehouse Arrangement System

Enterprise-grade Warehouse Management & Logistics System designed for modern logistics, freight forwarders, and distribution centers. Built with a high-performance **Python FastAPI** backend, **MongoDB**, and a modern **React + Tailwind CSS** frontend.

---

## 🌟 Key Features

### 1. 🏗️ Stock Arrangement & Spatial Slotting (Warehouse Layout)
- **Interactive 2D Warehouse Floorplan**: Visual representation of warehouse zones:
  - **Zone A**: High-Velocity Aisle (Optimized for quick dispatch access)
  - **Zone B**: High-Bay Pallet Racking (General cargo & automotive)
  - **Zone C**: Heavy & Bulk Storage (Machinery parts & heavy pallets)
  - **Zone COLD**: Climate-Controlled Vault (-18°C cold chain monitoring)
  - **Zone STAGE**: Inbound Receiving & QA inspection docks
  - **Zone DISPATCH**: Outbound Marshaling & Fleet staging
- **Real-Time Bin Occupancy**: Live weight (kg) and cubic volume (m³) tracking per rack cell.
- **Velocity ABC Heatmap**: Identifies whether high-turnover Class-A items are placed near loading bays to reduce forklift transit time.
- **Interactive Bin Inspector & 1-Click Relocation**: Transfer inventory between bins with capacity checks and automated audit logging.

### 2. 📦 Real-Time Stock Tracking & Inventory Matrix
- Complete SKU lifecycle tracking with serial, batch/lot numbers, and expiry monitoring.
- Dynamic filtering by **Category**, **Warehouse Zone**, and **Stock Status** (In Stock, Low Stock, Out of Stock).
- Safety threshold / reorder level alerts with visual status indicators.
- CSV export for reporting and inventory audits.
- Full CRUD: Add SKU, inspect detailed barcode sheet, adjust stock counts, delete.

### 3. 🚚 Inbound & Outbound Logistics Dock
- Dock door scheduling (Bay 1 Receiving, Bay 2 Dispatch, Cold Dock 4).
- Carrier tracking (DHL, Maersk, Blue Dart, Apex Fleet).
- Inbound receiving into staging bins and outbound dispatch workflows.

### 4. 🔍 Simulated Barcode & QR Scanner
- Instant cargo barcode scanner simulator with realistic audio feedback and viewfinder.
- Rapid cargo lookup and 1-tap re-slotting.

### 5. 📋 Immutable Movement Audit Trail
- Historical audit log recording every **RECEIVE**, **RELOCATE**, **DISPATCH**, and **ADJUSTMENT** action with operator tags and timestamps.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+** (with `fastapi`, `uvicorn`, `pymongo`, `pydantic`)
- **Node.js 18+** & **npm**
- **MongoDB** (Local instance or MongoDB Atlas URI; falls back to embedded persistent storage if MongoDB service is offline)

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# (Optional) Set your MongoDB connection string in environment
export MONGODB_URI="mongodb://localhost:27017"

# Run the backend server (runs on port 8001)
python3 run.py
```
> The API will be live at `http://localhost:8001` (Interactive API docs at `http://localhost:8001/docs`).

### 2. Frontend Setup
```bash
# In the project root
npm install

# Start the Vite development server
npm run dev
```
> Open your browser at `http://localhost:3001` or `http://localhost:3000`.

---

## 🗄️ MongoDB Collections
The system uses the `logistics_stock_db` database with 5 structured collections:
1. `stock_items`: SKU master, quantities, safety thresholds, weight/volume, batch/expiry, velocity class.
2. `bin_slots`: Warehouse rack cells with weight/volume capacity limits and slotted items.
3. `warehouse_zones`: Zones with layout coordinates, temperature, and utilization metrics.
4. `shipment_orders`: Inbound supplier receipts and outbound client dispatches.
5. `movement_logs`: Full chronological audit trail.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Python 3, FastAPI, Uvicorn, Pydantic v2
- **Database**: MongoDB / PyMongo (with embedded persistent storage fallback)
