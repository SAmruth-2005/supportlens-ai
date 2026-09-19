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
  { result: "failure", label: "Didn't work", icon: XCircle },
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
      className="bg-card surface-raised animate-rise ring-primary/25 overflow-hidden rounded-xl ring-1"
    >
      <div aria-hidden="true" className="bg-primary h-[3px] w-full" />

      <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="eyebrow text-primary">Do this now</p>
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex items-center gap-1"
              data-step={stepNumber}
            >
              {Array.from({ length: stepNumber }, (_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    index === stepNumber - 1
                      ? "bg-primary w-5"
                      : "bg-foreground/20 w-1.5",
                  )}
                />
              ))}
            </span>
            <span className="text-muted-foreground tabular eyebrow">
              Step {stepNumber}
            </span>
          </div>
        </div>

        <h2
          id="step-heading"
          className="text-section font-bold text-balance"
        >
          {step.title}
        </h2>

        <p className="max-w-[68ch] text-[1.0625rem] leading-[1.6] text-pretty">
          {step.instruction}
        </p>

        <div className="bg-muted/50 border-border/70 rounded-lg border px-4 py-3">
          <p className="eyebrow text-muted-foreground mb-1">What to look for</p>
          <p className="max-w-[68ch] text-sm leading-[1.6] text-pretty">
            {step.expected_signal}
          </p>
        </div>

        {step.safe ? (
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0" />
            Read-only check — it does not change your system configuration.
          </p>
        ) : null}
      </div>

      <div className="border-border/70 bg-muted/40 space-y-3 border-t px-5 py-4 sm:px-6">
        <p className="text-muted-foreground text-sm">
          Once you have tried it, report what happened:
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {RESULT_ACTIONS.map(({ result, label, icon: Icon }) => (
            <Button
              key={result}
              type="button"
              size="xl"
              variant={result === "success" ? "default" : "outline"}
              disabled={disabled}
              onClick={() => handleClick(result)}
              className="w-full transition-[transform,box-shadow] duration-150 motion-safe:hover:-translate-y-px"
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
