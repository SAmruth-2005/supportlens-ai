import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SessionStep, StepResult } from "@/types/supportlens";

const RESULT_LABEL: Record<StepResult, string> = {
  success: "Worked",
  failure: "Didn't work",
  unsure: "Not sure",
};

export function SessionTimeline({ steps }: { steps: SessionStep[] }) {
  if (steps.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold tracking-[-0.01em]">
          Steps already taken
        </h2>
      </CardHeader>
      <CardContent>
        <ol className="divide-border/70 divide-y">
          {steps.map((entry) => (
            <li
              key={entry.step_order}
              className="space-y-2 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-muted-foreground tabular font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
                  Step {entry.step_order}
                </span>
                <h3 className="font-semibold">{entry.step.title}</h3>
                {entry.user_result ? (
                  <span className="text-muted-foreground text-sm">
                    — {RESULT_LABEL[entry.user_result]}
                  </span>
                ) : null}
              </div>
              {entry.ai_reasoning_summary ? (
                <p className="text-muted-foreground max-w-[68ch] text-sm leading-[1.65] text-pretty">
                  {entry.ai_reasoning_summary}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
