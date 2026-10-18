import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CTABand, PHONES, PhoneLinks } from "@/components/shared";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Request a Quote — Namutek Logistics Limited" },
      {
        name: "description",
        content:
          "Request a quote for freight, haulage, logistics or construction services. Call +260 966 445513 or +260 976 699145. Foxdale, Lusaka, Zambia.",
      },
      { property: "og:title", content: "Contact & Request a Quote — Namutek Logistics Limited" },
      {
        property: "og:description",
        content:
          "Request a quote for freight, haulage, logistics or construction services across Zambia.",
      },
    ],
  }),
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
  freight: { label: "Freight transportation", extras: [
    { key: "cargo", label: "What cargo are you transporting?" },
    { key: "volume", label: "Approx. weight or volume" },
    { key: "frequency", label: "One-off or regular transport?" },
  ] },
  haulage: { label: "Heavy-duty haulage", extras: [
    { key: "load", label: "Load type and dimensions" },
    { key: "equipment", label: "Equipment or trailer type needed (if known)" },
    { key: "frequency", label: "One-off or regular transport?" },
  ] },
  logistics: { label: "Logistics & distribution", extras: [
    { key: "scope", label: "Services needed (planning, dispatch, distribution, final-mile)" },
    { key: "frequency", label: "How often do you need this service?" },
  ] },
  construction: { label: "Building construction & civil works", extras: [
    { key: "projectType", label: "Project type (residential, commercial, industrial, civil works)" },
    { key: "timeline", label: "Expected start or timeline" },
  ] },
} as const;

type ServiceKey = keyof typeof SERVICES;

const inputClass = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40";

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
      projectDetails: string;
      companyName?: string;
      email?: string;
    } = {
      serviceType: SERVICES[serviceType].label,
      origin: originValue,
      destination: destinationValue,
      contactName: contactNameValue,
      phone: phoneValue,
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
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <h3 className="text-2xl text-primary">Enquiry prepared for WhatsApp</h3>
        <p className="mt-3 text-sm text-muted-foreground">Your quotation request has been formatted and WhatsApp has opened in a new window. Please send the message to our team.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">Open WhatsApp</a>
          <a href="/" className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent">Back to home</a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="serviceType" className="mb-1 block text-sm font-semibold">Service type <span className="text-primary">*</span></label>
          <select id="serviceType" name="serviceType" defaultValue="freight" onChange={(e) => setServiceType(e.target.value as ServiceKey)} className={inputClass}>
            {Object.entries(SERVICES).map(([key, svc]) => (
              <option key={key} value={key}>{svc.label}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">Additional fields will appear based on your selection.</p>
        </div>
        {SERVICES[serviceType].extras.map((field) => (
          <div key={field.key} className="md:col-span-2">
            <label htmlFor={`extra_${field.key}`} className="mb-1 block text-sm font-semibold">{field.label}</label>
            <input id={`extra_${field.key}`} name={`extra_${field.key}`} maxLength={500} className={inputClass} />
          </div>
        ))}
        <div className="md:col-span-2">
          <label htmlFor="origin" className="mb-1 block text-sm font-semibold">Origin / collection location</label>
          <input id="origin" name="origin" placeholder="e.g. Lusaka, Ndola, Kitwe" maxLength={200} className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="destination" className="mb-1 block text-sm font-semibold">Destination / delivery location</label>
          <input id="destination" name="destination" placeholder="e.g. Ndola, Lusaka, Livingstone" maxLength={200} className={inputClass} />
        </div>
        <div>
          <label htmlFor="contactName" className="mb-1 block text-sm font-semibold">Your name <span className="text-primary">*</span></label>
          <input id="contactName" name="contactName" required maxLength={120} className={inputClass} />
        </div>
        <div>
          <label htmlFor="companyName" className="mb-1 block text-sm font-semibold">Company (optional)</label>
          <input id="companyName" name="companyName" maxLength={160} className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-semibold">Phone <span className="text-primary">*</span></label>
          <input id="phone" name="phone" type="tel" required maxLength={30} placeholder="+260 ..." className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold">Email (optional)</label>
          <input id="email" name="email" type="email" maxLength={255} className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="projectDetails" className="mb-1 block text-sm font-semibold">Project details <span className="text-primary">*</span></label>
          <textarea id="projectDetails" name="projectDetails" required rows={4} maxLength={2000} placeholder="Describe your goods, route, site or project so we can prepare an accurate quote." className={inputClass} />
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Your enquiry will be sent via WhatsApp to our team. We'll review your details and get back to you shortly.</p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "sending"} className="rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60">{status === "sending" ? "Sending…" : "Send via WhatsApp"}</button>
        <div className="text-sm text-muted-foreground">Prefer to talk? <PhoneLinks className="text-primary" /></div>
      </div>
    </form>
  );
}

function ContactPage() {
  return (
    <>
      <section className="bg-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Contact Us</p>
          <h1 className="mt-2 text-4xl text-background md:text-5xl">
            Tell us what you need moved or built
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-2xl text-primary">Call us</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Our lines are open for enquiries and dispatch.
              </p>
              <PhoneLinks className="mt-4 gap-3 text-lg text-foreground" />
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-2xl text-primary">Head office</h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground">
                Plot No. 3074M off Zambezi Road,
                <br />
                Foxdale, Lusaka, Lusaka Province,
                <br />
                Zambia
              </p>
              <a
                href="https://www.namuteklogistics.com"
                className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
              >
                www.namuteklogistics.com
              </a>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-2xl text-primary">Company details</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Registered name</dt>
                  <dd className="text-right font-semibold">Namutek Logistics Limited</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">PACRA reg. no.</dt>
                  <dd className="text-right font-semibold">120251021409</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Established</dt>
                  <dd className="text-right font-semibold">2018</dd>
                </div>
              </dl>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-3">
          <EnquiryForm />
        </Reveal>
      </section>

      <CTABand />
    </>
  );
}
