import { createFileRoute } from "@tanstack/react-router";
import { Building2, Factory, Globe2, HardHat, PackageCheck } from "lucide-react";
import { FleetGallery } from "@/components/FleetGallery";
import { CTABand } from "@/components/shared";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Fleet & Sectors We Serve — Namutek Logistics Limited" },
      {
        name: "description",
        content:
          "Prime movers, flatbed and tanker trailers, tipper trucks, excavators and construction plant — serving mining, construction, distribution and regional trade across Zambia.",
      },
      { property: "og:title", content: "Fleet & Sectors We Serve — Namutek Logistics Limited" },
      {
        property: "og:description",
        content:
          "Our fleet and plant support transport, haulage and construction assignments across Zambia's key sectors.",
      },
    ],
  }),
  component: FleetPage,
});

const TRANSPORT_FLEET = [
  "Prime movers and trucks",
  "Flatbed and tarpaulin-covered trailers",
  "Tanker trailers",
  "Tipper trucks",
];

const CONSTRUCTION_PLANT = ["Excavators", "Mini excavators", "Other plant and tools"];

const SECTORS = [
  {
    name: "Mining & Industrial",
    support: "Freight and haulage of materials, equipment and industrial goods.",
    icon: Factory,
  },
  {
    name: "Construction & Infrastructure",
    support: "Transport of construction materials, site services, civil and building works.",
    icon: HardHat,
  },
  {
    name: "Commercial & Distribution",
    support: "Domestic distribution, final-mile delivery and ongoing supply requirements.",
    icon: PackageCheck,
  },
  {
    name: "Institutional Projects",
    support: "Construction and refurbishment of office and institutional buildings.",
    icon: Building2,
  },
  {
    name: "Regional Trade",
    support: "Cross-border and regional transportation on selected routes.",
    icon: Globe2,
  },
];

function FleetPage() {
  return (
    <>
      <section className="bg-foreground">
        <Reveal>
          <div className="mx-auto max-w-6xl px-4 py-16">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
              Fleet & Equipment
            </p>
            <h1 className="mt-2 text-4xl text-background md:text-5xl">
              Ready for dispatch, ready for site
            </h1>
            <p className="mt-4 max-w-2xl text-background/80">
              Our fleet and plant support transport, haulage and construction
              assignments across Zambia and selected regional routes.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-lg border border-border bg-card p-8">
              <h2 className="text-3xl text-primary">Transport Fleet</h2>
              <ul className="mt-5 space-y-3">
                {TRANSPORT_FLEET.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-foreground">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-sm bg-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-lg border border-border bg-card p-8">
              <h2 className="text-3xl text-primary">Construction Plant</h2>
              <ul className="mt-5 space-y-3">
                {CONSTRUCTION_PLANT.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-foreground">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-sm bg-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-10 rounded-lg border-l-4 border-primary bg-muted/60 p-6">
            <h3 className="text-xl text-foreground">Fleet Management</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              We plan loads, schedule dispatch and monitor transport movements so
              that vehicles are used efficiently and clients stay informed — from
              collection through to final delivery.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="bg-muted/60">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
              Sectors We Serve
            </p>
            <h2 className="mt-2 text-4xl text-foreground md:text-5xl">
              Clients whose operations depend on dependable movement
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.05}>
                <article className="group h-full rounded-xl border border-border bg-card p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <s.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.support}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FleetGallery />

      <CTABand />
    </>
  );
}
