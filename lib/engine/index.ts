/**
 * Troubleshooting engine.
 *
 * Pure, deterministic transitions over a TroubleshootingSession. No I/O, no
 * model calls, no randomness — given the same session and result it always
 * produces the same next state, which is what makes it testable.
 *
 * The model supplies the diagnosis; this file decides what happens when the
 * user reports a result.
 */
import type {
  Diagnosis,
  SessionStep,
  StepResult,
  TroubleshootingSession,
} from "@/types/supportlens";

import type { StepOutcome } from "./catalog";
import { MAX_STEPS_PER_SESSION, getCatalogEntry } from "./catalog";

export type { StepOutcome } from "./catalog";
export { MAX_STEPS_PER_SESSION, STEP_CATALOG } from "./catalog";

/** A session that has not been written to a store yet. */
export type NewSession = Omit<
  TroubleshootingSession,
  "created_at" | "updated_at"
>;

export interface CreateSessionInput {
  id: string;
  issueText: string;
  diagnosis: Diagnosis;
  isDemo?: boolean;
  /** Steps already completed, used when seeding a worked example. */
  completedSteps?: SessionStep[];
}

/** Build a fresh active session whose current step is the diagnosis first step. */
export function createSession({
  id,
  issueText,
  diagnosis,
  isDemo = false,
  completedSteps = [],
}: CreateSessionInput): NewSession {
  const steps: SessionStep[] = [
    ...completedSteps,
    {
      step_order: completedSteps.length + 1,
      step: diagnosis.first_step,
      user_result: null,
      ai_reasoning_summary: null,
    },
  ];

  return {
    id,
    issue_text: issueText,
    status: "active",
    diagnosis,
    steps,
    final_resolution: null,
    is_demo: isDemo,
  };
}

/** The step awaiting a result, or null when the session has ended. */
export function currentStep(
  session: TroubleshootingSession,
): SessionStep | null {
  return session.steps.find((entry) => entry.user_result === null) ?? null;
}

export function isTerminal(session: TroubleshootingSession): boolean {
  return session.status !== "active";
}

export type AdvanceFailure =
  | "session_ended"
  | "no_current_step"
  | "step_mismatch";

export type AdvanceResult =
  | { ok: true; session: TroubleshootingSession; outcome: StepOutcome }
  | { ok: false; reason: AdvanceFailure; message: string };

/**
 * Resolve what a reported result means for the current step.
 *
 * Preference order:
 *   1. The catalog's explicit transition for this step.
 *   2. The diagnosis's own next_step_options, for a model-invented step id.
 *   3. Escalate — we will not guess.
 */
function resolveOutcome(
  session: TroubleshootingSession,
  stepId: string,
  result: StepResult,
): StepOutcome {
  const entry = getCatalogEntry(stepId);
  if (entry) return entry.transitions[result];

  const suggested = session.diagnosis?.next_step_options.find(
    (option) => option.result === result,
  );
  if (suggested) {
    return {
      kind: "step",
      step_id: suggested.next_step,
      because: "Continuing along the path identified during the diagnosis.",
    };
  }

  return {
    kind: "escalate",
    because:
      "There is no defined follow-up for that result, so rather than guess, this should go to a support team.",
  };
}

/**
 * Apply a reported result and return the next session state.
 *
 * `expectedStepId` guards against a stale client submitting a result for a step
 * that has already been answered.
 */
export function advance(
  session: TroubleshootingSession,
  result: StepResult,
  expectedStepId?: string,
): AdvanceResult {
  if (isTerminal(session)) {
    return {
      ok: false,
      reason: "session_ended",
      message: `This session has already ended (${session.status}).`,
    };
  }

  const current = currentStep(session);
  if (!current) {
    return {
      ok: false,
      reason: "no_current_step",
      message: "This session has no step awaiting a result.",
    };
  }

  if (expectedStepId && expectedStepId !== current.step.id) {
    return {
      ok: false,
      reason: "step_mismatch",
      message: `Expected a result for "${current.step.id}", not "${expectedStepId}".`,
    };
  }

  let outcome = resolveOutcome(session, current.step.id, result);

  // Guard the two ways a "step" outcome can fail to produce a usable step.
  if (outcome.kind === "step") {
    if (!getCatalogEntry(outcome.step_id)) {
      outcome = {
        kind: "escalate",
        because: `No further automated step is defined for "${outcome.step_id}". A support team should continue from here.`,
      };
    } else if (session.steps.length >= MAX_STEPS_PER_SESSION) {
      outcome = {
        kind: "escalate",
        because: `We have worked through ${MAX_STEPS_PER_SESSION} checks without resolving this. It needs someone with deeper access.`,
      };
    }
  }

  const answered: SessionStep = {
    ...current,
    user_result: result,
    ai_reasoning_summary: outcome.because,
  };

  const steps = session.steps.map((entry) =>
    entry.step_order === current.step_order ? answered : entry,
  );

  if (outcome.kind === "step") {
    const next = getCatalogEntry(outcome.step_id)!;
    steps.push({
      step_order: steps.length + 1,
      step: next.step,
      user_result: null,
      ai_reasoning_summary: null,
    });

    return {
      ok: true,
      outcome,
      session: { ...session, steps, updated_at: new Date().toISOString() },
    };
  }

  const status =
    outcome.kind === "resolved"
      ? "resolved"
      : outcome.kind === "escalate"
        ? "escalated"
        : "unsolved";

  return {
    ok: true,
    outcome,
    session: {
      ...session,
      steps,
      status,
      final_resolution: outcome.because,
      updated_at: new Date().toISOString(),
    },
  };
}

/** Shape returned to clients: the session plus the step awaiting an answer. */
export function toSessionView(session: TroubleshootingSession) {
  return { session, current_step: currentStep(session) };
}
