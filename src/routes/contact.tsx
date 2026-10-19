import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { CTABand, PHONES, PhoneLinks } from "@/components/shared";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

const WHATSAPP_NUMBER = "260966445513";

function whatsappMessage(enquiry: {
  serviceType: string;
  origin: string;
  destination: string;
  contactName: string;
  companyName?: string;
  phone: string;
  email?: string;
  extraDetails: string[];
  projectDetails: string;
}): string {
  const lines = [
    "Namutek Logistics — Quotation Enquiry",
    "",
    `Service: ${enquiry.serviceType}`,
    `Origin: ${enquiry.origin || "Not specified"}`,
    `Destination: ${enquiry.destination || "Not specified"}`,
    `Name: ${enquiry.contactName}`,
    enquiry.companyName ? `Company: ${enquiry.companyName}` : null,
    `Phone: ${enquiry.phone}`,
    enquiry.email ? `Email: ${enquiry.email}` : null,
    enquiry.extraDetails.length > 0 ? "" : null,
    ...enquiry.extraDetails,
    "",
    "Details:",
    enquiry.projectDetails,
    "",
    "Prepared from the Namutek website contact form. This message is sent only after you tap Send in WhatsApp.",
  ].filter((line): line is string => line !== null);
  return lines.join("\n");
}

const SERVICES = {
  freight: {
    label: "Freight transportation",
    extras: [
      { key: "cargo", label: "What cargo are you transporting?" },
      { key: "volume", label: "Approx. weight or volume" },
      { key: "frequency", label: "One-off or regular transport?" },
    ],
  },
  haulage: {
    label: "Heavy-duty haulage",
    extras: [
      { key: "load", label: "Load type and dimensions" },
      { key: "equipment", label: "Equipment or trailer type needed (if known)" },
      { key: "frequency", label: "One-off or regular transport?" },
    ],
  },
  logistics: {
    label: "Logistics & distribution",
    extras: [
      { key: "scope", label: "Services needed (planning, dispatch, distribution, final-mile)" },
      { key: "frequency", label: "How often do you need this service?" },
    ],
  },
  construction: {
    label: "Building construction & civil works",
    extras: [
      {
        key: "projectType",
        label: "Project type (residential, commercial, industrial, civil works)",
      },
      { key: "timeline", label: "Expected start or timeline" },
    ],
  },
} as const;

type ServiceKey = keyof typeof SERVICES;

const inputClass =
  "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 hover:border-foreground/20 focus:border-primary focus:ring-4 focus:ring-primary/10";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">
      {children}
    </label>
  );
}

