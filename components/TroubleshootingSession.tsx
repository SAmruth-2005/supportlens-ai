"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";

import { CausesList } from "@/components/CausesList";
import { DiagnosisCard } from "@/components/DiagnosisCard";
import { ResolutionCard } from "@/components/ResolutionCard";
import { SessionTimeline } from "@/components/SessionTimeline";
import { StepCard } from "@/components/StepCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { StepResult, TroubleshootingSession } from "@/types/supportlens";

export interface TroubleshootingSessionProps {
  initialSession: TroubleshootingSession;
  restartHref?: string;
}

export function TroubleshootingSessionView({
  initialSession,
  restartHref,
}: TroubleshootingSessionProps) {
  const [session, setSession] = useState(initialSession);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = session.steps.find((entry) => entry.user_result === null);
  const answered = session.steps.filter((entry) => entry.user_result !== null);

  async function handleResult(result: StepResult) {
    if (!current || pending) return;

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/troubleshoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: session.id,
          result,
          step_id: current.step.id,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.error ?? "That result could not be recorded.");
        return;
      }

      setSession(payload.session);
    } catch {
      setError("Could not reach the server. Check your connection and retry.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      {session.diagnosis ? (
        <DiagnosisCard diagnosis={session.diagnosis} />
      ) : null}

      {error ? (
        <Alert className="animate-rise">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>Could not record that result</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {current ? (
        // Keyed so the step's own transient state resets on each new step.
        <StepCard
          key={current.step.id}
          step={current.step}
          stepNumber={current.step_order}
          onResult={handleResult}
          pending={pending}
        />
      ) : (
        <ResolutionCard
          status={session.status === "active" ? "unsolved" : session.status}
          resolution={session.final_resolution}
          restartHref={restartHref}
        />
      )}

      <SessionTimeline steps={answered} />

      {session.diagnosis ? (
        <CausesList causes={session.diagnosis.likely_causes} />
      ) : null}
    </div>
  );
}
