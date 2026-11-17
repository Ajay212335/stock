import React, { useState } from 'react';
import { 
  Truck, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  User, 
  Layers, 
  Plus, 
  Search,
  FileText,
  Calendar,
  ShieldCheck,
  Building2,
  Box,
  AlertCircle
} from 'lucide-react';

export default function ShipmentManager({ 
  shipments = [], 
  onUpdateStatus, 
  onCreateShipment 
}) {
  const [filterType, setFilterType] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    order_number: '',
    type: 'INBOUND',
    client_or_supplier: '',
    carrier: 'DHL Freight Priority',
    vehicle_plate: '',
    dock_door: 'Bay 1 (Receiving)',
    scheduled_time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    status: 'Scheduled',
    items: [{ sku: 'SKU-ELC-7740', name: 'High-Precision LiDAR Distance Scanners', expected_qty: 40 }]
  });

  const filtered = shipments.filter(s => {
    if (filterType !== 'ALL' && s.type !== filterType) return false;
    return true;
  });

  const handleStatusChange = (orderId, newStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(orderId, newStatus);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newOrder.order_number) {
      newOrder.order_number = `${newOrder.type.slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    onCreateShipment(newOrder);
    setShowCreateModal(false);
  };

  const inboundCount = shipments.filter(s => s.type === 'INBOUND').length;
  const outboundCount = shipments.filter(s => s.type === 'OUTBOUND').length;
  const activeDockCount = shipments.filter(s => s.status === 'At Dock' || s.status === 'Unloading' || s.status === 'In Progress').length;
  const completedCount = shipments.filter(s => s.status === 'Completed').length;

  return (
    <div className="space-y-5">
      {/* Top Dock Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Dock Manifests</span>
            <span className="text-xl font-black font-mono text-slate-900 mt-0.5 block">{shipments.length}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Truck className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Inbound Freight</span>
            <span className="text-xl font-black font-mono text-emerald-600 mt-0.5 block">{inboundCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Outbound Dispatches</span>
            <span className="text-xl font-black font-mono text-blue-600 mt-0.5 block">{outboundCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active at Dock Bays</span>
            <span className="text-xl font-black font-mono text-orange-600 mt-0.5 block">{activeDockCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === 'ALL' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Manifests ({shipments.length})
          </button>
          <button
            onClick={() => setFilterType('INBOUND')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              filterType === 'INBOUND' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Inbound Receipts</span>
          </button>
          <button
            onClick={() => setFilterType('OUTBOUND')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              filterType === 'OUTBOUND' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Outbound Dispatches</span>
          </button>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-orange-600/25 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Dock Arrival</span>
        </button>
      </div>

      {/* Shipments Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((shipment) => {
          const isInbound = shipment.type === 'INBOUND';
          const isComplete = shipment.status === 'Completed';

          return (
            <div 
              key={shipment.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-orange-300 hover:shadow-md transition-all group"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2.5">
                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold font-mono ${
                      isInbound 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-orange-100 text-orange-800 border border-orange-200'
                    }`}>
                      {isInbound ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      <span>{shipment.type}</span>
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900">
                      #{shipment.order_number}
                    </span>
                  </div>

                  <select
                    value={shipment.status}
                    onChange={(e) => handleStatusChange(shipment.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold focus:outline-none cursor-pointer border ${
                      isComplete ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      shipment.status === 'Unloading' || shipment.status === 'In Progress' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="At Dock">At Dock</option>
                    <option value={isInbound ? 'Unloading' : 'In Progress'}>
                      {isInbound ? 'Unloading & Staging' : 'In Progress (Loading)'}
                    </option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Carrier & Client */}
                <div className="space-y-1 mb-4">
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-950 transition-colors">
                    {shipment.client_or_supplier}
                  </h4>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center space-x-1.5">
                      <Truck className="w-3.5 h-3.5 text-orange-600" />
                      <span className="text-slate-700 font-bold">{shipment.carrier}</span>
                    </span>
                    {shipment.vehicle_plate && (
                      <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-bold">
                        {shipment.vehicle_plate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dock & Scheduled Time */}
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 grid grid-cols-2 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-slate-500 text-[10px] block font-semibold">Assigned Dock Door:</span>
                    <span className="font-bold text-slate-800 text-xs mt-0.5 block">{shipment.dock_door}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-semibold">Scheduled Window:</span>
                    <span className="font-mono text-slate-800 font-bold text-xs mt-0.5 block">{shipment.scheduled_time}</span>
                  </div>
                </div>

                {/* Cargo Manifest Items */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Cargo Manifest ({shipment.items?.length || 0} line items)
                  </span>
                  <div className="space-y-2">
                    {shipment.items?.map((it, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <div className="truncate max-w-[220px]">
                          <span className="font-mono font-bold text-orange-600 block">{it.sku}</span>
                          <span className="text-slate-800 text-[11px] truncate block font-medium">{it.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-slate-900 block">
                            {it.expected_qty} units
                          </span>
                          {it.bin_assigned && (
                            <span className="text-[10px] text-slate-500 font-mono block">
                              Bin: {it.bin_assigned}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 text-[11px]">
                  Tracking: {shipment.tracking_number || 'N/A'}
                </span>

                {!isComplete && (
                  <button
                    onClick={() => handleStatusChange(shipment.id, 'Completed')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-300 font-bold transition-all flex items-center space-x-1.5 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Completion</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Shipment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Schedule Dock Arrival / Dispatch</h3>
            <p className="text-xs text-slate-500">Register carrier freight manifest and assign dock door</p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Manifest Type</label>
                <select
                  value={newOrder.type}
                  onChange={(e) => setNewOrder({ ...newOrder, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                >
                  <option value="INBOUND">INBOUND (Receiving / Supplier Delivery)</option>
                  <option value="OUTBOUND">OUTBOUND (Fulfillment / Dispatch Order)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Client or Supplier Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Fulfillment IXD3 or Brembo Spares"
                  value={newOrder.client_or_supplier}
                  onChange={(e) => setNewOrder({ ...newOrder, client_or_supplier: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Freight Carrier</label>
                  <input
                    type="text"
                    value={newOrder.carrier}
                    onChange={(e) => setNewOrder({ ...newOrder, carrier: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Vehicle Plate Number</label>
                  <input
                    type="text"
                    placeholder="KA-05-FF-8812"
                    value={newOrder.vehicle_plate}
                    onChange={(e) => setNewOrder({ ...newOrder, vehicle_plate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Dock Door</label>
                  <select
                    value={newOrder.dock_door}
                    onChange={(e) => setNewOrder({ ...newOrder, dock_door: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  >
                    <option value="Bay 1 (Receiving)">Bay 1 (Receiving)</option>
                    <option value="Bay 2 (Dispatch)">Bay 2 (Dispatch)</option>
                    <option value="Bay 3 (Cross-Dock)">Bay 3 (Cross-Dock)</option>
                    <option value="Cold Dock 4">Cold Dock 4 (-20°C)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Expected Units</label>
                  <input
                    type="number"
                    value={newOrder.items[0]?.expected_qty || 50}
                    onChange={(e) => setNewOrder({ 
                      ...newOrder, 
                      items: [{ ...newOrder.items[0], expected_qty: parseInt(e.target.value) || 1 }] 
                    })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-md shadow-orange-600/25"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
