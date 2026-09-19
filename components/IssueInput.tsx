"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ImagePlus,
  Loader2,
  ShieldCheck,
  TriangleAlert,
  X,
} from "lucide-react";

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
    <div className="space-y-5">
      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-card surface-raised focus-within:ring-primary/30 overflow-hidden rounded-xl ring-1 ring-foreground/10 transition-shadow duration-200 focus-within:ring-2">
          <label htmlFor="issue" className="sr-only">
            Describe the problem
          </label>
          <Textarea
            id="issue"
            name="issue"
            rows={5}
            value={issueText}
            onChange={(event) => setIssueText(event.target.value)}
            disabled={pending}
            placeholder="Describe the problem. For example: I can browse public websites, but I cannot open one internal company application."
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "issue-error" : "issue-hint"}
            className="min-h-36 resize-none rounded-none border-0 bg-transparent px-5 py-4 text-base leading-[1.6] shadow-none ring-0 focus-visible:ring-0 sm:min-h-40"
          />

          {screenshot ? (
            <div className="border-border/70 mx-5 mb-4 flex items-center gap-3 rounded-lg border p-2.5">
              {/* Local preview only — the image is never returned by the server. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshot.preview_url}
                alt="Screenshot you attached"
                className="border-border/70 size-11 shrink-0 rounded-md border object-cover"
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
                size="icon-sm"
                onClick={removeScreenshot}
                disabled={pending}
                aria-label="Remove screenshot"
              >
                <X aria-hidden="true" />
              </Button>
            </div>
          ) : null}

          <div className="border-border/70 bg-muted/40 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
            <input
              ref={fileInputRef}
              id="screenshot"
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              onChange={handleFileChange}
              disabled={pending}
              className="sr-only"
              aria-describedby={
                imageError ? "screenshot-error" : "screenshot-hint"
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={() => fileInputRef.current?.click()}
              className="text-muted-foreground hover:text-foreground"
            >
              <ImagePlus aria-hidden="true" />
              {screenshot ? "Replace screenshot" : "Attach a screenshot"}
            </Button>

            <Button
              type="submit"
              size="xl"
              disabled={pending}
              className="group/cta w-full transition-[transform,box-shadow] duration-150 sm:ml-auto sm:w-auto motion-safe:hover:-translate-y-px hover:shadow-[0_8px_20px_-8px_var(--primary)]"
            >
              {pending ? (
                <>
                  <Loader2 aria-hidden="true" className="animate-spin" />
                  Analysing
                </>
              ) : (
                <>
                  Start diagnosis
                  <ArrowRight
                    aria-hidden="true"
                    className="transition-transform duration-150 motion-safe:group-hover/cta:translate-x-0.5"
                  />
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          {error ? (
            <p id="issue-error" role="alert" className="text-destructive text-sm">
              {error}
            </p>
          ) : null}
          {imageError ? (
            <p
              id="screenshot-error"
              role="alert"
              className="text-destructive text-sm"
            >
              {imageError}
            </p>
          ) : null}
          <p
            id="issue-hint"
            className="text-muted-foreground flex items-start gap-1.5 text-sm"
          >
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            <span id="screenshot-hint">
              Screenshots are analysed and never stored. Never include passwords
              or API keys.
            </span>
          </p>
        </div>
      </form>

      {failure ? (
        <Alert className="animate-rise">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>Analysis unavailable</AlertTitle>
          <AlertDescription>
            {failure} You can still open a worked example below to see the full
            troubleshooting flow.
          </AlertDescription>
        </Alert>
      ) : null}

      <section
        aria-labelledby="examples"
        className="flex flex-wrap items-center gap-x-3 gap-y-2"
      >
        <h2 id="examples" className="eyebrow text-muted-foreground">
          Try an example
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
