import React from 'react';
import { 
  Boxes, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Warehouse, 
  Truck, 
  Flame, 
  Weight, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ArrowUpRight,
  Plus,
  QrCode
} from 'lucide-react';

export default function AnalyticsDashboard({ 
  metrics, 
  zones = [], 
  lowStockItems = [],
  onNavigateTab,
  onRelocateClick,
  onItemClick 
}) {
  const summary = metrics?.summary || {};
  const categories = metrics?.category_distribution || [];
  const velocity = metrics?.velocity_distribution || [];

  return (
    <div className="space-y-6">
      {/* Friendly Welcome & Quick Action Hero Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white shadow-lg shadow-orange-600/20 relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute right-32 top-0 w-32 h-32 bg-amber-400/20 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Facility Operations Radar • Live Atlas Sync</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Apex Central Logistics Hub
            </h2>
            <p className="text-sm text-orange-100 font-medium leading-relaxed">
              Real-time stock tracking and spatial arrangement system. {(summary.total_units || 0).toLocaleString()} units currently slotted across 6 facility zones.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('arrangement')}
              className="px-4 py-2.5 rounded-xl bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs shadow-md transition-all flex items-center space-x-2"
            >
              <Warehouse className="w-4 h-4 text-orange-600" />
              <span>2D Floorplan</span>
            </button>
            <button
              onClick={() => onNavigateTab('scanner')}
              className="px-4 py-2.5 rounded-xl bg-orange-700/60 hover:bg-orange-700/90 text-white font-bold text-xs border border-white/20 transition-all flex items-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan Barcode</span>
            </button>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="px-4 py-2.5 rounded-xl bg-orange-700/60 hover:bg-orange-700/90 text-white font-bold text-xs border border-white/20 transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>View Inventory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total SKUs */}
        <div 
          onClick={() => onNavigateTab('inventory')}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">Total SKUs</span>
            <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-slate-900 block group-hover:text-orange-600 transition-colors">
            {summary.total_skus || 0}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block font-medium">Catalog Items</span>
        </div>

        {/* Total Units */}
        <div 
          onClick={() => onNavigateTab('inventory')}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">Total Stock</span>
            <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-slate-900 block group-hover:text-orange-600 transition-colors">
            {(summary.total_units || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block font-medium">Physical Units</span>
        </div>

        {/* Total Weight */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">Payload Load</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Weight className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-slate-900 block">
            {summary.total_weight_tonnes || 0} <span className="text-xs font-normal text-slate-400">t</span>
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block font-medium">Racking Load</span>
        </div>

        {/* Space Utilization */}
        <div 
          onClick={() => onNavigateTab('arrangement')}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">Space Used</span>
            <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-orange-600 block">
            {summary.warehouse_utilization_pct || 0}%
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block font-medium">
            {summary.occupied_bins || 0} / {summary.total_bins || 0} Bins
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div 
          onClick={() => onNavigateTab('inventory')}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">Safety Alerts</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className={`text-2xl font-black font-mono block ${summary.low_stock_alerts > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
            {summary.low_stock_alerts || 0}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block font-medium">Low Stock Items</span>
        </div>

        {/* Dock Operations */}
        <div 
          onClick={() => onNavigateTab('shipments')}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">Dock Manifests</span>
            <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-slate-900 block group-hover:text-orange-600 transition-colors">
            {summary.active_dock_operations || 0}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block font-medium">Active In/Outbound</span>
        </div>
      </div>

      {/* Middle Section: Zone Space Utilization & Velocity ABC Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Warehouse Zone Space Occupancy */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-orange-600" />
                <span>Zone Capacity & Utilization</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time occupancy across warehouse storage zones</p>
            </div>
            <button
              onClick={() => onNavigateTab('arrangement')}
              className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center space-x-1"
            >
              <span>View Floorplan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {zones.map((z) => {
              const pct = z.utilization_pct || 0;
              return (
                <div key={z.id} className="space-y-1.5 p-3 rounded-2xl bg-slate-50/60 border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center space-x-2.5">
                      <span 
                        className="w-3 h-3 rounded-md inline-block shadow-2xs"
                        style={{ backgroundColor: z.color || '#ea580c' }}
                      ></span>
                      <span className="font-bold text-slate-800">{z.name}</span>
                    </div>
                    <span className="font-mono text-slate-600">
                      {z.occupied_bins} / {z.total_bins} bins (<strong>{pct}%</strong>)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${pct}%`,
                        backgroundColor: z.color || '#ea580c'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Velocity ABC Turnover Distribution */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-orange-600" />
                  <span>Velocity ABC Slotting Analysis</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Optimal arrangement by pick frequency</p>
              </div>
              <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                Lean Logistics
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 block">Class A (Fast)</span>
                <span className="text-2xl font-black font-mono text-orange-600 mt-1 block">
                  {velocity.find(v => v.label.includes('Class A'))?.count || 5} SKUs
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block font-medium">Slot near dock doors</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Class B (Medium)</span>
                <span className="text-2xl font-black font-mono text-amber-600 mt-1 block">
                  {velocity.find(v => v.label.includes('Class B'))?.count || 4} SKUs
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block font-medium">Standard racking bays</span>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">Class C (Slow)</span>
                <span className="text-2xl font-black font-mono text-purple-600 mt-1 block">
                  {velocity.find(v => v.label.includes('Class C'))?.count || 4} SKUs
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block font-medium">High tiers & bulk zones</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 flex items-center justify-between text-xs">
            <span className="text-slate-700 font-bold">Optimize forklift transit & picker travel time?</span>
            <button
              onClick={() => onRelocateClick && onRelocateClick()}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-xs"
            >
              Run Slot Optimizer
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Critical Low Stock Items & Cargo Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Urgent Items (Left 2 cols) */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span>Low Stock & Safety Threshold Alerts</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">SKUs requiring immediate replenishment order</p>
            </div>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs text-orange-600 hover:text-orange-700 font-bold"
            >
              View All ({lowStockItems.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {lowStockItems.slice(0, 4).map((it) => (
              <div
                key={it.sku}
                onClick={() => onItemClick && onItemClick(it)}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200 hover:border-orange-300 cursor-pointer transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-orange-600">{it.sku}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-amber-100 text-amber-800">
                      Bin: {it.bin_id}
                    </span>
                  </div>
                  <p className="font-bold text-slate-800 mt-1 truncate max-w-md">{it.name}</p>
                </div>

                <div className="text-right">
                  <span className="text-rose-600 font-mono font-bold text-sm block">
                    {it.quantity} {it.unit}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Min safety: {it.min_threshold}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cargo Category Distribution (Right 1 col) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">Cargo Category Breakdown</h3>
          <p className="text-xs text-slate-500 mb-5">Stored physical units per category</p>
          <div className="space-y-3.5">
            {categories.map((c, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-100 last:border-none font-medium">
                <span className="text-slate-700 truncate max-w-[170px]">{c.category}</span>
                <span className="font-mono font-bold text-slate-900">{c.units.toLocaleString()} units</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
