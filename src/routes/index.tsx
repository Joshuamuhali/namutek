import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Handshake,
  Lightbulb,
  ShieldCheck,
  Truck,
} from "lucide-react";
import buildingSite from "@/assets/building-site.jpg";
import civilWorks from "@/assets/civil-works.jpg";
import { HeroCarousel } from "@/components/HeroCarousel";
import miningHaul from "@/assets/mining-haul.jpg";
import plantHire from "@/assets/plant-hire.jpg";
import { CTABand } from "@/components/shared";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/")({
  component: Index,
});

const SERVICES = [
  {
    n: "01",
    title: "Transportation",
    desc: "Point-to-point commercial freight, bulk and general cargo, heavy-duty haulage, long-distance and cross-border transport.",
    image: miningHaul,
    imageAlt: "Heavy haulage truck transporting industrial cargo",
    icon: Truck,
    route: "transportation",
  },
  {
    n: "02",
    title: "Logistics",
    desc: "Transport planning, fleet coordination, dispatch, distribution and delivery management.",
    image: plantHire,
    imageAlt: "Namutek transport and plant assets ready for coordination",
    icon: BadgeCheck,
    route: "logistics",
  },
  {
    n: "03",
    title: "Building Construction",
    desc: "Residential, commercial, industrial and institutional buildings, extensions and refurbishment.",
    image: buildingSite,
    imageAlt: "Building construction site with structural work in progress",
    icon: Building2,
    route: "building-construction",
  },
  {
    n: "04",
    title: "Civil & Infrastructure",
    desc: "Earthworks, roads, drainage, culverts, site development and project support.",
    image: civilWorks,
    imageAlt: "Civil works and earthmoving on a development site",
    icon: Building2,
    route: "civil-infrastructure",
  },
];

const PILLARS = [
  {
    title: "Reliable",
    desc: "Timely, consistent delivery and operations that keep running smoothly.",
    icon: BadgeCheck,
  },
  {
    title: "Professional",
    desc: "Skilled people, clear processes and a safety-first approach on every assignment.",
    icon: ShieldCheck,
  },
  {
    title: "Innovative",
    desc: "Modern tools and practical thinking that deliver effective, competitive solutions.",
    icon: Lightbulb,
  },
  {
    title: "Community-focused",
    desc: "Deeply rooted in the Zambian context, fostering local development.",
    icon: Handshake,
  },
  {
    title: "Affordable",
    desc: "Value-driven, accessible services with transparent pricing and strong value for money.",
    icon: BadgeCheck,
  },
];

const STATS = [
  { value: "2018", label: "Year established" },
  { value: "4", label: "Core service areas" },
  { value: "Zambia +", label: "Regional routes served" },
  { value: "24/7", label: "Operational focus" },
];

function Index() {
  return (
    <>
      <HeroCarousel />

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <Reveal>
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                  Our services
                </p>
                <h2 className="mt-3 text-3xl text-foreground md:text-5xl">
                  Four areas. One dependable partner.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                  From heavy haulage to civil works, we bring transport, logistics and construction
                  together under one accountable team.
                </p>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:gap-3"
              >
                Explore all services
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <Reveal key={service.n} delay={i * 0.06}>
                  <Link
                    to="/services"
                    hash={service.route}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.imageAlt}
                        className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
                        width={800}
                        height={500}
                        loading="lazy"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-foreground/80 px-3 py-1 text-xs font-bold tracking-wider text-background backdrop-blur-sm">
                        {service.n}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <h3 className="text-lg font-bold text-foreground">{service.title}</h3>
                      </div>
                      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {service.desc}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                        Learn more
                        <ArrowRight
                          className="h-4 w-4 transition group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Why choose us
              </p>
              <h2 className="mt-3 text-3xl text-foreground md:text-5xl">
                Dependable service, built on clear principles
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground md:text-lg">
                These five commitments shape how we plan, communicate and deliver across every
                service.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div className="relative min-h-[360px] overflow-hidden rounded-2xl bg-foreground shadow-lg sm:min-h-[480px]">
                <img
                  src="/namutek-fleet-yard.jpg"
                  alt="Namutek fleet vehicles prepared at the company yard"
                  className="absolute inset-0 h-full w-full object-cover"
                  width={1200}
                  height={900}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    One accountable team
                  </p>
                  <p className="mt-2 max-w-md text-2xl font-bold leading-snug text-background sm:text-3xl">
                    We plan carefully. We work responsibly. We deliver on our commitments.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {PILLARS.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <Reveal key={pillar.title} delay={i * 0.05}>
                    <article className="h-full rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-foreground">{pillar.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {pillar.desc}
                      </p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
