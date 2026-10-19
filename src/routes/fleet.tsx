import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  Container,
  Factory,
  Fuel,
  Globe2,
  HardHat,
  Package,
  PackageCheck,
  Route as RouteIcon,
  Truck,
} from "lucide-react";
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
  { name: "Prime movers and trucks", icon: Truck },
  { name: "Flatbed and tarpaulin-covered trailers", icon: Container },
  { name: "Tanker trailers", icon: Fuel },
  { name: "Tipper trucks", icon: Package },
];

const CONSTRUCTION_PLANT = [
  { name: "Excavators", icon: HardHat },
  { name: "Mini excavators", icon: HardHat },
  { name: "Other plant and tools", icon: PackageCheck },
];

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
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1fr_auto] md:items-end md:py-20">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-primary">
                <Truck className="h-4 w-4" aria-hidden="true" />
                Fleet & Equipment
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl leading-tight text-background md:text-6xl">
                Ready for dispatch.
                <span className="block text-background/65">Ready for site.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-background/75 md:text-lg">
                The vehicles and plant behind dependable transport, haulage and construction
                assignments across Zambia and selected regional routes.
              </p>
            </div>
            <a
              href="#fleet-capabilities"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-background/20 px-5 py-3 text-sm font-semibold text-background transition hover:border-primary hover:bg-background/5"
            >
              Explore our capabilities
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </section>

      <section id="fleet-capabilities" className="scroll-mt-24 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Transport & plant
              </p>
              <h2 className="mt-3 text-3xl text-foreground md:text-4xl">
                The right capability for the job
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                From moving commercial freight to supporting active project sites, our fleet and
                equipment are organised around practical client needs.
              </p>
            </div>
          </Reveal>

          <div className="mt-9 grid gap-5 lg:grid-cols-2">
            <Reveal>
              <article className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                      Freight & haulage
                    </p>
                    <h3 className="mt-2 text-2xl text-foreground">Transport Fleet</h3>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Truck className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Vehicle and trailer options for a range of cargo, materials and delivery
                  requirements.
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {TRANSPORT_FLEET.map(({ name, icon: Icon }) => (
                    <li
                      key={name}
                      className="flex min-h-14 items-center gap-3 rounded-xl bg-muted/60 px-4 py-3 text-sm font-medium text-foreground"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {name}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
            <Reveal delay={0.1}>
              <article className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                      Site support
                    </p>
                    <h3 className="mt-2 text-2xl text-foreground">Construction Plant</h3>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HardHat className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Plant and tools for construction, civil works and project-site requirements.
                </p>
                <ul className="mt-6 grid gap-3">
                  {CONSTRUCTION_PLANT.map(({ name, icon: Icon }) => (
                    <li
                      key={name}
                      className="flex min-h-14 items-center gap-3 rounded-xl bg-muted/60 px-4 py-3 text-sm font-medium text-foreground"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {name}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <article className="mt-6 overflow-hidden rounded-2xl bg-foreground text-background">
              <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[auto_1fr_auto] md:items-center md:p-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <ClipboardCheck className="h-7 w-7" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    Planning & coordination
                  </p>
                  <h3 className="mt-2 text-2xl text-background">Fleet Management</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-background/70">
                    We plan loads, schedule dispatch and monitor transport movements so vehicles are
                    used efficiently and clients stay informed — from collection through to final
                    delivery.
                  </p>
                </div>
                <div className="hidden items-center gap-3 text-sm text-background/65 md:flex">
                  <RouteIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                  Load to delivery
                </div>
              </div>
            </article>
          </Reveal>
        </div>
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
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.support}</p>
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
