// FlowPilot AI - Realistic Business Database & Seed Repositories
import { Invoice, Customer, CommunicationRecord, CompanyPolicy } from '../types/flowpilot';

export const DEMO_CUSTOMERS: Customer[] = [
  {
    customer_id: 'CUST-101',
    company_name: 'Zenith Retail Pvt Ltd',
    industry: 'Omnichannel Retail & E-Commerce',
    customer_value: 'ENTERPRISE',
    risk_level: 'HIGH',
    credit_limit: 500000,
    contact_name: 'Vikramaditya Singhania',
    email: 'finance@old-domain.com', // Intentionally invalid domain to trigger deterministic failure
    alternate_email: 'accounts@zenithretail.in', // Discovered upon AI investigation
    phone: '+91 98201 44921',
    payment_history_score: 34,
    notes: 'Recent ERP migration caused legacy email domain de-provisioning. High value account with multiple recurring POs.'
  },
  {
    customer_id: 'CUST-102',
    company_name: 'Apex Logistics & Supply Chain',
    industry: 'Freight & Transportation',
    customer_value: 'HIGH',
    risk_level: 'HIGH',
    credit_limit: 300000,
    contact_name: 'Rajesh Nair',
    email: 'r.nair@apexlogistics.in',
    alternate_email: 'billing@apexlogistics.in',
    phone: '+91 98450 11234',
    payment_history_score: 42,
    notes: 'Outstanding balance over 45 days. 2 automated reminders previously unacknowledged.'
  },
  {
    customer_id: 'CUST-103',
    company_name: 'NovaTech Solutions India',
    industry: 'Cloud Infrastructure & SaaS',
    customer_value: 'ENTERPRISE',
    risk_level: 'MEDIUM',
    credit_limit: 1000000,
    contact_name: 'Pooja Deshmukh',
    email: 'pooja.d@novatech.co.in',
    alternate_email: 'finance-desk@novatech.co.in',
    phone: '+91 99882 33410',
    payment_history_score: 78,
    notes: 'Customer submitted an official 7-day payment extension request 3 days ago. Policy rule requires withholding aggressive dunning.'
  },
  {
    customer_id: 'CUST-104',
    company_name: 'Bharat Heavy Engineering Works',
    industry: 'Industrial Equipment Manufacturing',
    customer_value: 'ENTERPRISE',
    risk_level: 'HIGH',
    credit_limit: 1500000,
    contact_name: 'Col. Amitabha Roy (Retd.)',
    email: 'amitabha.roy@bhew-india.org',
    alternate_email: 'treasury@bhew-india.org',
    phone: '+91 97110 55678',
    payment_history_score: 55,
    notes: 'High value invoice ₹520,000 overdue by 38 days. Exceeds ₹500,000 threshold requiring Finance VP escalation signoff.'
  },
  {
    customer_id: 'CUST-105',
    company_name: 'Kavita Organics & Biotech',
    industry: 'Pharmaceuticals & Life Sciences',
    customer_value: 'MID_MARKET',
    risk_level: 'LOW',
    credit_limit: 250000,
    contact_name: 'Dr. Sunita Murthy',
    email: 'sunita.murthy@kavitaorganics.com',
    alternate_email: 'accounts@kavitaorganics.com',
    phone: '+91 94480 88991',
    payment_history_score: 89,
    notes: 'Consistent payer. Delayed invoice caused by milestone verification delay in Lab #3.'
  },
  {
    customer_id: 'CUST-106',
    company_name: 'InfraStruct Global Ventures',
    industry: 'Smart Cities & Civil Infrastructure',
    customer_value: 'ENTERPRISE',
    risk_level: 'MEDIUM',
    credit_limit: 800000,
    contact_name: 'Karthik Raman',
    email: 'karthik.r@infrastruct.com',
    phone: '+91 98190 77412',
    payment_history_score: 68,
    notes: 'Invoice ₹145,000 overdue by 22 days. Pending client approval chain.'
  },
  {
    customer_id: 'CUST-107',
    company_name: 'AeroDynamics Propulsion Labs',
    industry: 'Defense & Aerospace',
    customer_value: 'HIGH',
    risk_level: 'LOW',
    credit_limit: 600000,
    contact_name: 'Wing Cdr. R. K. Sharma',
    email: 'procurement@aerodynamics.in',
    phone: '+91 99200 44102',
    payment_history_score: 95,
    notes: 'Government clearance linked purchase order. Settles within 15 days of reminder.'
  },
  {
    customer_id: 'CUST-108',
    company_name: 'Zeta FinTech Digital Ltd',
    industry: 'Financial Services & Payments',
    customer_value: 'MID_MARKET',
    risk_level: 'HIGH',
    credit_limit: 200000,
    contact_name: 'Farhan Zaidi',
    email: 'farhan.z@zetafintech.in',
    phone: '+91 98700 12399',
    payment_history_score: 41,
    notes: 'Multiple delayed reconciliations. Cashflow constraints reported in Q3.'
  }
];

