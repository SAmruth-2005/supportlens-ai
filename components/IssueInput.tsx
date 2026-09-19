"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DEMO_SCENARIOS } from "@/lib/demo/scenarios";
import { analyzeRequestSchema } from "@/lib/schemas";

export function IssueInput() {
  const router = useRouter();
  const [issueText, setIssueText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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
        body: JSON.stringify({ issue_text: parsed.data.issue_text }),
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
