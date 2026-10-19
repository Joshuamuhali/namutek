import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroCarousel } from "@/components/HeroCarousel";
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
  },
  {
    n: "02",
    title: "Logistics",
    desc: "Transport planning, fleet coordination, dispatch, distribution and delivery management.",
  },
  {
    n: "03",
    title: "Building Construction",
    desc: "Residential, commercial, industrial and institutional buildings, extensions and refurbishment.",
  },
  {
    n: "04",
    title: "Civil & Infrastructure",
    desc: "Earthworks, roads, drainage, culverts, site development and project support.",
  },
];

const PILLARS = [
  { title: "Reliable", desc: "Timely, consistent delivery and operations that keep running smoothly." },
  { title: "Professional", desc: "Skilled people, clear processes and a safety-first approach on every assignment." },
  { title: "Innovative", desc: "Modern tools and practical thinking that deliver effective, competitive solutions." },
  { title: "Community-focused", desc: "Deeply rooted in the Zambian context, fostering local development." },
  { title: "Affordable", desc: "Value-driven, accessible services with transparent pricing and strong value for money." },
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
              <p className="font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services at a glance */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <Reveal>
          <p className="text-sm font-semibold text-primary">Our services</p>
          <h2 className="mt-2 text-3xl text-foreground md:text-5xl">Four areas. One dependable partner.</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            From heavy haulage to civil works, we combine transport, logistics and construction so you work with one
            accountable team.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <Link
                to="/services"
                className="group flex h-full flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <span className="font-display text-2xl font-bold text-primary/90">{s.n}</span>
                <h3 className="mt-3 text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Learn more
                  <span aria-hidden className="transition group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
          <Reveal>
            <p className="text-sm font-semibold text-primary">Why choose us</p>
            <h2 className="mt-2 text-3xl text-foreground md:text-5xl">Built on five core pillars</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                  <div className="h-1 w-10 rounded-full bg-primary" />
                  <h3 className="mt-5 text-lg font-bold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-5 text-lg font-medium text-foreground">
              We plan carefully. We work responsibly. We deliver on our commitments.
            </p>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </>
  );
}
