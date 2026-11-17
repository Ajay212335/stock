const API_BASE = import.meta.env.VITE_API_BASE_URL || (
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8001/api'
    : 'https://stock-mo5n.onrender.com/api'
);

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(err.detail || `HTTP Error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`API call failed for ${endpoint}:`, error.message);
    throw error;
  }
}

export const stockApi = {
  // Auth
  login: (credentials) => fetchJson('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  signup: (userData) => fetchJson('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  // Inventory
  getInventory: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.search) qs.append('search', params.search);
    if (params.category && params.category !== 'All') qs.append('category', params.category);
    if (params.zone && params.zone !== 'All') qs.append('zone', params.zone);
    if (params.status && params.status !== 'All') qs.append('status', params.status);
    return fetchJson(`/inventory/?${qs.toString()}`);
  },

  getItem: (sku) => fetchJson(`/inventory/${sku}`),

  createItem: (item) => fetchJson('/inventory/', {
    method: 'POST',
    body: JSON.stringify(item)
  }),

  updateItem: (sku, updates) => fetchJson(`/inventory/${sku}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),

  deleteItem: (sku) => fetchJson(`/inventory/${sku}`, {
    method: 'DELETE'
  }),

  getLowStockAlerts: () => fetchJson('/inventory/alerts/low-stock'),

  // Stock Arrangement & Spatial Layout
  getZones: () => fetchJson('/arrangement/zones'),

  getBins: (zoneId) => {
    const qs = zoneId && zoneId !== 'All' ? `?zone_id=${zoneId}` : '';
    return fetchJson(`/arrangement/bins${qs}`);
  },

  relocateStock: (payload) => fetchJson('/arrangement/relocate', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  getSlottingHeatMap: () => fetchJson('/arrangement/heat-map'),

  // Shipments (Inbound & Outbound)
  getShipments: (type) => {
    const qs = type && type !== 'ALL' ? `?type=${type}` : '';
    return fetchJson(`/shipments/${qs}`);
  },

  createShipment: (shipment) => fetchJson('/shipments/', {
    method: 'POST',
    body: JSON.stringify(shipment)
  }),

  updateShipmentStatus: (orderId, status) => fetchJson(`/shipments/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),

  // Analytics & Audit Logs
  getDashboardAnalytics: () => fetchJson('/analytics/dashboard'),
  getAuditLogs: (limit = 50) => fetchJson(`/logs/?limit=${limit}`),
  getHealth: () => fetchJson('/health')
};
