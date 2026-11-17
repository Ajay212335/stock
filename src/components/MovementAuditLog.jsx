import React, { useState } from 'react';
import { 
  History, 
  ArrowLeftRight, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  User, 
  Clock, 
  Search, 
  Filter,
  ArrowRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';

export default function MovementAuditLog({ logs = [] }) {
  const [filterAction, setFilterAction] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = logs.filter((log) => {
    if (filterAction !== 'ALL' && log.action !== filterAction) return false;
    if (search) {
      const s = search.toLowerCase();
      const matchSku = log.sku?.toLowerCase().includes(s);
      const matchName = log.item_name?.toLowerCase().includes(s);
      const matchUser = log.user?.toLowerCase().includes(s);
      if (!matchSku && !matchName && !matchUser) return false;
    }
    return true;
  });

  const getActionBadge = (action) => {
    switch (action) {
      case 'RELOCATE':
        return (
          <span className="px-3 py-1 rounded-xl bg-orange-100 text-orange-800 font-mono font-bold text-xs flex items-center space-x-1.5 border border-orange-200 shadow-2xs">
            <ArrowLeftRight className="w-3.5 h-3.5 text-orange-600" />
            <span>RELOCATE</span>
          </span>
        );
      case 'RECEIVE':
        return (
          <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-mono font-bold text-xs flex items-center space-x-1.5 border border-emerald-200 shadow-2xs">
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
            <span>RECEIVE</span>
          </span>
        );
      case 'DISPATCH':
        return (
          <span className="px-3 py-1 rounded-xl bg-blue-100 text-blue-800 font-mono font-bold text-xs flex items-center space-x-1.5 border border-blue-200 shadow-2xs">
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
            <span>DISPATCH</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-mono text-xs font-bold">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Filters and Header Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-3.5 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by SKU, item name, or operator..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 font-bold focus:outline-none focus:border-orange-500"
          >
            <option value="ALL">All Actions ({logs.length})</option>
            <option value="RELOCATE">Relocations Only</option>
            <option value="RECEIVE">Dock Receipts</option>
            <option value="DISPATCH">Dispatches</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-mono font-semibold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          Showing {filtered.length} audit records
        </span>
      </div>

      {/* Audit Log Timeline Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-5">Timestamp</th>
                <th className="py-4 px-5">Action Type</th>
                <th className="py-4 px-5">SKU & Item Description</th>
                <th className="py-4 px-5">Transfer Route (From → To)</th>
                <th className="py-4 px-5">Quantity</th>
                <th className="py-4 px-5">Operator & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((log, idx) => (
                <tr key={log.id || idx} className="hover:bg-orange-50/40 transition-colors">
                  <td className="py-4 px-5 font-mono text-slate-500 whitespace-nowrap font-medium">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                  </td>
                  <td className="py-4 px-5">
                    {getActionBadge(log.action)}
                  </td>
                  <td className="py-4 px-5 max-w-xs">
                    <span className="font-mono font-bold text-orange-600 block">{log.sku}</span>
                    <span className="text-slate-800 text-xs truncate block font-bold mt-0.5">{log.item_name}</span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs shadow-2xs">
                      <span className="font-bold text-slate-700">{log.from_location}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
                      <span className="font-bold text-slate-900">{log.to_location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-mono font-bold text-emerald-700 text-xs">
                    {log.quantity} units
                  </td>
                  <td className="py-4 px-5 max-w-xs">
                    <div className="flex items-center space-x-1.5 text-slate-900 font-bold">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{log.user || 'System'}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 truncate block font-medium mt-0.5">
                      {log.notes || 'Routine warehouse operation'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Immutable audit records stored in MongoDB Atlas</span>
          <span className="font-mono text-slate-600">Encrypted SHA-256 Audit Chain</span>
        </div>
      </div>
    </div>
  );
}
