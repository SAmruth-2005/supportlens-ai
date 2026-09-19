import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { TroubleshootingSessionView } from "@/components/TroubleshootingSession";
import { loadOrSeedSession, resetDemoSession } from "@/lib/engine/bootstrap";

// Sessions are mutable in-memory state, so this page cannot be prerendered.
export const dynamic = "force-dynamic";

const STATUS_LABEL = {
  active: "Investigating",
  resolved: "Resolved",
  escalated: "Escalated",
  unsolved: "Unresolved",
} as const;

export default async function SessionPage({
  params,
  searchParams,
}: PageProps<"/session/[id]">) {
  const { id } = await params;
  const { restart } = await searchParams;

  if (restart) {
    await resetDemoSession(id);
    redirect(`/session/${id}`);
  }

  const session = await loadOrSeedSession(id);
  if (!session) notFound();

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-[46rem] space-y-5">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md text-sm font-medium transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          New investigation
        </Link>

        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="eyebrow text-muted-foreground">Incident</p>
            <span
              className={
                session.status === "active"
                  ? "mono-meta text-primary flex items-center gap-1.5"
                  : "mono-meta text-muted-foreground flex items-center gap-1.5"
              }
            >
              <span
                aria-hidden="true"
                className={
                  session.status === "active"
                    ? "bg-primary size-1.5 rounded-full"
                    : "bg-muted-foreground/50 size-1.5 rounded-full"
                }
              />
              {STATUS_LABEL[session.status]}
            </span>
            {session.is_demo ? (
              <span className="mono-meta text-muted-foreground/70 border-border rounded-full border px-2 py-0.5">
                Demo scenario
              </span>
            ) : null}
          </div>

          <h1 className="text-section font-bold text-balance">
            {session.issue_text}
          </h1>

          {session.is_demo ? (
            <p className="text-muted-foreground text-xs leading-[1.55] text-pretty">
              A seeded walkthrough. The branching below is the real engine; the
              initial diagnosis is not live model output.
            </p>
          ) : null}
        </header>

        <TroubleshootingSessionView
          initialSession={session}
          restartHref={
            session.is_demo ? `/session/${session.id}?restart=1` : undefined
          }
        />
      </div>
    </div>
  );
}
