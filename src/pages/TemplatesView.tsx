import React from 'react';
import { ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';
import { ActivePage } from '../components/Navigation';

interface TemplatesViewProps {
  onNavigate: (page: ActivePage) => void;
}

const LIBRARY_TEMPLATES = [
  {
    id: 'overdue-recovery',
    title: 'OVERDUE RECOVERY',
    description: 'Automatically identify overdue invoices, cross-reference bank statements, and prepare follow-up actions.',
    trigger: 'Invoice overdue',
    frequency: 'Daily',
  },
  {
    id: 'bank-reconciliation',
    title: 'BANK RECONCILIATION',
    description: 'Match bank transactions with outstanding invoices and resolve matched customer ledger entries.',
    trigger: 'Bank CSV Upload',
    frequency: 'On-demand / Daily',
  },
  {
    id: 'payment-followup',
    title: 'PAYMENT FOLLOW-UP',
    description: 'Prepare customer payment reminders for accounts nearing payment due date.',
    trigger: '3 days before due date',
    frequency: 'Daily',
  },
  {
    id: 'monthly-statement',
    title: 'MONTHLY STATEMENT',
    description: 'Generate recurring customer account statements and balance summaries.',
    trigger: 'End of month',
    frequency: 'Monthly',
  }
];

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onNavigate }) => {
  const handleUseTemplate = () => {
    sound.playClick();
    onNavigate('create');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
            Workflow Library
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Pre-configured financial operations templates and recovery procedures.
          </p>
        </div>
      </div>

      {/* ─── Template Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LIBRARY_TEMPLATES.map((tmpl) => (
          <div key={tmpl.id} className="bento-card p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight font-heading">{tmpl.title}</h3>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  STANDARD
                </span>
              </div>
              
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {tmpl.description}
              </p>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Trigger</span>
                  <span className="font-semibold text-slate-700 font-mono-num">{tmpl.trigger}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Frequency</span>
                  <span className="font-semibold text-slate-700">{tmpl.frequency}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Policy: Pre-Approved Template</span>
              <button
                onClick={handleUseTemplate}
                className="btn-indigo py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>Use Workflow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
