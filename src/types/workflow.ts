export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type WorkflowStatus = 'TRIAGED' | 'PENDING_APPROVAL' | 'IN_PROGRESS' | 'COMPLETED' | 'REROUTED';
export type StageId = 'IDENTIFY' | 'GATHER' | 'RECOMMEND' | 'APPROVE' | 'EXECUTE' | 'TRACK';
export type DataSourceType = 'POSTGRES' | 'GOOGLE_SHEETS' | 'GMAIL' | 'STRIPE' | 'QUICKBOOKS' | 'STUDENT_ERP' | 'HRMS_PORTAL' | 'GOV_REGISTRY';
export type ToneType = 'POLITE' | 'FORMAL' | 'URGENT';

export type UserRole = 
  | 'SMB_OWNER' 
  | 'FINANCE' 
  | 'HR_OPS' 
  | 'EDU_ADMIN' 
  | 'GOV_NGO' 
  | 'CLIENT_STUDENT';

export interface RoleMetadata {
  id: UserRole;
  name: string;
  badge: string;
  iconName: string;
  colorClass: string;
  borderClass: string;
  description: string;
  allowedTabs: string[];
  quickActions: {
    id: string;
    label: string;
    icon: string;
    actionType: 'NEW_WORKFLOW' | 'FILTER' | 'EXPORT' | 'TRIGGER_ACTION';
    templateId?: string;
  }[];
  primaryMetricLabel: string;
  primaryMetricValue: string;
  secondaryMetricLabel: string;
  secondaryMetricValue: string;
}

export interface DataSourceRecord {
  id: string;
  name: string;
  type: DataSourceType;
  iconName: string;
  status: 'CONNECTED' | 'SYNCING' | 'ERROR';
  lastSynced: string;
  recordsCount: number;
  healthScore: number;
  samplePayload: Record<string, any>;
}

export interface CommunicationDraft {
  id: string;
  taskId: string;
  recipientEmail: string;
  recipientName: string;
  companyName: string;
  subject: string;
  tone: ToneType;
  body: string;
  channel: 'EMAIL' | 'SLACK' | 'WHATSAPP';
  generatedAt: string;
  estimatedRecoveryProb: number;
  attachments?: string[];
}

export interface WorkflowTask {
  id: string;
  roleCategory: UserRole;
  title: string;
  companyName: string;
  contactPerson: string;
  amount: number;
  currency: string;
  dueDate: string;
  daysOverdue: number;
  status: WorkflowStatus;
  priority: Priority;
  currentStage: StageId;
  nextAction: string;
  assignedAgent: string;
  dataSources: DataSourceType[];
  confidenceScore: number;
  isRerouted?: boolean;
  rerouteReason?: string;
  draft?: CommunicationDraft;
  rawDetails: {
    invoiceNumber?: string;
    studentId?: string;
    employeeId?: string;
    grantId?: string;
    roomAllotment?: string;
    itemsSummary: string;
    previousContactCount: number;
    paymentLink?: string;
    documentStatus?: string;
    riskCategory: string;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  roleCategory?: UserRole;
  taskId?: string;
  taskTitle?: string;
  agentName: string;
  agentRole: 'SENSOR' | 'FUSION' | 'REASONER' | 'REASONING' | 'DISPATCHER' | 'SUPERVISOR' | 'HUMAN';
  type: 'INFO' | 'TOOL_CALL' | 'REASONING' | 'HUMAN_APPROVAL' | 'REROUTE_EVENT' | 'EXECUTION_SUCCESS' | 'ERROR';
  message: string;
  details?: Record<string, any>;
  sourceIcon?: string;
}

export interface TimelineStage {
  id: StageId;
  label: string;
  description: string;
  iconName: string;
  activeCount: number;
  durationAvg: string;
  agent: string;
}

export interface RerouteScenario {
  id: string;
  title: string;
  roleCategory: UserRole;
  description: string;
  triggerEvent: string;
  initialPath: string[];
  reroutedPath: string[];
  rerouteExplanation: string;
  targetTaskId: string;
  tag: string;
}

export interface BuilderNode {
  id: string;
  title: string;
  type: 'TRIGGER' | 'SOURCE' | 'AI_REASONING' | 'DECISION_BRANCH' | 'HITL_GATE' | 'ACTION_EXEC';
  category: 'INGEST' | 'LOGIC' | 'DISPATCH';
  description: string;
  x: number;
  y: number;
  config: Record<string, string>;
  status: 'IDLE' | 'ACTIVE' | 'DONE';
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  targetRole: UserRole;
  description: string;
  icon: string;
  badge: string;
  nodesCount: number;
  nodes: BuilderNode[];
}

export interface CopilotMessage {
  id: string;
  sender: 'AI' | 'USER' | 'SYSTEM';
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    actionType: string;
    payload?: any;
  }[];
  highlightTaskId?: string;
}
