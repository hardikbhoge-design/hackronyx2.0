// FlowPilot AI - Interactive Visual Workflow DAG Graph
import React from 'react';
import { 
  WorkflowStep, 
  WorkflowStatus 
} from '../../types/flowpilot';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  ArrowDown, 
  Sparkles,
  Zap,
  Lock
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface WorkflowGraphProps {
  steps: WorkflowStep[];
  workflowStatus: WorkflowStatus;
  onSelectNode: (step: WorkflowStep) => void;
  selectedStepId?: string;
}

export const WorkflowGraph: React.FC<WorkflowGraphProps> = ({
  steps,
  workflowStatus,
  onSelectNode,
  selectedStepId
}) => {
  return (
    <div className="w-full bg-app-card border border-card rounded-2xl p-6 relative overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-card relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase text-green-400">Deterministic DAG Orchestrator</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
          </div>
          <h3 className="text-sm font-bold text-white font-display">Workflow State Machine</h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Running
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Approval Gate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span> Re-Planned
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400"></span> Failure
          </span>
        </div>
      </div>

      {/* DAG Node Chain */}
      <div className="space-y-3 relative z-10">
        {/* START Node */}
        <div className="flex items-center justify-center">
          <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-card text-[11px] font-mono font-bold text-slate-400 flex items-center gap-2 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-green-400" />
            <span>START TRIGGER: Natural-Language Objective</span>
          </div>
        </div>

        <div className="flex justify-center text-slate-400">
          <ArrowDown className="w-4 h-4 text-slate-400 animate-bounce" />
        </div>

        {/* Dynamic Step Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {steps.map((step, idx) => {
            const isSelected = selectedStepId === step.id;
            const isRunning = step.status === 'RUNNING';
            const isCompleted = step.status === 'COMPLETED';
            const isFailed = step.status === 'FAILED';
            const isWaiting = step.status === 'WAITING_APPROVAL';
            const isReplanned = step.isReplanned;

            return (
              <div
                key={step.id}
                onClick={() => {
                  sound.playClick();
                  onSelectNode(step);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'border-green-400 bg-app-card shadow-lg shadow-green-400/10 scale-[1.02]'
                    : isRunning
                    ? 'border-green-500/60 bg-app-card ring-1 ring-green-400/30'
                    : isCompleted
                    ? 'border-emerald-500/30 bg-app-card hover:border-emerald-400/50'
                    : isFailed
                    ? 'border-red-500/60 bg-app-card ring-1 ring-red-400/30'
                    : isWaiting
                    ? 'border-amber-500/60 bg-app-card ring-1 ring-amber-400/30 animate-pulse'
                    : 'border-card bg-app-card opacity-60 hover:opacity-100 hover:border-white/20'
                }`}
              >
                {/* Top Status & Tool Pill */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-slate-300 text-[10px]">
                      {idx + 1}
                    </span>
                    {step.toolName || 'AI Reasoning'}
                  </span>

                  {/* Status Indicator */}
                  {isCompleted && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  )}
                  {isRunning && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/30 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Running
                    </span>
                  )}
                  {isWaiting && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      <Lock className="w-3 h-3" /> Approval Gate
                    </span>
                  )}
                  {isFailed && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/30">
                      <AlertTriangle className="w-3 h-3" /> Failed (550)
                    </span>
                  )}
                  {step.status === 'PENDING' && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                      <Clock className="w-3 h-3" /> Queued
                    </span>
                  )}
                </div>

                {/* Step Title */}
                <h4 className="text-xs font-bold text-white mb-1 group-hover:text-green-300 transition-colors">
                  {step.name}
                </h4>

                {/* Result or Replan notice */}
                {step.resultSummary && (
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mt-1">
                    {step.resultSummary}
                  </p>
                )}

                {/* Re-planned badge */}
                {isReplanned && (
                  <div className="mt-2 p-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-[10px] text-purple-300 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>Dynamic Re-Plan Applied: Alternate Contact Verified</span>
                  </div>
                )}

                {/* Duration */}
                {step.durationMs ? (
                  <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-card">
                    <span>Latency</span>
                    <span className="text-green-400 font-bold">{step.durationMs}ms</span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center text-slate-400 pt-2">
          <ArrowDown className="w-4 h-4 text-slate-400" />
        </div>

        {/* COMPLETE Node */}
        <div className="flex items-center justify-center">
          <div className={`px-5 py-2 rounded-full border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            workflowStatus === 'COMPLETED'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 border-card text-slate-400'
          }`}>
            <CheckCircle2 className={`w-4 h-4 ${workflowStatus === 'COMPLETED' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>TERMINAL STATE: Workflow Reconciliation & Complete Audit Logged</span>
          </div>
        </div>
      </div>

    </div>
  );
};
