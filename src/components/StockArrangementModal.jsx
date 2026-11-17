import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  AlertCircle, 
  CheckCircle2, 
  Warehouse, 
  Layers, 
  Weight, 
  Sparkles,
  Flame
} from 'lucide-react';

export default function StockArrangementModal({ 
  isOpen, 
  onClose, 
  inventory = [], 
  bins = [], 
  zones = [],
  preselectedSku = null,
  preselectedBin = null,
  onRelocateSuccess 
}) {
  const [sku, setSku] = useState('');
  const [targetBinCode, setTargetBinCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('Slotting Optimization');
  const [operator, setOperator] = useState('Logistics Operator #01');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (preselectedSku) {
      setSku(preselectedSku);
      const item = inventory.find(i => i.sku === preselectedSku);
      if (item) setQuantity(item.quantity);
    } else if (inventory.length > 0 && !sku) {
      setSku(inventory[0].sku);
      setQuantity(inventory[0].quantity);
    }
    if (preselectedBin) {
      setTargetBinCode(preselectedBin);
    }
  }, [preselectedSku, preselectedBin, inventory]);

  if (!isOpen) return null;

  const currentItem = inventory.find(i => i.sku === sku);
  const targetBin = bins.find(b => b.bin_code === targetBinCode);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sku) {
      setError('Please select a stock item');
      return;
    }
    if (!targetBinCode) {
      setError('Please select a destination bin slot');
      return;
    }
    if (currentItem && currentItem.bin_id === targetBinCode) {
      setError('Target bin is identical to current bin location');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await onRelocateSuccess({
        sku,
        from_bin: currentItem?.bin_id || 'UNKNOWN',
        to_bin: targetBinCode,
        quantity: parseInt(quantity, 10),
        reason,
        user: operator
      });
      setSuccessMsg(`Stock successfully relocated to ${targetBinCode}!`);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to relocate stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Stock Arrangement & Bin Transfer</h3>
              <p className="text-xs text-slate-500 font-medium">Re-slot cargo across warehouse racks and zones</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center space-x-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Select Stock Item */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Stock Item to Relocate
            </label>
            <select
              value={sku}
              onChange={(e) => {
                setSku(e.target.value);
                const it = inventory.find(i => i.sku === e.target.value);
                if (it) setQuantity(it.quantity);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-mono font-medium"
            >
              {inventory.map((item) => (
                <option key={item.sku} value={item.sku}>
                  {item.sku} - {item.name} ({item.quantity} {item.unit}) [Current: {item.bin_id}]
                </option>
              ))}
            </select>
          </div>

          {/* Source Location Banner */}
          {currentItem && (
            <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-100 grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Current Slot:</span>
                <span className="font-mono font-bold text-orange-950 text-sm">{currentItem.bin_id}</span>
                <span className="text-[10px] text-slate-500 block font-mono">{currentItem.zone_id}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Velocity Class:</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono mt-0.5 ${
                  currentItem.velocity_class === 'A' ? 'bg-orange-100 text-orange-800' :
                  currentItem.velocity_class === 'B' ? 'bg-amber-100 text-amber-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  Class {currentItem.velocity_class}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Total Weight:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {Math.round(currentItem.quantity * currentItem.weight_per_unit_kg)} kg
                </span>
              </div>
            </div>
          )}

          {/* Target Destination Bin */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Target Destination Bin Slot
            </label>
            <select
              value={targetBinCode}
              onChange={(e) => setTargetBinCode(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-mono font-medium"
            >
              <option value="">-- Choose Target Bin --</option>
              {zones.map(z => {
                const zBins = bins.filter(b => b.zone_id === z.id);
                return (
                  <optgroup key={z.id} label={`${z.name} (${z.code})`}>
                    {zBins.map(b => (
                      <option key={b.bin_code} value={b.bin_code}>
                        {b.bin_code} • {b.status} • {b.current_weight_kg}/{b.max_weight_kg}kg ({b.weight_occupancy_pct}%)
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>

          {/* Target Bin Capacity Verification */}
          {targetBin && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center space-x-1 font-medium">
                  <Warehouse className="w-3.5 h-3.5 text-orange-600" />
                  <span>Target Zone: <strong>{targetBin.zone_id}</strong> ({targetBin.aisle})</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  targetBin.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                  targetBin.status === 'Full' ? 'bg-rose-100 text-rose-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {targetBin.status}
                </span>
              </div>

              {/* Weight clearance */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Available Weight Capacity:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {Math.max(0, targetBin.max_weight_kg - targetBin.current_weight_kg).toFixed(1)} kg available
                </span>
              </div>
            </div>
          )}

          {/* Relocation Reason & Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Transfer Quantity ({currentItem?.unit || 'units'})
              </label>
              <input
                type="number"
                min="1"
                max={currentItem?.quantity || 1000}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Arrangement Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
              >
                <option value="Slotting Optimization">Slotting Optimization</option>
                <option value="Near Dock Staging">Near Dock Staging</option>
                <option value="Cold Chain Compliance">Cold Chain Compliance</option>
                <option value="Pallet Consolidation">Pallet Consolidation</option>
                <option value="Maintenance Clearance">Maintenance Clearance</option>
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-orange-600/25 transition-all flex items-center space-x-2"
            >
              {loading ? (
                <span>Re-allocating...</span>
              ) : (
                <>
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>Execute Relocation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
