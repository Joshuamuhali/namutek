import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { lookupRequestStatusFn } from "@/lib/operations.functions";
import { Search, Clock, CheckCircle2, AlertCircle, FileText, Calendar, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/track")({
  component: TrackRequestPage,
});

const STATUS_STEPS = [
  { key: "submitted", label: "Request Submitted", desc: "Details received by dispatch" },
  { key: "under_review", label: "Technical Review", desc: "Specifications & route assessed" },
  { key: "quotation_in_progress", label: "Quotation Prepared", desc: "Rate calculations & management check" },
  { key: "quoted", label: "Formal Quote Issued", desc: "Sent to client for acceptance" },
  { key: "confirmed", label: "Booking Confirmed", desc: "Resource allocation locked" },
];

function getStatusIndex(status?: string): number {
  if (!status) return 0;
  switch (status.toLowerCase()) {
    case "submitted":
    case "new":
      return 0;
    case "under_review":
    case "assessment_required":
      return 1;
    case "ready_for_quotation":
    case "quotation_in_progress":
      return 2;
    case "quoted":
    case "pending_approval":
    case "approved":
      return 3;
    case "confirmed":
    case "in_progress":
    case "completed":
      return 4;
    default:
      return 0;
  }
}

export function TrackRequestPage() {
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const lookupFn = useServerFn(lookupRequestStatusFn);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await lookupFn({ data: { reference: reference.trim() } });
      setResult(res);
    } catch {
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  };

  const req = result?.request;
  const currentStep = getStatusIndex(req?.status);

  return (
    <div className="min-h-[80vh] bg-background py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Self-Service Portal</span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-1">
            Track Your Service Request
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your unique reference number (e.g. <span className="font-mono text-foreground font-semibold">NMT-2026-XXXXXX</span>) provided upon submission.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Enter reference (e.g. NMT-2026-102938)"
              className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {searched && !loading && (
          <div>
            {!result?.found ? (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
                <h3 className="text-base font-semibold text-foreground">Reference Not Found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  We could not find a record for <span className="font-mono font-medium">{reference}</span>. Please verify the code or contact our office directly.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
                <div className="flex flex-wrap items-center justify-between border-b border-border pb-4 mb-6 gap-2">
                  <div>
                    <span className="text-xs uppercase font-semibold text-muted-foreground">Service Request</span>
                    <h2 className="text-xl font-bold text-foreground font-mono">{req.reference}</h2>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase text-primary">
                      {req.status?.replace("_", " ")}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Submitted: {new Date(req.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Status Stepper */}
                <div className="mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Request Progress</h4>
                  <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-5 gap-2">
                    {STATUS_STEPS.map((s, idx) => {
                      const isComplete = idx <= currentStep;
                      const isCurrent = idx === currentStep;
                      return (
                        <div
                          key={s.key}
                          className={`rounded-lg p-3 text-left border ${
                            isCurrent
                              ? "border-primary bg-primary/5"
                              : isComplete
                              ? "border-border bg-muted/40"
                              : "border-border/40 opacity-50"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            {isComplete ? (
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            ) : (
                              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                            )}
                            <span className="text-xs font-bold text-foreground truncate">{s.label}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2">{s.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details snapshot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg bg-muted/30 p-4 border border-border/50 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Customer Contact</span>
                    <span className="font-semibold text-foreground">{req.contact_name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Division</span>
                    <span className="font-semibold text-foreground capitalize">{req.service_division}</span>
                  </div>
                  {req.estimated_amount_min && (
                    <div className="sm:col-span-2">
                      <span className="text-xs text-muted-foreground block">Estimated Range</span>
                      <span className="font-semibold text-primary">
                        ZMW {Number(req.estimated_amount_min).toLocaleString()} – ZMW {Number(req.estimated_amount_max).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap justify-between items-center text-xs text-muted-foreground pt-4 border-t border-border">
                  <span>Questions regarding this booking?</span>
                  <a href="/contact" className="inline-flex items-center gap-1 text-primary hover:underline font-semibold">
                    Contact Dispatch Office <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
