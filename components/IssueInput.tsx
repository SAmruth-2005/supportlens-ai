"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ImagePlus,
  ShieldCheck,
  TriangleAlert,
  X,
} from "lucide-react";

import { AnalysisState } from "@/components/AnalysisState";
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
import { cn } from "@/lib/utils";

const MAX_CHARS = 2000;

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

  const overLimit = issueText.length > MAX_CHARS;

  if (pending) {
    return <AnalysisState hasScreenshot={Boolean(screenshot)} />;
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} noValidate>
        <div className="panel-raised focus-within:ring-primary/35 overflow-hidden transition-shadow duration-200 focus-within:ring-2">
          <div className="panel-inset border-border/70 flex items-center justify-between gap-3 border-b px-4 py-2.5">
            <label htmlFor="issue" className="eyebrow text-muted-foreground">
              Describe the IT issue
            </label>
            <span
              className={cn(
                "mono-meta tabular",
                overLimit ? "text-destructive" : "text-muted-foreground/70",
              )}
            >
              {issueText.length}/{MAX_CHARS}
            </span>
          </div>

          <Textarea
            id="issue"
            name="issue"
            rows={5}
            value={issueText}
            onChange={(event) => setIssueText(event.target.value)}
            placeholder="My laptop connects to Wi-Fi but internal sites time out, while public websites load normally…"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "issue-error" : "issue-hint"}
            className="min-h-36 resize-none rounded-none border-0 bg-transparent px-4 py-4 text-base leading-[1.6] shadow-none ring-0 focus-visible:ring-0 sm:min-h-40"
          />

          {screenshot ? (
            <div className="border-border/70 animate-rise mx-4 mb-4 flex items-center gap-3 rounded-lg border p-2.5">
              {/* Local preview only — the server never returns the image. */}
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
                <p className="mono-meta text-muted-foreground">
                  {screenshot.width}×{screenshot.height} · JPEG
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={removeScreenshot}
                aria-label="Remove screenshot"
              >
                <X aria-hidden="true" />
              </Button>
            </div>
          ) : null}

          <div className="panel-inset border-border/70 flex flex-wrap items-center justify-between gap-3 border-t px-3 py-3">
            <input
              ref={fileInputRef}
              id="screenshot"
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              onChange={handleFileChange}
              className="sr-only"
              aria-describedby={
                imageError ? "screenshot-error" : "screenshot-hint"
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-muted-foreground hover:text-foreground"
            >
              <ImagePlus aria-hidden="true" />
              {screenshot ? "Replace screenshot" : "Attach screenshot"}
            </Button>

            <Button
              type="submit"
              size="xl"
              className="group/cta w-full transition-[transform,box-shadow] duration-150 sm:w-auto motion-safe:hover:-translate-y-px hover:shadow-[0_8px_20px_-8px_var(--primary)]"
            >
              Start diagnosis
              <ArrowRight
                aria-hidden="true"
                className="transition-transform duration-150 motion-safe:group-hover/cta:translate-x-0.5"
              />
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
            className="text-muted-foreground flex items-start gap-1.5 text-xs leading-[1.5]"
          >
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            <span id="screenshot-hint">
              PNG, JPEG or WebP up to 2 MB. Screenshots are analysed and never
              stored — check yours shows no passwords or keys.
            </span>
          </p>
        </div>
      </form>

      {failure ? (
        <Alert className="animate-rise">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>Analysis service unavailable</AlertTitle>
          <AlertDescription>
            {failure} Your description has been kept — retry, or open a worked
            example below to see the full troubleshooting flow.
          </AlertDescription>
        </Alert>
      ) : null}

      <section aria-labelledby="examples" className="space-y-2.5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 id="examples" className="eyebrow text-muted-foreground">
            Try a worked example
          </h2>
          <p className="text-muted-foreground text-xs">
            Seeded walkthroughs — not live analysis
          </p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {DEMO_SCENARIOS.map((scenario) => (
            <li key={scenario.id}>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="transition-colors duration-150"
              >
                <Link href={`/session/${scenario.id}`}>
                  <span
                    aria-hidden="true"
                    className="bg-muted-foreground/40 size-1.5 rounded-full"
                  />
                  {scenario.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
