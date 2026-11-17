import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  Bell, 
  Plus, 
  QrCode, 
  Warehouse, 
  ArrowLeftRight,
  LogOut,
  Home,
  User,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  onQuickAction, 
  lowStockCount, 
  searchQuery, 
  setSearchQuery,
  dbStatus,
  onOpenScanner,
  currentUser,
  onLogout,
  onGoHome
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between shadow-xs">
      {/* Brand & Warehouse Selector */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onQuickAction('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Logix<span className="text-orange-600">Flow</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                WMS 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">Intelligent Stock & Spatial Slotting</p>
          </div>
        </div>

        {/* Warehouse Location Selector */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-orange-50/60 border border-orange-100 text-xs">
          <Warehouse className="w-3.5 h-3.5 text-orange-600" />
          <span className="text-slate-500 font-medium">Facility:</span>
          <select className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer">
            <option value="DC-01">Apex Central Hub (DC-01) - 45,000 sq.ft</option>
            <option value="DC-02">Port Gateway Depot (DC-02)</option>
            <option value="DC-03">North Air Cargo Vault (DC-03)</option>
          </select>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden lg:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU, item, lot number, or bin location (e.g., A-01-02)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-semibold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2.5">
        {/* Scan Barcode Button */}
        <button
          onClick={onOpenScanner}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-xs font-bold text-orange-700 transition-all shadow-xs"
          title="Open simulated handheld Barcode / QR Scanner"
        >
          <QrCode className="w-4 h-4 text-orange-600" />
          <span className="hidden sm:inline">Scan SKU</span>
        </button>

        {/* Fast Relocate Button */}
        <button
          onClick={() => onQuickAction('relocate')}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
          title="Quickly relocate stock to another bin"
        >
          <ArrowLeftRight className="w-4 h-4 text-orange-600" />
          <span className="hidden sm:inline">Relocate</span>
        </button>

        {/* Add Stock Button */}
        <button
          onClick={() => onQuickAction('add-stock')}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white transition-all shadow-md shadow-orange-600/25 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Stock</span>
        </button>

        {/* Alerts Button */}
        <button
          onClick={() => onQuickAction('alerts')}
          className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 transition-all"
          title="Stock Alerts"
        >
          <Bell className="w-4 h-4" />
          {lowStockCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
              {lowStockCount}
            </span>
          )}
        </button>

        {/* User Profile & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 pl-2 pr-1.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
              {currentUser?.name ? currentUser.name[0].toUpperCase() : 'A'}
            </div>
            <span className="text-xs font-bold text-slate-800 hidden md:block max-w-[100px] truncate">
              {currentUser?.name || 'Supervisor'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-xs font-medium animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-900 truncate">{currentUser?.name || 'Ajay Vishwa'}</p>
                <p className="text-[11px] text-orange-600 font-semibold">{currentUser?.role || 'Warehouse Manager'}</p>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onGoHome();
                }}
                className="w-full px-4 py-2 text-left text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center space-x-2 transition-colors"
              >
                <Home className="w-4 h-4 text-orange-600" />
                <span>Marketing Home</span>
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout();
                }}
                className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition-colors border-t border-slate-100 mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
