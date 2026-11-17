import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Barcode, 
  Printer, 
  ArrowLeftRight, 
  Calendar, 
  Weight, 
  Package, 
  Layers, 
  Building2,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Minus
} from 'lucide-react';

export default function StockDetailModal({ 
  isOpen, 
  onClose, 
  item, 
  onRelocateClick,
  onUpdateQuantity 
}) {
  const [updating, setUpdating] = useState(false);

  if (!isOpen || !item) return null;

  const handleAdjust = async (delta) => {
    setUpdating(true);
    try {
      const newQty = Math.max(0, item.quantity + delta);
      await onUpdateQuantity(item.sku, { quantity: newQty });
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-mono font-bold text-sm">
              {item.velocity_class}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900 font-mono">{item.sku}</h3>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                  item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-800' :
                  item.status === 'Low Stock' ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-sm">{item.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Barcode & QR Label Banner */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center space-x-4">
              {/* Simulated 2D DataMatrix / QR */}
              <div className="w-20 h-20 bg-white p-2 rounded-xl flex flex-col justify-between shadow-md shrink-0">
                <div className="flex justify-between">
                  <div className="w-3.5 h-3.5 bg-black"></div>
                  <div className="w-3.5 h-3.5 bg-black"></div>
                </div>
                <div className="grid grid-cols-4 gap-0.5 px-0.5">
                  <div className="w-1.5 h-1.5 bg-black"></div>
                  <div className="w-1.5 h-1.5 bg-transparent"></div>
                  <div className="w-1.5 h-1.5 bg-black"></div>
                  <div className="w-1.5 h-1.5 bg-black"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-3.5 h-3.5 bg-black"></div>
                  <div className="w-3.5 h-3.5 bg-black"></div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold">Logistics Barcode Tag</span>
                <p className="font-mono text-xs font-bold text-white tracking-widest mt-0.5">{item.sku}</p>
                <p className="text-[10px] text-slate-300 font-mono mt-0.5">BIN: {item.bin_id} • LOT: {item.batch_number || 'N/A'}</p>
                {/* Simulated 1D Barcode lines */}
                <div className="flex items-center space-x-0.5 mt-2 h-5">
                  {[2,1,3,1,2,4,1,2,1,3,2,1,4,2,1,3,1,2].map((w, idx) => (
                    <span 
                      key={idx} 
                      className="bg-white h-full inline-block" 
                      style={{ width: `${w * 1.5}px` }}
                    ></span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all flex items-center space-x-1.5 shrink-0"
            >
              <Printer className="w-3.5 h-3.5 text-orange-400" />
              <span>Print Label</span>
            </button>
          </div>

          {/* Quick Quantity Adjustment */}
          <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Current Inventory Count</span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-2xl font-black font-mono text-slate-900">{item.quantity}</span>
                <span className="text-xs text-slate-500 font-medium">{item.unit}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={updating || item.quantity <= 0}
                onClick={() => handleAdjust(-5)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-xs font-mono font-bold text-slate-700 transition-all shadow-2xs"
              >
                -5
              </button>
              <button
                disabled={updating || item.quantity <= 0}
                onClick={() => handleAdjust(-1)}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 transition-all shadow-2xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={updating}
                onClick={() => handleAdjust(1)}
                className="p-2 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={updating}
                onClick={() => handleAdjust(5)}
                className="px-3 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 disabled:opacity-40 text-xs font-mono font-bold text-orange-800 transition-all"
              >
                +5
              </button>
            </div>
          </div>

          {/* Location & Slotting Specs */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-medium block mb-0.5">Assigned Bin Location</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{item.bin_id}</span>
              <span className="text-[10px] text-orange-600 block mt-0.5 font-mono font-bold">{item.zone_id}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-medium block mb-0.5">Safety Stock Threshold</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{item.min_threshold} {item.unit}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">Max Capacity: {item.max_capacity}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-medium block mb-0.5">Unit Weight & Cube</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{item.weight_per_unit_kg} kg</span>
              <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">{item.volume_per_unit_m3} m³</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-medium block mb-0.5">Batch / Expiry</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{item.batch_number || 'N/A'}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{item.expiry_date || 'Non-perishable'}</span>
            </div>
          </div>

          {/* Supplier */}
          {item.supplier && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Supplier:</span>
              <span className="text-slate-900 font-bold">{item.supplier}</span>
            </div>
          )}

          {/* Action footer */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                onClose();
                onRelocateClick(item.sku);
              }}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/25 transition-all flex items-center space-x-1.5"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Relocate Stock</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
