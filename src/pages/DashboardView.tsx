import React, { useEffect, useState } from 'react';
import { WorkflowResult, BackendAPI, BackendInvoice } from '../services/backendApi';
import { 
  Plus, 
  ArrowUpRight,
  Calendar
} from 'lucide-react';
import { sound } from '../utils/audio';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { ActivePage } from '../components/Navigation';

interface DashboardViewProps {
  workflowResults?: WorkflowResult[];
  onNavigate: (page: ActivePage) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate
}) => {
  const [invoices, setInvoices] = useState<BackendInvoice[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('INV-1003');
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'draft' | 'unpaid'>('unpaid');

  useEffect(() => {
    BackendAPI.fetchInvoices().then(invs => {
      if (invs.length > 0) {
        setInvoices(invs);
        setSelectedInvoiceId(invs[0].invoice_id);
      }
    });
  }, []);

  const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE');
  const paidInvoices = invoices.filter(i => i.status === 'PAID');
  const pendingInvoices = invoices.filter(i => i.status === 'PENDING');
  
  const totalOverdue = overdueInvoices.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = paidInvoices.reduce((acc, curr) => acc + curr.amount, 0);

  const COLORS = { Paid: '#10b981', Overdue: '#ef4444', Pending: '#f59e0b' };

  const invoiceStatusData = [
    { name: 'Overdue', value: overdueInvoices.length || 3, color: COLORS.Overdue },
    { name: 'Paid', value: paidInvoices.length || 3, color: COLORS.Paid },
    { name: 'Pending', value: pendingInvoices.length || 1, color: COLORS.Pending },
  ].filter(d => d.value > 0);

  const invoiceBarData = [
    { name: 'Jul', amount: 12000 },
    { name: 'Aug', amount: 19000 },
    { name: 'Sep', amount: 24000 },
    { name: 'Oct', amount: 31000 },
    { name: 'Nov', amount: 20000 },
    { name: 'Dec', amount: totalOverdue || 24850 },
  ];

  const baseInvoices = invoices.length > 0 ? invoices : [
    { invoice_id: 'INV-1001', customer_name: 'BrightWave Tech', amount: 68750, status: 'OVERDUE', due_date: '2026-10-01', days_overdue: 18 },
    { invoice_id: 'INV-1002', customer_name: 'Starlight Corp', amount: 21480, status: 'PENDING', due_date: '2026-10-05', days_overdue: 4 },
    { invoice_id: 'INV-1003', customer_name: 'BrightWave', amount: 47980, status: 'OVERDUE', due_date: '2026-10-02', days_overdue: 14 },
    { invoice_id: 'INV-1004', customer_name: 'Nova Analytics', amount: 55230, status: 'OVERDUE', due_date: '2026-10-10', days_overdue: 11 },
  ];

  const displayInvoices = baseInvoices.filter(inv => {
    if (invoiceFilter === 'all') return true;
    if (invoiceFilter === 'draft') return inv.status === 'PENDING';
    if (invoiceFilter === 'unpaid') return inv.status === 'OVERDUE';
    return true;
  });

  const selectedInvoice = displayInvoices.find(i => i.invoice_id === selectedInvoiceId) || displayInvoices[0] || baseInvoices[0];

  return (
    <div className="space-y-6 pb-12 max-w-[1380px] mx-auto animate-fade-in">
      
      {/* ─── Top Fast Pill Header bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading tracking-tight">
            Invoices & Receivables
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage and track all customer invoices and payments in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          </div>

          <button
            onClick={() => { sound.playClick(); onNavigate('create'); }}
            className="btn-indigo text-xs px-4 py-2.5 shadow-md shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create an invoice</span>
          </button>
        </div>
      </div>

      {/* ─── Reference Image 1 KPI Metrics Cards Row ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Overdue */}
        <div className="bento-card p-6 flex flex-col justify-between h-[150px] border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Overdue</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          </div>
          <div>
            <div className="text-3xl font-black number-display text-slate-900">
              ₹{(totalOverdue || 24850).toLocaleString()}
            </div>
            <p className="text-xs text-rose-600 font-bold mt-1">
              ↑ 12.5% from last month
            </p>
          </div>
        </div>

        {/* Metric 2: Due within next month */}
        <div className="bento-card p-6 flex flex-col justify-between h-[150px] border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Due within next month</span>
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
          </div>
          <div>
            <div className="text-3xl font-black number-display text-slate-900">
              ₹142,560.00
            </div>
            <p className="text-xs text-indigo-600 font-bold mt-1">
              ↑ 8.2% from last month
            </p>
          </div>
        </div>

        {/* Metric 3: Average time to get paid */}
        <div className="bento-card p-6 flex flex-col justify-between h-[150px] border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Average time to get paid</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <div>
            <div className="text-3xl font-black number-display text-slate-900">
              16 <span className="text-sm font-normal text-slate-500">days</span>
            </div>
            <p className="text-xs text-emerald-600 font-bold mt-1">
              ↓ 2 days from last month
            </p>
          </div>
        </div>

        {/* Metric 4: Available for Instant Payout */}
        <div className="bento-card p-6 flex flex-col justify-between h-[150px] border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Available for Instant Payout</span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">Expects</span>
          </div>
          <div>
            <div className="text-2xl font-black number-display text-slate-900">
              ₹{(totalPaid || 186540).toLocaleString()}
            </div>
            <button 
              onClick={() => onNavigate('data')}
              className="mt-2 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-xl transition-all w-full text-center"
            >
              Payout now
            </button>
          </div>
        </div>

      </div>

      {/* ─── Main Charts Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Collection Performance Graph */}
        <div className="lg:col-span-8 bento-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Collection Performance</h3>
              <p className="text-xs text-slate-500 mt-0.5">Historical receivables recovery trend</p>
            </div>
            <button onClick={() => onNavigate('data')} className="btn-ghost text-indigo-600 hover:text-indigo-800">
              <span>View Invoices</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={invoiceBarData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }} barSize={34}>
                <defs>
                  <linearGradient id="violetBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', backgroundColor: '#1e1b38', color: '#fff', border: '1px solid #6366f1', boxShadow: '0 8px 24px rgba(99,102,241,0.2)', fontSize: '12px' }}
                  formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, 'Receivables']}
                />
                <Bar dataKey="amount" fill="url(#violetBarGradient)" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Receivables Health Graph */}
        <div className="lg:col-span-4 bento-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">Receivables Health</h3>
            <p className="text-xs text-slate-500 mt-0.5">{displayInvoices.length} total registered invoices</p>
          </div>
          
          <div className="my-3 relative flex items-center justify-center">
            <div className="w-[140px] h-[140px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={invoiceStatusData} cx="50%" cy="50%" innerRadius={42} outerRadius={64} paddingAngle={4} dataKey="value" stroke="none">
                    {invoiceStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 number-display">{displayInvoices.length}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">invoices</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {invoiceStatusData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="font-semibold text-slate-700">{d.name}</span>
                </div>
                <span className="number-display font-bold text-slate-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─── Reference Image 1 Dark Violet Contrast Unpaid Invoices Container ─── */}
      <div className="bento-card-dark p-6">
        
        {/* Top pill navigation within dark card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white font-heading">Unpaid Invoices</h3>
          </div>

          <div className="flex items-center gap-2 bg-[#2a264a] p-1 rounded-2xl border border-slate-700 text-xs">
            <button 
              onClick={() => setInvoiceFilter('all')}
              className={`px-4 py-1.5 rounded-xl font-bold shadow-sm ${invoiceFilter === 'all' ? 'bg-[#383363] text-white' : 'text-slate-400 hover:text-white'}`}>
              All Invoices
            </button>
            <button 
              onClick={() => setInvoiceFilter('draft')}
              className={`px-4 py-1.5 rounded-xl font-semibold ${invoiceFilter === 'draft' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
              Draft <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] text-white font-mono-num ${invoiceFilter === 'draft' ? 'bg-indigo-500' : 'bg-slate-700'}`}>{pendingInvoices.length || 3}</span>
            </button>
            <button 
              onClick={() => setInvoiceFilter('unpaid')}
              className={`px-4 py-1.5 rounded-xl font-bold shadow-sm ${invoiceFilter === 'unpaid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              Unpaid <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] text-white font-mono-num ${invoiceFilter === 'unpaid' ? 'bg-indigo-500' : 'bg-slate-700'}`}>{overdueInvoices.length || 5}</span>
            </button>
          </div>
        </div>

        {/* Master Detail inside Dark Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
          
          {/* Invoice List */}
          <div className="lg:col-span-5 space-y-2.5">
            {displayInvoices.map((inv) => {
              const isSelected = selectedInvoice?.invoice_id === inv.invoice_id;
              return (
                <div
                  key={inv.invoice_id}
                  onClick={() => { sound.playClick(); setSelectedInvoiceId(inv.invoice_id); }}
                  className={`p-4 rounded-2xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                      : 'bg-[#25213f] border-slate-800 text-slate-300 hover:bg-[#2c284a]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="number-display font-bold text-sm">#{inv.invoice_id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-indigo-500/80 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          Unsent
                        </span>
                      </div>
                      <p className="text-xs opacity-80 font-medium">In {inv.days_overdue || 5} days</p>
                    </div>
                    <div className="text-right">
                      <span className="number-display font-bold text-base block">₹{inv.amount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Invoice Details Box (Translucent Purple Gradient Surface) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#2d2850] via-[#262145] to-[#1e1b38] rounded-3xl border border-indigo-500/40 p-6 flex flex-col justify-between space-y-6 shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-indigo-400/20">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 block mb-1">Invoice details</span>
                  <h2 className="text-2xl font-black number-display text-white">#{selectedInvoice.invoice_id}</h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-indigo-200 block font-medium">Company</span>
                  <span className="text-lg font-bold text-white">{selectedInvoice.customer_name || 'BrightWave'}</span>
                </div>
              </div>

              {/* Sub items breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
                <div className="p-4 rounded-2xl bg-[#373160]/80 border border-indigo-400/20">
                  <span className="text-xs font-bold text-indigo-200 block number-display">₹15,990.00</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">UI/UX Design</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#373160]/80 border border-indigo-400/20">
                  <span className="text-xs font-bold text-indigo-200 block number-display">₹21,250.00</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Development</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#373160]/80 border border-indigo-400/20">
                  <span className="text-xs font-bold text-indigo-200 block number-display">₹10,740.00</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">QA & Testing</span>
                </div>
              </div>
            </div>

            {/* Total Balance & Action CTA */}
            <div className="pt-4 border-t border-indigo-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-indigo-300 block font-medium">Balance Due</span>
                <span className="text-2xl font-black number-display text-white">₹{selectedInvoice.amount?.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { sound.playClick(); onNavigate('approvals'); }}
                  className="px-6 py-3 bg-white text-indigo-900 hover:bg-slate-100 font-extrabold rounded-2xl transition-all shadow-md text-xs cursor-pointer"
                >
                  Payout now
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
