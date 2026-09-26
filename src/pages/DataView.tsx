import React, { useState, useEffect } from 'react';
import { DEMO_INVOICES } from '../data/demoDatabase';
import { 
  Search, 
  Download,
  RefreshCw,
  Building2,
  ArrowUpRight
} from 'lucide-react';
import { sound } from '../utils/audio';
import { ActivePage } from '../components/Navigation';
import { BackendAPI, BackendInvoice, BackendStatus } from '../services/backendApi';

interface DataViewProps {
  onNavigate?: (page: ActivePage) => void;
}

export const DataView: React.FC<DataViewProps> = ({ onNavigate }) => {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('CHECKING');
  const [liveInvoices, setLiveInvoices] = useState<BackendInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = BackendAPI.subscribeToStatus(setBackendStatus);
    BackendAPI.startPolling();
    return unsub;
  }, []);

  useEffect(() => {
    if (backendStatus === 'ONLINE') {
      loadLiveData();
    }
  }, [backendStatus]);

  const loadLiveData = async () => {
    setIsLoading(true);
    const invoices = await BackendAPI.fetchInvoices();
    if (invoices.length > 0) setLiveInvoices(invoices);
    setIsLoading(false);
  };

  const invoicesToShow = (liveInvoices.length > 0 ? liveInvoices : DEMO_INVOICES.map(inv => ({
    ...inv,
    invoice_id: inv.invoice_id,
    customer_name: inv.customer_name,
    amount: inv.amount,
    status: inv.status,
    due_date: inv.due_date,
    days_overdue: inv.days_overdue,
  } as BackendInvoice))).filter(inv => {
    const custName = inv.customer_name || inv.customer_id || '';
    const matchesSearch = inv.invoice_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      custName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedInvoice = invoicesToShow.find(i => i.invoice_id === selectedInvoiceId) || invoicesToShow[0];

  const handleExportCSV = () => {
    sound.playSuccess();
    const headers = "Invoice ID,Customer,Amount,Status,Due Date,Days Overdue\n";
    const rows = invoicesToShow.map(i => `${i.invoice_id},"${i.customer_name || i.customer_id}",${i.amount},${i.status},${i.due_date},${i.days_overdue || 0}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finnova_invoices_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading tracking-tight">
            Invoices
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Track outstanding customer balances and payment status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { sound.playClick(); loadLiveData(); }}
            disabled={isLoading}
            className="px-4 py-2 rounded-2xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isLoading ? 'animate-spin' : ''}`} />
            Sync
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-2xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ─── Filters & Search ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice or customer..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 text-xs">
            <button
              onClick={() => { sound.playClick(); setStatusFilter('ALL'); }}
              className={`px-4 py-1.5 rounded-xl font-bold transition-all ${statusFilter === 'ALL' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All
            </button>
            <button
              onClick={() => { sound.playClick(); setStatusFilter('OVERDUE'); }}
              className={`px-4 py-1.5 rounded-xl font-bold transition-all ${statusFilter === 'OVERDUE' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Overdue
            </button>
            <button
              onClick={() => { sound.playClick(); setStatusFilter('PAID'); }}
              className={`px-4 py-1.5 rounded-xl font-bold transition-all ${statusFilter === 'PAID' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Paid
            </button>
          </div>
        </div>
      </div>

      {/* ─── Master Detail Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Invoice Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col h-[680px]">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-200 uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="px-5 py-4">Invoice</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Overdue</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoicesToShow.map((inv) => {
                  const isSelected = selectedInvoice?.invoice_id === inv.invoice_id;
                  return (
                    <tr
                      key={inv.invoice_id}
                      onClick={() => { sound.playClick(); setSelectedInvoiceId(inv.invoice_id); }}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50/60' : 'hover:bg-slate-50/80'}`}
                    >
                      <td className="px-5 py-4 font-mono-num font-bold text-slate-900">{inv.invoice_id}</td>
                      <td className="px-5 py-4 font-semibold text-slate-700">{inv.customer_name || inv.customer_id}</td>
                      <td className="px-5 py-4 font-mono-num font-bold text-slate-900">₹{inv.amount.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          inv.status === 'OVERDUE' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono-num text-slate-500">
                        {inv.days_overdue ? `${inv.days_overdue} days` : '0 days'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                          isSelected ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}>
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Glassmorphism Purple Gradient Translucent Detail Drawer */}
        {selectedInvoice && (
          <div className="lg:col-span-5 glass-panel p-6 flex flex-col h-[680px] overflow-y-auto space-y-6 shadow-xl">
            
            {/* Invoice Overview Header */}
            <div className="flex items-start justify-between pb-4 border-b border-indigo-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 block mb-1">Invoice Overview</span>
                <h2 className="text-2xl font-black font-mono-num text-slate-900">{selectedInvoice.invoice_id}</h2>
                <p className="text-xs font-semibold text-slate-600 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  {selectedInvoice.customer_name || selectedInvoice.customer_id}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                selectedInvoice.status === 'OVERDUE' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                selectedInvoice.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {selectedInvoice.status}
              </span>
            </div>

            {/* Amount and Key Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/80 border border-indigo-100/80 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Amount</span>
                <span className="text-2xl font-black font-mono-num text-slate-900">₹{selectedInvoice.amount.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 border border-indigo-100/80 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Due Date</span>
                <span className="text-sm font-bold font-mono-num text-slate-800">{selectedInvoice.due_date}</span>
                {selectedInvoice.days_overdue && (
                  <span className="text-[10px] font-bold text-rose-600 block mt-0.5">{selectedInvoice.days_overdue} days overdue</span>
                )}
              </div>
            </div>

            {/* Payment & Collection Ledger */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment & Collection Ledger</h3>
              
              <div className="p-4 rounded-2xl border border-indigo-100/80 bg-white/80 space-y-3 text-xs shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Reconciliation Record</span>
                  <span className="font-semibold text-slate-800">
                    {selectedInvoice.status === 'PAID' ? 'Confirmed in Bank Ledger' : 'Unmatched - No Bank Record'}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Risk Score</span>
                  <span className={`font-mono-num font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                    selectedInvoice.status === 'OVERDUE' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedInvoice.status === 'OVERDUE' ? 'HIGH RISK' : 'LOW RISK'}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Governance Policy</span>
                  <span className="font-semibold text-slate-700">
                    {selectedInvoice.status === 'OVERDUE' ? 'Approval Gate Required' : 'Standard Auto Monitoring'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block mb-1">Recommended Operation</span>
                  <p className="text-slate-700 font-medium bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/60 leading-relaxed">
                    {selectedInvoice.status === 'OVERDUE' 
                      ? 'Prepare payment reminder statement and dispatch via approval queue.'
                      : 'Account in good standing. No collection action needed.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action CTA with Electric Indigo Primary Button */}
            {selectedInvoice.status === 'OVERDUE' && (
              <button 
                onClick={() => { sound.playClick(); onNavigate ? onNavigate('approvals') : null; }}
                className="w-full btn-indigo py-3.5 text-xs font-bold flex items-center justify-center gap-2 mt-auto shadow-md shadow-indigo-200"
              >
                <span>Initiate Collection Recovery</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