function EnquiryForm() {
  const [serviceType, setServiceType] = useState<ServiceKey>("freight");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    const extra: Record<string, string> = {};
    for (const { key } of SERVICES[serviceType].extras) {
      const value = String(form.get(`extra_${key}`) ?? "").trim();
      if (value) extra[key] = value;
    }
    const extraDetails = SERVICES[serviceType].extras.flatMap(({ key, label }) =>
      extra[key] ? [`${label}: ${extra[key]}`] : [],
    );
    const originValue = String(form.get("origin") ?? "").trim();
    const destinationValue = String(form.get("destination") ?? "").trim();
    const contactNameValue = String(form.get("contactName") ?? "");
    const companyNameValue = String(form.get("companyName") ?? "").trim();
    const phoneValue = String(form.get("phone") ?? "");
    const emailValue = String(form.get("email") ?? "").trim();
    const projectDetailsValue = String(form.get("projectDetails") ?? "");

    const enquiry: {
      serviceType: string;
      origin: string;
      destination: string;
      contactName: string;
      phone: string;
      extraDetails: string[];
      projectDetails: string;
      companyName?: string;
      email?: string;
    } = {
      serviceType: SERVICES[serviceType].label,
      origin: originValue,
      destination: destinationValue,
      contactName: contactNameValue,
      phone: phoneValue,
      extraDetails,
      projectDetails: projectDetailsValue,
    };
    if (companyNameValue) {
      enquiry.companyName = companyNameValue;
    }
    if (emailValue) {
      enquiry.email = emailValue;
    }
    const message = whatsappMessage(enquiry);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="flex min-h-[460px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          One last step
        </p>
        <h3 className="mt-2 text-2xl text-foreground sm:text-3xl">Your enquiry is ready</h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          WhatsApp should have opened with your message prepared. Send it there to deliver your
          request to the Namutek team.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            Open WhatsApp
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Prepare another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-foreground/5"
    >
      <div className="border-b border-border bg-muted/30 px-6 py-6 sm:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Request a quote
            </p>
            <h2 className="mt-1 text-2xl text-foreground">Tell us about your project</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Share a few details and we&apos;ll prepare a message for you to send directly to our
              team on WhatsApp.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6 sm:p-8">
        <section aria-labelledby="request-details-heading">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </span>
            <div>
              <h3 id="request-details-heading" className="text-base font-bold text-foreground">
                What do you need?
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Choose a service and tell us about the job.
              </p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="serviceType">
                Service type <span className="text-primary">*</span>
              </FieldLabel>
              <select
                id="serviceType"
                name="serviceType"
                defaultValue="freight"
                onChange={(e) => setServiceType(e.target.value as ServiceKey)}
                className={inputClass}
              >
                {Object.entries(SERVICES).map(([key, svc]) => (
                  <option key={key} value={key}>
                    {svc.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-muted-foreground">
                We&apos;ll ask for the details that are most useful for this service.
              </p>
            </div>
            {SERVICES[serviceType].extras.map((field) => (
              <div key={field.key} className="sm:col-span-2">
                <FieldLabel htmlFor={`extra_${field.key}`}>{field.label}</FieldLabel>
                <input
                  id={`extra_${field.key}`}
                  name={`extra_${field.key}`}
                  maxLength={500}
                  className={inputClass}
                />
              </div>
            ))}
            <div>
              <FieldLabel htmlFor="origin">Collection location</FieldLabel>
              <input
                id="origin"
                name="origin"
                placeholder="e.g. Lusaka, Ndola"
                maxLength={200}
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="destination">Delivery location</FieldLabel>
              <input
                id="destination"
                name="destination"
                placeholder="e.g. Kitwe, Livingstone"
                maxLength={200}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="projectDetails">
                Project details <span className="text-primary">*</span>
              </FieldLabel>
              <textarea
                id="projectDetails"
                name="projectDetails"
                required
                rows={4}
                maxLength={2000}
                placeholder="Tell us about your cargo, route, site or project requirements."
                className={`${inputClass} min-h-32 resize-y`}
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="contact-details-heading">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              2
            </span>
            <div>
              <h3 id="contact-details-heading" className="text-base font-bold text-foreground">
                How can we reach you?
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your contact details will be included in the WhatsApp message.
              </p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="contactName">
                Your name <span className="text-primary">*</span>
              </FieldLabel>
              <input
                id="contactName"
                name="contactName"
                required
                maxLength={120}
                autoComplete="name"
                placeholder="Full name"
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="companyName">Company (optional)</FieldLabel>
              <input
                id="companyName"
                name="companyName"
                maxLength={160}
                autoComplete="organization"
                placeholder="Company name"
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="phone">
                Phone number <span className="text-primary">*</span>
              </FieldLabel>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                maxLength={30}
                autoComplete="tel"
                placeholder="+260 ..."
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="email">Email (optional)</FieldLabel>
              <input
                id="email"
                name="email"
                type="email"
                maxLength={255}
                autoComplete="email"
                placeholder="you@company.com"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <div className="border-t border-border pt-6">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            Your details are used to prepare your enquiry. Nothing is submitted until you review and
            send the message in WhatsApp.
          </p>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {status === "sending" ? "Preparing message…" : "Continue to WhatsApp"}
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="text-sm text-muted-foreground">
              Prefer to call?
              <PhoneLinks className="mt-2 gap-2 text-sm text-primary" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function ContactPage() {
  return (
    <>
      <section className="bg-foreground">
        <Reveal>
          <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-primary">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Contact Namutek
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl leading-tight text-background md:text-6xl">
              Tell us what you need moved or built
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-background/70 md:text-lg">
              Talk to our team about freight, logistics or construction. Send a quick enquiry and
              we&apos;ll take it from there.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <Reveal>
          <aside className="space-y-5 lg:sticky lg:top-28">
            <div className="rounded-2xl bg-foreground p-7 text-background shadow-lg shadow-foreground/10 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-2xl text-background">Let&apos;s talk</h2>
              <p className="mt-2 text-sm leading-relaxed text-background/65">
                Speak with our team about your transport, logistics or project requirements.
              </p>
              <PhoneLinks className="mt-5 gap-3 text-base text-background" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg text-foreground">Visit our office</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Plot No. 3074M off Zambezi Road,
                    <br />
                    Foxdale, Lusaka, Zambia
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Plot+No.+3074M+Zambezi+Road+Foxdale+Lusaka+Zambia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    <Navigation className="h-4 w-4" aria-hidden="true" />
                    Get directions
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="text-base font-bold text-foreground">Company details</h2>
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Registered name</dt>
                  <dd className="text-right font-semibold text-foreground">
                    Namutek Logistics Limited
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">PACRA reg. no.</dt>
                  <dd className="text-right font-semibold text-foreground">120251021409</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Established</dt>
                  <dd className="text-right font-semibold text-foreground">2018</dd>
                </div>
              </dl>
              <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />
                Enquiries are handled by our Lusaka team.
              </div>
            </div>
          </aside>
        </Reveal>

        <Reveal delay={0.1}>
          <EnquiryForm />
        </Reveal>
      </section>

      <CTABand />
    </>
  );
}
