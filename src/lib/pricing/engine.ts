import { z } from "zod";
import {
  CARGO_BANDS,
  BUILDING_TYPES,
  CIVIL_TYPES,
  EQUIPMENT,
  routeDistance,
  CROSS_BORDER_SURCHARGE,
  RANGE_SPREAD,
  locationByKey,
  type DivisionKey,
} from "./quote-config";

export interface PricingLineItem {
  description: string;
  quantity: number;
  unit: string;
  unitRate: number;
  total: number;
}

export interface PricingCalculationResult {
  serviceDivision: DivisionKey;
  currency: "ZMW";
  calculatedAt: string;
  isIndicative: boolean;
  isInstantBookingEligible: boolean;
  lineItems: PricingLineItem[];
  subtotal: number;
  surcharges: number;
  tax: number; // e.g. 16% VAT standard if applicable
  discount: number;
  indicativeMin: number;
  indicativeMax: number;
  total: number;
  assumptions: string[];
  warnings?: string[];
}

export const pricingInputSchema = z.object({
  division: z.enum(["freight", "construction", "civil", "plant"]),
  // Freight specific
  band: z.string().optional(),
  origin: z.string().optional(),
  dest: z.string().optional(),
  loads: z.number().int().min(1).default(1),
  // Construction specific
  buildType: z.string().optional(),
  area: z.number().positive().optional(),
  // Civil specific
  civilType: z.string().optional(),
  civilQty: z.number().positive().optional(),
  // Plant hire specific
  equipment: z.string().optional(),
  quantity: z.number().int().min(1).default(1),
  days: z.number().int().min(1).default(1),
});

export type PricingInput = z.infer<typeof pricingInputSchema>;

/**
 * Server-authoritative Pricing Engine.
 * Implements PRD Section 5:
 * Calculates line-items, taxes, indicative ranges, and determines instant-booking eligibility.
 */
