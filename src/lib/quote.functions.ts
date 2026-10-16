import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { calculateAuthoritativePrice, pricingInputSchema } from "./pricing/engine";

const requestInputSchema = z.object({
  division: z.enum(["freight", "construction", "civil", "plant"]),
  origin: z.string().trim().max(200).optional(),
  destination: z.string().trim().max(200).optional(),
  contactName: z.string().trim().min(2, "Please enter your name").max(120),
  companyName: z.string().trim().max(160).optional(),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  email: z.string().trim().email("Please enter a valid email address").max(255).optional().or(z.literal("")),
  projectDetails: z.string().trim().min(5, "Please provide brief details").max(2000),
  pricingParams: pricingInputSchema,
  requestedDate: z.string().optional(),
});

export type ServiceRequestInput = z.infer<typeof requestInputSchema>;

function getSupabaseClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) {
    throw new Error("Missing Supabase configuration");
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function generateReference(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `NMT-${year}-${rand}`;
}

/**
 * Server function to calculate authoritative estimate snapshot (PRD 5.1 & 8.1)
 */
export const calculateEstimateFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => pricingInputSchema.parse(data))
  .handler(async ({ data }) => {
    return calculateAuthoritativePrice(data);
  });

/**
 * Server function to submit a structured service request with server pricing (PRD 8.1)
 */
export const submitServiceRequestFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => requestInputSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = getSupabaseClient();
    const reference = generateReference();

    // 1. Calculate authoritative estimate on server
    const pricing = calculateAuthoritativePrice(data.pricingParams);

    // 2. Prepare payload for service_requests
    const insertPayload = {
      reference,
      service_division: data.division,
      status: "submitted",
      priority: "normal",
      contact_name: data.contactName,
      company_name: data.companyName || null,
      phone: data.phone,
      email: data.email || null,
      specifications: {
        details: data.projectDetails,
        pricingInput: data.pricingParams,
        calculatedPrice: pricing,
      },
      origin: data.origin || null,
      destination: data.destination || null,
      requested_start_at: data.requestedDate ? new Date(data.requestedDate).toISOString() : null,
      estimated_amount_min: pricing.indicativeMin || null,
      estimated_amount_max: pricing.indicativeMax || null,
      is_instant_eligible: pricing.isInstantBookingEligible,
      guest_claim_token: Math.random().toString(36).substring(2, 15),
    };

    // Try inserting into new service_requests table; fallback gracefully to quote_requests if migration pending
    let dbSuccess = false;
    let fallbackError: string | null = null;

    try {
      const { error: reqError } = await supabase.from("service_requests").insert(insertPayload);
      if (!reqError) {
        dbSuccess = true;
      } else {
        fallbackError = reqError.message;
      }
    } catch {
      // Table might not exist yet, fallback below
    }

    if (!dbSuccess) {
      // Fallback insert to quote_requests so existing systems do not lose customer inquiries
      const { error: quoteErr } = await supabase.from("quote_requests").insert({
        service_type: data.division,
        origin: data.origin || null,
        destination: data.destination || null,
        contact_name: data.contactName,
        company_name: data.companyName || null,
        phone: data.phone,
        email: data.email || null,
        project_details: data.projectDetails,
        extra: {
          reference,
          specifications: insertPayload.specifications,
          is_instant_eligible: pricing.isInstantBookingEligible,
        },
        estimate_min: pricing.indicativeMin || null,
        estimate_max: pricing.indicativeMax || null,
      });

      if (quoteErr) {
        throw new Error(quoteErr.message || fallbackError || "Failed to record your request.");
      }
    }

    return {
      ok: true,
      reference,
      status: "submitted",
      isInstantEligible: pricing.isInstantBookingEligible,
      pricing,
    };
  });

/**
 * Backward compatible export for existing components
 */
export const submitQuoteRequest = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    return submitServiceRequestFn({
      data: {
        division: data.serviceType || "freight",
        origin: data.origin,
        destination: data.destination,
        contactName: data.contactName,
        companyName: data.companyName,
        phone: data.phone,
        email: data.email,
        projectDetails: data.projectDetails,
        pricingParams: {
          division: data.serviceType || "freight",
          band: data.extra?.band,
          origin: data.origin,
          dest: data.destination,
          loads: Number(data.extra?.loads || 1),
          buildType: data.extra?.buildType,
          area: Number(data.extra?.area || 0),
          civilType: data.extra?.civilType,
          civilQty: Number(data.extra?.civilQty || 0),
          equipment: data.extra?.equipment,
          quantity: Number(data.extra?.quantity || 1),
          days: Number(data.extra?.days || 1),
        },
      },
    });
  });
