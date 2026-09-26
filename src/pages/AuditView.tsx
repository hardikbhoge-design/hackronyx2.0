import React, { useState, useEffect, useCallback } from 'react';
import { 
  Download, 
  Search, 
  ShieldCheck, 
  RefreshCw
} from 'lucide-react';
import { sound } from '../utils/audio';
import { BackendAPI, BackendAuditLog } from '../services/backendApi';

export const AuditView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [backendLogs, setBackendLogs] = useState<BackendAuditLog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadLogs = useCallback(async () => {
    setIsRefreshing(true);
    const logs = await BackendAPI.fetchBackendAuditLogs();
    setBackendLogs(logs);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    BackendAPI.startPolling();
    loadLogs();
  }, [loadLogs]);

  const filteredLogs = backendLogs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const handleExportCSV = () => {
    sound.playSuccess();
    const headers = "Timestamp,Event,System/Actor,Details\n";
    const rows = filteredLogs.map(l => `"${l.timestamp}","${l.action}","${l.agent}","${JSON.stringify(l.details || {}).replace(/"/g, '""')}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finnova_compliance_audit_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
            Compliance Audit Log
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Immutable log of enterprise financial events, workflow executions, and authorization records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadLogs}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-2xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            className="btn-indigo text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-100"
          >
            <Download className="w-3.5 h-3.5" />
            Export Log
          </button>
        </div>
      </div>

      {/* ─── Filters & Search ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search log by event, workflow, or invoice..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 font-mono-num">{filteredLogs.length} events logged</span>
        </div>
      </div>

      {/* ─── Audit Log Table ─── */}
      <div className="bento-card overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Audit Stream</h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            RECORDED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white text-slate-500 font-extrabold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Event</th>
                <th className="px-6 py-3.5">System / User</th>
                <th className="px-6 py-3.5">Workflow</th>
                <th className="px-6 py-3.5">Details</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono-num text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{log.action}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-full text-[11px] border border-slate-200 font-bold">
                        {log.agent.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-600">Overdue Recovery</td>
                    <td className="px-6 py-4 font-mono-num text-slate-500 max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-xs font-semibold">
                    No compliance audit records found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