export function calculateAuthoritativePrice(input: PricingInput): PricingCalculationResult {
  const now = new Date().toISOString();

  if (input.division === "freight") {
    const band = CARGO_BANDS.find((b) => b.key === input.band);
    const distanceKm = routeDistance(input.origin, input.dest);

    if (!band || distanceKm === null) {
      return {
        serviceDivision: "freight",
        currency: "ZMW",
        calculatedAt: now,
        isIndicative: true,
        isInstantBookingEligible: false,
        lineItems: [],
        subtotal: 0,
        surcharges: 0,
        tax: 0,
        discount: 0,
        indicativeMin: 0,
        indicativeMax: 0,
        total: 0,
        assumptions: ["Standard Zambian corridor transit.", "Assessment required for custom corridor/unlisted destinations."],
        warnings: ["Route distance or cargo band not recognized for automatic pricing."],
      };
    }

    const isBorder =
      !!(locationByKey(input.origin) as { border?: boolean } | undefined)?.border ||
      !!(locationByKey(input.dest) as { border?: boolean } | undefined)?.border;

    const baseHaulage = Math.max(band.minimum, distanceKm * band.ratePerKm) * Math.max(1, input.loads);
    const surchargeAmount = isBorder ? baseHaulage * CROSS_BORDER_SURCHARGE : 0;
    const subtotal = baseHaulage + surchargeAmount;

    const lineItems: PricingLineItem[] = [
      {
        description: `Haulage (${band.label}) - ${distanceKm} km × ${input.loads} load(s)`,
        quantity: distanceKm * input.loads,
        unit: "km-load",
        unitRate: band.ratePerKm,
        total: Math.round(baseHaulage),
      },
    ];

    if (isBorder) {
      lineItems.push({
        description: "Cross-Border Transit Surcharge (Clearance & Corridor tariff)",
        quantity: 1,
        unit: "fixed",
        unitRate: surchargeAmount,
        total: Math.round(surchargeAmount),
      });
    }

    return {
      serviceDivision: "freight",
      currency: "ZMW",
      calculatedAt: now,
      isIndicative: true,
      // Freight on established Zambian corridors with standard cargo is instant-booking eligible
      isInstantBookingEligible: !isBorder && distanceKm <= 600,
      lineItems,
      subtotal: Math.round(subtotal),
      surcharges: Math.round(surchargeAmount),
      tax: 0, // VAT quoted separately based on client tax status
      discount: 0,
      indicativeMin: Math.round(subtotal * (1 - RANGE_SPREAD)),
      indicativeMax: Math.round(subtotal * (1 + RANGE_SPREAD)),
      total: Math.round(subtotal),
      assumptions: [
        `Distance estimated at ≈ ${distanceKm} km along national paved highway.`,
        "Loading and offloading demurrage limits apply (3 hrs included).",
        "Subject to road-worthiness and standard transit insurance.",
      ],
    };
  }

  if (input.division === "construction") {
    const building = BUILDING_TYPES.find((b) => b.key === input.buildType);
    const area = input.area || 0;

    if (!building || area <= 0) {
      return {
        serviceDivision: "construction",
        currency: "ZMW",
        calculatedAt: now,
        isIndicative: true,
        isInstantBookingEligible: false,
        lineItems: [],
        subtotal: 0,
        surcharges: 0,
        tax: 0,
        discount: 0,
        indicativeMin: 0,
        indicativeMax: 0,
        total: 0,
        assumptions: ["Site assessment and geotechnical review required."],
      };
    }

    const avgRate = (building.perM2[0] + building.perM2[1]) / 2;
    const subtotal = avgRate * area;

    return {
      serviceDivision: "construction",
      currency: "ZMW",
      calculatedAt: now,
      isIndicative: true,
      // Construction projects always require management assessment & site review (PRD Section 4.1)
      isInstantBookingEligible: false,
      lineItems: [
        {
          description: `Superstructure & Finishes (${building.label}) - ${area} m²`,
          quantity: area,
          unit: "m²",
          unitRate: avgRate,
          total: Math.round(subtotal),
        },
      ],
      subtotal: Math.round(subtotal),
      surcharges: 0,
      tax: 0,
      discount: 0,
      indicativeMin: Math.round(building.perM2[0] * area),
      indicativeMax: Math.round(building.perM2[1] * area),
      total: Math.round(subtotal),
      assumptions: [
        "Bill of Quantities (BoQ) to be finalized after architectural drawing review.",
        "Site preparation and water connection included conditionally.",
      ],
    };
  }

  if (input.division === "civil") {
    const civil = CIVIL_TYPES.find((c) => c.key === input.civilType);
    const qty = input.civilQty || 0;

    if (!civil || qty <= 0) {
      return {
        serviceDivision: "civil",
        currency: "ZMW",
        calculatedAt: now,
        isIndicative: true,
        isInstantBookingEligible: false,
        lineItems: [],
        subtotal: 0,
        surcharges: 0,
        tax: 0,
        discount: 0,
        indicativeMin: 0,
        indicativeMax: 0,
        total: 0,
        assumptions: ["Site inspection and ground survey mandatory."],
      };
    }

    const avgRate = (civil.rate[0] + civil.rate[1]) / 2;
    const subtotal = avgRate * qty;

    return {
      serviceDivision: "civil",
      currency: "ZMW",
      calculatedAt: now,
      isIndicative: true,
      isInstantBookingEligible: false,
      lineItems: [
        {
          description: `${civil.label} - ${qty} ${civil.unit}`,
          quantity: qty,
          unit: civil.unit,
          unitRate: avgRate,
          total: Math.round(subtotal),
        },
      ],
      subtotal: Math.round(subtotal),
      surcharges: 0,
      tax: 0,
      discount: 0,
      indicativeMin: Math.round(civil.rate[0] * qty),
      indicativeMax: Math.round(civil.rate[1] * qty),
      total: Math.round(subtotal),
      assumptions: [
        "Topography and soil testing report required prior to mobilization.",
      ],
    };
  }

  // Plant hire
  const equip = EQUIPMENT.find((e) => e.key === input.equipment);
  const days = input.days || 1;
  const qty = input.quantity || 1;

  if (!equip || days <= 0) {
    return {
      serviceDivision: "plant",
      currency: "ZMW",
      calculatedAt: now,
      isIndicative: true,
      isInstantBookingEligible: false,
      lineItems: [],
      subtotal: 0,
      surcharges: 0,
      tax: 0,
      discount: 0,
      indicativeMin: 0,
      indicativeMax: 0,
      total: 0,
      assumptions: ["Equipment availability check required."],
    };
  }

  const avgPerDay = (equip.perDay[0] + equip.perDay[1]) / 2;
  const subtotal = avgPerDay * days * qty;

  return {
    serviceDivision: "plant",
    currency: "ZMW",
    calculatedAt: now,
    isIndicative: true,
    // Plant hire is eligible for instant reservation hold if duration is defined
    isInstantBookingEligible: true,
    lineItems: [
      {
        description: `${equip.label} Wet Hire (${qty} unit(s) × ${days} day(s))`,
        quantity: qty * days,
        unit: "unit-day",
        unitRate: avgPerDay,
        total: Math.round(subtotal),
      },
    ],
    subtotal: Math.round(subtotal),
    surcharges: 0,
    tax: 0,
    discount: 0,
    indicativeMin: Math.round(equip.perDay[0] * days * qty),
    indicativeMax: Math.round(equip.perDay[1] * days * qty),
    total: Math.round(subtotal),
    assumptions: [
      "Certified operator and standard maintenance included.",
      "Fuel/diesel policy based on site consumption or wet-lease contract.",
      "Mobilization and lowbed float charges calculated upon site confirmation.",
    ],
  };
}
