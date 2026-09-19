import { Check, CircleHelp, Flag, ScanSearch, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  SessionStatus,
  SessionStep,
  StepResult,
} from "@/types/supportlens";

const RESULT_LABEL: Record<StepResult, string> = {
  success: "Worked",
  failure: "Failed",
  unsure: "Unclear",
};

const OUTCOME_LABEL: Record<Exclude<SessionStatus, "active">, string> = {
  resolved: "Resolved",
  escalated: "Escalated",
  unsolved: "Not enough information",
};

type NodeState = "done" | "current" | "pending";

function Node({
  state,
  icon: Icon,
}: {
  state: NodeState;
  icon: typeof Check;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full",
        state === "done" && "bg-foreground/8 text-muted-foreground",
        state === "current" && "bg-primary text-primary-foreground",
        state === "pending" &&
          "text-muted-foreground/40 ring-1 ring-border ring-inset",
      )}
    >
      <Icon className="size-3" />
    </span>
  );
}

export interface SessionTimelineProps {
  steps: SessionStep[];
  status: SessionStatus;
}

/**
 * The investigation path: where the session started, every check answered so
 * far, the check awaiting an answer, and how it ended. Derived entirely from
 * the session the engine produced.
 */
export function SessionTimeline({ steps, status }: SessionTimelineProps) {
  const isActive = status === "active";

  return (
    <section aria-labelledby="timeline-heading" className="panel overflow-hidden">
      <div className="panel-inset border-border/70 border-b px-4 py-2.5 sm:px-5">
        <h2 id="timeline-heading" className="eyebrow text-muted-foreground">
          Investigation path
        </h2>
      </div>

      <ol className="px-4 py-4 sm:px-5">
        <li className="flex gap-3">
          <div className="flex flex-col items-center">
            <Node state="done" icon={ScanSearch} />
            <span aria-hidden="true" className="bg-border/70 w-px flex-1" />
          </div>
          <div className="min-w-0 pb-4">
            <p className="text-sm font-semibold">Diagnosis</p>
            <p className="text-muted-foreground text-xs">
              Category, severity and likely causes identified
            </p>
          </div>
        </li>

        {steps.map((entry) => {
          const answered = entry.user_result !== null;
          const state: NodeState = answered ? "done" : "current";

          return (
            <li key={entry.step_order} className="flex gap-3">
              <div className="flex flex-col items-center">
                <Node
                  state={state}
                  icon={
                    !answered
                      ? ScanSearch
                      : entry.user_result === "success"
                        ? Check
                        : entry.user_result === "failure"
                          ? X
                          : CircleHelp
                  }
                />
                <span aria-hidden="true" className="bg-border/70 w-px flex-1" />
              </div>

              <div className="min-w-0 pb-4">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <p
                    className={cn(
                      "text-sm text-pretty",
                      answered ? "font-medium" : "text-primary font-semibold",
                    )}
                  >
                    {entry.step.title}
                  </p>
                  {answered ? (
                    <span className="mono-meta text-muted-foreground/70">
                      {RESULT_LABEL[entry.user_result!]}
                    </span>
                  ) : (
                    <span className="mono-meta text-primary">Current</span>
                  )}
                </div>
                {entry.ai_reasoning_summary ? (
                  <p className="text-muted-foreground mt-0.5 max-w-[68ch] text-xs leading-[1.55] text-pretty">
                    {entry.ai_reasoning_summary}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}

        <li className="flex gap-3">
          <div className="flex flex-col items-center">
            <Node state={isActive ? "pending" : "done"} icon={Flag} />
          </div>
          <div className="min-w-0">
            <p
              className={cn(
                "text-sm",
                isActive
                  ? "text-muted-foreground/60"
                  : "font-semibold",
              )}
            >
              {isActive
                ? "Outcome"
                : OUTCOME_LABEL[status as Exclude<SessionStatus, "active">]}
            </p>
            {isActive ? (
              <p className="text-muted-foreground/60 text-xs">
                Resolved or escalated once the checks conclude
              </p>
            ) : null}
          </div>
        </li>
      </ol>
    </section>
  );
}
