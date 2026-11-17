import React, { useState } from 'react';
import { 
  Warehouse, 
  Layers, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeftRight, 
  Thermometer, 
  Droplets,
  Package,
  Weight,
  Maximize2,
  Sparkles,
  Info,
  Zap,
  Snowflake,
  Truck,
  Box,
  CornerDownRight,
  Plus,
  Search,
  Check,
  TrendingUp,
  Cpu,
  Wrench,
  Pill,
  Coffee
} from 'lucide-react';

export default function WarehouseFloorplan({ 
  zones = [], 
  bins = [], 
  heatMapData = null, 
  onRelocateClick,
  onItemClick 
}) {
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedBin, setSelectedBin] = useState(null);
  const [viewMode, setViewMode] = useState('occupancy'); // 'occupancy' | 'velocity'
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered zones
  const displayedZones = selectedZone === 'All' 
    ? zones 
    : zones.filter(z => z.id === selectedZone);

  // Filtered bins
  const getBinsForZone = (zoneId) => {
    return bins.filter(b => {
      const matchZone = b.zone_id === zoneId;
      if (!matchZone) return false;
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        const hasCode = b.bin_code.toLowerCase().includes(s);
        const hasItem = b.current_items?.some(i => 
          i.sku.toLowerCase().includes(s) || i.name.toLowerCase().includes(s)
        );
        return hasCode || hasItem;
      }
      return true;
    });
  };

  const getCategoryIcon = (category = '') => {
    if (category.includes('Electronics')) return Cpu;
    if (category.includes('Automotive') || category.includes('Industrial')) return Wrench;
    if (category.includes('Pharma') || category.includes('Cold')) return Pill;
    if (category.includes('Goods') || category.includes('FMCG')) return Coffee;
    return Box;
  };

  const getZoneIcon = (zoneId) => {
    switch (zoneId) {
      case 'ZONE-A': return Zap;
      case 'ZONE-B': return Layers;
      case 'ZONE-C': return Weight;
      case 'ZONE-COLD': return Snowflake;
      case 'ZONE-STAGE': return Truck;
      case 'ZONE-DISPATCH': return ArrowRight;
      default: return Warehouse;
    }
  };

  const totalCapacityBins = bins.length;
  const occupiedTotalBins = bins.filter(b => b.current_items && b.current_items.length > 0).length;
  const overallOccupancyPct = totalCapacityBins > 0 ? Math.round((occupiedTotalBins / totalCapacityBins) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Filter & View Controls Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: View Mode Toggle & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setViewMode('occupancy')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                viewMode === 'occupancy' 
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Capacity View</span>
            </button>
            <button
              onClick={() => setViewMode('velocity')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                viewMode === 'velocity' 
                  ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white shadow-md shadow-orange-600/25' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Velocity ABC Heatmap</span>
            </button>
          </div>

          {/* Quick Bin Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by bin (e.g. A-01) or SKU..."
              className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all w-56 font-medium"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pt-1 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          {viewMode === 'occupancy' ? (
            <>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-400 inline-block shadow-2xs"></span>
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-md bg-orange-100 border border-orange-400 inline-block shadow-2xs"></span>
                <span>Partially Full (&lt;85%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-md bg-rose-100 border border-rose-400 inline-block shadow-2xs"></span>
                <span>Near Capacity (&gt;85%)</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-md bg-orange-200 border border-orange-500 inline-block"></span>
                <span>Class A (Fast Movers)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-400 inline-block"></span>
                <span>Class B (Medium)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-md bg-purple-100 border border-purple-400 inline-block"></span>
                <span>Class C (Slow Movers)</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Zone Category Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedZone('All')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-2xs ${
            selectedZone === 'All'
              ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25'
              : 'bg-white hover:bg-orange-50 text-slate-700 border border-slate-200'
          }`}
        >
          All Zones ({zones.length})
        </button>
        {zones.map(z => {
          const Icon = getZoneIcon(z.id);
          const isSelected = selectedZone === z.id;
          return (
            <button
              key={z.id}
              onClick={() => setSelectedZone(z.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-2 shadow-2xs ${
                isSelected
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25'
                  : 'bg-white hover:bg-orange-50 text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-orange-600'}`} />
              <span>{z.name.split(' ')[0]} ({z.code})</span>
            </button>
          );
        })}
      </div>

      {/* AI Slotting Optimization Banner */}
      {heatMapData && heatMapData.misplaced_count > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-orange-50 via-amber-50/70 to-orange-100/50 border border-orange-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-slate-900">Warehouse Slotting Efficiency:</h4>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-200/90 text-orange-800 font-mono font-bold border border-orange-300">
                  {heatMapData.slotting_efficiency_score}% Optimal
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                {heatMapData.misplaced_count} slotting rearrangement opportunity detected. Moving high-turnover Class-A items closer to dispatch bays minimizes forklift transit distance.
              </p>
            </div>
          </div>
          <button
            onClick={() => onRelocateClick && onRelocateClick(heatMapData.recommendations[0]?.sku)}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shrink-0 shadow-md shadow-orange-600/25 flex items-center space-x-2"
          >
            <span>Review Slot Recommendation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid: Warehouse Zones (Left 2 Cols) + Interactive Inspector (Right 1 Col) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Zone Layouts */}
        <div className="xl:col-span-2 space-y-6">
          {displayedZones.map((zone) => {
            const zoneBins = getBinsForZone(zone.id);
            const isCold = zone.id === 'ZONE-COLD';
            const ZoneIcon = getZoneIcon(zone.id);

            return (
              <div 
                key={zone.id} 
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm transition-all hover:shadow-md relative overflow-hidden"
              >
                {/* Zone Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
                  <div className="flex items-center space-x-3.5">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: zone.color || '#ea580c' }}
                    >
                      <ZoneIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-slate-900">{zone.name}</h3>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                          {zone.code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{zone.description || zone.type}</p>
                    </div>
                  </div>

                  {/* Telemetry (e.g. Cold storage temp/humidity) */}
                  <div className="flex items-center space-x-3 text-xs">
                    {isCold && zone.temperature_c !== undefined && (
                      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 font-mono text-xs font-bold shadow-2xs">
                        <Thermometer className="w-4 h-4 text-cyan-600 animate-pulse" />
                        <span>{zone.temperature_c}°C</span>
                        <span className="text-cyan-400 font-normal">|</span>
                        <span>{zone.humidity_pct || 80}% RH</span>
                      </div>
                    )}
                    <div className="text-right bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-500 font-medium">Zone Utilization: </span>
                      <span className="text-xs font-mono font-bold text-orange-600">
                        {zone.occupied_bins} / {zone.total_bins} ({zone.utilization_pct || 0}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Warehouse Rack Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {zoneBins.map((bin) => {
                    const isSelected = selectedBin?.bin_code === bin.bin_code;
                    const items = bin.current_items || [];
                    const isOccupied = items.length > 0;
                    const primaryItem = items[0];
                    const weightPct = bin.weight_occupancy_pct || 0;
                    const ItemIcon = primaryItem ? getCategoryIcon(primaryItem.category) : Box;

                    // Color determination
                    let cellBg = 'bg-slate-50/80 hover:bg-orange-50/40 border-slate-200/90';
                    let loadColor = 'bg-emerald-500';

                    if (viewMode === 'velocity') {
                      if (!isOccupied) {
                        cellBg = 'bg-slate-50/60 border-slate-200 text-slate-400';
                      } else {
                        const hasA = items.some(i => i.velocity_class === 'A');
                        const hasB = items.some(i => i.velocity_class === 'B');
                        if (hasA) {
                          cellBg = 'bg-orange-50/90 border-orange-400 shadow-xs ring-1 ring-orange-200';
                          loadColor = 'bg-orange-600';
                        } else if (hasB) {
                          cellBg = 'bg-amber-50/90 border-amber-300';
                          loadColor = 'bg-amber-500';
                        } else {
                          cellBg = 'bg-purple-50/90 border-purple-300';
                          loadColor = 'bg-purple-600';
                        }
                      }
                    } else if (isOccupied) {
                      if (weightPct >= 85) {
                        cellBg = 'bg-rose-50/90 border-rose-300 shadow-xs';
                        loadColor = 'bg-rose-500';
                      } else {
                        cellBg = 'bg-white border-orange-200 shadow-xs hover:border-orange-400';
                        loadColor = 'bg-orange-500';
                      }
                    }

                    return (
                      <div
                        key={bin.id}
                        onClick={() => setSelectedBin(bin)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 flex flex-col justify-between group min-h-[140px] ${cellBg} ${
                          isSelected ? 'ring-2 ring-orange-500 border-transparent shadow-md scale-[1.02] bg-white' : 'hover:shadow-sm'
                        }`}
                      >
                        {/* Rack Cell Header: Bin Code & Tier Level */}
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="font-mono text-xs font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors whitespace-nowrap">
                            {bin.bin_code}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold font-mono whitespace-nowrap ${
                            bin.shelf_level === 1 ? 'bg-slate-200 text-slate-700' :
                            bin.shelf_level === 2 ? 'bg-orange-100 text-orange-800' :
                            bin.shelf_level === 3 ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            Tier {bin.shelf_level}
                          </span>
                        </div>

                        {/* Stored Cargo Slot Presentation */}
                        <div className="mb-3">
                          {isOccupied ? (
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1.5">
                                <ItemIcon className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                                <span className="font-mono text-xs font-bold text-slate-900 truncate">
                                  {primaryItem.sku}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 truncate font-medium">
                                {primaryItem.name}
                              </p>
                              <p className="text-[11px] font-bold text-orange-700">
                                {primaryItem.quantity} {primaryItem.unit}
                              </p>
                            </div>
                          ) : (
                            <div className="py-2">
                              <span className="text-xs text-slate-400 font-medium flex items-center space-x-1.5">
                                <Box className="w-3.5 h-3.5 text-slate-300" />
                                <span>Available Slot</span>
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                Max Capacity: {bin.max_weight_kg}kg
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Weight Load Progress Bar */}
                        <div className="pt-2.5 border-t border-slate-100">
                          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1.5">
                            <span className="font-mono">{bin.current_weight_kg ? `${Math.round(bin.current_weight_kg)}kg` : '0kg'}</span>
                            <span className="font-mono font-bold text-slate-800">{weightPct}% Load</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${loadColor}`}
                              style={{ width: `${Math.min(weightPct, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Dynamic Live Slot Inspector & Warehouse Radar */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-md p-6 sticky top-20">
            {selectedBin ? (
              /* BIN INSPECTOR VIEW (When a rack slot is clicked) */
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5">
                      Rack Slot Inspection
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 font-mono flex items-center space-x-2">
                      <span>{selectedBin.bin_code}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-sans font-bold ${
                        selectedBin.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                        selectedBin.status === 'Full' ? 'bg-rose-100 text-rose-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {selectedBin.status}
                      </span>
                    </h3>
                  </div>

                  <button
                    onClick={() => onRelocateClick && onRelocateClick(selectedBin.current_items?.[0]?.sku)}
                    className="p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 transition-all border border-orange-200 shadow-2xs"
                    title="Transfer Cargo Out of this Slot"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 4-Tier Rack Elevation Graphic */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                    Vertical Rack Elevation Schematic
                  </span>
                  <div className="space-y-1.5">
                    {[4, 3, 2, 1].map((lvl) => {
                      const isCurrentLevel = selectedBin.shelf_level === lvl;
                      return (
                        <div 
                          key={lvl}
                          className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                            isCurrentLevel
                              ? 'bg-orange-600 text-white font-bold shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-500'
                          }`}
                        >
                          <span className="flex items-center space-x-2">
                            <span>Level {lvl}</span>
                            <span className="text-[10px] font-sans opacity-80">
                              {lvl === 4 ? '(High Tier)' : lvl === 1 ? '(Ground / Pallet)' : '(Mid)'}
                            </span>
                          </span>
                          {isCurrentLevel && <span className="text-[10px] uppercase tracking-wide bg-orange-700 px-1.5 py-0.2 rounded">Selected Bin</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Load Meters */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
                    <span className="text-[10px] text-slate-500 block mb-1 font-semibold">Payload Weight</span>
                    <span className="text-base font-bold text-slate-900 font-mono block">
                      {selectedBin.current_weight_kg || 0} / {selectedBin.max_weight_kg} kg
                    </span>
                    <div className="w-full h-1.5 bg-orange-200/80 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-orange-600 rounded-full"
                        style={{ width: `${Math.min(selectedBin.weight_occupancy_pct || 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
                    <span className="text-[10px] text-slate-500 block mb-1 font-semibold">Cubic Clearance</span>
                    <span className="text-base font-bold text-slate-900 font-mono block">
                      {selectedBin.current_volume_m3 || 0} / {selectedBin.max_volume_m3} m³
                    </span>
                    <div className="w-full h-1.5 bg-orange-200/80 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-orange-600 rounded-full"
                        style={{ width: `${Math.min(selectedBin.volume_occupancy_pct || 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Slotted Inventory List */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    Slotted Cargo Items ({selectedBin.current_items?.length || 0})
                  </h4>
                  {selectedBin.current_items && selectedBin.current_items.length > 0 ? (
                    <div className="space-y-2">
                      {selectedBin.current_items.map((item, idx) => (
                        <div 
                          key={idx}
                          onClick={() => onItemClick && onItemClick(item)}
                          className="p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200 hover:border-orange-300 cursor-pointer transition-all"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-orange-600 font-mono">{item.sku}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                              item.velocity_class === 'A' ? 'bg-orange-100 text-orange-800' :
                              item.velocity_class === 'B' ? 'bg-amber-100 text-amber-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              Class {item.velocity_class}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-medium">
                            <span>Quantity: <strong className="text-slate-900 font-mono">{item.quantity} {item.unit}</strong></span>
                            <span>{item.weight_per_unit_kg * item.quantity} kg</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-500 text-xs">
                      <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-bold text-slate-700">Empty & Clean Bin Slot</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Ready for freight dock intake.</p>
                      <button
                        onClick={() => onRelocateClick && onRelocateClick(null, selectedBin.bin_code)}
                        className="mt-3.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        Slot Cargo Here
                      </button>
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedBin(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Deselect Slot
                </button>
              </div>
            ) : (
              /* LIVE WAREHOUSE RADAR VIEW (When no bin is clicked) */
              <div className="space-y-5">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <Warehouse className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Facility Floor Radar</h3>
                    <p className="text-xs text-slate-500">Live slot occupancy & spatial health</p>
                  </div>
                </div>

                {/* Space Occupancy Dial Summary */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50/50 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">Total Bins Occupied</span>
                    <span className="text-sm font-black font-mono text-orange-600">{overallOccupancyPct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-orange-200/80 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-600 rounded-full transition-all"
                      style={{ width: `${overallOccupancyPct}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-medium">
                    <span>{occupiedTotalBins} Occupied</span>
                    <span>{totalCapacityBins - occupiedTotalBins} Available</span>
                  </div>
                </div>

                {/* Quick Facility Guidelines */}
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Slotting Best Practices
                  </span>
                  
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
                    <Zap className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Zone A (Dock Proximity)</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Keep Class A goods in Aisle A to minimize picker turnaround time.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
                    <Snowflake className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Cold Chain Compliance</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Biologics and vaccines must remain locked to Zone COLD (-18°C).</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
                    <Weight className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Heavy Ground Pallets</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Industrial machinery parts above 300kg belong on Level 1 ground bays.</p>
                    </div>
                  </div>
                </div>

                {/* Helpful Tip */}
                <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/80 text-xs text-orange-800 flex items-center space-x-2">
                  <Info className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>Click on any bin rack cell on the left to inspect its contents or transfer cargo.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
