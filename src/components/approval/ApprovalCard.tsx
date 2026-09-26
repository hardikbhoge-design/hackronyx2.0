// FlowPilot AI - Human-in-the-Loop Approval Card & Governance Modal
import React, { useState } from 'react';
import { ApprovalRequest } from '../../types/flowpilot';
import { 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Mail, 
  Building2
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface ApprovalCardProps {
  approval: ApprovalRequest;
  onApprove: (id: string) => void;
  onReject?: (id: string) => void;
  onEdit?: (id: string, updatedDraft: { subject: string; body: string; email: string }) => void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  approval,
  onApprove,
  onReject,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [subject, setSubject] = useState(approval.draftSubject);
  const [body, setBody] = useState(approval.draftBody);
  const [email, setEmail] = useState(approval.recipientEmail);

  const amountFormatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(approval.amount);

  const handleSaveEdit = () => {
    sound.playSuccess();
    setIsEditing(false);
    if (onEdit) {
      onEdit(approval.id, { subject, body, email });
    }
  };

  const isApproved = approval.status === 'APPROVED';
  const isReplanned = approval.status === 'REPLANNED';

  return (
    <div className={`bento-card p-5 border transition-all ${
      isApproved 
        ? 'border-emerald-500/40 bg-app-card' 
        : isReplanned 
        ? 'border-purple-500/40 bg-app-card' 
        : 'border-green-500/40 bg-app-card shadow-lg shadow-green-400/5'
    }`}>
      
      {/* Header Info */}
      <div className="flex items-start justify-between pb-3 border-b border-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-3.5 h-3.5 text-green-400" />
            <h4 className="text-sm font-bold text-white font-display">{approval.customerName}</h4>
            <span className="text-[10px] font-mono text-slate-400">({approval.invoiceId})</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {approval.daysOverdue} Days Overdue • Recipient: <span className="text-green-300 font-semibold">{approval.recipientEmail}</span>
          </p>
        </div>

        {/* Priority & Status Badges */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
            approval.priorityLevel === 'CRITICAL' 
              ? 'bg-red-500/20 text-red-300 border-red-500/40' 
              : 'bg-green-500/20 text-green-300 border-green-500/40'
          }`}>
            Priority: {approval.priorityScore}/100 ({approval.priorityLevel})
          </span>

          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
            isApproved 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}>
            {approval.status}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-card">
          <span className="text-[10px] font-mono text-slate-400">Outstanding Balance</span>
          <p className="text-sm font-bold text-white font-mono">{amountFormatted}</p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-card">
          <span className="text-[10px] font-mono text-slate-400">Proposed Action</span>
          <p className="text-xs font-semibold text-green-300 line-clamp-1">{approval.proposedAction}</p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-card">
          <span className="text-[10px] font-mono text-slate-400">Corporate Policy Gate</span>
          <p className="text-xs font-semibold text-white truncate">POL-02 (&gt;₹100k Signoff)</p>
        </div>
      </div>

      {/* Rationale */}
      <div className="p-2.5 rounded-xl bg-slate-900/40 border border-card mb-3 text-[11px] text-slate-300 leading-relaxed">
        <span className="font-bold text-slate-400 uppercase font-mono text-[10px] block mb-0.5">AI Reasoning & Evidence:</span>
        {approval.reason}
      </div>

      {/* Generated Communication Box */}
      <div className="p-3 rounded-xl bg-app-card border border-card space-y-2 mb-4">
        <div className="flex items-center justify-between text-[11px] pb-1 border-b border-card">
          <span className="font-mono text-slate-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-green-400" />
            Personalized Communication Draft
          </span>
          {!isApproved && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[10px] text-green-400 hover:text-green-300 font-mono flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> {isEditing ? 'Cancel Edit' : 'Edit Draft'}
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2 text-xs">
            <div>
              <label className="text-[10px] font-mono text-slate-400">Recipient Email:</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs mt-1 focus:border-green-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400">Subject:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs mt-1 focus:border-green-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400">Email Body:</label>
              <textarea
                value={body}
                rows={4}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs mt-1 focus:border-green-400 focus:outline-none font-sans"
              />
            </div>
            <button
              onClick={handleSaveEdit}
              className="btn-green text-xs px-3 py-1"
            >
              Save Custom Draft
            </button>
          </div>
        ) : (
          <div className="space-y-1.5 text-xs">
            <div className="font-semibold text-white flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400">Subject:</span>
              <span className="text-green-300">{subject}</span>
            </div>
            <p className="text-slate-300 whitespace-pre-line text-[11px] leading-relaxed max-h-28 overflow-y-auto pr-1">
              {body}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-card">
        <div className="text-[10px] font-mono text-slate-400">
          {isApproved ? `Approved by Operator` : `Human verification required`}
        </div>

        <div className="flex items-center gap-2">
          {!isApproved && (
            <>
              <button
                onClick={() => {
                  sound.playClick();
                  if (onReject) onReject(approval.id);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5 text-red-400" />
                Reject
              </button>

              <button
                onClick={() => {
                  sound.playSuccess();
                  onApprove(approval.id);
                }}
                className="btn-green text-xs px-4 py-1.5 flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve & Execute
              </button>
            </>
          )}

          {isApproved && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Approved & Dispatched
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
