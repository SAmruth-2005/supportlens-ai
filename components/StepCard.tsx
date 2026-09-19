"use client";

import { useState } from "react";
import {
  CheckCircle2,
  CircleHelp,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StepResult, TroubleshootingStep } from "@/types/supportlens";

const RESULT_ACTIONS: {
  result: StepResult;
  label: string;
  icon: typeof CheckCircle2;
}[] = [
  { result: "success", label: "It worked", icon: CheckCircle2 },
  { result: "failure", label: "It failed", icon: XCircle },
  { result: "unsure", label: "Not sure", icon: CircleHelp },
];

export interface StepCardProps {
  step: TroubleshootingStep;
  stepNumber: number;
  /** Omit while the troubleshooting engine is not connected — buttons disable. */
  onResult?: (result: StepResult) => void;
  pending?: boolean;
}

export function StepCard({
  step,
  stepNumber,
  onResult,
  pending = false,
}: StepCardProps) {
  const [pressed, setPressed] = useState<StepResult | null>(null);
  const disabled = !onResult || pending;

  function handleClick(result: StepResult) {
    setPressed(result);
    onResult?.(result);
  }

  return (
    <section
      aria-labelledby="step-heading"
      className="panel-raised animate-rise overflow-hidden"
    >
      <div aria-hidden="true" className="bg-primary h-0.5 w-full" />

      <div className="panel-inset border-border/70 flex items-center justify-between gap-3 border-b px-4 py-2.5 sm:px-5">
        <p className="eyebrow text-primary flex items-center gap-2">
          <span
            aria-hidden="true"
            className="bg-primary inline-block size-1.5 rounded-full"
          />
          Recommended action
        </p>
        <span className="mono-meta text-muted-foreground">
          Step {String(stepNumber).padStart(2, "0")}
        </span>
      </div>

      <div className="space-y-4 px-4 py-5 sm:px-5">
        <h2 id="step-heading" className="text-section font-bold text-balance">
          {step.title}
        </h2>

        <p className="max-w-[68ch] text-[1.0625rem] leading-[1.6] text-pretty">
          {step.instruction}
        </p>

        <div className="border-border/70 border-l-2 pl-3.5">
          <p className="eyebrow text-muted-foreground/80 mb-1">
            What to look for
          </p>
          <p className="text-muted-foreground max-w-[68ch] text-sm leading-[1.55] text-pretty">
            {step.expected_signal}
          </p>
        </div>

        {step.safe ? (
          <p className="text-muted-foreground/80 flex items-center gap-1.5 text-xs">
            <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0" />
            Read-only check — it does not change your configuration.
          </p>
        ) : null}
      </div>

      <div className="panel-inset border-border/70 space-y-2.5 border-t px-4 py-3.5 sm:px-5">
        <p className="eyebrow text-muted-foreground">What happened?</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {RESULT_ACTIONS.map(({ result, label, icon: Icon }) => (
            <Button
              key={result}
              type="button"
              size="xl"
              variant={result === "success" ? "default" : "outline"}
              disabled={disabled}
              onClick={() => handleClick(result)}
              className={cn(
                "w-full transition-[transform,box-shadow] duration-150",
                "motion-safe:hover:-translate-y-px",
              )}
            >
              {pending && pressed === result ? (
                <Loader2 aria-hidden="true" className="animate-spin" />
              ) : (
                <Icon aria-hidden="true" />
              )}
              {label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
