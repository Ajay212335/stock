import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  ArrowLeftRight, 
  Eye, 
  Trash2, 
  AlertTriangle, 
  Download, 
  QrCode, 
  Calendar, 
  Layers, 
  ArrowUpDown, 
  CheckCircle2,
  Boxes,
  Plus,
  Cpu,
  Wrench,
  Pill,
  Coffee,
  Box
} from 'lucide-react';

export default function StockTable({ 
  inventory = [], 
  onSelectItem, 
  onRelocateItem, 
  onDeleteItem,
  onAddNew 
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);

  const categories = [
    'All',
    'High-Value Electronics',
    'Automotive Spares',
    'Pharmaceuticals & Cold Chain',
    'Fast Moving Consumer Goods',
    'Industrial Machinery Parts'
  ];

  const zones = ['All', 'ZONE-A', 'ZONE-B', 'ZONE-C', 'ZONE-COLD', 'ZONE-STAGE'];
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  // Filter & Search
  const filtered = inventory.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (selectedZone !== 'All' && item.zone_id !== selectedZone) return false;
    if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;
    if (search) {
      const s = search.toLowerCase();
      const matchSku = item.sku.toLowerCase().includes(s);
      const matchName = item.name.toLowerCase().includes(s);
      const matchBin = item.bin_id.toLowerCase().includes(s);
      const matchBatch = item.batch_number?.toLowerCase().includes(s);
      if (!matchSku && !matchName && !matchBin && !matchBatch) return false;
    }
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getCategoryIcon = (category = '') => {
    if (category.includes('Electronics')) return Cpu;
    if (category.includes('Automotive') || category.includes('Industrial')) return Wrench;
    if (category.includes('Pharma') || category.includes('Cold')) return Pill;
    if (category.includes('Goods') || category.includes('FMCG')) return Coffee;
    return Box;
  };

  const exportCSV = () => {
    const headers = ['SKU,Product Name,Category,Quantity,Unit,Min Safety Stock,Bin Location,Zone,Velocity Class,Batch,Weight (kg)'];
    const rows = sorted.map(i => 
      `"${i.sku}","${i.name}","${i.category}",${i.quantity},"${i.unit}",${i.min_threshold},"${i.bin_id}","${i.zone_id}","${i.velocity_class}","${i.batch_number || ''}",${i.weight_per_unit_kg}`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LogixFlow_Inventory_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const inStockCount = inventory.filter(i => i.quantity > i.min_threshold).length;
  const lowStockCount = inventory.filter(i => i.quantity <= i.min_threshold && i.quantity > 0).length;
  const outOfStockCount = inventory.filter(i => i.quantity === 0).length;

  return (
    <div className="space-y-5">
      {/* Top Quick Status Chips Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total SKUs</span>
            <span className="text-xl font-black font-mono text-slate-900 mt-0.5 block">{inventory.length}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Boxes className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Healthy Stock</span>
            <span className="text-xl font-black font-mono text-emerald-600 mt-0.5 block">{inStockCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Low Stock Alert</span>
            <span className="text-xl font-black font-mono text-amber-600 mt-0.5 block">{lowStockCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Out of Stock</span>
            <span className="text-xl font-black font-mono text-rose-600 mt-0.5 block">{outOfStockCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <Package className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between">
        <div className="flex-1 flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative min-w-[240px] flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by SKU, product name, lot #, or bin..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 font-bold focus:outline-none focus:border-orange-500"
          >
            {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
          </select>

          {/* Zone Dropdown */}
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 font-bold focus:outline-none focus:border-orange-500"
          >
            {zones.map(z => <option key={z} value={z}>{z === 'All' ? 'All Zones' : z}</option>)}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 font-bold focus:outline-none focus:border-orange-500"
          >
            {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 transition-all shadow-2xs"
            title="Export filtered stock records to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={onAddNew}
            className="flex items-center space-x-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-orange-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New SKU</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-5 cursor-pointer" onClick={() => handleSort('sku')}>
                  <div className="flex items-center space-x-1.5">
                    <span>SKU Code</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-4 px-5 cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center space-x-1.5">
                    <span>Product Name & Category</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-4 px-5 cursor-pointer" onClick={() => handleSort('bin_id')}>
                  <div className="flex items-center space-x-1.5">
                    <span>Assigned Bin & Zone</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-4 px-5 cursor-pointer" onClick={() => handleSort('quantity')}>
                  <div className="flex items-center space-x-1.5">
                    <span>Inventory Level</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-4 px-5">Velocity Class</th>
                <th className="py-4 px-5">Batch & Expiry</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {sorted.length > 0 ? (
                sorted.map((item) => {
                  const isLow = item.quantity <= item.min_threshold && item.quantity > 0;
                  const isOut = item.quantity === 0;
                  const pct = Math.min(Math.round((item.quantity / item.max_capacity) * 100), 100);
                  const CategoryIcon = getCategoryIcon(item.category);

                  return (
                    <tr 
                      key={item.sku}
                      className="hover:bg-orange-50/40 transition-colors group"
                    >
                      {/* SKU */}
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-orange-600 group-hover:text-orange-700 text-xs">
                            {item.sku}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          {item.batch_number || 'LOT-STANDARD'}
                        </span>
                      </td>

                      {/* Name & Category */}
                      <td className="py-4 px-5 max-w-sm">
                        <p className="font-bold text-slate-900 group-hover:text-orange-950 text-xs">
                          {item.name}
                        </p>
                        <div className="flex items-center space-x-1.5 mt-1">
                          <CategoryIcon className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] text-slate-500 font-medium">
                            {item.category}
                          </span>
                        </div>
                      </td>

                      {/* Bin & Zone */}
                      <td className="py-4 px-5">
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 font-mono text-xs shadow-2xs">
                          <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                          <span className="font-bold text-orange-900">{item.bin_id}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-1 font-mono font-medium">
                          {item.zone_id}
                        </span>
                      </td>

                      {/* Stock Level */}
                      <td className="py-4 px-5 min-w-[150px]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold font-mono text-slate-900 text-xs">
                            {item.quantity} <span className="text-[11px] font-normal text-slate-500">{item.unit}</span>
                          </span>
                          {isOut ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                              Out
                            </span>
                          ) : isLow ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center space-x-1">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              <span>Low Stock</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-700 font-bold font-mono">
                              In Stock
                            </span>
                          )}
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                          Safety Threshold: {item.min_threshold} {item.unit}
                        </span>
                      </td>

                      {/* Velocity Class */}
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg font-mono text-xs font-bold ${
                          item.velocity_class === 'A' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                          item.velocity_class === 'B' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}>
                          Class {item.velocity_class}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-1 font-medium">
                          {item.velocity_class === 'A' ? 'Fast Mover' : item.velocity_class === 'B' ? 'Medium' : 'Slow Mover'}
                        </span>
                      </td>

                      {/* Lot & Expiry */}
                      <td className="py-4 px-5 font-mono text-slate-700">
                        {item.expiry_date ? (
                          <div className="flex items-center space-x-1.5 text-slate-800 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-orange-600" />
                            <span>{item.expiry_date}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-sans">Non-perishable</span>
                        )}
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {item.weight_per_unit_kg} kg / unit
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onSelectItem(item)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all shadow-2xs"
                            title="Inspect Details & QR Tag"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onRelocateItem(item.sku)}
                            className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 transition-all border border-orange-200 shadow-2xs"
                            title="Relocate Stock to Another Bin"
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item.sku)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all shadow-2xs"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-700">No stock items match your filter criteria.</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing search terms or selecting 'All' filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Showing <strong className="text-slate-900 font-mono font-bold">{sorted.length}</strong> of <strong className="text-slate-900 font-mono font-bold">{inventory.length}</strong> stock items</span>
          <span className="font-mono text-emerald-700 font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live MongoDB Atlas Sync Active</span>
          </span>
        </div>
      </div>
    </div>
  );
}
