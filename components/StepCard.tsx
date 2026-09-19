"use client";

import { CheckCircle2, CircleHelp, ShieldCheck, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
  const disabled = !onResult || pending;

  return (
    <Card className="border-primary/30 shadow-lg">
      <CardHeader className="gap-3">
        <span className="text-primary font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
          Step {stepNumber} · do this now
        </span>
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-balance">
          {step.title}
        </h2>
      </CardHeader>

      <CardContent className="space-y-5">
        <p className="max-w-[68ch] text-[1.0625rem] leading-[1.65] text-pretty">
          {step.instruction}
        </p>

        <dl className="border-border/70 space-y-2 border-l-2 pl-4 text-sm">
          <div className="flex flex-col gap-0.5">
            <dt className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
              What to look for
            </dt>
            <dd className="max-w-[68ch] text-pretty">{step.expected_signal}</dd>
          </div>
        </dl>

        {step.safe ? (
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <ShieldCheck aria-hidden="true" className="size-4 shrink-0" />
            Read-only check. It does not change your system configuration.
          </p>
        ) : null}
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-3">
        <p className="text-muted-foreground text-sm">
          Once you have tried it, report what happened:
        </p>
        <div className="flex flex-wrap gap-2">
          {RESULT_ACTIONS.map(({ result, label, icon: Icon }) => (
            <Button
              key={result}
              type="button"
              variant={result === "success" ? "default" : "outline"}
              disabled={disabled}
              onClick={() => onResult?.(result)}
              className="transition-[transform,box-shadow] duration-150 motion-safe:hover:-translate-y-px"
            >
              <Icon aria-hidden="true" />
              {label}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
