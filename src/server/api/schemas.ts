import { z } from "zod";

// Base Envelope schemas
export const metaSchema = z.object({
  requestId: z.string(),
  pagination: z
    .object({
      page: z.number().int().min(1),
      pageSize: z.number().int().min(1),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
    })
    .optional(),
});

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    fieldErrors: z.record(z.string()).optional(),
  }),
  meta: metaSchema,
});

// Enums conforming to PRD schema & migration 0002
export const UserRoleEnum = z.enum([
  "super_admin",
  "managing_director",
  "quotation_officer",
  "sales_officer",
  "dispatcher",
  "project_coordinator",
  "fleet_manager",
  "finance_officer",
  "field_staff",
  "customer",
]);

export const ServiceDivisionEnum = z.enum(["freight", "construction", "civil", "plant"]);

export const ServiceRequestStatusEnum = z.enum([
  "draft",
  "submitted",
  "under_review",
  "awaiting_customer_information",
  "qualified",
  "quotation_in_progress",
  "quoted",
  "converted",
  "rejected",
  "cancelled",
  "closed",
]);

export const QuotationStatusEnum = z.enum([
  "draft",
  "pending_approval",
  "revision_requested",
  "approved",
  "issued",
  "accepted",
  "declined",
  "expired",
  "withdrawn",
]);

export const BookingStatusEnum = z.enum([
  "draft",
  "pending_confirmation",
  "confirmed",
  "reschedule_requested",
  "in_progress",
  "completed",
  "cancelled",
]);

export const AssetStatusEnum = z.enum([
  "available",
  "reserved",
  "allocated",
  "under_maintenance",
  "out_of_service",
]);

export const WorkOrderStatusEnum = z.enum([
  "draft",
  "ready",
  "assigned",
  "in_progress",
  "blocked",
  "completion_submitted",
  "completed",
  "cancelled",
]);

export const InvoiceStatusEnum = z.enum([
  "draft",
  "issued",
  "partially_paid",
  "paid",
  "overdue",
  "voided",
]);

export const PaymentVerificationStatusEnum = z.enum([
  "recorded",
  "pending_verification",
  "verified",
  "rejected",
  "reversed",
]);

// 1. Service Request Create Contract
export const createServiceRequestSchema = z.object({
  serviceDivision: ServiceDivisionEnum,
  customer: z.object({
    type: z.enum(["guest", "registered"]),
    name: z.string().min(2),
    phone: z.string().min(7),
    email: z.string().email(),
    company: z.string().optional(),
  }),
  details: z.record(z.unknown()),
  estimatedAmountMin: z.number().optional(),
  estimatedAmountMax: z.number().optional(),
  isInstantEligible: z.boolean().default(false),
  notes: z.string().optional(),
});

// 2. Request Qualify Contract
export const qualifyRequestSchema = z.object({
  salesOwnerId: z.string().uuid().optional(),
  qualificationNotes: z.string().min(3),
  verifiedScope: z.record(z.unknown()),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
});

// 3. Price Calculation Contract
export const priceCalculationRequestSchema = z.object({
  serviceDivision: ServiceDivisionEnum,
  pricingVersion: z.string().default("v1.4.2"),
  inputs: z.record(z.unknown()),
  context: z
    .object({
      requestId: z.string().optional(),
      customerId: z.string().optional(),
    })
    .optional(),
});

// 4. Quotation Create & Revision Contract
export const createQuotationRevisionSchema = z.object({
  quotationId: z.string().uuid().optional(),
  requestId: z.string().uuid(),
  pricingVersion: z.string().default("v1.4.2"),
  items: z.array(
    z.object({
      code: z.string(),
      description: z.string(),
      unit: z.string(),
      quantity: z.number().positive(),
      unitRate: z.number().nonnegative(),
      lineTotal: z.number().nonnegative(),
    })
  ).min(1),
  directCost: z.number().nonnegative(),
  currency: z.literal("ZMW").default("ZMW"),
  vatRate: z.number().default(0.16),
  discountAmount: z.number().default(0),
  surcharges: z.number().default(0),
  validityDays: z.number().int().min(1).default(14),
  termsAndConditions: z.string().optional(),
  notes: z.string().optional(),
  riskFlags: z.array(z.string()).default([]),
});

// 5. Managing Director Approval Command
export const approveQuotationSchema = z.object({
  revisionId: z.string().uuid(),
  decision: z.enum(["approved", "rejected", "return_for_revision"]),
  reason: z.string().min(3),
  marginConcessionApproved: z.boolean().default(false),
});

// 6. Customer Acceptance Command
export const customerQuotationAcceptanceSchema = z.object({
  revisionId: z.string().uuid(),
  acceptedByName: z.string().min(2),
  acceptedByRole: z.string().optional(),
  acceptanceMethod: z.enum(["customer_portal", "email_signed", "physical_concession"]).default("customer_portal"),
  requestedStartDate: z.string().optional(),
});

// 7. Booking Confirm & Resource Allocation Command
export const confirmBookingSchema = z.object({
  quotationId: z.string().uuid(),
  quotationRevisionId: z.string().uuid(),
  scheduledStart: z.string(),
  scheduledEnd: z.string(),
  allocations: z.array(
    z.object({
      resourceType: z.enum(["vehicle", "driver", "plant_machinery", "crew"]),
      resourceId: z.string().uuid(),
      notes: z.string().optional(),
    })
  ).default([]),
  notes: z.string().optional(),
});

// 8. Dispatch Assignment & Departure Command
export const dispatchTripSchema = z.object({
  bookingId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  driverId: z.string().uuid(),
  plannedDeparture: z.string(),
  departureChecklist: z.object({
    vehicleInspected: z.boolean(),
    cargoSecured: z.boolean(),
    documentsAvailable: z.boolean(),
  }),
  odometerStartKm: z.number().optional(),
  notes: z.string().optional(),
});

// 9. Work Order Completion & Evidence Command
export const submitWorkOrderCompletionSchema = z.object({
  workOrderId: z.string().uuid(),
  completionEvidenceIds: z.array(z.string().uuid()).min(1),
  clientSignoffName: z.string().min(2),
  clientSignoffSignatureUrl: z.string().optional(),
  notes: z.string().optional(),
});

// 10. Commercial Invoice Generation Command
export const createInvoiceSchema = z.object({
  billableSourceType: z.enum(["quotation", "booking", "work_order"]),
  billableSourceId: z.string().uuid(),
  customerId: z.string().uuid(),
  paymentTermsDays: z.number().int().default(14),
  taxAmount: z.number().nonnegative(),
  notes: z.string().optional(),
});

// 11. Payment Record & Verification Command
export const recordPaymentSchema = z.object({
  customerId: z.string().uuid(),
  invoiceId: z.string().uuid().optional(),
  amount: z.number().positive(),
  currency: z.literal("ZMW").default("ZMW"),
  method: z.enum(["bank_transfer", "mobile_money", "cash", "cheque"]),
  externalReference: z.string().min(3),
  evidenceDocumentId: z.string().uuid().optional(),
  receivedAt: z.string(),
  notes: z.string().optional(),
});

export const verifyPaymentSchema = z.object({
  paymentId: z.string().uuid(),
  decision: z.enum(["verified", "rejected"]),
  reason: z.string().min(3),
  bankStatementReference: z.string().optional(),
});
