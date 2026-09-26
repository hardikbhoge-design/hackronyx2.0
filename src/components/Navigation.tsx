import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Workflow, 
  CheckSquare, 
  FileText, 
  Database, 
  Layers, 
  Settings,
  Play,
  Building2,
  UserCheck
} from 'lucide-react';
import { sound } from '../utils/audio';
import { BackendAPI, BackendStatus } from '../services/backendApi';

export type ActivePage = 
  | 'dashboard'
  | 'data'
  | 'workflows'
  | 'create'
  | 'execution'
  | 'approvals'
  | 'audit'
  | 'templates'
  | 'settings';

interface NavigationProps {
  currentPage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenAccountModal: () => void;
  pendingApprovalsCount: number;
  activeWorkflowsCount: number;
}

const NAV_SECTIONS = [
  {
    label: 'OVERVIEW',
    items: [
      { id: 'dashboard'  as ActivePage, label: 'Overview', icon: LayoutDashboard },
    ]
  },
  {
    label: 'RECEIVABLES OPERATIONS',
    items: [
      { id: 'data'       as ActivePage, label: 'Invoices',  icon: Database },
      { id: 'workflows'  as ActivePage, label: 'Workflows', icon: Workflow },
      { id: 'execution'  as ActivePage, label: 'Execution', icon: Play },
      { id: 'approvals'  as ActivePage, label: 'Approvals', icon: CheckSquare },
    ]
  },
  {
    label: 'GOVERNANCE',
    items: [
      { id: 'audit'      as ActivePage, label: 'Audit Trail', icon: FileText },
    ]
  },
  {
    label: 'CONFIGURATION',
    items: [
      { id: 'templates'  as ActivePage, label: 'Library', icon: Layers },
      { id: 'settings'   as ActivePage, label: 'Settings',  icon: Settings },
    ]
  }
];

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onNavigate,
  onOpenAccountModal,
  pendingApprovalsCount,
  activeWorkflowsCount
}) => {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('CHECKING');

  useEffect(() => {
    const unsub = BackendAPI.subscribeToStatus(setBackendStatus);
    return unsub;
  }, []);

  const handleNavClick = (page: ActivePage) => {
    sound.playClick();
    onNavigate(page);
  };

  return (
    <aside className="sidebar flex-shrink-0 overflow-hidden z-30 bg-white border-r border-slate-200/80">
      
      {/* ─── Brand ─── */}
      <div className="px-5 pt-6 pb-5 border-b border-slate-100">
        <button
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-3 w-full text-left group"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight leading-none font-heading">
                FINNOVA
              </span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-100">
                PRO
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 truncate">
              Smart Finances & Operations
            </span>
          </div>
        </button>
      </div>

      {/* ─── Top Pill Fast Bar (Matching Reference Image fast tabs) ─── */}
      <div className="px-3 pt-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all text-center ${
              currentPage === 'dashboard' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleNavClick('data')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all text-center ${
              currentPage === 'data' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Invoices
          </button>
          <button
            onClick={() => handleNavClick('approvals')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all text-center ${
              currentPage === 'approvals' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approvals
          </button>
        </div>
      </div>

      {/* ─── Navigation Links ─── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pt-4 pb-4">
        <div className="space-y-5">
          {NAV_SECTIONS.map((section, sIdx) => (
            <div key={sIdx}>
              <div className="px-3 mb-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                {section.label}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = currentPage === item.id || (item.id === 'workflows' && currentPage === 'create');

                  let badge: React.ReactNode = null;
                  if (item.id === 'approvals' && pendingApprovalsCount > 0) {
                    badge = (
                      <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[18px] text-center leading-tight">
                        {pendingApprovalsCount}
                      </span>
                    );
                  } else if (item.id === 'execution' && activeWorkflowsCount > 0) {
                    badge = (
                      <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      </span>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[13px] font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-100'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <item.icon
                        className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}
                      />
                      <span className="truncate">{item.label}</span>
                      {badge}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Footer: Backend Status & Account ─── */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engine Status</span>
            <span className={`flex items-center gap-1 text-[10px] font-extrabold ${
              backendStatus === 'ONLINE' ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${backendStatus === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              {backendStatus === 'ONLINE' ? 'CONNECTED' : 'CHECKING'}
            </span>
          </div>

          <button
            onClick={() => { sound.playClick(); onOpenAccountModal(); }}
            className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 text-left transition-all group"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate leading-tight group-hover:text-indigo-700">
                Operations Lead
              </span>
              <span className="text-[10px] text-slate-400 block truncate leading-tight mt-0.5">
                FINNOVA Workspace
              </span>
            </div>
          </button>
        </div>
      </div>

    </aside>
  );
};
