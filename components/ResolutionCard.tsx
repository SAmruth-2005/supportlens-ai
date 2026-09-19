import Link from "next/link";
import { CheckCircle2, CircleHelp, LifeBuoy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { SessionStatus } from "@/types/supportlens";

const OUTCOME = {
  resolved: {
    icon: CheckCircle2,
    eyebrow: "Resolved",
    heading: "This looks sorted",
  },
  escalated: {
    icon: LifeBuoy,
    eyebrow: "Escalation recommended",
    heading: "This needs someone with deeper access",
  },
  unsolved: {
    icon: CircleHelp,
    eyebrow: "Not enough information",
    heading: "We could not take this further",
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
  const { icon: Icon, eyebrow, heading } = OUTCOME[status];

  return (
    <Card className="border-primary/30">
      <CardHeader className="gap-3">
        <span className="text-primary flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
          <Icon aria-hidden="true" className="size-4" />
          {eyebrow}
        </span>
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-balance">
          {heading}
        </h2>
      </CardHeader>

      {resolution ? (
        <CardContent>
          <p className="max-w-[68ch] leading-[1.65] text-pretty">{resolution}</p>
        </CardContent>
      ) : null}

      <CardFooter className="flex-wrap gap-2">
        <Button asChild>
          <Link href="/">Start a new diagnosis</Link>
        </Button>
        {restartHref ? (
          <Button asChild variant="outline">
            <Link href={restartHref}>Run this example again</Link>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
