import Link from "next/link";
import { CheckCircle2, CircleHelp, LifeBuoy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SessionStatus } from "@/types/supportlens";

const OUTCOME = {
  resolved: {
    icon: CheckCircle2,
    eyebrow: "Resolved",
    heading: "This looks sorted",
    accent: true,
  },
  escalated: {
    icon: LifeBuoy,
    eyebrow: "Escalation recommended",
    heading: "This needs someone with deeper access",
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
  /** Demo sessions offer a re-run so the walkthrough can be shown again. */
  restartHref?: string;
}

export function ResolutionCard({
  status,
  resolution,
  restartHref,
}: ResolutionCardProps) {
  const { icon: Icon, eyebrow, heading, accent } = OUTCOME[status];

  return (
    <section
      aria-labelledby="resolution-heading"
      className={cn(
        "bg-card surface-raised animate-rise overflow-hidden rounded-xl ring-1",
        accent ? "ring-primary/25" : "ring-foreground/10",
      )}
    >
      <div
        aria-hidden="true"
        className={cn("h-[3px] w-full", accent ? "bg-primary" : "bg-border")}
      />

      <div className="space-y-4 px-5 py-6 sm:px-6 sm:py-7">
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-full",
            accent ? "bg-primary/10 text-primary" : "bg-muted text-foreground",
          )}
        >
          <Icon aria-hidden="true" className="size-5" />
        </span>

        <div className="space-y-2">
          <p
            className={cn(
              "eyebrow",
              accent ? "text-primary" : "text-muted-foreground",
            )}
          >
            {eyebrow}
          </p>
          <h2
            id="resolution-heading"
            className="text-section font-bold text-balance"
          >
            {heading}
          </h2>
        </div>

        {resolution ? (
          <p className="max-w-[68ch] text-[0.9375rem] leading-[1.65] text-pretty">
            {resolution}
          </p>
        ) : null}
      </div>

      <div className="border-border/70 bg-muted/40 flex flex-wrap gap-2 border-t px-5 py-4 sm:px-6">
        <Button asChild size="lg">
          <Link href="/">Start a new diagnosis</Link>
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
