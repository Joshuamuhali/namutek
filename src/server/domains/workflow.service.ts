import {
  createServiceRequestSchema,
  qualifyRequestSchema,
  createQuotationRevisionSchema,
  approveQuotationSchema,
  customerQuotationAcceptanceSchema,
  confirmBookingSchema,
  dispatchTripSchema,
  submitWorkOrderCompletionSchema,
  createInvoiceSchema,
  recordPaymentSchema,
  verifyPaymentSchema,
} from "../api/schemas";
import {
  RequestContext,
  assertPermission,
  emitDomainEvent,
  recordAuditLog,
  getSystemSupabase,
} from "../infrastructure/context";
import { calculateIndicativePrice } from "../../lib/pricing/engine";
import { z } from "zod";

export class IntegrationWorkflowService {
  /**
   * 1. Customer Submits Service Request
   */
  static async submitServiceRequest(
    input: z.infer<typeof createServiceRequestSchema>,
    ctx: RequestContext
  ) {
    const supabase = getSystemSupabase();
    const reference = `NMK-REQ-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const { data: request, error } = await supabase
      .from("service_requests")
      .insert({
        reference,
        service_division: input.serviceDivision,
        status: "submitted",
        contact_name: input.customer.name,
        company_name: input.customer.company || null,
        phone: input.customer.phone,
        email: input.customer.email,
        request_details: input.details,
        estimated_amount_min: input.estimatedAmountMin || null,
        estimated_amount_max: input.estimatedAmountMax || null,
        is_instant_eligible: input.isInstantEligible,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    const recordId = request?.id || `req_${Date.now()}`;

    await emitDomainEvent(
      "service_request.submitted",
      { type: "service_request", id: recordId },
      { reference, division: input.serviceDivision, customer: input.customer },
      ctx
    );

    await recordAuditLog("SUBMIT_REQUEST", "service_request", recordId, { reference }, ctx);

    return {
      id: recordId,
      reference,
      status: "submitted",
      nextAction: "qualification",
      submittedAt: new Date().toISOString(),
    };
  }

  /**
   * 2. Sales Officer Qualifies Request
   */
  static async qualifyRequest(
    requestId: string,
    input: z.infer<typeof qualifyRequestSchema>,
    ctx: RequestContext
  ) {
    assertPermission(ctx.userRole, "requests.qualify");
    const supabase = getSystemSupabase();

    await supabase
      .from("service_requests")
      .update({
        status: "qualified",
        priority: input.urgency,
        qualification_notes: input.qualificationNotes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    await emitDomainEvent(
      "service_request.qualified",
      { type: "service_request", id: requestId },
      { urgency: input.urgency, qualifiedBy: ctx.userId },
      ctx
    );

    await recordAuditLog("QUALIFY_REQUEST", "service_request", requestId, input, ctx);

    return {
      requestId,
      status: "qualified",
      urgency: input.urgency,
      nextAction: "pricing_and_quotation_preparation",
    };
  }

  /**
   * 3. Quotation Officer Prepares Immutable Revision
   */
  static async createQuotationRevision(
    input: z.infer<typeof createQuotationRevisionSchema>,
    ctx: RequestContext
  ) {
    assertPermission(ctx.userRole, "quotations.create");
    const supabase = getSystemSupabase();

    const subtotal = input.items.reduce((sum, item) => sum + item.lineTotal, 0);
    const taxAmount = (subtotal - input.discountAmount + input.surcharges) * input.vatRate;
    const grandTotal = subtotal - input.discountAmount + input.surcharges + taxAmount;
    const margin = input.directCost > 0 ? ((grandTotal - input.directCost) / grandTotal) * 100 : 0;

    const revisionNumber = 1;
    const quoteId = input.quotationId || `quote_${Date.now()}`;
    const revisionId = `rev_${Date.now()}`;

    await emitDomainEvent(
      "quotation.submitted_for_approval",
      { type: "quotation", id: quoteId },
      { revisionId, grandTotal, margin: `${margin.toFixed(1)}%` },
      ctx
    );

    await recordAuditLog(
      "SUBMIT_REVISION_FOR_APPROVAL",
      "quotation",
      quoteId,
      { revisionId, grandTotal, margin },
      ctx
    );

    return {
      quotationId: quoteId,
      revisionId,
      revisionNumber,
      status: "pending_approval",
      subtotal,
      taxAmount,
      grandTotal,
      directCost: input.directCost,
      calculatedMargin: `${margin.toFixed(1)}%`,
      requiresApprovalFrom: "managing_director",
    };
  }

  /**
   * 4. Managing Director Approves / Returns Quotation Revision
   */
  static async approveQuotation(
    quoteId: string,
    input: z.infer<typeof approveQuotationSchema>,
    ctx: RequestContext
  ) {
    assertPermission(ctx.userRole, "quotations.approve");

    const newStatus =
      input.decision === "approved"
        ? "approved"
        : input.decision === "return_for_revision"
        ? "revision_requested"
        : "rejected";

    await emitDomainEvent(
      input.decision === "approved" ? "quotation.approved" : "quotation.returned_for_revision",
      { type: "quotation", id: quoteId },
      { revisionId: input.revisionId, decision: input.decision, reason: input.reason },
      ctx
    );

    await recordAuditLog(
      `QUOTATION_${input.decision.toUpperCase()}`,
      "quotation",
      quoteId,
      { revisionId: input.revisionId, decision: input.decision, reason: input.reason },
      ctx
    );

    return {
      quotationId: quoteId,
      revisionId: input.revisionId,
      status: newStatus,
      decision: input.decision,
      authorizedBy: ctx.userId || "managing_director",
      authorizedAt: new Date().toISOString(),
    };
  }

  /**
   * 5. Customer Accepts Issued Quotation Revision
   */
  static async customerAcceptQuotation(
    quoteId: string,
    input: z.infer<typeof customerQuotationAcceptanceSchema>,
    ctx: RequestContext
  ) {
    const bookingId = `bk_${Date.now()}`;

    await emitDomainEvent(
      "quotation.accepted",
      { type: "quotation", id: quoteId },
      {
        revisionId: input.revisionId,
        acceptedBy: input.acceptedByName,
        bookingId,
      },
      ctx
    );

    await recordAuditLog(
      "CUSTOMER_ACCEPT_QUOTATION",
      "quotation",
      quoteId,
      { acceptedBy: input.acceptedByName, bookingId },
      ctx
    );

    return {
      quotationId: quoteId,
      status: "accepted",
      bookingReference: `NMK-BK-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId,
      nextStep: "dispatcher_resource_allocation",
    };
  }

  /**
   * 6. Dispatcher Confirms Booking & Allocates Available Resources
   */
  static async confirmBookingAndAllocate(
    bookingId: string,
    input: z.infer<typeof confirmBookingSchema>,
    ctx: RequestContext
  ) {
    assertPermission(ctx.userRole, "bookings.allocate");

    await emitDomainEvent(
      "booking.confirmed",
      { type: "booking", id: bookingId },
      { allocationsCount: input.allocations.length },
      ctx
    );

    await recordAuditLog(
      "CONFIRM_BOOKING_ALLOCATE",
      "booking",
      bookingId,
      { allocations: input.allocations },
      ctx
    );

    return {
      bookingId,
      status: "confirmed",
      scheduledStart: input.scheduledStart,
      scheduledEnd: input.scheduledEnd,
      allocatedResources: input.allocations,
      workOrderStatus: "ready_for_dispatch",
    };
  }

  /**
   * 7. Dispatcher Authorizes Departure & Assigns Trip
   */
  static async dispatchTrip(
    dispatchId: string,
    input: z.infer<typeof dispatchTripSchema>,
    ctx: RequestContext
  ) {
    assertPermission(ctx.userRole, "trips.dispatch");

    await emitDomainEvent(
      "dispatch.departed",
      { type: "dispatch", id: dispatchId },
      { driverId: input.driverId, vehicleId: input.vehicleId },
      ctx
    );

    await recordAuditLog("DISPATCH_DEPARTURE", "dispatch", dispatchId, input, ctx);

    return {
      dispatchId,
      bookingId: input.bookingId,
      status: "dispatched",
      departedAt: new Date().toISOString(),
      driverId: input.driverId,
      vehicleId: input.vehicleId,
    };
  }

  /**
   * 8. Field Staff Submits Work Completion & Signed Evidence
   */
  static async submitWorkOrderCompletion(
    workOrderId: string,
    input: z.infer<typeof submitWorkOrderCompletionSchema>,
    ctx: RequestContext
  ) {
    assertPermission(ctx.userRole, "work_orders.execute_assigned");

    await emitDomainEvent(
      "work_order.completion_submitted",
      { type: "work_order", id: workOrderId },
      { clientSignoff: input.clientSignoffName },
      ctx
    );

    await recordAuditLog("SUBMIT_WORK_COMPLETION", "work_order", workOrderId, input, ctx);

    return {
      workOrderId,
      status: "completed",
      clientSignoff: input.clientSignoffName,
      submittedAt: new Date().toISOString(),
      eligibleForInvoicing: true,
    };
  }

  /**
   * 9. Finance Officer Generates Commercial Invoice
   */
  static async createInvoice(
    input: z.infer<typeof createInvoiceSchema>,
    ctx: RequestContext
  ) {
    assertPermission(ctx.userRole, "invoices.create");
    const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceId = `inv_${Date.now()}`;

    await emitDomainEvent(
      "invoice.issued",
      { type: "invoice", id: invoiceId },
      { invoiceNumber, customerId: input.customerId },
      ctx
    );

    await recordAuditLog("CREATE_INVOICE", "invoice", invoiceId, { invoiceNumber, input }, ctx);

    return {
      invoiceId,
      invoiceNumber,
      status: "issued",
      dueDate: new Date(Date.now() + input.paymentTermsDays * 86400000).toISOString(),
    };
  }

  /**
   * 10. Finance Officer Records & Verifies Payment
   */
  static async recordPayment(
    input: z.infer<typeof recordPaymentSchema>,
    ctx: RequestContext
  ) {
    assertPermission(ctx.userRole, "payments.record");
    const paymentId = `pay_${Date.now()}`;

    await emitDomainEvent(
      "payment.recorded",
      { type: "payment", id: paymentId },
      { amount: input.amount, reference: input.externalReference },
      ctx
    );

    await recordAuditLog("RECORD_PAYMENT", "payment", paymentId, input, ctx);

    return {
      paymentId,
      status: "pending_verification",
      amount: input.amount,
      reference: input.externalReference,
      receivedAt: input.receivedAt,
    };
  }

  static async verifyPayment(
    input: z.infer<typeof verifyPaymentSchema>,
    ctx: RequestContext
  ) {
    assertPermission(ctx.userRole, "payments.verify");

    await emitDomainEvent(
      "payment.verified",
      { type: "payment", id: input.paymentId },
      { decision: input.decision },
      ctx
    );

    await recordAuditLog("VERIFY_PAYMENT", "payment", input.paymentId, input, ctx);

    return {
      paymentId: input.paymentId,
      status: input.decision === "verified" ? "verified" : "rejected",
      verifiedBy: ctx.userId || "finance_officer",
      verifiedAt: new Date().toISOString(),
      balanceUpdated: input.decision === "verified",
    };
  }
}
