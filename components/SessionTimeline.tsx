import { CheckCircle2, CircleHelp, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SessionStep, StepResult } from "@/types/supportlens";

const RESULT_META: Record<
  StepResult,
  { label: string; icon: typeof CheckCircle2; tone: string }
> = {
  success: { label: "Worked", icon: CheckCircle2, tone: "text-foreground" },
  failure: { label: "Didn't work", icon: XCircle, tone: "text-muted-foreground" },
  unsure: { label: "Not sure", icon: CircleHelp, tone: "text-muted-foreground" },
};

export function SessionTimeline({ steps }: { steps: SessionStep[] }) {
  if (steps.length === 0) return null;

  return (
    <section aria-labelledby="timeline-heading" className="space-y-3">
      <h2 id="timeline-heading" className="eyebrow text-muted-foreground">
        Steps already taken
      </h2>

      <ol className="space-y-0">
        {steps.map((entry, index) => {
          const meta = entry.user_result
            ? RESULT_META[entry.user_result]
            : null;
          const Icon = meta?.icon;
          const isLast = index === steps.length - 1;

          return (
            <li key={entry.step_order} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  aria-hidden="true"
                  className="bg-background ring-border/70 flex size-6 shrink-0 items-center justify-center rounded-full ring-1"
                >
                  {Icon ? (
                    <Icon className={cn("size-3.5", meta?.tone)} />
                  ) : (
                    <span className="bg-foreground/30 size-1.5 rounded-full" />
                  )}
                </span>
                {!isLast ? (
                  <span aria-hidden="true" className="bg-border/70 w-px flex-1" />
                ) : null}
              </div>

              <div className={cn("min-w-0 space-y-1", isLast ? "pb-0" : "pb-5")}>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <h3 className="text-sm font-semibold text-pretty">
                    {entry.step.title}
                  </h3>
                  {meta ? (
                    <span className="text-muted-foreground text-xs">
                      · {meta.label}
                    </span>
                  ) : null}
                </div>
                {entry.ai_reasoning_summary ? (
                  <p className="text-muted-foreground max-w-[68ch] text-sm leading-[1.6] text-pretty">
                    {entry.ai_reasoning_summary}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
