import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteStructuredData } from "@/components/StructuredData";
import { PHONES } from "@/components/shared";
import { DESIGNER, SITE_ORIGIN } from "@/lib/site-metadata";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/fleet", label: "Fleet & Sectors" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const DEFAULT_PAGE_METADATA = {
  title: "Namutek Logistics Limited — Freight, Haulage & Construction in Zambia",
  description:
    "Dependable freight transportation, heavy-duty haulage, logistics, building construction and civil works across Zambia and regional routes. Request a quote today.",
};

const PAGE_METADATA: Record<string, typeof DEFAULT_PAGE_METADATA> = {
  "/": DEFAULT_PAGE_METADATA,
  "/about": {
    title: "About Us — Namutek Logistics Limited",
    description:
      "Namutek Logistics Limited is a Zambian company providing transportation, logistics and construction services. Established 2018, based in Foxdale, Lusaka.",
  },
  "/services": {
    title: "Our Services — Namutek Logistics Limited",
    description:
      "Freight transportation, heavy-duty haulage, logistics coordination, building construction and civil infrastructure services across Zambia and regional routes.",
  },
  "/fleet": {
    title: "Fleet & Sectors We Serve — Namutek Logistics Limited",
    description:
      "Prime movers, flatbed and tanker trailers, tipper trucks, excavators and construction plant — serving mining, construction, distribution and regional trade across Zambia.",
  },
  "/contact": {
    title: "Contact & Request a Quote — Namutek Logistics Limited",
    description:
      "Request a quote for freight, haulage, logistics or construction services. Call +260 966 445513 or +260 976 699145. Foxdale, Lusaka, Zambia.",
  },
  "/credits": {
    title: `Website Design — ${DESIGNER.name} | Namutek Logistics Limited`,
    description: `${DESIGNER.name} designed and developed the Namutek Logistics Limited website — freight, haulage, logistics and construction services in Zambia.`,
  },
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl text-primary">404</h1>
        <h2 className="mt-4 text-2xl text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 shadow-sm shadow-foreground/5 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center" aria-label="Namutek Logistics home">
          <img
            src="/logo.png"
            alt="Namutek Logistics Limited"
            className="h-[4.25rem] w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${PHONES[0].tel}`}
            className="hidden text-sm font-semibold text-foreground transition-colors hover:text-primary lg:block"
          >
            {PHONES[0].display}
          </a>
          <Link
            to="/contact"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90 sm:block"
          >
            Get a Quote
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground"
            >
              Get a Quote
            </Link>
            <a
              href={`tel:${PHONES[0].tel}`}
              className="rounded-md px-3 py-2 text-sm font-semibold text-primary"
            >
              Call {PHONES[0].display}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <div className="inline-block rounded-md bg-background p-3">
            <img
              src="/logo.png"
              alt="Namutek Logistics Limited"
              className="h-12 w-auto object-contain"
              loading="lazy"
            />
          </div>
          <p className="mt-4 max-w-xs text-sm text-background/70">
            Transportation, logistics and construction services across Zambia and
            selected regional markets.
          </p>
        </div>

        <div>
          <h3 className="text-lg text-background">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {PHONES.map((p) => (
              <li key={p.tel}>
                <a href={`tel:${p.tel}`} className="text-background/80 transition-colors hover:text-background">
                  {p.display}
                </a>
              </li>
            ))}
            <li className="text-background/80">
              Plot No. 3074M off Zambezi Road, Foxdale, Lusaka, Zambia
            </li>
            <li>
              <a
                href="https://www.namuteklogistics.com"
                className="text-background/80 transition-colors hover:text-background"
              >
                www.namuteklogistics.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-background">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-background/80 transition-colors hover:text-background"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-background/50">
            Registered in Zambia · PACRA Reg. No. 120251021409 · Established 2018
          </p>
        </div>
      </div>
      <div className="border-t border-background/10 px-4 py-4 text-center text-xs text-background/50">
        <p>© {new Date().getFullYear()} Namutek Logistics Limited. All rights reserved.</p>
        <p className="mt-1.5 text-background/45">
          Designed By :{" "}
          <Link
            to="/credits"
            className="text-background/75 underline-offset-2 transition hover:text-background hover:underline"
          >
            {DESIGNER.name}
          </Link>
        </p>
      </div>
    </footer>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const metadata = PAGE_METADATA[pathname] ?? DEFAULT_PAGE_METADATA;

  useEffect(() => {
    document.title = metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", metadata.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", metadata.description);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", `${SITE_ORIGIN}${pathname}`);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", `${SITE_ORIGIN}${pathname}`);
  }, [metadata, pathname]);

  return (
    <>
      <SiteStructuredData />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
