/**
 * POST /api/analyze
 *
 * Issue text in, validated structured diagnosis out. This is the only place the
 * browser can reach the model, and the key never leaves the server.
 */
import { NextResponse } from "next/server";

import { analyzeIssue } from "@/lib/gemini";
import { analyzeRequestSchema } from "@/lib/schemas";

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

    const parsed = analyzeRequestSchema.safeParse(body);
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

    const outcome = await analyzeIssue(parsed.data.issue_text);

    if (!outcome.ok) {
      const status =
        outcome.kind === "config" ? 500 : outcome.kind === "timeout" ? 504 : 502;

      return NextResponse.json(
        { error: outcome.message, kind: outcome.kind },
        { status },
      );
    }

    return NextResponse.json({
      issue_text: parsed.data.issue_text,
      diagnosis: outcome.diagnosis,
      source: outcome.source,
      model: outcome.model,
    });
  } catch (error) {
    // Last line of defence. Log server-side, tell the client nothing internal.
    console.error(
      "[api/analyze] unexpected error:",
      error instanceof Error ? error.name : "unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong analysing the issue.", kind: "internal" },
      { status: 500 },
    );
  }
}
