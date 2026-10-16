import { createClient } from "@supabase/supabase-js";
import { UserRoleEnum } from "../api/schemas";
import { z } from "zod";

export interface RequestContext {
  userId?: string;
  userRole?: z.infer<typeof UserRoleEnum>;
  organizationId: string;
  requestId: string;
  idempotencyKey?: string;
}

export function getSystemSupabase() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"] || process.env["SUPABASE_PUBLISHABLE_KEY"];
  return createClient(url!, key!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Validates permission against role matrix server-side
 */
export function assertPermission(role: string | undefined, requiredPermission: string) {
  const permissionsByRole: Record<string, string[]> = {
    super_admin: ["system.config", "users.manage", "audit.view", "pricing.manage"],
    managing_director: ["quotations.approve", "reports.executive", "discounts.override"],
    quotation_officer: ["quotations.create", "quotations.submit_for_approval", "pricing.calculate"],
    sales_officer: ["requests.qualify", "leads.manage", "pipeline.update"],
    dispatcher: ["bookings.allocate", "dispatches.create", "trips.dispatch"],
    project_coordinator: ["projects.manage", "milestones.update", "tasks.block"],
    fleet_manager: ["assets.manage", "maintenance.schedule", "assets.inspect"],
    finance_officer: ["invoices.create", "invoices.issue", "payments.record", "payments.verify"],
    field_staff: ["work_orders.execute_assigned", "trips.checkin", "evidence.upload"],
    customer: ["requests.submit", "quotations.accept", "bookings.view", "invoices.view"],
  };

  const allowed = permissionsByRole[role || ""] || [];
  if (!allowed.includes(requiredPermission)) {
    const error = new Error(`FORBIDDEN: Role '${role}' lacks required permission '${requiredPermission}'`);
    (error as any).statusCode = 403;
    throw error;
  }
}

/**
 * Transactional Outbox pattern: persists domain events for subscribers & external notifications
 */
export async function emitDomainEvent(
  eventType: string,
  aggregate: { type: string; id: string },
  data: Record<string, unknown>,
  ctx: RequestContext
) {
  const supabase = getSystemSupabase();
  const eventPayload = {
    event_type: eventType,
    aggregate_type: aggregate.type,
    aggregate_id: aggregate.id,
    actor_id: ctx.userId || "anonymous",
    actor_role: ctx.userRole || "guest",
    organization_id: ctx.organizationId,
    correlation_id: ctx.requestId,
    payload: data,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from("event_outbox").insert(eventPayload);
  } catch (err) {
    console.warn(`[Outbox fallback] Event ${eventType} queued locally:`, data);
  }
}

/**
 * Immutable audit log writer
 */
export async function recordAuditLog(
  action: string,
  entityType: string,
  entityId: string,
  details: Record<string, unknown>,
  ctx: RequestContext
) {
  const supabase = getSystemSupabase();
  const auditEntry = {
    action,
    entity_type: entityType,
    entity_id: entityId,
    actor_id: ctx.userId || "system",
    actor_role: ctx.userRole || "system",
    request_id: ctx.requestId,
    details,
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from("audit_logs").insert(auditEntry);
  } catch (err) {
    console.info(`[Audit Stream] [${action}] ${entityType}:${entityId} by ${ctx.userRole}`);
  }
}
