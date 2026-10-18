import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import heroTruck from "@/assets/hero-truck.jpg";
import miningHaul from "@/assets/mining-haul.jpg";
import plantHire from "@/assets/plant-hire.jpg";
import buildingSite from "@/assets/building-site.jpg";
import civilWorks from "@/assets/civil-works.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6500;

type HeroSlide = {
  id: string;
  serviceHash?: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "transportation",
    serviceHash: "transportation",
    tag: "01 · Transportation",
    title: "Freight & heavy-duty haulage",
    description:
      "Point-to-point commercial freight, bulk and general cargo, long-distance and cross-border transport — with safety and reliability on every route across Zambia and the region.",
    image: miningHaul,
    imageAlt: "Heavy haulage truck carrying industrial cargo on a Zambian highway",
  },
  {
    id: "logistics",
    serviceHash: "logistics",
    tag: "02 · Logistics",
    title: "Planning, dispatch & delivery",
    description:
      "Transport planning, fleet coordination, load scheduling and distribution management so your goods move on time from origin to final mile.",
    image: plantHire,
    imageAlt: "Fleet and plant assets coordinated for logistics operations",
  },
  {
    id: "construction",
    serviceHash: "building-construction",
    tag: "03 · Building construction",
    title: "Residential to industrial builds",
    description:
      "New construction, extensions and refurbishment for residential, commercial, industrial and institutional projects — delivered with skilled teams and clear processes.",
    image: buildingSite,
    imageAlt: "Active building construction site with structural works in progress",
  },
  {
    id: "civil",
    serviceHash: "civil-infrastructure",
    tag: "04 · Civil & infrastructure",
    title: "Earthworks, roads & site development",
    description:
      "Earthworks, roads, drainage, culverts and site development — practical civil support that keeps infrastructure and mining projects moving.",
    image: civilWorks,
    imageAlt: "Civil infrastructure and earthworks on a development site",
  },
  {
    id: "partner",
    tag: "05 · One partner",
    title: "Four disciplines. One dependable team.",
    description:
      "Namutek Logistics Limited keeps businesses supplied, projects on schedule and operations running — transportation, logistics and construction under one roof since 2018.",
    image: heroTruck,
    imageAlt: "Namutek prime mover hauling cargo on a Zambian highway",
  },
];

export function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setActive(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || paused) return;

    const timer = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [api, paused]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  return (
    <section
      className="relative min-h-[min(92vh,880px)] overflow-hidden bg-foreground"
      aria-label="Featured services"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <Carousel
        setApi={setApi}
        opts={{ loop: true, duration: 28 }}
        className="h-full min-h-[inherit]"
      >
        <CarouselContent className="ml-0 h-full min-h-[inherit]">
          {HERO_SLIDES.map((slide) => (
            <CarouselItem key={slide.id} className="basis-full pl-0">
              <div className="relative flex min-h-[min(92vh,880px)] flex-col justify-end">
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  className="absolute inset-0 h-full w-full object-cover"
                  width={1920}
                  height={1080}
                  fetchPriority={slide.id === "transportation" ? "high" : undefined}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/75 to-foreground/25" />
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/45 to-transparent" />

                <div className="relative mx-auto w-full max-w-6xl px-4 pb-28 pt-32 md:pb-32 md:pt-40">
                  <p className="text-sm font-semibold tracking-wide text-primary">{slide.tag}</p>
                  <h1 className="mt-3 max-w-3xl text-4xl leading-[1.05] text-background md:text-6xl lg:text-7xl">
                    {slide.title}
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-background/88 md:text-lg">
                    {slide.description}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90"
                    >
                      Get a Quote
                    </Link>
                    {slide.serviceHash ? (
                      <Link
                        to="/services"
                        hash={slide.serviceHash}
                        className="inline-flex items-center justify-center rounded-full border border-background/35 bg-background/10 px-6 py-3 text-sm font-semibold text-background backdrop-blur-sm transition hover:bg-background/20"
                      >
                        Explore this service
                      </Link>
                    ) : (
                      <Link
                        to="/services"
                        className="inline-flex items-center justify-center rounded-full border border-background/35 bg-background/10 px-6 py-3 text-sm font-semibold text-background backdrop-blur-sm transition hover:bg-background/20"
                      >
                        View all services
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto max-w-6xl px-4 pb-8">
          <div className="pointer-events-auto flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {HERO_SLIDES.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}: ${slide.title}`}
                  aria-current={active === i ? "true" : undefined}
                  onClick={() => scrollTo(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    active === i ? "w-10 bg-primary" : "w-2 bg-background/45 hover:bg-background/70",
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => api?.scrollPrev()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-background/30 bg-background/10 text-background backdrop-blur-sm transition hover:bg-background/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => api?.scrollNext()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-background/30 bg-background/10 text-background backdrop-blur-sm transition hover:bg-background/20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </Carousel>
    </section>
  );
}
