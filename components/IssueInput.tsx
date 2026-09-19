"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ImagePlus, Loader2, TriangleAlert, X } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DEMO_SCENARIOS } from "@/lib/demo/scenarios";
import {
  ACCEPTED_IMAGE_TYPES,
  type PreparedScreenshot,
  prepareScreenshot,
} from "@/lib/image";
import { analyzeRequestSchema } from "@/lib/schemas";

export function IssueInput() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [issueText, setIssueText] = useState("");
  const [screenshot, setScreenshot] = useState<PreparedScreenshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    setImageError(null);
    try {
      setScreenshot(await prepareScreenshot(file));
    } catch (cause) {
      setScreenshot(null);
      setImageError(
        cause instanceof Error ? cause.message : "That image could not be used.",
      );
    }
  }

  function removeScreenshot() {
    setScreenshot(null);
    setImageError(null);
    fileInputRef.current?.focus();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFailure(null);

    const parsed = analyzeRequestSchema.safeParse({ issue_text: issueText });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your input.");
      return;
    }

    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue_text: parsed.data.issue_text,
          ...(screenshot
            ? {
                screenshot: {
                  mime_type: screenshot.mime_type,
                  data: screenshot.data,
                },
              }
            : {}),
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.session_id) {
        setFailure(
          payload?.error ?? "The analysis could not be completed. Try again.",
        );
        return;
      }

      router.push(`/session/${payload.session_id}`);
    } catch {
      setFailure("Could not reach the server. Check your connection and retry.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <label htmlFor="issue" className="block text-sm font-semibold">
          Describe the problem
        </label>
        <Textarea
          id="issue"
          name="issue"
          rows={5}
          value={issueText}
          onChange={(event) => setIssueText(event.target.value)}
          disabled={pending}
          placeholder="For example: I can browse public websites, but I cannot open one internal company application."
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "issue-error" : "issue-hint"}
          className="text-base"
        />
        <p id="issue-hint" className="text-muted-foreground text-sm">
          Include what you expected, what happened instead, and any error text
          you can see. Never paste passwords or API keys.
        </p>
        {error ? (
          <p id="issue-error" role="alert" className="text-destructive text-sm">
            {error}
          </p>
        ) : null}

        <div className="space-y-2">
          <input
            ref={fileInputRef}
            id="screenshot"
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            onChange={handleFileChange}
            disabled={pending}
            className="sr-only"
            aria-describedby={imageError ? "screenshot-error" : "screenshot-hint"}
          />

          {screenshot ? (
            <div className="border-border/70 flex items-center gap-3 rounded-lg border p-3">
              {/* Local preview only — never uploaded back from the server. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshot.preview_url}
                alt="Screenshot you attached"
                className="border-border/70 size-14 rounded-md border object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  Screenshot attached
                </p>
                <p className="text-muted-foreground tabular text-xs">
                  {screenshot.width} × {screenshot.height}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeScreenshot}
                disabled={pending}
              >
                <X aria-hidden="true" />
                Remove
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus aria-hidden="true" />
              Attach a screenshot
            </Button>
          )}

          <p id="screenshot-hint" className="text-muted-foreground text-sm">
            Optional. PNG, JPEG or WebP. It is sent for analysis and never
            stored — check it shows no passwords before attaching.
          </p>
          {imageError ? (
            <p
              id="screenshot-error"
              role="alert"
              className="text-destructive text-sm"
            >
              {imageError}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="transition-[transform,box-shadow] duration-150 motion-safe:hover:-translate-y-px"
        >
          {pending ? (
            <>
              <Loader2 aria-hidden="true" className="animate-spin" />
              Analysing
            </>
          ) : (
            <>
              Start diagnosis
              <ArrowRight aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      {failure ? (
        <Alert>
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>Analysis unavailable</AlertTitle>
          <AlertDescription>
            {failure} You can still open a worked example below to see the full
            troubleshooting flow.
          </AlertDescription>
        </Alert>
      ) : null}

      <section aria-labelledby="examples" className="space-y-3">
        <h2
          id="examples"
          className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.16em] uppercase"
        >
          Worked examples
        </h2>
        <ul className="flex flex-wrap gap-2">
          {DEMO_SCENARIOS.map((scenario) => (
            <li key={scenario.id}>
              <Button asChild variant="outline" size="sm">
                <Link href={`/session/${scenario.id}`}>{scenario.label}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
