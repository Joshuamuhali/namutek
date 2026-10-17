import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  return createClient(url!, key!, { auth: { persistSession: false, autoRefreshToken: false } });
}

export interface DashboardMetric {
  newRequestsCount: number;
  quotationsPendingCount: number;
  todayBookingsCount: number;
  unpaidInvoicesCount: number;
}

/**
 * PRD Section 10.3: Admin dashboard high-level metric counts & live queues
 */
export const getAdminMetricsFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabase();

  // Try service_requests first, fallback to quote_requests
  let requestsCount = 0;
  const { count: sReqCount } = await supabase.from("service_requests").select("*", { count: "exact", head: true });
  if (sReqCount !== null) {
    requestsCount = sReqCount;
  } else {
    const { count: qCount } = await supabase.from("quote_requests").select("*", { count: "exact", head: true });
    requestsCount = qCount || 0;
  }

  // Quotations awaiting approval
  const { count: quotesCount } = await supabase
    .from("quotations")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending_approval");

  // Active bookings
  const { count: bookingsCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .in("status", ["confirmed", "in_progress"]);

  // Invoices
  const { count: invoicesCount } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .in("status", ["issued", "overdue"]);

  return {
    newRequestsCount: requestsCount,
    quotationsPendingCount: quotesCount || 0,
    todayBookingsCount: bookingsCount || 0,
    unpaidInvoicesCount: invoicesCount || 0,
  } satisfies DashboardMetric;
});

/**
 * PRD Section 8.2: List recent requests for operational queues
 */
export const getRecentRequestsFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabase();

  // First try service_requests
  const { data: sData } = await supabase
    .from("service_requests")
    .select("*")
    .order("submitted_at", { ascending: false })
    .limit(20);

  if (sData && sData.length > 0) {
    return sData.map((r: any) => ({
      id: r.id,
      reference: r.reference,
      division: r.service_division,
      contactName: r.contact_name,
      company: r.company_name,
      phone: r.phone,
      status: r.status,
      priority: r.priority,
      submittedAt: r.submitted_at,
      estimateMin: r.estimated_amount_min,
      estimateMax: r.estimated_amount_max,
      isInstantEligible: r.is_instant_eligible,
    }));
  }

  // Fallback to quote_requests
  const { data: qData } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  return (qData || []).map((q: any) => ({
    id: q.id,
    reference: q.extra?.reference || `REQ-${q.id.slice(0, 8)}`,
    division: q.service_type,
    contactName: q.contact_name,
    company: q.company_name,
    phone: q.phone,
    status: q.status || "submitted",
    priority: "normal",
    submittedAt: q.created_at,
    estimateMin: q.estimate_min,
    estimateMax: q.estimate_max,
    isInstantEligible: !!q.extra?.is_instant_eligible,
  }));
});

/**
 * PRD Section 4.3 & 9.3: Quotation draft creation & approval workflow
 */
export const updateQuotationStatusFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        quotationId: z.string(),
        decision: z.enum(["approved", "rejected", "changes_requested"]),
        reason: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = getSupabase();
    const newStatus = data.decision === "approved" ? "approved" : "draft";

    const { error } = await supabase
      .from("quotations")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", data.quotationId);

    if (error) {
      throw new Error(`Failed to update quotation: ${error.message}`);
    }

    return { ok: true, status: newStatus };
  });

/**
 * PRD Section 8.1: Track request status by Reference (Guest & Customer Lookup)
 */
export const lookupRequestStatusFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ reference: z.string().trim().min(3) }).parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = getSupabase();

    // Query service_requests by reference
    const { data: sReq } = await supabase
      .from("service_requests")
      .select("id, reference, service_division, status, submitted_at, estimated_amount_min, estimated_amount_max, contact_name")
      .eq("reference", data.reference)
      .maybeSingle();

    if (sReq) {
      return { found: true, request: sReq };
    }

    // Check quote_requests table
    const { data: qData } = await supabase
      .from("quote_requests")
      .select("id, service_type, status, created_at, estimate_min, estimate_max, contact_name, extra")
      .limit(100);

    const match = (qData || []).find((q: any) => q.extra?.reference === data.reference || q.id === data.reference);

    if (match) {
      return {
        found: true,
        request: {
          id: match.id,
          reference: match.extra?.reference || match.id,
          service_division: match.service_type,
          status: match.status,
          submitted_at: match.created_at,
          estimated_amount_min: match.estimate_min,
          estimated_amount_max: match.estimate_max,
          contact_name: match.contact_name,
        },
      };
    }

    return { found: false, request: null };
  });
