/**
 * In-memory SessionStore.
 *
 * Process-local and lost on restart, which is acceptable for the hackathon
 * build: it keeps the troubleshooting workflow fully functional whether or not
 * a database is wired up.
 */
import type { TroubleshootingSession } from "@/types/supportlens";

import type { SessionStore } from "./index";

/**
 * Held on globalThis deliberately.
 *
 * In dev, route handlers and server components are bundled separately, so a
 * module-level Map would give each its own copy and a session written by one
 * would be invisible to the other. Hot reloads would also wipe it. This is the
 * same singleton pattern used for dev database clients.
 */
const globalForSessions = globalThis as typeof globalThis & {
  __supportlensSessions?: Map<string, TroubleshootingSession>;
};

const sessions: Map<string, TroubleshootingSession> =
  globalForSessions.__supportlensSessions ??
  (globalForSessions.__supportlensSessions = new Map());

function now(): string {
  return new Date().toISOString();
}

export const memoryStore: SessionStore = {
  async create(session) {
    const timestamp = now();
    const record: TroubleshootingSession = {
      ...session,
      created_at: timestamp,
      updated_at: timestamp,
    };
    sessions.set(record.id, record);
    return record;
  },

  async get(id) {
    return sessions.get(id) ?? null;
  },

  async update(id, patch) {
    const existing = sessions.get(id);
    if (!existing) return null;

    const updated: TroubleshootingSession = {
      ...existing,
      ...patch,
      id: existing.id,
      created_at: existing.created_at,
      updated_at: now(),
    };
    sessions.set(id, updated);
    return updated;
  },

  async list(limit = 20) {
    return [...sessions.values()]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit);
  },
};
