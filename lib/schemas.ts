/**
 * Runtime validation for model output.
 *
 * Nothing the model returns reaches workflow logic without passing through
 * here first (docs/SUPPORTLENS_AI_PROMPTS.md §7: "Never trust model output
 * blindly"). The Gemini layer added in Phase 2 parses against these schemas
 * and falls back to a safe response when parsing fails.
 */
import { z } from "zod";

import {
  ISSUE_CATEGORIES,
  SEVERITIES,
  SESSION_STATUSES,
  STEP_RESULTS,
} from "@/types/supportlens";

export const issueCategorySchema = z.enum(ISSUE_CATEGORIES);
export const severitySchema = z.enum(SEVERITIES);
export const sessionStatusSchema = z.enum(SESSION_STATUSES);
export const stepResultSchema = z.enum(STEP_RESULTS);

export const likelyCauseSchema = z.object({
  cause: z.string().min(1),
  reason: z.string().min(1),
});

export const troubleshootingStepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  instruction: z.string().min(1),
  expected_signal: z.string().min(1),
  safe: z.boolean(),
});

export const nextStepOptionSchema = z.object({
  result: z.string().min(1),
  next_step: z.string().min(1),
});

export const diagnosisSchema = z.object({
  category: issueCategorySchema,
  severity: severitySchema,
  summary: z.string().min(1),
  likely_causes: z.array(likelyCauseSchema).max(6),
  first_step: troubleshootingStepSchema,
  next_step_options: z.array(nextStepOptionSchema).max(6),
});

/** Response shape for the result-interpretation prompt. */
export const interpretationSchema = z.object({
  status: z.enum(["continue", "resolved", "escalate", "unknown"]),
  updated_assessment: z.string().min(1),
  next_step: z
    .object({
      id: z.string().min(1),
      title: z.string().min(1),
      instruction: z.string().min(1),
      why: z.string().min(1),
    })
    .nullable(),
});

/** Inbound payload for the analyze endpoint (Phase 2). */
export const analyzeRequestSchema = z.object({
  issue_text: z
    .string()
    .trim()
    .min(10, "Describe the issue in at least a few words.")
    .max(2000, "Please keep the description under 2000 characters."),
});

/** Inbound payload for the troubleshoot endpoint (Phase 3). */
export const troubleshootRequestSchema = z.object({
  session_id: z.string().trim().min(1, "A session id is required."),
  result: stepResultSchema,
  /** Optional guard: the step the client believes it is answering. */
  step_id: z.string().trim().min(1).optional(),
});

export type DiagnosisInput = z.input<typeof diagnosisSchema>;
export type Interpretation = z.infer<typeof interpretationSchema>;
export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type TroubleshootRequest = z.infer<typeof troubleshootRequestSchema>;
