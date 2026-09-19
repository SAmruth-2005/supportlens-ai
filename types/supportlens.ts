/**
 * SupportLens AI — core domain types.
 *
 * These mirror the JSON contracts defined in docs/SUPPORTLENS_AI_PROMPTS.md.
 * Keep this file and lib/schemas.ts in sync: the types describe the shape,
 * the schemas enforce it at runtime on anything that comes back from the model.
 */

export const ISSUE_CATEGORIES = [
  "network",
  "dns",
  "wifi",
  "vpn",
  "browser",
  "application",
  "system",
  "unknown",
] as const;

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];

export const SEVERITIES = ["low", "medium", "high"] as const;
export type Severity = (typeof SEVERITIES)[number];

/** Lifecycle of a troubleshooting session (docs/SUPPORTLENS_DATABASE.md). */
export const SESSION_STATUSES = [
  "active",
  "resolved",
  "escalated",
  "unsolved",
] as const;
export type SessionStatus = (typeof SESSION_STATUSES)[number];

/** What the user reports back after performing a step. */
export const STEP_RESULTS = ["success", "failure", "unsure"] as const;
export type StepResult = (typeof STEP_RESULTS)[number];

export interface LikelyCause {
  cause: string;
  reason: string;
}

/** One safe diagnostic action the user is asked to perform. */
export interface TroubleshootingStep {
  id: string;
  title: string;
  instruction: string;
  expected_signal: string;
  safe: boolean;
}

export interface NextStepOption {
  result: string;
  next_step: string;
}

/** First-pass analysis of an issue. */
export interface Diagnosis {
  category: IssueCategory;
  severity: Severity;
  summary: string;
  likely_causes: LikelyCause[];
  first_step: TroubleshootingStep;
  next_step_options: NextStepOption[];
}

/** A step that has been issued, plus the result if the user has reported one. */
export interface SessionStep {
  step_order: number;
  step: TroubleshootingStep;
  user_result: StepResult | null;
  ai_reasoning_summary: string | null;
}

export interface TroubleshootingSession {
  id: string;
  created_at: string;
  updated_at: string;
  issue_text: string;
  status: SessionStatus;
  diagnosis: Diagnosis | null;
  steps: SessionStep[];
  final_resolution: string | null;
  /** True when the session is driven by a seeded scenario rather than the model. */
  is_demo: boolean;
}
