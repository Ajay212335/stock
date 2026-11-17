import React, { useState, useEffect, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import WarehouseFloorplan from './components/WarehouseFloorplan';
import StockTable from './components/StockTable';
import StockArrangementModal from './components/StockArrangementModal';
import AddStockModal from './components/AddStockModal';
import StockDetailModal from './components/StockDetailModal';
import ShipmentManager from './components/ShipmentManager';
import BarcodeScannerModal from './components/BarcodeScannerModal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import MovementAuditLog from './components/MovementAuditLog';
import { stockApi } from './services/api';

export default function App() {
  // Navigation: 'landing' | 'auth' | 'dashboard'
  const [pageView, setPageView] = useState('landing');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('logix_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data states
  const [inventory, setInventory] = useState([]);
  const [zones, setZones] = useState([]);
  const [bins, setBins] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [heatMapData, setHeatMapData] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRelocateModalOpen, setIsRelocateModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [preselectedSku, setPreselectedSku] = useState(null);
  const [preselectedBin, setPreselectedBin] = useState(null);

  // Load all data
  const loadAllData = useCallback(async () => {
    try {
      const [
        invData, 
        zonesData, 
        binsData, 
        shipmentsData, 
        metricsData, 
        heatData, 
        logsData,
        healthData
      ] = await Promise.allSettled([
        stockApi.getInventory(),
        stockApi.getZones(),
        stockApi.getBins(),
        stockApi.getShipments(),
        stockApi.getDashboardAnalytics(),
        stockApi.getSlottingHeatMap(),
        stockApi.getAuditLogs(),
        stockApi.getHealth()
      ]);

      if (invData.status === 'fulfilled') setInventory(invData.value);
      if (zonesData.status === 'fulfilled') setZones(zonesData.value);
      if (binsData.status === 'fulfilled') setBins(binsData.value);
      if (shipmentsData.status === 'fulfilled') setShipments(shipmentsData.value);
      if (metricsData.status === 'fulfilled') setMetrics(metricsData.value);
      if (heatData.status === 'fulfilled') setHeatMapData(heatData.value);
      if (logsData.status === 'fulfilled') setLogs(logsData.value);
      if (healthData.status === 'fulfilled') setDbStatus(healthData.value);
    } catch (err) {
      console.error('Data load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Auth Handlers
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setPageView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('logix_user');
    localStorage.removeItem('logix_token');
    setCurrentUser(null);
    setPageView('landing');
  };

  // Actions
  const handleRelocateClick = (sku = null, targetBin = null) => {
    setPreselectedSku(sku);
    setPreselectedBin(targetBin);
    setIsRelocateModalOpen(true);
  };

  const handleRelocateSuccess = async (payload) => {
    await stockApi.relocateStock(payload);
    await loadAllData();
  };

  const handleAddStock = async (itemData) => {
    await stockApi.createItem(itemData);
    await loadAllData();
  };

  const handleDeleteItem = async (sku) => {
    if (window.confirm(`Are you sure you want to delete ${sku}?`)) {
      await stockApi.deleteItem(sku);
      await loadAllData();
    }
  };

  const handleUpdateQuantity = async (sku, updates) => {
    const updated = await stockApi.updateItem(sku, updates);
    setSelectedDetailItem(updated);
    await loadAllData();
  };

  const handleUpdateShipmentStatus = async (orderId, newStatus) => {
    await stockApi.updateShipmentStatus(orderId, newStatus);
    await loadAllData();
  };

  const handleCreateShipment = async (shipmentData) => {
    await stockApi.createShipment(shipmentData);
    await loadAllData();
  };

  const lowStockCount = inventory.filter(i => i.quantity <= i.min_threshold).length;
  const lowStockItems = inventory.filter(i => i.quantity <= i.min_threshold);

  // 1. Landing View
  if (pageView === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => {
          if (currentUser) {
            setPageView('dashboard');
          } else {
            setPageView('auth');
          }
        }}
        onLoginClick={() => setPageView('auth')}
      />
    );
  }

  // 2. Auth View (Login & Sign Up)
  if (pageView === 'auth') {
    return (
      <AuthPage
        onAuthSuccess={handleAuthSuccess}
        onBackToHome={() => setPageView('landing')}
      />
    );
  }

  // 3. Authenticated Dashboard View
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentTab={activeTab}
        onQuickAction={(action) => {
          if (action === 'add-stock') setIsAddModalOpen(true);
          else if (action === 'relocate') handleRelocateClick();
          else if (action === 'alerts') setActiveTab('inventory');
          else if (action === 'dashboard') setActiveTab('dashboard');
        }}
        lowStockCount={lowStockCount}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (q && activeTab !== 'inventory') setActiveTab('inventory');
        }}
        dbStatus={dbStatus}
        onOpenScanner={() => setIsScannerOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onGoHome={() => setPageView('landing')}
      />

      {/* Main Container: Sidebar + Active Content View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          stats={metrics?.summary}
        />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* View Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center space-x-2">
                  <span>
                    {activeTab === 'dashboard' && 'Operations Dashboard & KPIs'}
                    {activeTab === 'inventory' && 'Stock Tracking & Inventory Matrix'}
                    {activeTab === 'arrangement' && 'Stock Arrangement & Warehouse Floorplan'}
                    {activeTab === 'shipments' && 'Inbound & Outbound Logistics Dock'}
                    {activeTab === 'scanner' && 'Logistics Barcode & QR Scanner'}
                    {activeTab === 'logs' && 'Movement Audit Trail & Relocation Logs'}
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  {activeTab === 'dashboard' && 'Live throughput, space utilization, and warehouse stock telemetry'}
                  {activeTab === 'inventory' && 'Search, filter, batch monitor, and track physical cargo across warehouse zones'}
                  {activeTab === 'arrangement' && 'Visual 2D rack layout, bin slot capacity utilization, and velocity ABC optimization'}
                  {activeTab === 'shipments' && 'Carrier schedules, dock door management, receiving, and dispatch orders'}
                  {activeTab === 'scanner' && 'Instant cargo tag verification and dock intake terminal'}
                  {activeTab === 'logs' && 'Immutable timestamped chain of all stock transfers, receipts, and slot changes'}
                </p>
              </div>

              {/* Status Pill */}
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-xs px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold flex items-center space-x-2 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>DC-01 Central Hub</span>
                </span>
              </div>
            </div>

            {/* Atlas IP Notice Banner if Atlas is not reachable */}
            {dbStatus && !dbStatus.is_live && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
                    !
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-amber-950">MongoDB Atlas Connection Pending</p>
                    <p className="text-amber-800 mt-0.5">
                      Atlas requires your IP to be allowed. In your MongoDB Atlas Console, go to <b>Network Access &gt; Add IP Address &gt; Allow Access from Anywhere (0.0.0.0/0)</b>.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => loadAllData()}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 transition-all shadow-xs"
                >
                  Retry Atlas Sync
                </button>
              </div>
            )}

            {/* TAB VIEWS */}
            {activeTab === 'dashboard' && (
              <AnalyticsDashboard
                metrics={metrics}
                zones={zones}
                lowStockItems={lowStockItems}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onRelocateClick={handleRelocateClick}
                onItemClick={(item) => setSelectedDetailItem(item)}
              />
            )}

            {activeTab === 'inventory' && (
              <StockTable
                inventory={inventory}
                onSelectItem={(item) => setSelectedDetailItem(item)}
                onRelocateItem={(sku) => handleRelocateClick(sku)}
                onDeleteItem={handleDeleteItem}
                onAddNew={() => setIsAddModalOpen(true)}
              />
            )}

            {activeTab === 'arrangement' && (
              <WarehouseFloorplan
                zones={zones}
                bins={bins}
                heatMapData={heatMapData}
                onRelocateClick={handleRelocateClick}
                onItemClick={(item) => setSelectedDetailItem(item)}
              />
            )}

            {activeTab === 'shipments' && (
              <ShipmentManager
                shipments={shipments}
                onUpdateStatus={handleUpdateShipmentStatus}
                onCreateShipment={handleCreateShipment}
              />
            )}

            {activeTab === 'scanner' && (
              <div className="max-w-2xl mx-auto pt-4">
                <BarcodeScannerModal
                  isOpen={true}
                  onClose={() => setActiveTab('dashboard')}
                  inventory={inventory}
                  onSelectItem={(item) => setSelectedDetailItem(item)}
                  onRelocateItem={(sku) => handleRelocateClick(sku)}
                />
              </div>
            )}

            {activeTab === 'logs' && (
              <MovementAuditLog logs={logs} />
            )}
          </div>
        </main>
      </div>

      {/* MODALS */}
      {/* Relocate / Re-slot Modal */}
      <StockArrangementModal
        isOpen={isRelocateModalOpen}
        onClose={() => setIsRelocateModalOpen(false)}
        inventory={inventory}
        bins={bins}
        zones={zones}
        preselectedSku={preselectedSku}
        preselectedBin={preselectedBin}
        onRelocateSuccess={handleRelocateSuccess}
      />

      {/* Add Stock Modal */}
      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        zones={zones}
        bins={bins}
        onAddStock={handleAddStock}
      />

      {/* Detail / Barcode Sheet Modal */}
      <StockDetailModal
        isOpen={!!selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        item={selectedDetailItem}
        onRelocateClick={(sku) => handleRelocateClick(sku)}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Floating Barcode Scanner Modal */}
      {isScannerOpen && activeTab !== 'scanner' && (
        <BarcodeScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          inventory={inventory}
          onSelectItem={(item) => setSelectedDetailItem(item)}
          onRelocateItem={(sku) => handleRelocateClick(sku)}
        />
      )}
    </div>
  );
}
