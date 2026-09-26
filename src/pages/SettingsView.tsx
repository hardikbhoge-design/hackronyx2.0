import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../utils/audio';

type SettingsTab = 'general' | 'workspace' | 'workflow' | 'approval' | 'notifications' | 'security' | 'integrations';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [workspaceName, setWorkspaceName] = useState('FINNOVA');
  const [currency, setCurrency] = useState('INR');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [hitlEnforced, setHitlEnforced] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    sound.playSuccess();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleReset = () => {
    sound.playWarning();
    setWorkspaceName('FINNOVA');
    setCurrency('INR');
    setTimezone('Asia/Kolkata');
    setHitlEnforced(true);
  };

  const SETTINGS_TABS: { id: SettingsTab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'workspace', label: 'Workspace' },
    { id: 'workflow', label: 'Workflow' },
    { id: 'approval', label: 'Approval Policy' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
    { id: 'integrations', label: 'Integrations' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
            Settings
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage enterprise platform options, workspace configurations, and security policies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="btn-indigo px-5 py-2.5 text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-100"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Settings successfully updated.
        </div>
      )}

      {/* ─── Settings Layout ─── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bento-card p-6 shadow-sm">
        
        {/* Left Navigation */}
        <div className="md:col-span-3 space-y-1.5 border-r border-slate-100 pr-4">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { sound.playClick(); setActiveTab(tab.id); }}
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white font-extrabold shadow-md shadow-indigo-100'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="md:col-span-9 space-y-6 pl-2">
          
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">General Platform Settings</h3>
                <p className="text-xs text-slate-500 mt-0.5">Basic environment configurations and default parameters.</p>
              </div>

              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Workspace Name</label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Default Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'approval' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">Approval Policy Governance</h3>
                <p className="text-xs text-slate-500 mt-0.5">Enforce mandatory human authorization rules for financial actions.</p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 max-w-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Strict Manager Approval Gate</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Require explicit approval before emailing statements to overdue clients.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={hitlEnforced}
                    onChange={(e) => setHitlEnforced(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'general' && activeTab !== 'approval' && (
            <div className="py-12 text-center text-slate-400 text-xs font-semibold">
              Configured standard defaults for <span className="font-bold text-slate-700">{activeTab}</span>.
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-indigo px-5 py-2.5 text-xs font-bold shadow-md shadow-indigo-100"
            >
              Save Changes
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