export const DEMO_INVOICES: Invoice[] = [
  {
    invoice_id: 'INV-2026-1042',
    customer_id: 'CUST-101',
    customer_name: 'Zenith Retail Pvt Ltd',
    invoice_date: '2026-07-28',
    due_date: '2026-08-27',
    amount: 185000,
    currency: 'INR',
    status: 'OVERDUE',
    days_overdue: 47,
    payment_link: 'https://pay.flowpilot.ai/inv/INV-1042'
  },
  {
    invoice_id: 'INV-2026-1088',
    customer_id: 'CUST-102',
    customer_name: 'Apex Logistics & Supply Chain',
    invoice_date: '2026-08-01',
    due_date: '2026-08-31',
    amount: 124500,
    currency: 'INR',
    status: 'OVERDUE',
    days_overdue: 43,
    payment_link: 'https://pay.flowpilot.ai/inv/INV-1088'
  },
  {
    invoice_id: 'INV-2026-1095',
    customer_id: 'CUST-103',
    customer_name: 'NovaTech Solutions India',
    invoice_date: '2026-08-12',
    due_date: '2026-09-02',
    amount: 95000,
    currency: 'INR',
    status: 'OVERDUE',
    days_overdue: 18,
    payment_link: 'https://pay.flowpilot.ai/inv/INV-1095'
  },
  {
    invoice_id: 'INV-2026-1104',
    customer_id: 'CUST-104',
    customer_name: 'Bharat Heavy Engineering Works',
    invoice_date: '2026-08-05',
    due_date: '2026-09-04',
    amount: 520000,
    currency: 'INR',
    status: 'OVERDUE',
    days_overdue: 38,
    payment_link: 'https://pay.flowpilot.ai/inv/INV-1104'
  },
  {
    invoice_id: 'INV-2026-1112',
    customer_id: 'CUST-105',
    customer_name: 'Kavita Organics & Biotech',
    invoice_date: '2026-08-20',
    due_date: '2026-09-10',
    amount: 72000,
    currency: 'INR',
    status: 'OVERDUE',
    days_overdue: 10,
    payment_link: 'https://pay.flowpilot.ai/inv/INV-1112'
  },
  {
    invoice_id: 'INV-2026-1119',
    customer_id: 'CUST-106',
    customer_name: 'InfraStruct Global Ventures',
    invoice_date: '2026-08-15',
    due_date: '2026-09-05',
    amount: 145000,
    currency: 'INR',
    status: 'OVERDUE',
    days_overdue: 22,
    payment_link: 'https://pay.flowpilot.ai/inv/INV-1119'
  },
  {
    invoice_id: 'INV-2026-1125',
    customer_id: 'CUST-108',
    customer_name: 'Zeta FinTech Digital Ltd',
    invoice_date: '2026-08-08',
    due_date: '2026-09-01',
    amount: 68000,
    currency: 'INR',
    status: 'OVERDUE',
    days_overdue: 19,
    payment_link: 'https://pay.flowpilot.ai/inv/INV-1125'
  },
  {
    invoice_id: 'INV-2026-1130',
    customer_id: 'CUST-107',
    customer_name: 'AeroDynamics Propulsion Labs',
    invoice_date: '2026-09-01',
    due_date: '2026-09-18',
    amount: 32000, // Below ₹50,000 threshold (should be filtered out)
    currency: 'INR',
    status: 'OVERDUE',
    days_overdue: 2,
    payment_link: 'https://pay.flowpilot.ai/inv/INV-1130'
  },
  {
    invoice_id: 'INV-2026-1135',
    customer_id: 'CUST-105',
    customer_name: 'Kavita Organics & Biotech',
    invoice_date: '2026-09-05',
    due_date: '2026-09-25',
    amount: 110000,
    currency: 'INR',
    status: 'PENDING', // Not overdue yet
    days_overdue: 0,
    payment_link: 'https://pay.flowpilot.ai/inv/INV-1135'
  }
];

