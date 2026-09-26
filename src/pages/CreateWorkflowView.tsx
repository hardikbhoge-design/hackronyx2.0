import React, { useState } from 'react';
import { Play, FileText, AlertCircle, CheckCircle2, Loader2, Search, ShieldCheck, Lock } from 'lucide-react';
import { sound } from '../utils/audio';
import { BackendAPI, WorkflowResult } from '../services/backendApi';

interface CreateWorkflowViewProps {
  onWorkflowCreated: (results: WorkflowResult[]) => void;
}

type RunPhase = 'idle' | 'running' | 'success' | 'error';

const PIPELINE_STEPS = [
  { icon: <Search className="w-4 h-4" />, label: 'Fetch Overdue Invoices', detail: 'Querying accounts receivable database' },
  { icon: <ShieldCheck className="w-4 h-4" />, label: 'Bank Reconciliation', detail: 'Cross-referencing bank statement records' },
  { icon: <FileText className="w-4 h-4" />, label: 'Draft Statement Notice', detail: 'Preparing payment reminder notice' },
  { icon: <Lock className="w-4 h-4" />, label: 'Approval Gate', detail: 'Queuing for manager signoff' },
  { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Dispatch & Audit Log', detail: 'Transmitting notice and recording log' },
];

export const CreateWorkflowView: React.FC<CreateWorkflowViewProps> = ({
  onWorkflowCreated
}) => {
  const primaryExample = "Identify and recover all overdue invoices";
  const [prompt, setPrompt] = useState(primaryExample);
  const [phase, setPhase] = useState<RunPhase>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(-1);

  const handleCreateAndRun = async () => {
    sound.playClick();
    setPhase('running');
    setErrorMsg('');
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 3) return prev + 1;
        return prev;
      });
    }, 1200);

    const response = await BackendAPI.runBackendWorkflow(prompt);
    clearInterval(stepInterval);

    if (response.success) {
      setCurrentStep(4);
      setTimeout(() => {
        sound.playSuccess();
        setPhase('success');
        onWorkflowCreated(response.results);
      }, 600);
    } else {
      setPhase('error');
      setErrorMsg(response.error || 'Workflow execution failed. Ensure the backend is running at localhost:8000.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12 pt-6">

      {/* ─── Header ─── */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Execute Receivables Workflow
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Specify workflow parameters to analyze accounts, reconcile deposits, and route actions for authorization.
        </p>
      </div>

      {/* ─── Error Banner ─── */}
      {phase === 'error' && (
        <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-rose-800">Execution Error</p>
            <p className="text-xs text-rose-700 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* ─── Input Form ─── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Workflow Directive
        </label>
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={phase === 'running'}
          placeholder="e.g. Identify and recover all overdue invoices..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60 resize-none"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setPrompt(primaryExample)}
            disabled={phase === 'running'}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-all"
          >
            Use Default Overdue Recovery Template
          </button>
        </div>
      </div>

      {/* ─── Process Pipeline Steps ─── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Execution Process Pipeline</h3>
          {phase === 'running' && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Executing operations...
            </span>
          )}
        </div>

        <div className="space-y-3">
          {PIPELINE_STEPS.map((step, i) => {
            const isDone    = phase === 'running' ? i < currentStep : phase === 'success';
            const isActive  = phase === 'running' && i === currentStep;
            
            return (
              <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                isActive  ? 'bg-emerald-50/80 border-emerald-300' :
                isDone    ? 'bg-slate-50 border-slate-200' :
                            'bg-white border-slate-100'
              }`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                  isDone    ? 'bg-emerald-700 text-white' :
                  isActive  ? 'bg-slate-900 text-white animate-pulse' :
                              'bg-slate-100 text-slate-400'
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : step.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-bold ${isDone || isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                    {step.label}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{step.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Submit Action Button ─── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={handleCreateAndRun}
          disabled={phase === 'running' || !prompt.trim()}
          className="btn-emerald py-3 px-8 text-xs font-semibold flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          {phase === 'running' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Workflow...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start Execution</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
