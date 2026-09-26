// FlowPilot AI — Backend API Service
// Connects to the FastAPI REST server running at localhost:8000
// Falls back gracefully to demo mode if backend is offline

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TIMEOUT_MS = 8000; // workflow can be slow, give it more time

export type BackendStatus = 'CHECKING' | 'ONLINE' | 'OFFLINE';

// ---- Types matching backend responses ----
export interface BackendInvoice {
  invoice_id: string;
  customer_id?: string;
  customer_name: string;
  amount: number;
  status: string;
  due_date: string;
  days_overdue: number;
  email?: string;
  [key: string]: any;
}

export interface BankStatement {
  transaction_id: string;
  date: string;
  description: string;
  amount: string | number;
}

export interface BackendAuditLog {
  timestamp: string;
  agent: string;
  action: string;
  details: Record<string, any>;
}

export interface WorkflowResult {
  invoice_id: string;
  status: string; // DRAFT_READY | RESOLVED_INTERNALLY | FAILED | COMPLETED | APPROVED | REJECTED
  amount?: number;
  draft?: {
    email_id: string;
    recipient: string;
    subject: string;
    body: string;
    status: string;
  };
  requires_hitl?: boolean;
  hitl_reason?: string;
  reason?: string;
}

// ---- HTTP helper with timeout ----
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// ---- Backend Status Check ----
let _cachedStatus: BackendStatus = 'CHECKING';
let _statusListeners: Array<(status: BackendStatus) => void> = [];
let _checkScheduled = false;

export function subscribeToBackendStatus(listener: (status: BackendStatus) => void) {
  _statusListeners.push(listener);
  listener(_cachedStatus);
  return () => { _statusListeners = _statusListeners.filter(l => l !== listener); };
}

function broadcastStatus(status: BackendStatus) {
  _cachedStatus = status;
  _statusListeners.forEach(l => l(status));
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/health`);
    if (res.ok) {
      broadcastStatus('ONLINE');
      return true;
    }
    broadcastStatus('OFFLINE');
    return false;
  } catch {
    broadcastStatus('OFFLINE');
    return false;
  }
}

// Auto-check on startup and every 15s
export function startBackendHealthPolling() {
  if (_checkScheduled) return;
  _checkScheduled = true;
  checkBackendHealth();
  setInterval(checkBackendHealth, 15000);
}

// ---- API Methods ----

/** GET /api/invoices — all invoices from SQLite */
export async function fetchInvoices(): Promise<BackendInvoice[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/invoices`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.invoices || [];
  } catch (err) {
    console.warn('[BackendAPI] fetchInvoices failed', err);
    return [];
  }
}

/** GET /api/invoices/overdue — only overdue invoices */
export async function fetchOverdueInvoices(): Promise<BackendInvoice[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/invoices/overdue`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.invoices || [];
  } catch (err) {
    console.warn('[BackendAPI] fetchOverdueInvoices failed', err);
    return [];
  }
}

/** GET /api/bank-statements — CSV data */
export async function fetchBankStatements(): Promise<BankStatement[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/bank-statements`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.statements || [];
  } catch (err) {
    console.warn('[BackendAPI] fetchBankStatements failed', err);
    return [];
  }
}

/** GET /api/audit-logs — JSON audit log from Python backend */
export async function fetchBackendAuditLogs(): Promise<BackendAuditLog[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/audit-logs`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.logs || [];
  } catch (err) {
    console.warn('[BackendAPI] fetchBackendAuditLogs failed', err);
    return [];
  }
}

/** POST /api/approve-email */
export async function approveEmail(emailId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/approve-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_id: emailId })
    });
    const data = await res.json();
    return { success: data.success, message: data.result?.message };
  } catch (err) {
    console.warn('[BackendAPI] approveEmail failed', err);
    return { success: false, message: 'Backend offline or request failed' };
  }
}

/** POST /api/stage-email */
export async function stageEmail(recipient: string, subject: string, body: string): Promise<{ success: boolean; draft?: any }> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/stage-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, subject, body })
    });
    const data = await res.json();
    return { success: data.success, draft: data.draft };
  } catch (err) {
    console.warn('[BackendAPI] stageEmail failed', err);
    return { success: false };
  }
}

/** POST /api/log-event — write to backend audit log */
export async function logEventToBackend(agentName: string, action: string, details: Record<string, any>): Promise<void> {
  try {
    await fetchWithTimeout(`${API_BASE}/api/log-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_name: agentName, action, details })
    });
  } catch {
    // Silently fail — backend logging is best-effort
  }
}

/** POST /api/run-workflow — trigger Python orchestrator */
export async function runBackendWorkflow(goal?: string): Promise<{ success: boolean; results: WorkflowResult[]; error?: string }> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/run-workflow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal: goal || 'Identify and recover all overdue invoices' })
    });
    const data = await res.json();
    return { success: data.success, results: data.results || [], error: data.error };
  } catch (err: any) {
    console.warn('[BackendAPI] runBackendWorkflow failed', err);
    return { success: false, results: [], error: err?.message || 'Connection failed' };
  }
}

export const BackendAPI = {
  checkHealth: checkBackendHealth,
  fetchInvoices,
  fetchOverdueInvoices,
  fetchBankStatements,
  fetchBackendAuditLogs,
  approveEmail,
  stageEmail,
  logEventToBackend,
  runBackendWorkflow,
  subscribeToStatus: subscribeToBackendStatus,
  startPolling: startBackendHealthPolling,
  getStatus: () => _cachedStatus,
};
