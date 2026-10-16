-- =====================================================================================
-- Migration 0002: Namutek Service Booking, Quotation & Work-Order Management Platform
-- Conforms to PRD Specification v1.0
-- =====================================================================================

-- Enums and Types
DO $$ BEGIN
  CREATE TYPE public.user_role_type AS ENUM (
    'super_admin',
    'managing_director',
    'quotation_officer',
    'sales_officer',
    'dispatcher',
    'project_coordinator',
    'fleet_manager',
    'finance_officer',
    'field_staff',
    'customer'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.service_division AS ENUM (
    'freight',
    'construction',
    'civil',
    'plant'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.request_status AS ENUM (
    'submitted',
    'under_review',
    'awaiting_customer',
    'assessment_required',
    'ready_for_quotation',
    'quotation_in_progress',
    'quoted',
    'declined',
    'cancelled',
    'closed'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.quotation_status AS ENUM (
    'draft',
    'pending_approval',
    'approved',
    'sent',
    'accepted',
    'revised',
    'declined',
    'expired',
    'superseded'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.booking_status AS ENUM (
    'provisional_hold',
    'awaiting_conditions',
    'confirmed',
    'in_progress',
    'completed',
    'rescheduling_requested',
    'rescheduled',
    'cancelled',
    'expired',
    'no_show'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.work_order_status AS ENUM (
    'draft',
    'ready',
    'assigned',
    'in_progress',
    'completion_pending',
    'completed',
    'blocked',
    'cancelled',
    'reopened'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.invoice_status AS ENUM (
    'draft',
    'issued',
    'partially_paid',
    'paid',
    'overdue',
    'void',
    'disputed'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles & RBAC
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role public.user_role_type NOT NULL DEFAULT 'customer',
  company_name TEXT,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Services & Server-Authoritative Pricing Rules
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  division public.service_division NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  instant_booking_eligible BOOLEAN NOT NULL DEFAULT false,
  form_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pricing_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  version INT NOT NULL,
  effective_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  effective_to TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(service_id, version)
);

CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pricing_version_id UUID REFERENCES public.pricing_versions(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL, -- 'base', 'per_km', 'per_m2', 'per_day', 'surcharge'
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  rate NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  unit TEXT NOT NULL DEFAULT 'ZMW',
  priority INT NOT NULL DEFAULT 0
);

-- 3. Service Requests (Replaces/extends basic quote_requests)
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  customer_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_division public.service_division NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  status public.request_status NOT NULL DEFAULT 'submitted',
  priority TEXT NOT NULL DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  contact_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  origin TEXT,
  destination TEXT,
  requested_start_at TIMESTAMPTZ,
  requested_end_at TIMESTAMPTZ,
  estimated_amount_min NUMERIC(14,2),
  estimated_amount_max NUMERIC(14,2),
  is_instant_eligible BOOLEAN NOT NULL DEFAULT false,
  guest_claim_token TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Quotations & Revisions (Management approval workflow)
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
  quote_number TEXT UNIQUE NOT NULL,
  current_revision INT NOT NULL DEFAULT 1,
  status public.quotation_status NOT NULL DEFAULT 'draft',
  currency TEXT NOT NULL DEFAULT 'ZMW',
  valid_until TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quotation_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  revision_number INT NOT NULL,
  scope_summary TEXT NOT NULL,
  pricing_version_id UUID REFERENCES public.pricing_versions(id),
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  tax_total NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  discount_total NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  total NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  terms TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(quotation_id, revision_number)
);

CREATE TABLE IF NOT EXISTS public.quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_id UUID NOT NULL REFERENCES public.quotation_revisions(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1.00,
  unit TEXT NOT NULL,
  unit_rate NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  line_total NUMERIC(14,2) NOT NULL DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS public.quotation_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_id UUID NOT NULL REFERENCES public.quotation_revisions(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES public.profiles(id),
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected', 'changes_requested')),
  reason TEXT,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Bookings & Resource Capacity (Anti-double booking)
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_code TEXT UNIQUE NOT NULL,
  asset_type TEXT NOT NULL, -- 'truck', 'trailer', 'tipper', 'excavator', 'grader', etc.
  name TEXT NOT NULL,
  registration_number TEXT,
  capacity_description TEXT,
  status TEXT NOT NULL DEFAULT 'available', -- 'available', 'maintenance', 'decommissioned'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT UNIQUE NOT NULL,
  request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
  accepted_revision_id UUID REFERENCES public.quotation_revisions(id) ON DELETE SET NULL,
  status public.booking_status NOT NULL DEFAULT 'provisional_hold',
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  hold_expires_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.booking_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE RESTRICT,
  allocation_start TIMESTAMPTZ NOT NULL,
  allocation_end TIMESTAMPTZ NOT NULL,
  allocation_status TEXT NOT NULL DEFAULT 'active'
);

-- 6. Work Orders & Delivery Execution
CREATE TABLE IF NOT EXISTS public.work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_number TEXT UNIQUE NOT NULL,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  status public.work_order_status NOT NULL DEFAULT 'ready',
  supervisor_id UUID REFERENCES public.profiles(id),
  planned_start_at TIMESTAMPTZ,
  planned_end_at TIMESTAMPTZ,
  actual_start_at TIMESTAMPTZ,
  actual_end_at TIMESTAMPTZ,
  instructions TEXT,
  completion_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.work_order_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  sequence INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  completed_at TIMESTAMPTZ
);

-- 7. Billing, Invoices & Manual Payment Records
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.profiles(id),
  status public.invoice_status NOT NULL DEFAULT 'issued',
  currency TEXT NOT NULL DEFAULT 'ZMW',
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  tax_total NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  total NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  amount_paid NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  balance_due NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  due_at TIMESTAMPTZ NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1.00,
  unit_rate NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  line_total NUMERIC(14,2) NOT NULL DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_reference TEXT UNIQUE NOT NULL,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
  amount NUMERIC(14,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ZMW',
  method TEXT NOT NULL, -- 'bank_transfer', 'cheque', 'cash', 'mobile_money_manual'
  reference_notes TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  recorded_by UUID REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'verified'
);

-- 8. Audit Logs & Status History
CREATE TABLE IF NOT EXISTS public.status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'service_request', 'quotation', 'booking', 'work_order', 'invoice'
  entity_id UUID NOT NULL,
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  actor_id UUID REFERENCES public.profiles(id),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Security: RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Anonymous public service read
CREATE POLICY "Public services read" ON public.services FOR SELECT USING (active = true);

-- Guest or authenticated service request insertion
CREATE POLICY "Anyone can submit service request" ON public.service_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can read all service requests" ON public.service_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can update service requests" ON public.service_requests FOR UPDATE TO authenticated USING (true);

-- Permissions grants
GRANT SELECT, INSERT ON public.services TO anon, authenticated;
GRANT SELECT, INSERT ON public.service_requests TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
