/**
 * Session persistence boundary.
 *
 * The workflow only ever talks to this interface. Phase 1 ships the in-memory
 * implementation; a Supabase implementation can be dropped in later without
 * touching a single component. docs/SUPPORTLENS_DATABASE.md is explicit that
 * persistence must never block the core troubleshooting experience.
 */
import type { TroubleshootingSession } from "@/types/supportlens";

export interface SessionStore {
  create(
    session: Omit<TroubleshootingSession, "created_at" | "updated_at">,
  ): Promise<TroubleshootingSession>;
  get(id: string): Promise<TroubleshootingSession | null>;
  update(
    id: string,
    patch: Partial<Omit<TroubleshootingSession, "id" | "created_at">>,
  ): Promise<TroubleshootingSession | null>;
  list(limit?: number): Promise<TroubleshootingSession[]>;
}

/**
 * In-process memory alone is not enough on serverless, where consecutive
 * requests may land on different instances. The durable store keeps that fast
 * path and carries the session in a cookie so it survives the hop.
 */
export { durableStore as sessionStore } from "./cookie";
