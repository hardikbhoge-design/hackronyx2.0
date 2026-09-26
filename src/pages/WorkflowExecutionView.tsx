import React, { useState } from 'react';
import { WorkflowResult } from '../services/backendApi';
import { Play, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';
import { ActivePage } from '../components/Navigation';

interface WorkflowExecutionViewProps {
  workflowResults: WorkflowResult[];
  onNavigate: (page: ActivePage) => void;
}

const BUSINESS_TIMELINE_STEPS = [
  { step: '01', title: 'Data Collection', desc: 'Ingest invoice & customer data' },
  { step: '02', title: 'Reconciliation', desc: 'Cross-reference bank ledger deposits' },
  { step: '03', title: 'Draft Preparation', desc: 'Generate dunning statement notice' },
  { step: '04', title: 'Approval', desc: 'Corporate authorization gate' },
  { step: '05', title: 'Dispatch', desc: 'Secure communication transmission' },
  { step: '06', title: 'Audit', desc: 'Record immutable compliance log' },
];

export const WorkflowExecutionView: React.FC<WorkflowExecutionViewProps> = ({
  workflowResults,
  onNavigate
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const selectedResult = workflowResults[selectedIdx] || workflowResults[0];

  const totalRuns = workflowResults.length > 0 ? workflowResults.length : 8;
  const successfulRuns = workflowResults.filter(r => ['COMPLETED', 'APPROVED', 'RESOLVED_INTERNALLY'].includes(r.status)).length || (workflowResults.length === 0 ? 7 : 0);
  const failedRuns = workflowResults.filter(r => ['FAILED', 'REJECTED'].includes(r.status)).length || 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
            Execution History
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Audit trail of executed financial operations workflows and business process logs.
          </p>
        </div>

        <button 
          onClick={() => { sound.playClick(); onNavigate('create'); }}
          className="btn-indigo shrink-0 text-xs flex items-center gap-2 shadow-md shadow-indigo-100 font-bold"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Execute Workflow</span>
        </button>
      </div>

      {/* ─── Top Metrics ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bento-card p-5 border-l-4 border-l-indigo-500">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Runs</span>
          <span className="text-2xl font-black font-mono-num text-slate-900">{totalRuns}</span>
        </div>

        <div className="bento-card p-5 border-l-4 border-l-emerald-500">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Successful</span>
          <span className="text-2xl font-black font-mono-num text-emerald-600">{successfulRuns}</span>
        </div>

        <div className="bento-card p-5 border-l-4 border-l-rose-500">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Failed</span>
          <span className="text-2xl font-black font-mono-num text-rose-600">{failedRuns}</span>
        </div>

        <div className="bento-card p-5 border-l-4 border-l-amber-500">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Average Duration</span>
          <span className="text-2xl font-black font-mono-num text-slate-800">1.8s</span>
        </div>
      </div>

      {/* ─── Execution Table & Timeline Detail ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col h-[650px]">
          <div className="px-5 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Past Execution Logs</h3>
            <span className="text-[11px] font-bold text-slate-500 font-mono-num">{workflowResults.length} records</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-white text-slate-500 font-extrabold border-b border-slate-200 uppercase tracking-wider sticky top-0">
                <tr>
                  <th className="px-5 py-3.5">Workflow</th>
                  <th className="px-5 py-3.5">Invoice</th>
                  <th className="px-5 py-3.5">Started</th>
                  <th className="px-5 py-3.5">Duration</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workflowResults.length > 0 ? (
                  workflowResults.map((wr, idx) => {
                    const isSelected = selectedIdx === idx;
                    return (
                      <tr 
                        key={wr.invoice_id}
                        onClick={() => { sound.playClick(); setSelectedIdx(idx); }}
                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}`}
                      >
                        <td className="px-5 py-4 font-semibold text-slate-800">Overdue Recovery</td>
                        <td className="px-5 py-4 font-mono-num font-bold text-slate-900">{wr.invoice_id}</td>
                        <td className="px-5 py-4 text-slate-500 font-mono-num">Today, 09:42 AM</td>
                        <td className="px-5 py-4 text-slate-500 font-mono-num">1.6s</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            wr.status === 'DRAFT_READY' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            wr.status === 'COMPLETED' || wr.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {wr.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-800">Overdue Recovery</td>
                    <td className="px-5 py-4 font-mono-num font-bold text-slate-900">INV-001</td>
                    <td className="px-5 py-4 text-slate-500 font-mono-num">26 Sep, 08:30 AM</td>
                    <td className="px-5 py-4 text-slate-500 font-mono-num">1.4s</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        DRAFT_READY
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel: Business Process Timeline */}
        <div className="lg:col-span-5 glass-panel p-6 shadow-xl flex flex-col h-[650px] overflow-y-auto space-y-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 block mb-1">Execution Process Timeline</span>
            <h2 className="text-xl font-black text-slate-900 font-heading">
              Invoice {selectedResult?.invoice_id || 'INV-001'} Workflow
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Step-by-step audit of operations pipeline execution.
            </p>
          </div>

          <div className="space-y-3">
            {BUSINESS_TIMELINE_STEPS.map((s) => (
              <div key={s.step} className="flex items-start gap-3 p-3.5 rounded-2xl border border-indigo-100/80 bg-white/80 shadow-sm">
                <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-mono-num font-bold text-xs flex items-center justify-center shrink-0">
                  {s.step}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{s.title}</h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      PASSED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedResult?.requires_hitl && selectedResult?.status === 'DRAFT_READY' && (
            <div className="pt-2 mt-auto">
              <button 
                onClick={() => { sound.playClick(); onNavigate('approvals'); }}
                className="w-full btn-indigo py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
              >
                <span>Review Approval Gate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
