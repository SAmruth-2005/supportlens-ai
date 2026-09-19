"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The diagnostic sequence shown while /api/analyze is in flight.
 *
 * Honesty rule: only the two phases the browser can actually observe are ever
 * marked complete. The model's work happens inside one request, so the later
 * phases stay "in progress" or "pending" — they are never ticked off to
 * simulate backend activity that has not been reported.
 */
const PHASES = [
  "Issue description validated",
  "Sent to analysis service",
  "Analysing the evidence",
  "Validating structured diagnosis",
  "Preparing troubleshooting path",
] as const;

/** Phases 0 and 1 genuinely completed in the browser before the request. */
const OBSERVED_COMPLETE = 2;

export function AnalysisState({ hasScreenshot }: { hasScreenshot: boolean }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const started = Date.now();
    const timer = setInterval(
      () => setElapsed(Math.floor((Date.now() - started) / 1000)),
      500,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="panel animate-rise overflow-hidden"
      role="status"
      aria-live="polite"
    >
      <div className="panel-inset border-border/70 flex items-center justify-between gap-4 border-b px-4 py-2.5">
        <p className="eyebrow text-muted-foreground">Analysing incident</p>
        <span className="mono-meta text-muted-foreground tabular">
          {elapsed}s
        </span>
      </div>

      {/* Indeterminate — reflects that the request is open, not its progress. */}
      <div className="bg-border/60 h-px w-full overflow-hidden">
        <div className="bg-primary animate-sweep h-px w-1/4" />
      </div>

      <ol className="space-y-2.5 px-4 py-4">
        {PHASES.map((phase, index) => {
          const complete = index < OBSERVED_COMPLETE;
          const active = index === OBSERVED_COMPLETE;

          return (
            <li key={phase} className="flex items-center gap-2.5 text-sm">
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full",
                  complete && "bg-primary/10 text-primary",
                  active && "text-primary",
                  !complete && !active && "text-muted-foreground/40",
                )}
              >
                {complete ? (
                  <Check className="size-3" />
                ) : active ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <span className="bg-current size-1.5 rounded-full" />
                )}
              </span>
              <span
                className={cn(
                  complete && "text-muted-foreground",
                  active && "font-medium",
                  !complete && !active && "text-muted-foreground/60",
                )}
              >
                {phase}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="text-muted-foreground border-border/70 border-t px-4 py-2.5 text-xs leading-[1.5]">
        {hasScreenshot
          ? "Reading the screenshot alongside your description."
          : "Diagnosis usually takes 15–40 seconds."}
      </p>
    </div>
  );
}
