// FlowPilot AI - Extensible Tool Registry & Execution Layer
import { 
  Invoice, 
  Customer, 
  CommunicationRecord, 
  CompanyPolicy,
  ToolDefinition, 
  ToolExecution 
} from '../types/flowpilot';
import { 
  DEMO_INVOICES, 
  DEMO_CUSTOMERS, 
  DEMO_COMMUNICATIONS, 
  DEMO_POLICIES 
} from '../data/demoDatabase';

export class ToolRegistry {
  private static registeredTools: Map<string, ToolDefinition> = new Map();
  private static executionHistory: ToolExecution[] = [];

  static registerTool(tool: ToolDefinition) {
    this.registeredTools.set(tool.id, tool);
  }

  static getTools(): ToolDefinition[] {
    return Array.from(this.registeredTools.values());
  }

  static getExecutionHistory(): ToolExecution[] {
    return [...this.executionHistory];
  }

  static logExecution(execution: ToolExecution) {
    this.executionHistory.unshift(execution);
  }
}

// 1. INVOICE TOOL
export class InvoiceTool {
  static async getInvoices(filters?: { minAmount?: number; onlyOverdue?: boolean }): Promise<{ invoices: Invoice[]; count: number }> {
    const start = Date.now();
    let result = [...DEMO_INVOICES];

    if (filters?.onlyOverdue) {
      result = result.filter(inv => inv.status === 'OVERDUE' && inv.days_overdue > 0);
    }
    if (filters?.minAmount !== undefined) {
      result = result.filter(inv => inv.amount >= filters.minAmount!);
    }

    const execution: ToolExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      toolName: 'InvoiceTool.getInvoices',
      timestamp: new Date().toLocaleTimeString(),
      input: filters || {},
      output: { totalFetched: result.length, sampleIds: result.slice(0, 3).map(i => i.invoice_id) },
      durationMs: Date.now() - start + 45,
      status: 'SUCCESS'
    };
    ToolRegistry.logExecution(execution);

    return { invoices: result, count: result.length };
  }

  static async checkPaymentStatus(invoiceId: string): Promise<{ invoiceId: string; status: string; isSettled: boolean }> {
    const start = Date.now();
    const invoice = DEMO_INVOICES.find(i => i.invoice_id === invoiceId);
    const isSettled = invoice ? invoice.status === 'PAID' : false;

    const execution: ToolExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      toolName: 'InvoiceTool.checkPaymentStatus',
      timestamp: new Date().toLocaleTimeString(),
      input: { invoiceId },
      output: { invoiceId, status: invoice?.status || 'NOT_FOUND', isSettled },
      durationMs: Date.now() - start + 28,
      status: 'SUCCESS'
    };
    ToolRegistry.logExecution(execution);

    return { invoiceId, status: invoice?.status || 'UNKNOWN', isSettled };
  }
}

// 2. CUSTOMER TOOL
export class CustomerTool {
  static async getCustomer(customerId: string): Promise<Customer | null> {
    const start = Date.now();
    const customer = DEMO_CUSTOMERS.find(c => c.customer_id === customerId) || null;

    const execution: ToolExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      toolName: 'CustomerTool.getCustomer',
      timestamp: new Date().toLocaleTimeString(),
      input: { customerId },
      output: customer ? { name: customer.company_name, risk: customer.risk_level, email: customer.email } : { error: 'Not found' },
      durationMs: Date.now() - start + 32,
      status: customer ? 'SUCCESS' : 'ERROR'
    };
    ToolRegistry.logExecution(execution);

    return customer;
  }

  static async getCustomerHistory(customerId: string): Promise<{ customer: Customer | null; communications: CommunicationRecord[] }> {
    const start = Date.now();
    const customer = DEMO_CUSTOMERS.find(c => c.customer_id === customerId) || null;
    const communications = DEMO_COMMUNICATIONS.filter(comm => comm.customer_id === customerId);

    const execution: ToolExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      toolName: 'CustomerTool.getCustomerHistory',
      timestamp: new Date().toLocaleTimeString(),
      input: { customerId },
      output: { communicationsCount: communications.length, recentStatus: communications[0]?.resolution_status || 'NONE' },
      durationMs: Date.now() - start + 40,
      status: 'SUCCESS'
    };
    ToolRegistry.logExecution(execution);

    return { customer, communications };
  }

  static async findAlternateContact(customerId: string): Promise<{ found: boolean; alternateEmail?: string; contactName?: string; source: string }> {
    const start = Date.now();
    const customer = DEMO_CUSTOMERS.find(c => c.customer_id === customerId);

    const found = !!customer?.alternate_email;
    const execution: ToolExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      toolName: 'CustomerTool.findAlternateContact',
      timestamp: new Date().toLocaleTimeString(),
      input: { customerId },
      output: found ? {
        alternateEmail: customer?.alternate_email,
        contactName: customer?.contact_name,
        source: 'Corporate Directory & Secondary Billing Master'
      } : { error: 'No secondary contact found' },
      durationMs: Date.now() - start + 65,
      status: found ? 'SUCCESS' : 'ERROR'
    };
    ToolRegistry.logExecution(execution);

    return {
      found,
      alternateEmail: customer?.alternate_email,
      contactName: customer?.contact_name,
      source: 'Corporate Directory & Secondary Billing Master'
    };
  }
}

// 3. EMAIL TOOL
export class EmailTool {
  static async generateEmail(data: {
    customer: Customer;
    invoice: Invoice;
    priorityLevel: string;
    escalation: boolean;
  }): Promise<{ subject: string; body: string }> {
    const isEscalation = data.escalation || data.invoice.amount >= 500000;
    const amountFormatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data.invoice.amount);

