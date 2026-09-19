import Link from "next/link";
import { CheckCircle2, CircleHelp, LifeBuoy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SessionStatus } from "@/types/supportlens";

const OUTCOME = {
  resolved: {
    icon: CheckCircle2,
    eyebrow: "Incident resolved",
    heading: "This looks sorted",
    accent: true,
  },
  escalated: {
    icon: LifeBuoy,
    eyebrow: "Escalation recommended",
    heading: "Hand this to a support specialist",
    accent: false,
  },
  unsolved: {
    icon: CircleHelp,
    eyebrow: "Not enough information",
    heading: "We could not take this further",
    accent: false,
  },
} as const;

export interface ResolutionCardProps {
  status: Exclude<SessionStatus, "active">;
  resolution: string | null;
  /** Number of checks the user actually answered. */
  completedSteps: number;
  /** Demo sessions offer a re-run so the walkthrough can be shown again. */
  restartHref?: string;
}

export function ResolutionCard({
  status,
  resolution,
  completedSteps,
  restartHref,
}: ResolutionCardProps) {
  const { icon: Icon, eyebrow, heading, accent } = OUTCOME[status];

  return (
    <section
      aria-labelledby="resolution-heading"
      className="panel-raised animate-rise overflow-hidden"
    >
      <div
        aria-hidden="true"
        className={cn("h-0.5 w-full", accent ? "bg-primary" : "bg-border")}
      />

      <div className="panel-inset border-border/70 flex items-center justify-between gap-3 border-b px-4 py-2.5 sm:px-5">
        <p
          className={cn(
            "eyebrow",
            accent ? "text-primary" : "text-muted-foreground",
          )}
        >
          {eyebrow}
        </p>
        <span className="mono-meta text-muted-foreground">
          {completedSteps} {completedSteps === 1 ? "check" : "checks"}
        </span>
      </div>

      <div className="flex gap-4 px-4 py-5 sm:px-5">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full",
            accent ? "bg-primary/10 text-primary" : "bg-muted text-foreground",
          )}
        >
          <Icon aria-hidden="true" className="size-4.5" />
        </span>

        <div className="min-w-0 space-y-2">
          <h2
            id="resolution-heading"
            className="text-section font-bold text-balance"
          >
            {heading}
          </h2>
          {resolution ? (
            <p className="text-muted-foreground max-w-[68ch] text-[0.9375rem] leading-[1.6] text-pretty">
              {resolution}
            </p>
          ) : null}
        </div>
      </div>

      <div className="panel-inset border-border/70 flex flex-wrap gap-2 border-t px-4 py-3.5 sm:px-5">
        <Button asChild size="lg">
          <Link href="/">Start a new investigation</Link>
        </Button>
        {restartHref ? (
          <Button asChild variant="outline" size="lg">
            <Link href={restartHref}>Run this example again</Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}
