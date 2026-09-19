/**
 * Durable SessionStore — SERVER ONLY.
 *
 * Why this exists: the in-memory store is per-process. On a serverless platform
 * each request may be served by a different instance, so a session created by
 * one invocation is invisible to the next. Demo ids survive because they can be
 * re-seeded from the scenario file; a user's session cannot, so it 404s.
 *
 * The session therefore travels with the request, in an httpOnly cookie. It is
 * gzipped before encoding — a realistic session is 2–4.5 KB of JSON, which
 * compresses to roughly 1.1–1.9 KB, comfortably inside the ~4 KB cookie limit.
 *
 * In-process memory is still consulted first, so repeated reads inside one
 * invocation cost nothing.
 */
import { cookies } from "next/headers";
import { gunzipSync, gzipSync } from "node:zlib";

import type { TroubleshootingSession } from "@/types/supportlens";

import type { SessionStore } from "./index";
import { memoryStore } from "./memory";

const COOKIE_NAME = "sl_session";

/** Leaves headroom under the ~4096 byte per-cookie browser limit. */
const MAX_COOKIE_BYTES = 3800;

const MAX_AGE_SECONDS = 60 * 60 * 6;

function encode(session: TroubleshootingSession): string | null {
  try {
    const packed = gzipSync(Buffer.from(JSON.stringify(session))).toString(
      "base64url",
    );
    return packed.length > MAX_COOKIE_BYTES ? null : packed;
  } catch {
    return null;
  }
}

function decode(value: string): TroubleshootingSession | null {
  try {
    return JSON.parse(
      gunzipSync(Buffer.from(value, "base64url")).toString("utf8"),
    ) as TroubleshootingSession;
  } catch {
    return null;
  }
}

/** Reads the carried session, if it is the one being asked for. */
async function readCookie(id: string): Promise<TroubleshootingSession | null> {
  try {
    const value = (await cookies()).get(COOKIE_NAME)?.value;
    if (!value) return null;

    const session = decode(value);
    return session && session.id === id ? session : null;
  } catch {
    // No request scope available.
    return null;
  }
}

/**
 * Persists the session onto the response.
 *
 * Cookies can only be written from a route handler or server action. During a
 * server-component render the write is refused, which is harmless: a demo
 * session re-seeds itself, and a real session is always written by the route
 * handler that created or advanced it.
 */
async function writeCookie(session: TroubleshootingSession): Promise<void> {
  const value = encode(session);
  if (!value) {
    console.warn(
      `[store] session ${session.id} too large to carry in a cookie; it will not survive a cold instance`,
    );
    return;
  }

  try {
    (await cookies()).set(COOKIE_NAME, value, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE_SECONDS,
      secure: process.env.NODE_ENV === "production",
    });
  } catch {
    // Read-only cookie scope — nothing to do.
  }
}

export const durableStore: SessionStore = {
  async create(session) {
    const record = await memoryStore.create(session);
    await writeCookie(record);
    return record;
  },

  async get(id) {
    return (await memoryStore.get(id)) ?? (await readCookie(id));
  },

  async update(id, patch) {
    const current = (await memoryStore.get(id)) ?? (await readCookie(id));
    if (!current) return null;

    const updated: TroubleshootingSession = {
      ...current,
      ...patch,
      id: current.id,
      created_at: current.created_at,
      updated_at: new Date().toISOString(),
    };

    // Only refresh memory when this instance already holds the session, so a
    // session hydrated from a cookie keeps its original created_at.
    await memoryStore.update(id, updated);
    await writeCookie(updated);

    return updated;
  },

  async list(limit = 20) {
    const remembered = await memoryStore.list(limit);
    if (remembered.length > 0) return remembered;

    try {
      const value = (await cookies()).get(COOKIE_NAME)?.value;
      const session = value ? decode(value) : null;
      return session ? [session] : [];
    } catch {
      return [];
    }
  },
};
