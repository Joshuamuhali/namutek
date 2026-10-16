export type RoleId =
  | 'super_admin'
  | 'managing_director'
  | 'quotation_officer'
  | 'sales_officer'
  | 'dispatcher'
  | 'project_coordinator'
  | 'fleet_manager'
  | 'finance_officer'
  | 'field_staff'
  | 'customer';

export interface RoleConfig {
  id: RoleId;
  name: string;
  category: 'Management' | 'Commercial' | 'Operations' | 'Finance' | 'Field workspace' | 'Customer portal';
  tagline: string;
  badge: string;
  allowedNav: string[];
  responsibilities: string[];
}

export const ROLES: Record<RoleId, RoleConfig> = {
  super_admin: {
    id: 'super_admin',
    name: 'Super Admin',
    category: 'Management',
    tagline: 'System governance, security audit & platform configuration',
    badge: 'System Admin',
    allowedNav: ['Overview', 'Users & Roles', 'Services', 'Pricing', 'Integrations', 'Audit Logs', 'System Health'],
    responsibilities: [
      'Staff accounts & permission sets',
      'Security audit events & policy controls',
      'Integration error monitoring & failed jobs',
      'Platform configuration & feature toggles',
    ],
  },
  managing_director: {
    id: 'managing_director',
    name: 'Managing Director',
    category: 'Management',
    tagline: 'Company-wide decisions, commercial approvals and executive oversight',
    badge: 'Executive',
    allowedNav: ['Overview', 'Approvals', 'Requests', 'Quotations', 'Projects', 'Operations', 'Finance Reports'],
    responsibilities: [
      'High-value and exceptional quotation approvals',
      'Operational delivery oversight & SLA health',
      'Revenue, cash collected & aged receivables',
      'Cross-division performance review',
    ],
  },
  quotation_officer: {
    id: 'quotation_officer',
    name: 'Quotation Officer',
    category: 'Commercial',
    tagline: 'Cost engineering, pricing formula calculations & quotation revisions',
    badge: 'Commercial',
    allowedNav: ['Overview', 'Request Queue', 'Quotations', 'Pricing Reference', 'Revisions'],
    responsibilities: [
      'Cost calculation from service scopes & inputs',
      'Drafting formal line-item quotation sheets',
      'Submitting immutable revisions for MD approval',
      'Tracking expiry & revision return notes',
    ],
  },
  sales_officer: {
    id: 'sales_officer',
    name: 'Sales Officer',
    category: 'Commercial',
    tagline: 'Customer enquiry qualification, pipeline tracking & client follow-up',
    badge: 'Commercial',
    allowedNav: ['Overview', 'Leads', 'Customers', 'Follow-ups', 'Pipeline'],
    responsibilities: [
      'Lead qualification & initial scope clarification',
      'Client relationship & communication history',
      'Pipeline kanban progression (New to Won)',
      'Follow-up schedule adherence',
    ],
  },
  dispatcher: {
    id: 'dispatcher',
    name: 'Dispatcher',
    category: 'Operations',
    tagline: 'Transport schedule, driver/vehicle allocation & movement control',
    badge: 'Operations',
    allowedNav: ['Overview', 'Dispatch Board', 'Bookings', 'Vehicles', 'Drivers', 'Work Orders'],
    responsibilities: [
      'Allocating roadworthy vehicles & licensed drivers',
      'Conflict-free calendar scheduling & dispatch board',
      'Departure and arrival confirmation tracking',
      'Real-time trip exceptions & reassignments',
    ],
  },
  project_coordinator: {
    id: 'project_coordinator',
    name: 'Project Coordinator',
    category: 'Operations',
    tagline: 'Construction, civil works & site mobilization management',
    badge: 'Operations',
    allowedNav: ['Overview', 'Projects', 'Work Orders', 'Milestones', 'Resources', 'Site Reports'],
    responsibilities: [
      'Multi-stage civil & building project milestones',
      'Site readiness & equipment requisition',
      'Progress logging, blocked task escalation',
      'Final completion sign-off coordination',
    ],
  },
  fleet_manager: {
    id: 'fleet_manager',
    name: 'Fleet Manager',
    category: 'Operations',
    tagline: 'Plant and fleet asset register, availability calendars & maintenance',
    badge: 'Fleet & Plant',
    allowedNav: ['Overview', 'Assets', 'Availability', 'Maintenance', 'Assignments'],
    responsibilities: [
      'Vehicle & heavy equipment readiness certification',
      'Preventative service intervals & maintenance downtime',
      'Blocking unavailable assets from dispatch booking',
      'Odometer/hour logs and operating compliance',
    ],
  },
  finance_officer: {
    id: 'finance_officer',
    name: 'Finance Officer',
    category: 'Finance',
    tagline: 'Invoicing, payment reconciliation, aging receivables & credit management',
    badge: 'Finance',
    allowedNav: ['Overview', 'Invoices', 'Payments', 'Receivables', 'Reconciliation', 'Reports'],
    responsibilities: [
      'Generating tax-compliant commercial invoices',
      'Manual receipt recording & payment verification',
      '30/60/90-day aging receivable recovery',
      'Audited adjustments and payment reconciliation',
    ],
  },
  field_staff: {
    id: 'field_staff',
    name: 'Field Staff / Driver',
    category: 'Field workspace',
    tagline: 'Mobile-first task execution, checklists, GPS check-in & photo proof',
    badge: 'Field Mobile',
    allowedNav: ['My Jobs', 'Schedule', 'Tasks', 'Updates', 'Documents'],
    responsibilities: [
      'Assigned trip / work-order job instructions',
      'Pre-trip safety checklists & departure confirmation',
      'Site delivery proof photo upload & client sign-off',
      'Offline-capable job update logging',
    ],
  },
  customer: {
    id: 'customer',
    name: 'Customer Portal',
    category: 'Customer portal',
    tagline: 'Self-service request tracking, quotation review, bookings & invoices',
    badge: 'Client Portal',
    allowedNav: ['My Requests', 'Quotations', 'Bookings', 'Invoices', 'Documents', 'Account'],
    responsibilities: [
      'Service request submission across all 4 divisions',
      'Reviewing and accepting/declining formal quotes',
      'Viewing confirmed bookings & progress updates',
      'Downloading invoices and submitting payment proof',
    ],
  },
};
