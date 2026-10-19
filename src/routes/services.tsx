import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Check,
  Construction,
  Route as RouteIcon,
  Truck,
  type LucideIcon,
} from "lucide-react";

import buildingSite from "@/assets/building-site.jpg";
import civilWorks from "@/assets/civil-works.jpg";
import miningHaul from "@/assets/mining-haul.jpg";
import plantHire from "@/assets/plant-hire.jpg";
import { CTABand } from "@/components/shared";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
});

type Service = {
  id: string;
  number: string;
  title: string;
  category: string;
  intro: string;
  items: readonly string[];
  icon: LucideIcon;
  image: string;
  imageAlt: string;
};

const SERVICES: Service[] = [
  {
    id: "transportation",
    number: "01",
    title: "Transportation",
    category: "Freight & haulage",
    intro:
      "Reliable point-to-point commercial logistics and efficient heavy-load transportation tailored to your operational and supply-chain requirements — with a strong focus on safety, reliability and professionalism.",
    items: [
      "Bulk cargo transportation",
      "General cargo transportation",
      "Heavy-duty haulage",
      "Long-distance transportation",
      "Domestic distribution",
      "Regional and cross-border transportation",
      "Construction material transportation",
      "Mining and industrial freight",
    ],
    icon: Truck,
    image: miningHaul,
    imageAlt: "Heavy haulage truck transporting industrial cargo",
  },
  {
    id: "logistics",
    number: "02",
    title: "Logistics",
    category: "Planning & coordination",
    intro:
      "We coordinate the movement and delivery of goods from origin to destination, helping clients manage their transportation requirements efficiently.",
    items: [
      "Transport planning",
      "Route planning",
      "Fleet coordination",
      "Load scheduling",
      "Dispatch coordination",
      "Distribution management",
      "Delivery coordination",
      "Final-mile delivery",
      "Transport monitoring",
    ],
    icon: RouteIcon,
    image: plantHire,
    imageAlt: "Transport and plant assets prepared for coordinated logistics operations",
  },
  {
    id: "building-construction",
    number: "03",
    title: "Building Construction",
    category: "Buildings & refurbishment",
    intro:
      "Construction services for residential, commercial, industrial and institutional developments — covering new construction, extensions and refurbishment works.",
    items: [
      "Residential construction",
      "Commercial buildings",
      "Office and institutional buildings",
      "Industrial buildings and workshops",
      "Warehouses and storage facilities",
      "Building extensions and renovations",
      "Refurbishment works",
    ],
    icon: Building2,
    image: buildingSite,
    imageAlt: "Building construction site with structural work in progress",
  },
  {
    id: "civil-infrastructure",
    number: "04",
    title: "Civil & Infrastructure",
    category: "Earthworks & infrastructure",
    intro:
      "Civil and infrastructure support for developments, construction projects and related works — from earthworks to completed structures.",
    items: [
      "Earthworks and site preparation",
      "Roads and access works",
      "Drainage and stormwater works",
      "Culverts and related structures",
      "Site development",
      "Infrastructure works",
      "Material and aggregate works",
      "Project and site support",
    ],
    icon: Construction,
    image: civilWorks,
    imageAlt: "Excavator carrying out civil earthworks on a road embankment",
  },
];

function ServiceSection({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  const imageFirst = index % 2 === 1;

  return (
    <Reveal>
      <article id={service.id} className="scroll-mt-28 border-t border-border py-14 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className={imageFirst ? "lg:order-2" : undefined}>
            <div className="relative overflow-hidden rounded-2xl bg-muted shadow-md">
              <img
                src={service.image}
                alt={service.imageAlt}
                className="aspect-[16/10] w-full object-cover transition duration-500 hover:scale-[1.02]"
                width={1600}
                height={1000}
                loading="lazy"
              />
              <span className="absolute left-4 top-4 rounded-full border border-background/20 bg-foreground/75 px-3 py-1.5 text-xs font-bold tracking-[0.16em] text-background backdrop-blur-sm">
                SERVICE {service.number}
              </span>
            </div>
          </div>

          <div className={imageFirst ? "lg:order-1" : undefined}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {service.category}
            </p>
            <h2 className="mt-2 text-3xl text-foreground md:text-4xl">{service.title}</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{service.intro}</p>

            <h3 className="mt-7 text-sm font-bold text-foreground">What we can support</h3>
            <ul className="mt-3 grid gap-x-5 gap-y-3 sm:grid-cols-2">
              {service.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Discuss your requirements
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function ServicesPage() {
  return (
    <>
      <section className="overflow-hidden bg-foreground">
        <Reveal>
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">What we do</p>
            <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-end">
              <div>
                <h1 className="max-w-4xl text-4xl leading-tight text-background md:text-6xl">
                  Practical services for work that moves Zambia forward
                </h1>
              </div>
              <div>
                <p className="leading-relaxed text-background/75 md:text-lg">
                  From freight and logistics to construction and civil works, explore the services
                  we provide to commercial, industrial and project-based clients.
                </p>
                <a
                  href="#service-list"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-background transition hover:text-primary"
                >
                  Explore our services
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-muted/50" aria-label="Service overview">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              return (
                <Reveal key={service.id} delay={index * 0.05}>
                  <a
                    href={`#${service.id}`}
                    className="group flex h-full items-center gap-4 rounded-xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        {service.number} · {service.category}
                      </span>
                      <span className="mt-1 block font-semibold text-foreground">
                        {service.title}
                      </span>
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="service-list" className="scroll-mt-24 bg-background">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <div className="max-w-2xl py-12 md:py-16">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Our capabilities
              </p>
              <h2 className="mt-3 text-3xl text-foreground md:text-4xl">
                Find the support your project needs
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Each service is designed to address a different part of your operation. Select a
                service above to jump to its details.
              </p>
            </div>
          </Reveal>

          {SERVICES.map((service, index) => (
            <ServiceSection key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>

      <CTABand />
    </>
  );
}
