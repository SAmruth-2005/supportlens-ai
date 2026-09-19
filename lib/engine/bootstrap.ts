/**
 * Session bootstrap — SERVER ONLY.
 *
 * Bridges the store and the seeded scenarios. A demo session uses its scenario
 * id as the session id, so /session/internal-app-dns stays a stable, shareable
 * URL that re-seeds itself if the in-memory store has been restarted.
 */
import { getDemoScenario } from "@/lib/demo/scenarios";
import { sessionStore } from "@/lib/store";
import type { TroubleshootingSession } from "@/types/supportlens";

import { createSession } from "./index";

/**
 * Load a session, seeding it from a demo scenario when the id names one and
 * nothing is stored yet. Returns null for an unknown id.
 */
export async function loadOrSeedSession(
  id: string,
): Promise<TroubleshootingSession | null> {
  const existing = await sessionStore.get(id);
  if (existing) return existing;

  const scenario = getDemoScenario(id);
  if (!scenario) return null;

  return sessionStore.create(
    createSession({
      id: scenario.id,
      issueText: scenario.issue_text,
      diagnosis: scenario.diagnosis,
      isDemo: true,
      completedSteps: scenario.completed_steps,
    }),
  );
}

/** Discard a demo session's progress and seed it again from the scenario. */
export async function resetDemoSession(
  id: string,
): Promise<TroubleshootingSession | null> {
  const scenario = getDemoScenario(id);
  if (!scenario) return null;

  return sessionStore.create(
    createSession({
      id: scenario.id,
      issueText: scenario.issue_text,
      diagnosis: scenario.diagnosis,
      isDemo: true,
      completedSteps: scenario.completed_steps,
    }),
  );
}
