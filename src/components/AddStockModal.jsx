import React, { useState } from 'react';
import { 
  X, 
  PackagePlus, 
  Barcode, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Warehouse 
} from 'lucide-react';

export default function AddStockModal({ 
  isOpen, 
  onClose, 
  zones = [], 
  bins = [], 
  onAddStock 
}) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'High-Value Electronics',
    quantity: 50,
    min_threshold: 20,
    max_capacity: 250,
    unit: 'boxes',
    zone_id: 'ZONE-A',
    bin_id: 'A-01-01',
    velocity_class: 'B',
    batch_number: '',
    expiry_date: '',
    weight_per_unit_kg: 2.5,
    volume_per_unit_m3: 0.02,
    supplier: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const generateSku = () => {
    const prefixes = {
      'High-Value Electronics': 'SKU-ELC',
      'Automotive Spares': 'SKU-AUT',
      'Pharmaceuticals & Cold Chain': 'SKU-MED',
      'Fast Moving Consumer Goods': 'SKU-FMC',
      'Industrial Machinery Parts': 'SKU-IND'
    };
    const prefix = prefixes[formData.category] || 'SKU-LOG';
    const rand = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ 
      ...prev, 
      sku: `${prefix}-${rand}`,
      batch_number: `BAT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sku || !formData.name) {
      setError('Please provide SKU and Product Name');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await onAddStock(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add stock item');
    } finally {
      setLoading(false);
    }
  };

  const currentZoneBins = bins.filter(b => b.zone_id === formData.zone_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Stock Intake & Slotting</h3>
              <p className="text-xs text-slate-500 font-medium">Register new SKU and assign warehouse bin slot</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center space-x-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* SKU & Generator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">SKU Code</label>
                <button
                  type="button"
                  onClick={generateSku}
                  className="text-[11px] text-orange-600 hover:text-orange-700 font-bold flex items-center space-x-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto Generate</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                placeholder="e.g., SKU-ELC-9021"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const cat = e.target.value;
                  let targetZone = 'ZONE-A';
                  if (cat.includes('Pharma') || cat.includes('Cold')) targetZone = 'ZONE-COLD';
                  else if (cat.includes('Automotive')) targetZone = 'ZONE-B';
                  else if (cat.includes('Industrial')) targetZone = 'ZONE-C';
                  
                  setFormData({ 
                    ...formData, 
                    category: cat,
                    zone_id: targetZone,
                    bin_id: targetZone === 'ZONE-COLD' ? 'COLD-01-01' : targetZone === 'ZONE-B' ? 'B-01-01' : 'A-01-01'
                  });
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
              >
                <option value="High-Value Electronics">High-Value Electronics</option>
                <option value="Automotive Spares">Automotive Spares</option>
                <option value="Pharmaceuticals & Cold Chain">Pharmaceuticals & Cold Chain</option>
                <option value="Fast Moving Consumer Goods">Fast Moving Consumer Goods</option>
                <option value="Industrial Machinery Parts">Industrial Machinery Parts</option>
              </select>
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Product Title & Description</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Telematics Gateway Sensor Transceivers"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>

          {/* Zone & Bin Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-orange-50/50 border border-orange-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Warehouse Zone</label>
              <select
                value={formData.zone_id}
                onChange={(e) => {
                  const zId = e.target.value;
                  const firstBin = bins.find(b => b.zone_id === zId);
                  setFormData({ 
                    ...formData, 
                    zone_id: zId, 
                    bin_id: firstBin ? firstBin.bin_code : '' 
                  });
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
              >
                {zones.map(z => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Bin Slot Code</label>
              <select
                value={formData.bin_id}
                onChange={(e) => setFormData({ ...formData, bin_id: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-mono font-bold"
              >
                {currentZoneBins.map(b => (
                  <option key={b.bin_code} value={b.bin_code}>
                    {b.bin_code} • {b.status} ({b.current_weight_kg}/{b.max_weight_kg}kg)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity, Unit & Thresholds */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
              >
                <option value="units">units</option>
                <option value="boxes">boxes</option>
                <option value="pallets">pallets</option>
                <option value="cartons">cartons</option>
                <option value="vials">vials</option>
                <option value="sets">sets</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Safety Stock (Min)</label>
              <input
                type="number"
                min="1"
                value={formData.min_threshold}
                onChange={(e) => setFormData({ ...formData, min_threshold: parseInt(e.target.value) || 10 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-mono font-bold"
              />
            </div>
          </div>

          {/* Velocity & Dimensions */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Velocity Class</label>
              <select
                value={formData.velocity_class}
                onChange={(e) => setFormData({ ...formData, velocity_class: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-mono font-bold"
              >
                <option value="A">Class A (Fast Moving)</option>
                <option value="B">Class B (Medium Turnover)</option>
                <option value="C">Class C (Slow Moving)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Weight (kg/unit)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.weight_per_unit_kg}
                onChange={(e) => setFormData({ ...formData, weight_per_unit_kg: parseFloat(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Batch / Lot #</label>
              <input
                type="text"
                value={formData.batch_number}
                onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                placeholder="BAT-2026-X"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-mono font-medium"
              />
            </div>
          </div>

          {/* Expiry & Supplier */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Expiry Date (Optional)</label>
              <input
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Supplier / Shipper</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="e.g., OmniSense Supply"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>
          </div>

          {/* Actions */}
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
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-orange-600/25 transition-all"
            >
              {loading ? 'Registering...' : 'Register & Slot SKU'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