    let subject = `[Action Required] Outstanding Payment Reminder: Invoice #${data.invoice.invoice_id}`;
    if (isEscalation) {
      subject = `[URGENT ESCALATION] Formal Overdue Notice: Invoice #${data.invoice.invoice_id} (${amountFormatted})`;
    }

    let body = `Dear ${data.customer.contact_name},\n\n` +
      `We hope this email finds you well at ${data.customer.company_name}.\n\n` +
      `Our automated billing records indicate that Invoice #${data.invoice.invoice_id} for the amount of ${amountFormatted}, ` +
      `which was due on ${data.invoice.due_date}, remains outstanding (${data.invoice.days_overdue} days overdue).\n\n` +
      (isEscalation 
        ? `Given the high account balance exceeding our enterprise threshold, this matter has been flagged for Senior Finance Management review. To avoid service disruption or credit hold, please ensure remittance is processed immediately.\n\n`
        : `Please process the payment at your earliest convenience to ensure uninterrupted service delivery.\n\n`) +
      `Direct Secure Payment Link: ${data.invoice.payment_link}\n\n` +
      `If payment has already been initiated, please share the transaction UTR number by replying directly to this email.\n\n` +
      `Sincerely,\n` +
      `Treasury & Accounts Receivable Operations\n` +
      `FlowPilot Autonomous Financial Services`;

    return { subject, body };
  }

  static async sendEmail(params: {
    to: string;
    subject: string;
    body: string;
    invoiceId: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string; errorCode?: string }> {
    const start = Date.now();

    // Intentional deterministic failure demonstration:
    // If destination domain is 'old-domain.com', simulate 550 Mailbox Unavailable bounce
    if (params.to.includes('old-domain.com')) {
      const execution: ToolExecution = {
        id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        toolName: 'EmailTool.sendEmail',
        timestamp: new Date().toLocaleTimeString(),
        input: { to: params.to, subject: params.subject, invoiceId: params.invoiceId },
        output: { error: '550 5.1.1 User unknown / Host domain de-provisioned' },
        durationMs: Date.now() - start + 85,
        status: 'ERROR',
        errorMessage: `SMTP Error 550: Mailbox unavailable at domain [${params.to}]`
      };
      ToolRegistry.logExecution(execution);

      return {
        success: false,
        error: `SMTP Error 550: Destination server rejected recipient [${params.to}] - Domain de-provisioned.`,
        errorCode: 'ERR_MAILBOX_UNAVAILABLE'
      };
    }

    // Success case
    const msgId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const execution: ToolExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      toolName: 'EmailTool.sendEmail',
      timestamp: new Date().toLocaleTimeString(),
      input: { to: params.to, subject: params.subject, invoiceId: params.invoiceId },
      output: { messageId: msgId, status: 'DELIVERED_250_OK', recipient: params.to },
      durationMs: Date.now() - start + 75,
      status: 'SUCCESS'
    };
    ToolRegistry.logExecution(execution);

    return {
      success: true,
      messageId: msgId
    };
  }
}

// 4. DOCUMENT & POLICY TOOL
export class DocumentTool {
  static async evaluateCompanyPolicies(invoice: Invoice, customer: Customer, communications: CommunicationRecord[]): Promise<{
    allowedToSend: boolean;
    requiresHumanApproval: boolean;
    requiresExecutiveEscalation: boolean;
    triggeredPolicies: CompanyPolicy[];
    rejectionReason?: string;
  }> {
    const start = Date.now();
    const triggered: CompanyPolicy[] = [];
    let requiresApproval = false;
    let requiresEscalation = false;
    let allowedToSend = true;
    let rejectionReason: string | undefined = undefined;

    // Check Rule 4: Active extension in last 7 days
    const recentExtension = communications.find(c => c.resolution_status === 'EXTENSION_REQUESTED' && c.daysAgo <= 7);
    if (recentExtension) {
      triggered.push(DEMO_POLICIES[3]); // POL-04
      allowedToSend = false;
      rejectionReason = `Customer granted active payment extension ${recentExtension.daysAgo} days ago. Policy POL-04 prohibits dunning during active grace window.`;
    }

    // Check Rule 2: Amount > ₹100k requires human signoff
    if (invoice.amount > 100000) {
      triggered.push(DEMO_POLICIES[1]); // POL-02
      requiresApproval = true;
    }

    // Check Rule 3: Amount > ₹500k OR High Risk + >35 days requires executive escalation
    if (invoice.amount >= 500000 || (customer.risk_level === 'HIGH' && invoice.days_overdue > 35)) {
      triggered.push(DEMO_POLICIES[2]); // POL-03
      requiresEscalation = true;
      requiresApproval = true;
    }

    // Rule 1: Overdue > 30 days
    if (invoice.days_overdue > 30) {
      triggered.push(DEMO_POLICIES[0]); // POL-01
    }

    const execution: ToolExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      toolName: 'DocumentTool.evaluateCompanyPolicies',
      timestamp: new Date().toLocaleTimeString(),
      input: { invoiceId: invoice.invoice_id, customerId: customer.customer_id, amount: invoice.amount },
      output: { 
        allowedToSend, 
        requiresHumanApproval: requiresApproval, 
        triggeredPolicyCount: triggered.length,
        policies: triggered.map(p => p.policy_id)
      },
      durationMs: Date.now() - start + 35,
      status: 'SUCCESS'
    };
    ToolRegistry.logExecution(execution);

    return {
      allowedToSend,
      requiresHumanApproval: requiresApproval,
      requiresExecutiveEscalation: requiresEscalation,
      triggeredPolicies: triggered,
      rejectionReason
    };
  }
}
