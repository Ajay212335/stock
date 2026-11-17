import React from 'react';
import { 
  LayoutDashboard, 
  PackageSearch, 
  Grid3X3, 
  Truck, 
  History, 
  QrCode, 
  Sparkles,
  Layers,
  TrendingUp,
  MapPin,
  Building2,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, stats }) {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Overview & KPIs', 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      id: 'inventory', 
      label: 'Stock Tracking', 
      icon: PackageSearch,
      badge: stats?.total_skus ? `${stats.total_skus}` : null
    },
    { 
      id: 'arrangement', 
      label: 'Stock Arrangement', 
      icon: Grid3X3,
      badge: null
    },
    { 
      id: 'shipments', 
      label: 'Inbound & Outbound', 
      icon: Truck,
      badge: stats?.active_dock_operations ? `${stats.active_dock_operations}` : null
    },
    { 
      id: 'scanner', 
      label: 'Barcode & QR Scanner', 
      icon: QrCode,
      badge: null
    },
    { 
      id: 'logs', 
      label: 'Movement Audit Log', 
      icon: History,
      badge: null
    },
  ];

  return (
    <aside className="w-56 border-r border-slate-200/90 bg-white flex flex-col justify-between p-3 hidden md:flex shrink-0 shadow-xs">
      <div className="space-y-4">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-2.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
            Operations Console
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/70'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isActive ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono shrink-0 ml-1.5 ${
                    isActive 
                      ? 'bg-orange-700 text-white font-bold' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200/80 font-bold'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Slotting Arrangement Insight Card */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-50/80 via-white to-amber-50/70 border border-orange-200 shadow-2xs">
          <div className="flex items-center space-x-1.5 text-orange-700 mb-1.5">
            <div className="w-5 h-5 rounded-md bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="text-[11px] font-bold">Slotting AI Advisor</span>
          </div>
          <p className="text-[10px] text-slate-600 leading-relaxed mb-2 font-medium">
            Keep fast-moving (Class-A) SKUs closer to loading docks to reduce pick transit.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-orange-200/80 text-[10px]">
            <span className="text-slate-500 font-medium">Space Used:</span>
            <span className="font-bold text-orange-600 font-mono">
              {stats?.warehouse_utilization_pct || 39.1}%
            </span>
          </div>
        </div>
      </div>

      {/* Facility Footer */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center space-x-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs shrink-0">
            DC
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-[11px] font-bold text-slate-900 truncate">Apex Hub</p>
            <p className="text-[9px] text-emerald-700 truncate flex items-center font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1 animate-pulse"></span>
              All Docks Active
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
