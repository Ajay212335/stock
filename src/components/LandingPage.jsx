import React from 'react';
import { 
  Boxes, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Flame, 
  Truck, 
  QrCode, 
  Warehouse, 
  BarChart3, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Globe,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function LandingPage({ onGetStarted, onLoginClick }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onGetStarted}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Boxes className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Logix<span className="text-orange-600">Flow</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                  Enterprise WMS
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Stock Tracking & Spatial Slotting</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-orange-600 transition-colors">Features</a>
            <a href="#floorplan" className="hover:text-orange-600 transition-colors">2D Arrangement</a>
            <a href="#slotting" className="hover:text-orange-600 transition-colors">ABC Heatmap</a>
            <a href="#dock" className="hover:text-orange-600 transition-colors">Dock Operations</a>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onLoginClick}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-orange-600 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-600/25 hover:shadow-orange-600/35 transition-all flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-orange-50/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-700 text-xs font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Next-Gen Stock Tracking & Intelligent Warehouse Arrangement</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Track every pallet. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                Optimize every rack slot.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Reduce forklift travel time by up to 34% with interactive 2D spatial arrangement, automated ABC velocity heatmaps, dock intake scanning, and complete lot traceability.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-xl shadow-orange-600/30 hover:shadow-orange-600/40 transition-all flex items-center justify-center space-x-2"
              >
                <span>Launch Logistics Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onLoginClick}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-300 shadow-xs transition-all"
              >
                Sign In
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left border-t border-slate-200/80 max-w-3xl mx-auto">
              <div>
                <span className="text-2xl font-black text-slate-900 font-mono block">45,000</span>
                <span className="text-xs text-slate-500 font-medium">Sq.Ft Facility Layout</span>
              </div>
              <div>
                <span className="text-2xl font-black text-orange-600 font-mono block">99.8%</span>
                <span className="text-xs text-slate-500 font-medium">Slotting Accuracy</span>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 font-mono block">3.4x</span>
                <span className="text-xs text-slate-500 font-medium">Faster Dock Turnover</span>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-600 font-mono block">100%</span>
                <span className="text-xs text-slate-500 font-medium">MongoDB Live Sync</span>
              </div>
            </div>
          </div>

          {/* Interactive UI Showcase Teaser */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-white p-3 shadow-2xl shadow-orange-500/10 border border-slate-200/80">
            <div className="rounded-2xl bg-slate-900 p-4 sm:p-6 text-white overflow-hidden shadow-inner">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-slate-400 font-mono pl-2">DC-01 Central Facility Layout • Live View</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
                    Velocity Heatmap Active
                  </span>
                </div>
              </div>

              {/* Mini Interactive Preview Grid */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">ZONE A (High-Velocity)</span>
                  <p className="font-bold font-mono text-orange-400 mt-1">A-01-01 to A-03-04</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300">
                    <span>Occupancy:</span>
                    <strong className="text-white font-mono">82%</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">ZONE B (High-Bay Racks)</span>
                  <p className="font-bold font-mono text-emerald-400 mt-1">B-01-01 to B-03-04</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300">
                    <span>Occupancy:</span>
                    <strong className="text-white font-mono">68%</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">ZONE COLD (Climate Vault)</span>
                  <p className="font-bold font-mono text-cyan-400 mt-1">-18.4°C / 82% RH</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300">
                    <span>Cold Chain:</span>
                    <strong className="text-emerald-400 font-mono">Passed</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">INBOUND DOCKS</span>
                  <p className="font-bold font-mono text-amber-400 mt-1">Bays 1-3 Active</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300">
                    <span>Throughput:</span>
                    <strong className="text-white font-mono">140 U/hr</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar 1: Stock Arrangement */}
      <section id="floorplan" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <Warehouse className="w-6 h-6" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Visual 2D Stock Arrangement & Rack Slotting
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Take the guesswork out of warehouse capacity. Inspect individual rack cells (Aisle, Bay, Shelf Tier) in real time. Monitor max payload weight in kilograms and volume clearance in cubic meters.
              </p>
              <ul className="space-y-3 text-sm text-slate-700 font-medium">
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
                  <span>Real-time weight limit and cube volume tracking per bin</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
                  <span>One-click stock transfer between bins with automatic capacity validation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
                  <span>Cold chain vault monitoring for vaccines and perishables</span>
                </li>
              </ul>
              <button
                onClick={onGetStarted}
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-md transition-all flex items-center space-x-2"
              >
                <span>Try Spatial Floorplan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">Bin Slot Inspector: A-01-02</h4>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800">
                  Partially Full (64%)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100">
                  <span className="text-slate-500 block">Payload Weight</span>
                  <span className="text-lg font-bold font-mono text-slate-900">540 / 850 kg</span>
                </div>
                <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100">
                  <span className="text-slate-500 block">Volume Cube</span>
                  <span className="text-lg font-bold font-mono text-slate-900">2.8 / 4.5 m³</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-orange-600">SKU-ELC-4921</span>
                  <p className="text-slate-700 font-semibold mt-0.5">IoT Telematics Gateway Hubs</p>
                </div>
                <span className="font-mono font-bold text-slate-900">140 boxes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar 2: Velocity ABC Heatmap */}
      <section id="slotting" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
            <div className="p-6 rounded-3xl bg-orange-50 border border-orange-100 shadow-xl space-y-4">
              <div className="flex items-center space-x-2 text-orange-700 font-bold text-sm">
                <Flame className="w-5 h-5 text-orange-600" />
                <span>Velocity ABC Analysis Advisor</span>
              </div>
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white border border-red-200 flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs shrink-0">
                    A
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">Class A (Fast Movers)</span>
                    <p className="text-xs text-slate-600 mt-0.5">80% of dispatch frequency. Staged near front loading docks.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-amber-200 flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                    B
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">Class B (Medium Turnover)</span>
                    <p className="text-xs text-slate-600 mt-0.5">General automotive spares and consumer items in high-bay racks.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-purple-200 flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                    C
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">Class C (Slow Moving)</span>
                    <p className="text-xs text-slate-600 mt-0.5">Heavy industrial assemblies slotted in high tiers to free dock bays.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Flame className="w-6 h-6" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                AI Slotting Optimizer & Travel Distance Minimization
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                LogixFlow evaluates inventory turnover velocity against spatial proximity to dispatch doors. If a fast-moving SKU is accidentally placed deep in secondary aisles, our algorithm flags it and recommends optimal relocations.
              </p>
              <div className="pt-2">
                <button
                  onClick={onGetStarted}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center space-x-2"
                >
                  <span>Explore Slotting AI</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">Logix<span className="text-orange-500">Flow</span></span>
              <p className="text-xs text-slate-400">Warehouse & Logistics Management System</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            © 2026 LogixFlow Inc. Powered by Python FastAPI & MongoDB. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={onLoginClick}
              className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all"
            >
              Sign In to Console
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