export const DEMO_COMMUNICATIONS: CommunicationRecord[] = [
  {
    communication_id: 'COMM-901',
    customer_id: 'CUST-101',
    invoice_id: 'INV-2026-1042',
    date: '2026-08-30',
    channel: 'EMAIL',
    subject: 'Gentle Payment Reminder: Invoice INV-2026-1042',
    summary: 'Automated 1st reminder sent. Delivery failed or no response received.',
    sentiment: 'UNRESPONSIVE',
    resolution_status: 'NO_REPLY',
    daysAgo: 21
  },
  {
    communication_id: 'COMM-902',
    customer_id: 'CUST-102',
    invoice_id: 'INV-2026-1088',
    date: '2026-09-03',
    channel: 'EMAIL',
    subject: '2nd Notice: Urgent Overdue Payment for Apex Logistics',
    summary: 'Customer opened email but did not initiate wire or dispute charge.',
    sentiment: 'UNRESPONSIVE',
    resolution_status: 'OPEN',
    daysAgo: 17
  },
  {
    communication_id: 'COMM-903',
    customer_id: 'CUST-103',
    invoice_id: 'INV-2026-1095',
    date: '2026-09-17',
    channel: 'PORTAL',
    subject: 'Request for 7-Day Payment Extension',
    summary: 'Pooja Deshmukh submitted formal extension request due to client disbursement schedule. Requested hold until Sep 24.',
    sentiment: 'RESPONSIVE',
    resolution_status: 'EXTENSION_REQUESTED',
    daysAgo: 3
  },
  {
    communication_id: 'COMM-904',
    customer_id: 'CUST-104',
    invoice_id: 'INV-2026-1104',
    date: '2026-09-08',
    channel: 'PHONE',
    subject: 'Accounts Call with Col. Roy',
    summary: 'Col. Roy stated invoice is in audit clearance committee. Promised release within 10 business days.',
    sentiment: 'NEUTRAL',
    resolution_status: 'PROMISE_TO_PAY',
    daysAgo: 12
  }
];

export const DEMO_POLICIES: CompanyPolicy[] = [
  {
    policy_id: 'POL-01',
    name: 'Overdue Baseline Dunning',
    threshold_rule: 'Days overdue > 30 days',
    action_required: 'Send standard payment reminder with direct payment gateway link.',
    enforced: true
  },
  {
    policy_id: 'POL-02',
    name: 'High-Value Manager Signoff Gate',
    threshold_rule: 'Invoice Amount > ₹100,000',
    action_required: 'Require explicit human operator approval before transmitting communication.',
    enforced: true
  },
  {
    policy_id: 'POL-03',
    name: 'Executive Escalation Gate',
    threshold_rule: 'Invoice Amount > ₹500,000 OR Risk Level = HIGH and Overdue > 35 days',
    action_required: 'Escalate to Finance VP level with tailored legal and suspension warning text.',
    enforced: true
  },
  {
    policy_id: 'POL-04',
    name: 'Active Extension Protection Rule',
    threshold_rule: 'Customer requested payment extension within previous 7 calendar days',
    action_required: 'STRICTLY SUPPRESS dunning messages to preserve relationship during active extension window.',
    enforced: true
  }
];

export const WORKFLOW_TEMPLATES = [
  {
    id: 'tpl-invoice-resolution',
    title: 'Overdue Invoice Resolution (Primary Demo)',
    category: 'Finance & Cash Flow',
    description: 'Autonomous scanning of overdue invoices > ₹50,000, risk profiling, policy verification, human-in-the-loop signoff, failure recovery, and audited execution.',
    prompt: 'Find all overdue invoices above ₹50,000, analyze the customers, prioritize the cases, prepare follow-up emails, and ask me for approval before sending.',
    tags: ['Finance', 'Invoices', 'Risk Scoring', 'HITL', 'Re-planning'],
    estimatedDuration: '45 seconds',
    successRate: '98.4%'
  },
  {
    id: 'tpl-employee-onboarding',
    title: 'Autonomous Employee Onboarding',
    category: 'HR & People Operations',
    description: 'Ingest offer letter acceptance → KYC & credential verification → automated hardware provisioning (MacBook M4) → IT account creation → manager signoff.',
    prompt: 'Collect new hire documents for Elena Rostova, verify background checks, provision IT accounts, and prepare welcome package for manager signoff.',
    tags: ['HR', 'Compliance', 'DocuSign', 'IT Provisioning'],
    estimatedDuration: '60 seconds',
    successRate: '99.1%'
  },
  {
    id: 'tpl-procurement-request',
    title: '3-Way Procurement & Vendor Signoff',
    category: 'Operations & Procurement',
    description: 'Verify employee purchase request against budget limits → check vendor compliance → perform 3-way PO matching → route to Finance Director for wire approval.',
    prompt: 'Verify purchase requisition PR-8821 for Cloud GPU cluster, match against AWS quote and department budget, and draft approval for Finance Director.',
    tags: ['Procurement', 'Budget', '3-Way Match', 'Approval'],
    estimatedDuration: '50 seconds',
    successRate: '97.8%'
  },
  {
    id: 'tpl-support-escalation',
    title: 'High-Impact Customer Support Escalation',
    category: 'Customer Success',
    description: 'Ingest inbound critical support ticket → classify SLA breach risk → retrieve account health & ARR value → draft executive response → notify on-call engineering lead.',
    prompt: 'Analyze high-priority outage ticket #TKT-992 from Zenith Retail, check SLA obligations, synthesize root cause from logs, and draft CEO update.',
    tags: ['Support', 'SLA', 'Executive Comms', 'Incident'],
    estimatedDuration: '35 seconds',
    successRate: '99.5%'
  }
];
