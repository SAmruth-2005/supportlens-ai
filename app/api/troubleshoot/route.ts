/**
 * POST /api/troubleshoot
 *
 * Advance a troubleshooting session by one reported result. Fully
 * deterministic — this endpoint never calls the model.
 *
 * Request:  { session_id, result: "success" | "failure" | "unsure", step_id? }
 * Response: { session, current_step, outcome }
 */
import { NextResponse } from "next/server";

import { advance, toSessionView } from "@/lib/engine";
import { loadOrSeedSession } from "@/lib/engine/bootstrap";
import { troubleshootRequestSchema } from "@/lib/schemas";
import { sessionStore } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON.", kind: "bad_request" },
        { status: 400 },
      );
    }

    const parsed = troubleshootRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message ?? "Invalid request.",
          kind: "validation",
          issues: parsed.error.issues.map((issue) => ({
            field: issue.path.join(".") || "(root)",
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const { session_id, result, step_id } = parsed.data;

    const session = await loadOrSeedSession(session_id);
    if (!session) {
      return NextResponse.json(
        { error: "No such troubleshooting session.", kind: "not_found" },
        { status: 404 },
      );
    }

    const advanced = advance(session, result, step_id);
    if (!advanced.ok) {
      return NextResponse.json(
        { error: advanced.message, kind: advanced.reason },
        { status: 409 },
      );
    }

    const saved = await sessionStore.update(session_id, {
      steps: advanced.session.steps,
      status: advanced.session.status,
      final_resolution: advanced.session.final_resolution,
    });

    return NextResponse.json({
      ...toSessionView(saved ?? advanced.session),
      outcome: advanced.outcome.kind,
    });
  } catch (error) {
    console.error(
      "[api/troubleshoot] unexpected error:",
      error instanceof Error ? error.name : "unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong advancing the session.", kind: "internal" },
      { status: 500 },
    );
  }
}
