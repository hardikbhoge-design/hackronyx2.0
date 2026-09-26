import React, { useState } from 'react';
import { WorkflowResult, BackendAPI } from '../services/backendApi';
import { ShieldCheck, Lock, AlertCircle, XCircle, Send } from 'lucide-react';
import { sound } from '../utils/audio';
import { ActivePage } from '../components/Navigation';

interface ApprovalsViewProps {
  workflowResults: WorkflowResult[];
  onNavigate?: (page: ActivePage) => void;
  onApproveSuccess: (emailId: string) => void;
  onRejectSuccess: (emailId: string) => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  workflowResults,
  onNavigate,
  onApproveSuccess,
  onRejectSuccess
}) => {
  const pendingApprovals = workflowResults.filter(r => r.requires_hitl && r.status === 'DRAFT_READY');
  const resolvedApprovals = workflowResults.filter(r => r.requires_hitl && r.status !== 'DRAFT_READY');

  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const handleApprove = async (emailId: string) => {
    sound.playClick();
    setLoadingIds(prev => new Set(prev).add(emailId));
    
    const response = await BackendAPI.approveEmail(emailId);
    
    setLoadingIds(prev => {
      const next = new Set(prev);
      next.delete(emailId);
      return next;
    });

    if (response?.success) {
      sound.playSuccess();
      onApproveSuccess(emailId);
    } else {
      alert("Failed to approve email. Check backend connection.");
    }
  };

  const handleReject = (emailId: string) => {
    sound.playWarning();
    onRejectSuccess(emailId);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading tracking-tight">
            Approval Center
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Review financial actions before they are dispatched.
          </p>
        </div>
      </div>

      {/* ─── Summary Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bento-card p-5 border-l-4 border-l-amber-500">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pending Authorizations</span>
          <div className="text-2xl font-black font-mono-num text-slate-900">{pendingApprovals.length}</div>
          <p className="text-xs text-amber-700 font-bold mt-1">Requires manager signoff</p>
        </div>

        <div className="bento-card p-5 border-l-4 border-l-emerald-500">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Approved & Dispatched</span>
          <div className="text-2xl font-black font-mono-num text-slate-900">
            {resolvedApprovals.filter(a => a.status === 'APPROVED').length}
          </div>
          <p className="text-xs text-emerald-700 font-bold mt-1">Transmitted to client</p>
        </div>
        
        <div className="bento-card p-5 border-l-4 border-l-rose-500">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Rejected</span>
          <div className="text-2xl font-black font-mono-num text-slate-900">
            {resolvedApprovals.filter(a => a.status === 'REJECTED').length}
          </div>
          <p className="text-xs text-rose-700 font-bold mt-1">Halted by policy</p>
        </div>
      </div>

      {/* ─── Approvals Queue List ─── */}
      <div className="space-y-6">
        {pendingApprovals.length === 0 ? (
          <div className="bento-card p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-3 border border-indigo-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">Approval Queue Clear</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              No financial actions require manual review at this moment.
            </p>
            {onNavigate && (
              <button
                onClick={() => { sound.playClick(); onNavigate('create'); }}
                className="btn-indigo mt-4 text-xs font-bold shadow-md shadow-indigo-100"
              >
                Run Receivables Workflow
              </button>
            )}
          </div>
        ) : (
          pendingApprovals.map((app) => (
            <div key={app.invoice_id} className="bento-card overflow-hidden shadow-sm hover:border-slate-300 transition-all">
              
              {/* Request Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-200">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base font-heading">
                      APPROVAL REQUEST: <span className="font-mono-num text-indigo-700">{app.invoice_id}</span>
                    </h3>
                    <p className="text-xs text-slate-500">Overdue Recovery Statement Authorization</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 flex items-center gap-1.5 w-fit">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {app.hitl_reason || "Manager approval required prior to dispatch"}
                </span>
              </div>

              {/* Request Body Details */}
              <div className="p-6 space-y-6">
                
                {/* Proposed Communication Card */}
                {app.draft && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Proposed Communication</h4>
                    
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                      <div className="px-5 py-3 border-b border-slate-200/80 bg-white text-xs space-y-1">
                        <div className="flex"><span className="w-24 text-slate-400 font-medium">Recipient:</span> <span className="font-bold text-slate-900 font-mono-num">{app.draft.recipient}</span></div>
                        <div className="flex"><span className="w-24 text-slate-400 font-medium">Subject:</span> <span className="font-bold text-slate-900">{app.draft.subject}</span></div>
                      </div>
                      <div className="p-5 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-sans bg-white">
                        {app.draft.body}
                      </div>
                    </div>
                  </div>
                )}

                {/* Authorize CTAs */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleReject(app.invoice_id)}
                    className="px-5 py-2.5 rounded-2xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => handleApprove(app.invoice_id)}
                    disabled={loadingIds.has(app.invoice_id)}
                    className="btn-indigo px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-100"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loadingIds.has(app.invoice_id) ? 'Dispatching...' : 'Approve & Dispatch'}</span>
                  </button>
                </div>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
