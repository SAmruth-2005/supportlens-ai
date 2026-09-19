/**
 * Gemini client — SERVER ONLY.
 *
 * This module reads GEMINI_API_KEY and must never be imported from a file
 * carrying "use client". Every Gemini call in the application goes through
 * here, and every response is validated before it is returned.
 *
 * Contract (docs/SUPPORTLENS_MASTER_BLUEPRINT.md §15):
 *   1. Ask the model for native structured JSON.
 *   2. Validate with Zod.
 *   3. On failure, attempt exactly one controlled repair.
 *   4. If that also fails, return the safe fallback — never raw model text.
 */
import { GoogleGenAI } from "@google/genai";

import {
  CATALOG_STEP_IDS,
  DIAGNOSIS_RESPONSE_SCHEMA,
  FALLBACK_DIAGNOSIS,
  SYSTEM_PROMPT,
  buildDiagnosisPrompt,
  buildRepairPrompt,
} from "@/lib/prompts";
import { diagnosisSchema } from "@/lib/schemas";
import type { Diagnosis } from "@/types/supportlens";

/**
 * Verified working model. gemini-2.5-flash returns 404 for new API keys — do
 * not reintroduce it.
 */
export const GEMINI_MODEL = "gemini-3.6-flash";

/** Per-attempt timeout. Observed successful calls have taken up to ~28s. */
const REQUEST_TIMEOUT_MS = 45_000;

/** Total attempts per request: 1 initial + 3 retries. */
const MAX_ATTEMPTS = 4;

/** Backoff doubles per retry: 500ms, 1s, 2s (plus jitter). */
const BASE_BACKOFF_MS = 500;

/** Hard ceiling on one request including retries and waiting. */
const TOTAL_BUDGET_MS = 90_000;

/**
 * Longest API-requested retry delay we will wait out. Anything longer means the
 * limit is not going to clear in time, so retrying only spends more quota.
 */
const MAX_HONOURED_RETRY_DELAY_MS = 5_000;

/** Where a returned diagnosis came from, so the UI can label it honestly. */
export type DiagnosisSource = "model" | "model_repaired" | "fallback";

/** Optional screenshot evidence. Request-scoped only — never stored or logged. */
export interface ScreenshotInput {
  mimeType: string;
  /** Base64 payload with no data: prefix. */
  data: string;
}

export type AnalyzeOutcome =
  | {
      ok: true;
      diagnosis: Diagnosis;
      source: DiagnosisSource;
      model: string;
    }
  | {
      ok: false;
      kind: "config" | "upstream" | "timeout" | "invalid_image";
      message: string;
    };

/**
 * Strip the API key from any string before it is logged. The SDK sends the key
 * as a header rather than a query parameter, but errors are not worth trusting
 * with a secret.
 */
function redact(value: unknown): string {
  const key = process.env.GEMINI_API_KEY;
  let text = value instanceof Error ? value.message : String(value);

  if (key) text = text.split(key).join("[REDACTED]");

  // An upstream error could echo the request. Never let image bytes reach a log.
  text = text
    .replace(/data:image\/[a-z+]+;base64,[A-Za-z0-9+/=]*/gi, "[IMAGE REDACTED]")
    .replace(/[A-Za-z0-9+/]{200,}={0,2}/g, "[IMAGE REDACTED]");

  return text.length > 800 ? `${text.slice(0, 800)}… [truncated]` : text;
}

/**
 * Did the upstream reject the image itself?
 *
 * Only consulted when we actually sent one. A 400 alone is not enough — it has
 * to name the media part, or we would misreport a genuine service fault as the
 * user's mistake.
 */
function isInvalidImageError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const status = (error as { status?: unknown }).status;
  const is400 = status === 400 || /"code"\s*:\s*400\b/.test(error.message);
  if (!is400) return false;

  return /image|inline_?data|media|mime|decode|corrupt|unsupported/i.test(
    error.message,
  );
}

function getClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * How long the API asked us to wait, in ms, if it said so.
 *
 * A 429 carries RetryInfo. A short delay is a burst rate limit worth waiting
 * out; a long one (the free tier's daily quota reports ~41s) will not clear
 * inside our budget, and every retry spends another quota unit.
 */
function requestedRetryDelayMs(message: string): number | null {
  const match = /"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/.exec(message);
  return match ? Number(match[1]) * 1000 : null;
}

/**
 * Is this failure worth retrying?
 *
 * Gemini returns 503 UNAVAILABLE under load, which clears on its own. A 429 is
 * only retried when the API's own RetryInfo says the wait is short — retrying a
 * daily-quota 429 burns quota for a result that cannot arrive in time. Our own
 * timeout is not retried either: a second 45s attempt blows the latency budget.
 */
function isTransient(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if (error.name === "TimeoutError" || error.name === "AbortError") return false;

  // Daily quota exhaustion is not transient on any useful timescale.
  if (/GenerateRequestsPerDay|FreeTier/i.test(error.message)) return false;

  const askedFor = requestedRetryDelayMs(error.message);
  if (askedFor !== null && askedFor > MAX_HONOURED_RETRY_DELAY_MS) return false;

  const status = (error as { status?: unknown }).status;
  if (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    return true;
  }

  return (
    /"code"\s*:\s*(429|500|502|503|504)\b/.test(error.message) ||
    /UNAVAILABLE|RESOURCE_EXHAUSTED|DEADLINE_EXCEEDED/i.test(error.message) ||
    /fetch failed|ECONNRESET|ETIMEDOUT|EAI_AGAIN|socket hang up/i.test(
      error.message,
    )
  );
}

/**
 * One structured-output call, retried on transient upstream failures.
 *
 * Returns the response text only when Gemini actually answered — a retry is
 * never treated as success on its own. If every attempt fails, the last error
 * is thrown so the caller can classify it.
 */
async function requestJson(
  client: GoogleGenAI,
  prompt: string,
  image?: ScreenshotInput,
): Promise<string> {
  const startedAt = Date.now();
  let lastError: unknown;

  const contents = image
    ? [
        { text: prompt },
        { inlineData: { mimeType: image.mimeType, data: image.data } },
      ]
    : prompt;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await client.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: DIAGNOSIS_RESPONSE_SCHEMA,
          temperature: 0.3,
          // Fresh signal per attempt — a reused one is already aborted.
          abortSignal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        },
      });

      if (attempt > 1) {
        console.info(
          `[gemini] recovered on attempt ${attempt}/${MAX_ATTEMPTS} after ${Date.now() - startedAt}ms`,
        );
      }
      return response.text ?? "";
    } catch (error) {
      lastError = error;

      if (!isTransient(error) || attempt === MAX_ATTEMPTS) break;

      const wait =
        BASE_BACKOFF_MS * 2 ** (attempt - 1) + Math.floor(Math.random() * 250);

      if (Date.now() - startedAt + wait > TOTAL_BUDGET_MS) {
        console.warn("[gemini] retry budget exhausted, giving up");
        break;
      }

      console.warn(
        `[gemini] transient failure on attempt ${attempt}/${MAX_ATTEMPTS}, retrying in ${wait}ms:`,
        redact(error),
      );
      await sleep(wait);
    }
  }

  throw lastError;
}

/** Parse + validate. Returns the diagnosis, or a description of what failed. */
function validate(
  raw: string,
): { ok: true; diagnosis: Diagnosis } | { ok: false; problem: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, problem: "Response was not valid JSON." };
  }

  const result = diagnosisSchema.safeParse(parsed);
  if (!result.success) {
    const problem = result.error.issues
      .slice(0, 5)
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ");
    return { ok: false, problem };
  }

  // The response schema already constrains these, but an id the engine cannot
  // resolve must never reach it — so it is enforced here too, not assumed.
  const unknown = [
    result.data.first_step.id,
    ...result.data.next_step_options.map((option) => option.next_step),
  ].filter((id) => !CATALOG_STEP_IDS.includes(id));

  if (unknown.length > 0) {
    return {
      ok: false,
      problem: `Unknown step id(s): ${[...new Set(unknown)].join(", ")}. Use only the listed ids.`,
    };
  }

  return { ok: true, diagnosis: result.data };
}

/**
 * Turn an issue description into a validated diagnosis.
 *
 * Never throws — every failure mode is returned as a value so the route can map
 * it to a status code.
 */
export async function analyzeIssue(
  issueText: string,
  image?: ScreenshotInput,
): Promise<AnalyzeOutcome> {
  const client = getClient();
  if (!client) {
    return {
      ok: false,
      kind: "config",
      message: "GEMINI_API_KEY is not configured on the server.",
    };
  }

  const hasImage = Boolean(image);

  // Attempt 1 — normal diagnosis.
  let first: string;
  try {
    first = await requestJson(
      client,
      buildDiagnosisPrompt(issueText, hasImage),
      image,
    );
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    console.error("[gemini] request failed:", redact(error));

    if (isTimeout) {
      return {
        ok: false,
        kind: "timeout",
        message: "The analysis took too long to respond.",
      };
    }

    // Only blame the image when we actually sent one and the upstream said so.
    if (hasImage && isInvalidImageError(error)) {
      return {
        ok: false,
        kind: "invalid_image",
        message:
          "That screenshot could not be read. Try a different PNG, JPEG or WebP image.",
      };
    }

    return {
      ok: false,
      kind: "upstream",
      message: "The analysis service could not be reached.",
    };
  }

  const firstCheck = validate(first);
  if (firstCheck.ok) {
    return {
      ok: true,
      diagnosis: firstCheck.diagnosis,
      source: "model",
      model: GEMINI_MODEL,
    };
  }

  // Attempt 2 — one controlled repair, telling the model what was wrong.
  console.warn("[gemini] invalid output, retrying:", firstCheck.problem);
  try {
    // The image must be re-sent, or the repair loses its evidence.
    const repaired = await requestJson(
      client,
      buildRepairPrompt(issueText, firstCheck.problem, hasImage),
      image,
    );
    const repairedCheck = validate(repaired);
    if (repairedCheck.ok) {
      return {
        ok: true,
        diagnosis: repairedCheck.diagnosis,
        source: "model_repaired",
        model: GEMINI_MODEL,
      };
    }
    console.warn("[gemini] repair also invalid:", repairedCheck.problem);
  } catch (error) {
    console.error("[gemini] repair request failed:", redact(error));
  }

  // Both attempts unusable — hand back the safe fallback rather than raw text.
  return {
    ok: true,
    diagnosis: FALLBACK_DIAGNOSIS,
    source: "fallback",
    model: GEMINI_MODEL,
  };
}
