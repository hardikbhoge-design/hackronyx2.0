import React from 'react';
import { WorkflowResult } from '../services/backendApi';
import { Plus, ArrowUpRight } from 'lucide-react';
import { sound } from '../utils/audio';
import { ActivePage } from '../components/Navigation';

interface WorkflowsListViewProps {
  workflowResults?: WorkflowResult[];
  onNavigate: (page: ActivePage) => void;
}

const DEFAULT_WORKFLOW_CARDS = [
  {
    id: 'overdue-recovery',
    name: 'Overdue Recovery',
    purpose: 'Automatically analyze aging receivables, cross-reference bank statements, and draft escalation notices.',
    trigger: 'Daily at 08:00 AM (Invoice > 7 days overdue)',
    lastRun: '12 minutes ago',
    status: 'ACTIVE',
    runs: 42,
  },
  {
    id: 'bank-recon',
    name: 'Bank Statement Reconciliation',
    purpose: 'Match incoming customer bank deposits against open invoice ledger records.',
    trigger: 'On Bank CSV Upload / Scheduled Daily',
    lastRun: '1 hour ago',
    status: 'ACTIVE',
    runs: 128,
  },
  {
    id: 'payment-followup',
    name: 'Payment Follow-up',
    purpose: 'Dispatch soft payment reminders to accounts approaching invoice due date.',
    trigger: '3 days prior to due date',
    lastRun: 'Yesterday at 05:00 PM',
    status: 'ACTIVE',
    runs: 89,
  },
  {
    id: 'monthly-statement',
    name: 'Monthly Statement Dispatch',
    purpose: 'Compile monthly statement summaries for enterprise clients and distribute account balances.',
    trigger: 'First calendar day of month',
    lastRun: '01 Sep 2026',
    status: 'SCHEDULED',
    runs: 12,
  },
];

export const WorkflowsListView: React.FC<WorkflowsListViewProps> = ({
  onNavigate
}) => {
  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading tracking-tight">
            Workflows
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Automate recurring receivables operations.
          </p>
        </div>

        <button
          onClick={() => { sound.playClick(); onNavigate('create'); }}
          className="btn-indigo shrink-0 flex items-center gap-2 shadow-md shadow-indigo-100 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Workflow</span>
        </button>
      </div>

      {/* ─── Cards Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEFAULT_WORKFLOW_CARDS.map((wf) => (
          <div key={wf.id} className="bento-card p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-base font-bold text-slate-900 font-heading">{wf.name}</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                  wf.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {wf.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {wf.purpose}
              </p>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Trigger</span>
                  <span className="font-semibold text-slate-700 font-mono-num">{wf.trigger}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Last Run</span>
                  <span className="font-semibold text-slate-700">{wf.lastRun}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Total Executions</span>
                  <span className="font-bold text-slate-900 font-mono-num">{wf.runs} runs</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Governance: Approval Enforced</span>
              <button
                onClick={() => { sound.playClick(); onNavigate('create'); }}
                className="btn-indigo py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>Open Workflow</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
