// FlowPilot AI - Node Detail Inspector Modal
import React from 'react';
import { WorkflowStep } from '../../types/flowpilot';
import { 
  X, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface NodeDetailModalProps {
  step: WorkflowStep | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  step,
  isOpen,
  onClose
}) => {
  if (!isOpen || !step) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-app-card border border-card rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-card flex items-center justify-between bg-app-card">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-green-400 text-slate-950 flex items-center justify-center font-bold text-xs">
              #{step.nodeIndex + 1}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">{step.name}</h3>
              <p className="text-[11px] font-mono text-slate-400">{step.toolName || 'AI Reasoning Engine'}</p>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Status & Latency Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-card space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Status</span>
              <div className="font-bold text-white flex items-center gap-1.5">
                {step.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {step.status === 'FAILED' && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                {step.status}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-card space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Execution Latency</span>
              <div className="font-bold text-green-400 font-mono">
                {step.durationMs ? `${step.durationMs} ms` : 'Pending'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-card space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Invoked Tool</span>
              <div className="font-bold text-white font-mono truncate">
                {step.toolName || 'Internal Reasoning'}
              </div>
            </div>
          </div>

          {/* Description & Summary */}
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-card space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Step Objective & Description</span>
            <p className="text-slate-300 leading-relaxed">{step.description}</p>
            {step.resultSummary && (
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[11px]">
                {step.resultSummary}
              </div>
            )}
          </div>

          {/* Re-plan Context if present */}
          {step.isReplanned && (
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-300 font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous Re-Planning Event Record</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">{step.replanReason}</p>
            </div>
          )}

          {/* Simulated Input / Output Payload Terminal */}
          <div className="p-3.5 rounded-xl bg-app-card border border-card space-y-2 font-mono">
            <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-card">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-green-400" />
                Execution Payload Inspector
              </span>
              <span className="text-green-400 font-bold">STATE_VERIFIED</span>
            </div>
            <pre className="text-[11px] text-green-300 overflow-x-auto p-2 rounded bg-black/40">
{JSON.stringify({
  stepId: step.id,
  nodeName: step.name,
  tool: step.toolName,
  status: step.status,
  isReplanned: step.isReplanned || false,
  timestamp: step.startTime || new Date().toLocaleTimeString(),
  duration: `${step.durationMs || 0}ms`
}, null, 2)}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-card bg-app-card flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400">FlowPilot Immutable DAG Checkpoint</span>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="btn-green text-xs px-4 py-1.5"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
