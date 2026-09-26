import { useState, useEffect } from 'react';
import { Navigation, ActivePage } from './components/Navigation';
import { DashboardView } from './pages/DashboardView';
import { WorkflowsListView } from './pages/WorkflowsListView';
import { CreateWorkflowView } from './pages/CreateWorkflowView';
import { WorkflowExecutionView } from './pages/WorkflowExecutionView';
import { ApprovalsView } from './pages/ApprovalsView';
import { AuditView } from './pages/AuditView';
import { DataView } from './pages/DataView';
import { SettingsView } from './pages/SettingsView';
import { TemplatesView } from './pages/TemplatesView';
import { AuthLayout } from './pages/auth/AuthLayout';
import { SignupView } from './pages/auth/SignupView';
import { LoginPage } from './components/ui/sign-in-page';
import { CookieConsent } from './components/ui/CookieConsent';
import { BackendAPI, WorkflowResult, BackendAuditLog } from './services/backendApi';
import {
  Activity,
  CheckCircle2,
  Lock,
  BrainCircuit,
  Bell,
  X,
  UserCheck
} from 'lucide-react';
import { sound } from './utils/audio';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [workflowResults, setWorkflowResults] = useState<WorkflowResult[]>([]);
  const [auditLogs, setAuditLogs] = useState<BackendAuditLog[]>([]);
  const [showActivityPanel, setShowActivityPanel] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  useEffect(() => {
    BackendAPI.startPolling();
    BackendAPI.fetchBackendAuditLogs().then(logs => {
      if (logs.length > 0) setAuditLogs(logs);
    });
  }, []);

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
  };

  const pendingApprovalsCount = workflowResults.filter(
    r => r.requires_hitl && r.status === 'DRAFT_READY'
  ).length;

  const renderView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView workflowResults={workflowResults} onNavigate={handleNavigate} />;
      case 'workflows':
        return <WorkflowsListView workflowResults={workflowResults} onNavigate={handleNavigate} />;
      case 'create':
        return <CreateWorkflowView onWorkflowCreated={(results) => {
          setWorkflowResults(results);
          BackendAPI.fetchBackendAuditLogs().then(logs => { setAuditLogs(logs); });
          handleNavigate('execution');
        }} />;
      case 'execution':
        return <WorkflowExecutionView workflowResults={workflowResults} onNavigate={handleNavigate} />;
      case 'approvals':
        return <ApprovalsView
          workflowResults={workflowResults}
          onNavigate={handleNavigate}
          onApproveSuccess={(emailId) => {
            setWorkflowResults(prev => prev.map(r =>
              r.draft?.email_id === emailId ? { ...r, status: 'APPROVED' } : r
            ));
            BackendAPI.fetchBackendAuditLogs().then(logs => { setAuditLogs(logs); });
          }}
          onRejectSuccess={(emailId) => {
            setWorkflowResults(prev => prev.map(r =>
              r.draft?.email_id === emailId ? { ...r, status: 'REJECTED' } : r
            ));
            BackendAPI.fetchBackendAuditLogs().then(logs => { setAuditLogs(logs); });
          }}
        />;
      case 'audit':
        return <AuditView />;
      case 'data':
        return <DataView onNavigate={handleNavigate} />;
      case 'templates':
        return <TemplatesView onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView workflowResults={workflowResults} onNavigate={handleNavigate} />;
    }
  };

  const recentActivity = [
    ...auditLogs.slice(0, 4).map((log, i) => ({
      id: `log-${i}`,
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      iconBg: 'bg-emerald-50 border border-emerald-200',
      text: log.action,
      sub: log.agent.replace(/_/g, ' '),
      time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })),
    ...workflowResults.filter(r => r.requires_hitl && r.status === 'DRAFT_READY').map((r, i) => ({
      id: `approval-${i}`,
      icon: <Lock className="w-3.5 h-3.5 text-amber-600" />,
      iconBg: 'bg-amber-50 border border-amber-200',
      text: `Approval required: ${r.invoice_id}`,
      sub: r.hitl_reason || 'Policy gate',
      time: 'Now',
    })),
  ].slice(0, 6);

  if (!isAuthenticated) {
    if (authMode === 'login') {
      return (
        <LoginPage 
          onLogin={() => setIsAuthenticated(true)}
          onNavigateToSignup={() => setAuthMode('signup')}
        />
      );
    }
    
    return (
      <AuthLayout title="Create Account">
        <SignupView 
          onSignup={() => setIsAuthenticated(true)}
          onNavigateToLogin={() => setAuthMode('login')}
        />
      </AuthLayout>
    );
  }

  return (
    <div className="flex h-screen bg-[#f0f4f8] overflow-hidden font-sans">
      
      {/* ── Sidebar ── */}
      <Navigation
        currentPage={activePage}
        onNavigate={handleNavigate}
        onOpenAccountModal={() => setShowAccountModal(true)}
        pendingApprovalsCount={pendingApprovalsCount}
        activeWorkflowsCount={workflowResults.length > 0 ? 1 : 0}
      />

      {/* ── Main Content Area ── */}
      <div className="flex flex-1 min-w-0 overflow-hidden">
        
        {/* ── Page Content ── */}
        <main className="flex-1 h-full overflow-y-auto">
          
          {/* Top header bar */}
          <div className="sticky top-0 z-20 bg-[#f0f4f8]/90 backdrop-blur-md border-b border-slate-200/70 px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono-num">
                  {activePage === 'dashboard' ? 'Dashboard' :
                   activePage === 'workflows' ? 'Workflows' :
                   activePage === 'create' ? 'New Workflow' :
                   activePage === 'execution' ? 'Execution Center' :
                   activePage === 'approvals' ? 'Approvals' :
                   activePage === 'audit' ? 'Audit Trail' :
                   activePage === 'data' ? 'Invoices' :
                   activePage === 'templates' ? 'Templates' : 'Settings'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Activity drawer toggle */}
              <button
                onClick={() => { sound.playClick(); setShowActivityPanel(v => !v); }}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border ${
                  showActivityPanel
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Activity</span>
                {recentActivity.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>

              {/* Approvals notification badge */}
              {pendingApprovalsCount > 0 && (
                <button
                  onClick={() => handleNavigate('approvals')}
                  className="relative flex items-center justify-center w-9 h-9 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl transition-colors"
                >
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {pendingApprovalsCount}
                  </span>
                </button>
              )}

              {/* User Avatar (Role-based, NO PERSONAL NAMES) */}
              <button
                onClick={() => { sound.playClick(); setShowAccountModal(true); }}
                className="w-9 h-9 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center shadow-md transition-transform active:scale-95 border border-slate-700"
              >
                <UserCheck className="w-4.5 h-4.5 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Page content */}
          <div className="px-8 py-6 animate-fade-in">
            {renderView()}
          </div>
        </main>

        {/* ── Right Activity Panel ── */}
        {showActivityPanel && (
          <div className="w-[320px] shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-hidden animate-slide-right shadow-xl">
            
            {/* Panel header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono-num">Activity Stream</span>
              </div>
              <button onClick={() => setShowActivityPanel(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Activity feed */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
              {recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BrainCircuit className="w-8 h-8 text-slate-300 mb-3" />
                  <p className="text-xs text-slate-500 font-bold">No recent activity</p>
                  <p className="text-[11px] text-slate-400 mt-1">Trigger a workflow to log events</p>
                </div>
              ) : (
                recentActivity.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                    <div className={`w-6 h-6 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 leading-tight">{item.text}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-mono-num uppercase">{item.sub}</p>
                    </div>
                    <span className="text-[10px] font-mono-num text-slate-400 shrink-0 mt-0.5">{item.time}</span>
                  </div>
                ))
              )}
            </div>

          </div>
        )}
      </div>

      {/* ── User Account Preferences Modal (Role-based, NO PERSONAL NAMES) ── */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5 animate-fade-in-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">Operations Lead</h3>
                  <p className="text-xs text-slate-500 font-mono-num">operator@finnova.io</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAccountModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                <span className="text-slate-500 font-medium">Role</span>
                <span className="font-bold text-slate-800">Operations Lead</span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                <span className="text-slate-500 font-medium">Organization</span>
                <span className="font-bold text-slate-800">FINNOVA Workspace</span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                <span className="text-slate-500 font-medium">Environment</span>
                <span className="font-mono-num font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Production Build
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                <span className="text-slate-500 font-medium">Backend API</span>
                <span className="font-mono-num font-bold text-slate-800">http://localhost:8000</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => { sound.playClick(); setShowAccountModal(false); }}
                className="w-full btn-emerald py-2.5 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Privacy Cookie Consent ── */}
      <CookieConsent />

    </div>
  );
}
