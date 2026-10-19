import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Building2,
  CalendarDays,
  Compass,
  Crosshair,
  Heart,
  Lightbulb,
  MapPin,
  Quote,
  ShieldCheck,
  Target,
  Truck,
  UserRound,
} from "lucide-react";
import { CTABand } from "@/components/shared";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

const VALUES = [
  {
    name: "Passion",
    meaning: "We care about every assignment and treat each client's cargo and project as our own.",
    icon: Heart,
  },
  {
    name: "Precision",
    meaning: "We plan routes, loads and schedules carefully so delivery is accurate and on time.",
    icon: Crosshair,
  },
  {
    name: "Integrity",
    meaning: "We are honest in our pricing, our communication and our commitments.",
    icon: ShieldCheck,
  },
  {
    name: "Innovation",
    meaning: "We use modern tools and practical ideas to find effective, competitive solutions.",
    icon: Lightbulb,
  },
  {
    name: "Professionalism",
    meaning: "We work with discipline, safety and accountability on every site and every road.",
    icon: Award,
  },
];

const GLANCE = [
  { label: "Company name", value: "Namutek Logistics Limited", icon: Building2 },
  {
    label: "Head office",
    value: "Plot No. 3074M off Zambezi Road, Foxdale, Lusaka, Zambia",
    icon: MapPin,
  },
  {
    label: "Core service areas",
    value: "Transportation, Logistics, Building Construction, Civil & Infrastructure",
    icon: Truck,
  },
  { label: "Operating area", value: "Zambia and selected regional markets", icon: Compass },
  { label: "Registration number", value: "120251021409", icon: ShieldCheck },
  { label: "Year established", value: "2018", icon: CalendarDays },
  { label: "Managing Director", value: "Musonda Chiinga", icon: UserRound },
];

function AboutPage() {
  return (
    <>
      <section className="bg-foreground">
        <Reveal>
          <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-primary">
              <Building2 className="h-4 w-4" aria-hidden="true" />
              About Namutek
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl leading-tight text-background md:text-6xl">
              Keeping businesses supplied and projects moving
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-background/70 md:text-lg">
              A Zambian logistics and construction partner built around dependable service,
              practical expertise and long-term relationships.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:p-12">
            <div className="absolute right-0 top-0 hidden h-48 w-48 -translate-y-1/3 translate-x-1/3 rounded-full bg-primary/5 md:block" />
            <div className="relative grid gap-8 p-7 md:grid-cols-[auto_1fr] md:gap-10 md:p-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Quote className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  A message from our Managing Director
                </p>
                <blockquote className="mt-5 space-y-4 text-lg leading-relaxed text-foreground md:text-xl">
                  <p>
                    At Namutek Logistics Limited, we believe that effective logistics is about more
                    than transporting goods. It is about keeping businesses supplied, projects
                    moving and operations running.
                  </p>
                  <p>
                    Our business was built around the need for dependable transportation and
                    practical logistics solutions. Today, we support clients across freight
                    transportation, heavy-duty haulage, supply chain coordination and construction
                    support, serving requirements within Zambia and selected regional markets.
                  </p>
                  <p>
                    As we continue to grow, our focus is on strengthening our capabilities, building
                    lasting business relationships and becoming a trusted partner to companies
                    across key sectors of the Zambian and regional economy.
                  </p>
                </blockquote>
                <div className="mt-7 border-t border-border pt-5">
                  <p className="font-bold text-foreground">Musonda Chiinga</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Managing Director, Namutek Logistics Limited
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-muted/60">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Who we are</p>
            <h2 className="mt-3 max-w-3xl text-3xl text-foreground md:text-4xl">
              One partner for the work that keeps business moving
            </h2>
          </Reveal>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Who we are",
                icon: Building2,
                body: "Namutek Logistics Limited is a Zambian company providing transportation, logistics and construction services to businesses and organisations. We specialise in the movement of goods and materials across Zambia and regional routes.",
              },
              {
                title: "What we do",
                icon: Truck,
                body: "We move goods, materials and equipment, coordinate their movement from origin to destination, and support construction and infrastructure projects with the transportation and site services they require.",
              },
              {
                title: "How we work",
                icon: ShieldCheck,
                body: "Our work is centred on dependable services that help clients move goods and keep projects progressing — with professionalism, safety, reliability and efficient service on every assignment.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <article className="h-full rounded-2xl border border-border bg-card p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Our direction</p>
          <h2 className="mt-3 text-3xl text-foreground md:text-4xl">
            The principles behind every delivery
          </h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-2xl text-foreground">Our Vision</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                To be the leading provider of safe and reliable goods transportation solutions, and
                a trusted delivery partner for construction and infrastructure projects, driving
                progress and prosperity in Zambia and beyond.
              </p>
            </article>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="h-full rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 text-foreground">
                <Compass className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-2xl text-foreground">Our Mission</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                To safely deliver goods to our customers and support their projects, ensuring their
                operations run smoothly — upholding the highest standards of safety, reliability and
                professionalism in every aspect of our business.
              </p>
            </article>
          </Reveal>
        </div>

        <Reveal>
          <p className="mt-16 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            What guides us
          </p>
          <h2 className="mt-3 text-3xl text-foreground md:text-4xl">Our Values</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.name} delay={i * 0.05}>
              <article className="h-full rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <v.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-foreground">{v.name}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{v.meaning}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-muted/60">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              The essentials
            </p>
            <h2 className="mt-3 text-3xl text-foreground md:text-4xl">Company at a Glance</h2>
          </Reveal>
          <dl className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GLANCE.map(({ label, value, icon: Icon }, i) => (
              <Reveal key={label} delay={i * 0.04}>
                <div className="flex h-full items-start gap-4 rounded-xl border border-border bg-card p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="mt-1.5 text-sm font-medium leading-relaxed text-foreground">
                      {value}
                    </dd>
                  </div>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <CTABand />
    </>
  );
}
