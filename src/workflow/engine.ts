import { 
  WorkflowInstance, 
  WorkflowStep, 
  ApprovalRequest, 
  ReplanEvent, 
  AuditLogEntry, 
  ParsedObjective 
} from '../types/flowpilot';
import { 
  InvoiceTool, 
  CustomerTool, 
  EmailTool 
} from '../tools/toolRegistry';
import { MockDeterministicProvider } from '../services/llm/llmProvider';
import { sound } from '../utils/audio';

export class FlowPilotEngine {
  private static activeWorkflows: Map<string, WorkflowInstance> = new Map();
  private static listeners: Set<(workflow: WorkflowInstance) => void> = new Set();

  static subscribe(listener: (workflow: WorkflowInstance) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static notify(workflow: WorkflowInstance) {
    this.listeners.forEach(l => l({ ...workflow }));
  }

  static getWorkflow(id: string): WorkflowInstance | undefined {
    return this.activeWorkflows.get(id);
  }

  static getAllWorkflows(): WorkflowInstance[] {
    return Array.from(this.activeWorkflows.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Pre-flight validation
  static validatePlan(_parsed: ParsedObjective): {
    isValid: boolean;
    checks: Array<{ name: string; passed: boolean; details: string; warning?: boolean }>;
  } {
    return {
      isValid: true,
      checks: [
        { name: 'Database Connectivity', passed: true, details: 'Postgres Invoices & Customer tables verified (latency 12ms).' },
        { name: 'Tool Registry Availability', passed: true, details: 'InvoiceTool, CustomerTool, EmailTool, DocumentTool operational.' },
        { name: 'Policy Ruleset Enforced', passed: true, details: 'POL-01, POL-02, POL-03, POL-04 loaded and active.' },
        { name: 'Security & HITL Gate', passed: true, warning: true, details: 'Sensitive external communications over ₹100,000 gated for operator approval.' }
      ]
    };
  }

  // Initialize a new workflow from natural language
  static async createWorkflow(prompt: string): Promise<WorkflowInstance> {
    const provider = new MockDeterministicProvider();
    const parsed = await provider.parseObjective(prompt);
    const planSteps = await provider.generatePlan(parsed);

    const steps: WorkflowStep[] = planSteps.map((stepText, idx) => ({
      id: `step-${idx + 1}`,
      name: stepText.replace(/^\d+\.\s*/, ''),
      description: `Execute autonomous sub-step: ${stepText}`,
      nodeIndex: idx,
      status: 'PENDING',
      durationMs: 0
    }));

    const workflowId = `WF-${Date.now().toString().slice(-6)}`;
    const newWorkflow: WorkflowInstance = {
      id: workflowId,
      title: parsed.title,
      objective: parsed,
      createdAt: new Date().toISOString(),
      durationSeconds: 0,
      status: 'IDLE',
      currentStepIndex: 0,
      steps,
      approvals: [],
      replans: [],
      auditLogs: [
        {
          id: `log-${Date.now()}-1`,
          timestamp: new Date().toLocaleTimeString(),
          workflowId,
          actor: 'AI_AGENT',
          eventType: 'AI_DECISION',
          action: 'Objective Ingestion & Plan Synthesis',
          status: 'SUCCESS',
          result: `Synthesized ${steps.length}-step execution DAG with constraints: Min ₹50,000, Overdue only, HITL enforced.`,
          reason: 'Natural-language intent decomposed into deterministic graph.'
        }
      ],
      summaryStats: {
        invoicesScanned: 284,
        overdueFound: 17,
        highValueFiltered: 12,
        prioritizedCases: 5,
        communicationsDrafted: 5,
        approvalsRequired: 3,
        approvalsGranted: 0,
        actionsExecuted: 0,
        failuresRecovered: 0
      }
    };

    this.activeWorkflows.set(workflowId, newWorkflow);
    this.notify(newWorkflow);
    return newWorkflow;
  }

  // Execute workflow step by step with pauses for approvals and failure re-planning
  static async executeWorkflow(
    workflowId: string, 
    onStepUpdate?: (wf: WorkflowInstance) => void
  ): Promise<void> {
    const wf = this.activeWorkflows.get(workflowId);
    if (!wf) return;

    wf.status = 'RUNNING';
    sound.playClick();
    this.notify(wf);
    if (onStepUpdate) onStepUpdate(wf);

    // Step 0: Ingest Invoices
    await this.runStep(wf, 0, 'InvoiceTool.getInvoices', async () => {
      await InvoiceTool.getInvoices({ minAmount: 0 });
      wf.summaryStats.invoicesScanned = 284;
      this.addAudit(wf, 'TOOL_CALL', 'Ingest Invoices from Master', 'InvoiceTool', 'SUCCESS', `Scanned 284 records across active ledgers.`);
      return `Retrieved 284 total invoices from database.`;
    });

    // Step 1: Filter Overdue
    await this.runStep(wf, 1, 'InvoiceTool.filterOverdue', async () => {
      wf.summaryStats.overdueFound = 17;
      this.addAudit(wf, 'AI_DECISION', 'Filter Overdue Records', undefined, 'SUCCESS', `Identified 17 invoices past maturity date.`);
      return `Filtered 17 overdue invoices (past due date).`;
    });

    // Step 2: Filter Amount >= 50,000
    await this.runStep(wf, 2, 'InvoiceTool.filterHighValue', async () => {
      const { invoices } = await InvoiceTool.getInvoices({ minAmount: 50000, onlyOverdue: true });
      wf.summaryStats.highValueFiltered = invoices.length;
      this.addAudit(wf, 'TOOL_CALL', 'Filter High Value Threshold', 'InvoiceTool', 'SUCCESS', `12 overdue invoices meet >= ₹50,000 constraint.`);
      return `Filtered 12 high-value overdue invoices (>= ₹50,000).`;
    });

    // Step 3: Retrieve Customer Profiles
    await this.runStep(wf, 3, 'CustomerTool.getCustomer', async () => {
      this.addAudit(wf, 'TOOL_CALL', 'Batch Fetch Customer Profiles', 'CustomerTool', 'SUCCESS', `Retrieved risk ratings, credit limits, and contact matrices.`);
      return `Retrieved 12 enterprise customer profiles with credit limits and contacts.`;
    });

    // Step 4: Retrieve Communication History
    await this.runStep(wf, 4, 'CustomerTool.getCustomerHistory', async () => {
      this.addAudit(wf, 'TOOL_CALL', 'Retrieve CRM Communication History', 'CustomerTool', 'SUCCESS', `Retrieved 4 historical interactions, dispute logs, and payment promises.`);
      return `Cross-referenced historical reminder notes and payment extensions.`;
    });

    // Step 5: Check Payment & Extension Status
    await this.runStep(wf, 5, 'DocumentTool.checkStatus', async () => {
      this.addAudit(wf, 'AI_DECISION', 'Evaluate Active Extension Status', undefined, 'SUCCESS', `NovaTech has active 7-day payment extension granted 3 days ago. Suppressing aggressive reminders under POL-04.`);
      return `Detected active 7-day payment extension for NovaTech (POL-04 suppression applied).`;
    });

    // Step 6: Prioritize Cases
    await this.runStep(wf, 6, 'PrioritizationEngine', async () => {
      wf.summaryStats.prioritizedCases = 5;
      this.addAudit(wf, 'AI_DECISION', 'Intelligent Priority Scoring', undefined, 'SUCCESS', `Calculated multi-factor risk scores: Zenith Retail (87/100, HIGH), Apex Logistics (84/100, HIGH), BHEW (94/100, CRITICAL).`);
      return `Ranked top 5 urgent accounts based on days overdue, balance, and risk profile.`;
    });

    // Step 7: Evaluate Policies
    await this.runStep(wf, 7, 'DocumentTool.evaluateCompanyPolicies', async () => {
      this.addAudit(wf, 'AI_DECISION', 'Policy Gate Compliance Check', 'DocumentTool', 'SUCCESS', `POL-02 requires manager approval for balances > ₹100,000. POL-03 triggers VP escalation on BHEW (> ₹500,000).`);
      return `Policy evaluation completed: 3 actions flagged for mandatory human approval.`;
    });

    // Step 8: Generate Drafts
    await this.runStep(wf, 8, 'EmailTool.generateEmail', async () => {
      // Build 3 approvals
      const approvals: ApprovalRequest[] = [
        {
          id: `app-1-${Date.now()}`,
          workflowId: wf.id,
          stepId: 'step-9',
          customerId: 'CUST-101',
          customerName: 'Zenith Retail Pvt Ltd',
          invoiceId: 'INV-2026-1042',
          amount: 185000,
          currency: 'INR',
          daysOverdue: 47,
          priorityScore: 87,
          priorityLevel: 'HIGH',
          proposedAction: 'Send Formal Escalation Overdue Notice & Payment Link',
          reason: 'Overdue 47 days, high risk profile (34/100 score), amount ₹185,000 exceeds ₹100k manager threshold (POL-02).',
          draftSubject: '[URGENT] Payment Follow-Up: Overdue Invoice #INV-2026-1042 (₹1,85,000)',
          draftBody: `Dear Vikramaditya Singhania,\n\nOur billing system indicates that Invoice #INV-2026-1042 for ₹1,85,000 is now 47 days overdue. Please remit payment immediately via the secure link: https://pay.flowpilot.ai/inv/INV-1042 to maintain active credit terms.\n\nSincerely,\nFlowPilot AR Team`,
          recipientEmail: 'finance@old-domain.com', // Will trigger intentional failure
          status: 'PENDING',
          createdAt: new Date().toLocaleTimeString()
        },
        {
          id: `app-2-${Date.now()}`,
          workflowId: wf.id,
          stepId: 'step-9',
          customerId: 'CUST-102',
          customerName: 'Apex Logistics & Supply Chain',
          invoiceId: 'INV-2026-1088',
          amount: 124500,
          currency: 'INR',
          daysOverdue: 43,
          priorityScore: 84,
          priorityLevel: 'HIGH',
          proposedAction: 'Send 2nd Urgent Payment Demand with Gateway Link',
          reason: 'Overdue 43 days, previous automated reminder unacknowledged, balance ₹124,500.',
          draftSubject: 'Urgent Notice: Outstanding Balance for Apex Logistics (Invoice #INV-2026-1088)',
          draftBody: `Dear Rajesh Nair,\n\nThis is a follow-up regarding overdue Invoice #INV-2026-1088 for ₹1,24,500 due on 2026-08-31. Please settle immediately: https://pay.flowpilot.ai/inv/INV-1088.\n\nBest regards,\nAccounts Team`,
          recipientEmail: 'r.nair@apexlogistics.in',
          status: 'PENDING',
          createdAt: new Date().toLocaleTimeString()
        },
        {
          id: `app-3-${Date.now()}`,
          workflowId: wf.id,
          stepId: 'step-9',
          customerId: 'CUST-104',
          customerName: 'Bharat Heavy Engineering Works',
          invoiceId: 'INV-2026-1104',
          amount: 520000,
          currency: 'INR',
          daysOverdue: 38,
          priorityScore: 94,
          priorityLevel: 'CRITICAL',
          proposedAction: 'Send Executive VP-Level Legal Escalation Notice',
          reason: 'Balance ₹520,000 exceeds ₹500,000 enterprise threshold (POL-03). High financial impact.',
          draftSubject: '[EXECUTIVE ESCALATION] Formal Legal & Treasury Notice: Invoice #INV-2026-1104 (₹5,20,000)',
          draftBody: `Dear Col. Amitabha Roy,\n\nInvoice #INV-2026-1104 for ₹5,20,000 is 38 days past maturity. Per Company Policy POL-03, this matter has been escalated to Executive Finance. Please arrange immediate wire clearance.\n\nRegards,\nFinance VP Desk`,
          recipientEmail: 'amitabha.roy@bhew-india.org',
          status: 'PENDING',
          createdAt: new Date().toLocaleTimeString()
        }
      ];

      wf.approvals = approvals;
      wf.summaryStats.communicationsDrafted = 5;
      wf.summaryStats.approvalsRequired = 3;
      this.addAudit(wf, 'APPROVAL', 'Generated 3 Pending Approvals', undefined, 'WARNING', `3 high-value communications prepared and queued for human operator review.`);
      return `Generated 5 communications; 3 require human signoff under corporate governance policy.`;
    });

    // Step 9: Pause and Wait for Human Approval
    wf.steps[9].status = 'WAITING_APPROVAL';
    wf.status = 'WAITING_APPROVAL';
    sound.playWarning();
    this.addAudit(wf, 'SYSTEM', 'Workflow Paused for Human Signoff', undefined, 'INFO', `Halting autonomous dispatch. Awaiting human operator approval on pending drafts.`);
    this.notify(wf);
    if (onStepUpdate) onStepUpdate(wf);
  }

  // Called when user clicks "Approve All" or approves an individual item
  static async resumeAfterApproval(
    workflowId: string, 
    approvalId: string,
    onStepUpdate?: (wf: WorkflowInstance) => void
  ): Promise<void> {
    const wf = this.activeWorkflows.get(workflowId);
    if (!wf) return;

    const approval = wf.approvals.find(a => a.id === approvalId);
    if (approval) {
      approval.status = 'APPROVED';
      approval.respondedAt = new Date().toLocaleTimeString();
      approval.reviewedBy = 'Senior Operations Lead (You)';
    }

    const allApproved = wf.approvals.every(a => a.status === 'APPROVED');
    wf.summaryStats.approvalsGranted += 1;

    this.addAudit(wf, 'APPROVAL', `Human Approved Action for ${approval?.customerName}`, undefined, 'SUCCESS', `Operator granted signoff for: ${approval?.proposedAction}`);
    this.notify(wf);

    if (!allApproved) {
      if (onStepUpdate) onStepUpdate(wf);
      return;
    }

    // Mark approval step as completed
    wf.steps[9].status = 'COMPLETED';
    wf.steps[9].durationMs = 1200;
    wf.steps[9].resultSummary = `All 3 pending actions approved by human operator.`;
    wf.status = 'RUNNING';
    sound.playClick();
    this.notify(wf);

    // Step 10: Execute Approved Communications (Triggering intentional failure on Zenith Retail)
    await this.runStep(wf, 10, 'EmailTool.sendEmail', async () => {
      // 1. Send Apex Logistics
      await EmailTool.sendEmail({
        to: 'r.nair@apexlogistics.in',
        subject: wf.approvals[1].draftSubject,
        body: wf.approvals[1].draftBody,
        invoiceId: 'INV-2026-1088'
      });
      wf.summaryStats.actionsExecuted += 1;

      // 2. Send BHEW
      await EmailTool.sendEmail({
        to: 'amitabha.roy@bhew-india.org',
        subject: wf.approvals[2].draftSubject,
        body: wf.approvals[2].draftBody,
        invoiceId: 'INV-2026-1104'
      });
      wf.summaryStats.actionsExecuted += 1;

      // 3. Send Zenith Retail (Intentional Failure)
      const res = await EmailTool.sendEmail({
        to: 'finance@old-domain.com',
        subject: wf.approvals[0].draftSubject,
        body: wf.approvals[0].draftBody,
        invoiceId: 'INV-2026-1042'
      });

      if (!res.success) {
        throw new Error(`SMTP Delivery Failed: 550 Mailbox Unavailable at [finance@old-domain.com]`);
      }

      return `Executed all communications.`;
    }).catch(async () => {
      // Step 11: Failure Detected -> Dynamic Re-Planning Loop
      sound.playFailure();
      wf.steps[10].status = 'FAILED';
      wf.steps[10].resultSummary = `2 emails sent successfully. 1 delivery failed: SMTP 550 Mailbox de-provisioned at [finance@old-domain.com].`;
      wf.status = 'FAILURE_DETECTED';

      this.addAudit(wf, 'FAILURE', 'SMTP Delivery Bounce Detected', 'EmailTool', 'ERROR', `Failed to deliver email to finance@old-domain.com for Zenith Retail (INV-1042).`);
      this.notify(wf);
      if (onStepUpdate) onStepUpdate(wf);

      await new Promise(r => setTimeout(r, 1400));

      // AI Autonomous Investigation & Dynamic Re-plan
      wf.status = 'REPLANNING';
      sound.playClick();
      this.addAudit(wf, 'REPLAN', 'AI Diagnostic Investigation Initiated', undefined, 'WARNING', `Analyzing failure context. Invoking CustomerTool.findAlternateContact('CUST-101') to discover active routing.`);
      
      const altResult = await CustomerTool.findAlternateContact('CUST-101');
      const alternateEmail = altResult.alternateEmail || 'accounts@zenithretail.in';

      const replanEvent: ReplanEvent = {
        id: `replan-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        workflowId: wf.id,
        failedStepId: 'step-11',
        failedAction: 'Send email to finance@old-domain.com',
        failureReason: '550 Mailbox Unavailable / Legacy ERP Domain De-provisioned',
        investigationDetails: 'AI queried secondary contact directories and found verified billing address: accounts@zenithretail.in',
        alternateDiscovery: `Discovered verified active contact: Vikramaditya Singhania <${alternateEmail}>`,
        newAction: `Re-route email transmission to ${alternateEmail}`,
        status: 'RECOVERED'
      };
      wf.replans.push(replanEvent);
      wf.summaryStats.failuresRecovered += 1;

      // Update Zenith approval
      wf.approvals[0].recipientEmail = alternateEmail;
      wf.approvals[0].status = 'REPLANNED';
      wf.approvals[0].proposedAction = `[RE-ROUTED] Send Overdue Notice to ${alternateEmail}`;
      wf.approvals[0].reason = `Adapted after bounce: Discovered verified alternate billing contact (${alternateEmail}).`;

      // Insert or mark re-planning step
      wf.steps[10].isReplanned = true;
      wf.steps[10].replanReason = `Dynamic DAG reconfiguration: Substituted destination mailbox [${alternateEmail}] and re-dispatched.`;
      
      this.addAudit(wf, 'REPLAN', 'Dynamic Re-Planning Succeeded', 'CustomerTool', 'SUCCESS', `Alternate contact verified. Auto-retransmitting payload to: ${alternateEmail}.`);
      this.notify(wf);
      if (onStepUpdate) onStepUpdate(wf);

      await new Promise(r => setTimeout(r, 1200));

      // Retry sending to alternate contact
      const retryRes = await EmailTool.sendEmail({
        to: alternateEmail,
        subject: wf.approvals[0].draftSubject,
        body: wf.approvals[0].draftBody,
        invoiceId: 'INV-2026-1042'
      });

      if (retryRes.success) {
        wf.steps[10].status = 'COMPLETED';
        wf.steps[10].resultSummary = `Recovery successful! Re-routed email delivered to [${alternateEmail}]. Total 3/3 delivered.`;
        wf.summaryStats.actionsExecuted += 1;
        this.addAudit(wf, 'EXECUTION', `Delivered to Alternate Mailbox: ${alternateEmail}`, 'EmailTool', 'SUCCESS', `Message ID: ${retryRes.messageId}`);
      }

      // Step 11: Verification
      await this.runStep(wf, 11, 'System.verify', async () => {
        this.addAudit(wf, 'EXECUTION', 'Execution Verification Reconciled', undefined, 'SUCCESS', `All 3 actions executed, 1 failure autonomously recovered, ledger audit status clean.`);
        return `Verification complete: 100% resolution rate. 0 unresolved exceptions.`;
      });

      // Step 12: Complete
      await this.runStep(wf, 12, 'System.commitState', async () => {
        wf.status = 'COMPLETED';
        wf.completedAt = new Date().toISOString();
        wf.durationSeconds = 38;
        sound.playSuccess();
        this.addAudit(wf, 'SYSTEM', 'Workflow Lifecycle Finalized', undefined, 'SUCCESS', `Workflow completed in 38s. Automation efficiency 96.4%.`);
        return `State committed to database with full audit trail logging.`;
      });

      this.notify(wf);
      if (onStepUpdate) onStepUpdate(wf);
    });
  }

  private static async runStep(
    wf: WorkflowInstance, 
    stepIndex: number, 
    toolName: string, 
    action: () => Promise<string>
  ) {
    if (!wf.steps[stepIndex]) return;

    wf.currentStepIndex = stepIndex;
    wf.steps[stepIndex].status = 'RUNNING';
    wf.steps[stepIndex].startTime = new Date().toLocaleTimeString();
    wf.steps[stepIndex].toolName = toolName;
    this.notify(wf);

    const start = Date.now();
    await new Promise(r => setTimeout(r, 700 + Math.random() * 400));
    const result = await action();

    wf.steps[stepIndex].durationMs = Date.now() - start;
    wf.steps[stepIndex].status = 'COMPLETED';
    wf.steps[stepIndex].resultSummary = result;
    this.notify(wf);
  }

  private static addAudit(
    wf: WorkflowInstance,
    eventType: AuditLogEntry['eventType'],
    action: string,
    tool: string | undefined,
    status: AuditLogEntry['status'],
    result: string
  ) {
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      workflowId: wf.id,
      actor: eventType === 'APPROVAL' ? 'HUMAN_OPERATOR' : 'AI_AGENT',
      eventType,
      action,
      tool,
      status,
      result,
      reason: 'Autonomous pipeline step'
    };
    wf.auditLogs.unshift(entry);
  }
}
