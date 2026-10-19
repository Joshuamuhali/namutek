import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/reveal";
import { DESIGNER, SITE_NAME } from "@/lib/site-metadata";

export const Route = createFileRoute("/credits")({
  component: CreditsPage,
});

function CreditsPage() {
  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
          <Reveal>
            <p className="text-sm font-semibold text-primary">Website design</p>
            <h1 className="mt-2 text-3xl font-bold text-foreground md:text-5xl">
              Designed by {DESIGNER.name}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              This website for <strong className="font-semibold text-foreground">{SITE_NAME}</strong> was
              designed and built by <strong className="font-semibold text-foreground">{DESIGNER.name}</strong>.
              The site presents Namutek&apos;s transportation, logistics, building construction and civil
              infrastructure services for clients across Zambia and regional routes.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              For design inquiries related to this project, please contact {SITE_NAME} through the
              contact page.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Back to home
              </Link>
              <Link
                to="/contact"
                className="inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Contact Namutek
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <Reveal delay={0.1}>
          <h2 className="text-xl font-bold text-foreground">Design credit</h2>
          <dl className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
            <div className="grid gap-1 px-5 py-4 sm:grid-cols-3">
              <dt className="text-sm font-medium text-muted-foreground">Designer</dt>
              <dd className="sm:col-span-2 font-semibold text-foreground">{DESIGNER.name}</dd>
            </div>
            <div className="grid gap-1 px-5 py-4 sm:grid-cols-3">
              <dt className="text-sm font-medium text-muted-foreground">Role</dt>
              <dd className="sm:col-span-2 text-foreground">{DESIGNER.jobTitle}</dd>
            </div>
            <div className="grid gap-1 px-5 py-4 sm:grid-cols-3">
              <dt className="text-sm font-medium text-muted-foreground">Client site</dt>
              <dd className="sm:col-span-2 text-foreground">{SITE_NAME}</dd>
            </div>
          </dl>
        </Reveal>
      </section>
    </>
  );
}
