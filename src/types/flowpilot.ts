// FlowPilot AI - Core TypeScript Types & Interfaces

export type WorkflowStatus = 
  | 'IDLE'
  | 'UNDERSTANDING'
  | 'PLANNING'
  | 'VERIFYING'
  | 'RUNNING'
  | 'WAITING_APPROVAL'
  | 'FAILURE_DETECTED'
  | 'REPLANNING'
  | 'COMPLETED'
  | 'FAILED';

export type StepStatus = 
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'WAITING_APPROVAL'
  | 'REPLANNING'
  | 'SKIPPED';

export type EventType = 
  | 'AI_DECISION'
  | 'TOOL_CALL'
  | 'APPROVAL'
  | 'FAILURE'
  | 'REPLAN'
  | 'EXECUTION'
  | 'SYSTEM';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface DecisionFactor {
  factor: string;
  weight: string;
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  description: string;
}

export interface PrioritizationResult {
  score: number; // 0 - 100
  level: PriorityLevel;
  factors: DecisionFactor[];
  summary: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: 'INVOICE' | 'CUSTOMER' | 'COMMUNICATION' | 'POLICY' | 'DATABASE' | 'NOTIFICATION';
  parameters: Record<string, string>;
}

export interface ToolExecution {
  id: string;
  toolName: string;
  timestamp: string;
  input: Record<string, any>;
  output: Record<string, any>;
  durationMs: number;
  status: 'SUCCESS' | 'ERROR';
  errorMessage?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  nodeIndex: number;
  status: StepStatus;
  toolName?: string;
  startTime?: string;
  durationMs?: number;
  resultSummary?: string;
  toolExecution?: ToolExecution;
  requiresApproval?: boolean;
  isReplanned?: boolean;
  replanReason?: string;
  evidence?: Record<string, any>;
}

export interface ApprovalRequest {
  id: string;
  workflowId: string;
  stepId: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  amount: number;
  currency: string;
  daysOverdue: number;
  priorityScore: number;
  priorityLevel: PriorityLevel;
  proposedAction: string;
  reason: string;
  draftSubject: string;
  draftBody: string;
  recipientEmail: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EDITED' | 'REPLANNED';
  createdAt: string;
  respondedAt?: string;
  reviewedBy?: string;
  editNotes?: string;
}

export interface ReplanEvent {
  id: string;
  timestamp: string;
  workflowId: string;
  failedStepId: string;
  failedAction: string;
  failureReason: string;
  investigationDetails: string;
  alternateDiscovery: string;
  newAction: string;
  status: 'ANALYZED' | 'RECOVERED' | 'APPLIED';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  workflowId: string;
  actor: 'AI_AGENT' | 'HUMAN_OPERATOR' | 'TOOL_EXECUTOR' | 'SYSTEM';
  eventType: EventType;
  action: string;
  tool?: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';
  result: string;
  approval?: string;
  reason?: string;
  payload?: Record<string, any>;
}

export interface ObjectiveConstraints {
  minAmount?: number;
  currency?: string;
  onlyOverdue?: boolean;
  prioritizeHighRisk?: boolean;
  requireHumanApproval?: boolean;
  actionType?: string;
  targetIndustry?: string;
}

export interface ParsedObjective {
  rawText: string;
  title: string;
  category: string;
  constraints: ObjectiveConstraints;
  bulletConstraints: string[];
  expectedStepsCount: number;
}

export interface WorkflowInstance {
  id: string;
  title: string;
  objective: ParsedObjective;
  createdAt: string;
  completedAt?: string;
  durationSeconds: number;
  status: WorkflowStatus;
  currentStepIndex: number;
  steps: WorkflowStep[];
  approvals: ApprovalRequest[];
  replans: ReplanEvent[];
  auditLogs: AuditLogEntry[];
  summaryStats: {
    invoicesScanned: number;
    overdueFound: number;
    highValueFiltered: number;
    prioritizedCases: number;
    communicationsDrafted: number;
    approvalsRequired: number;
    approvalsGranted: number;
    actionsExecuted: number;
    failuresRecovered: number;
  };
}

// Business Domain Entities
export interface Invoice {
  invoice_id: string;
  customer_id: string;
  customer_name: string;
  invoice_date: string;
  due_date: string;
  amount: number;
  currency: string;
  status: 'OVERDUE' | 'PAID' | 'PENDING' | 'DISPUTED';
  days_overdue: number;
  payment_link: string;
}

export interface Customer {
  customer_id: string;
  company_name: string;
  industry: string;
  customer_value: 'HIGH' | 'ENTERPRISE' | 'MID_MARKET' | 'SMB';
  risk_level: 'HIGH' | 'MEDIUM' | 'LOW';
  credit_limit: number;
  contact_name: string;
  email: string;
  alternate_email?: string;
  phone: string;
  payment_history_score: number; // 0 - 100
  notes: string;
}

export interface CommunicationRecord {
  communication_id: string;
  customer_id: string;
  invoice_id: string;
  date: string;
  channel: 'EMAIL' | 'PHONE' | 'WHATSAPP' | 'PORTAL';
  subject: string;
  summary: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'FRUSTRATED' | 'RESPONSIVE' | 'UNRESPONSIVE';
  resolution_status: 'OPEN' | 'PROMISE_TO_PAY' | 'EXTENSION_REQUESTED' | 'RESOLVED' | 'NO_REPLY';
  daysAgo: number;
}

export interface CompanyPolicy {
  policy_id: string;
  name: string;
  threshold_rule: string;
  action_required: string;
  enforced: boolean;
}

export type LLMProviderType = 'GEMINI' | 'OPENAI' | 'MOCK_DETERMINISTIC';

export interface LLMProviderConfig {
  provider: LLMProviderType;
  apiKey?: string;
  modelName: string;
  temperature: number;
}
