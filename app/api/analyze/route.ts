/**
 * POST /api/analyze
 *
 * Issue text in, validated structured diagnosis out. This is the only place the
 * browser can reach the model, and the key never leaves the server.
 */
import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { createSession } from "@/lib/engine";
import { analyzeIssue } from "@/lib/gemini";
import { MAX_SCREENSHOT_BYTES, analyzeRequestSchema } from "@/lib/schemas";
import { sessionStore } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Verify the bytes actually are the image they claim to be.
 *
 * A client-declared MIME type is a hint, not evidence, so the magic bytes are
 * checked before an image is ever sent upstream.
 */
function matchesSignature(bytes: Buffer, mimeType: string): boolean {
  if (mimeType === "image/png") {
    return (
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    );
  }

  if (mimeType === "image/jpeg") {
    return (
      bytes.length >= 3 &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff
    );
  }

  if (mimeType === "image/webp") {
    return (
      bytes.length >= 12 &&
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WEBP"
    );
  }

  return false;
}

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

    // Screenshot evidence is request-scoped: validated, forwarded, discarded.
    const { screenshot } = parsed.data;
    if (screenshot) {
      const bytes = Buffer.from(screenshot.data, "base64");

      if (bytes.length === 0 || bytes.length > MAX_SCREENSHOT_BYTES) {
        return NextResponse.json(
          { error: "Screenshot must be 2 MB or smaller.", kind: "validation" },
          { status: 400 },
        );
      }

      if (!matchesSignature(bytes, screenshot.mime_type)) {
        return NextResponse.json(
          {
            error: `That file is not a valid ${screenshot.mime_type.replace("image/", "").toUpperCase()} image.`,
            kind: "validation",
          },
          { status: 400 },
        );
      }
    }

    const outcome = await analyzeIssue(
      parsed.data.issue_text,
      screenshot
        ? { mimeType: screenshot.mime_type, data: screenshot.data }
        : undefined,
    );

    if (!outcome.ok) {
      const status =
        outcome.kind === "config"
          ? 500
          : outcome.kind === "timeout"
            ? 504
            : outcome.kind === "invalid_image"
              ? 400
              : 502;

      return NextResponse.json(
        { error: outcome.message, kind: outcome.kind },
        { status },
      );
    }

    // Open a troubleshooting session so the workflow can be advanced from here.
    const session = await sessionStore.create(
      createSession({
        id: randomUUID(),
        issueText: parsed.data.issue_text,
        diagnosis: outcome.diagnosis,
      }),
    );

    return NextResponse.json({
      session_id: session.id,
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
