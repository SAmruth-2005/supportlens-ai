import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { sessionStore } from "@/lib/store";
import type { SessionStatus } from "@/types/supportlens";

export const metadata: Metadata = { title: "History" };

// Reads the caller's session state, so it cannot be prerendered.
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<SessionStatus, string> = {
  active: "Investigating",
  resolved: "Resolved",
  escalated: "Escalated",
  unsolved: "Unresolved",
};

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function HistoryPage() {
  const sessions = await sessionStore.list(20);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-[46rem] space-y-5">
        <header className="space-y-2">
          <p className="eyebrow text-muted-foreground">Session history</p>
          <h1 className="text-section font-bold">Past investigations</h1>
        </header>

        {sessions.length === 0 ? (
          <div className="panel flex flex-col items-center gap-4 px-6 py-12 text-center">
            <span className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full">
              <History aria-hidden="true" className="size-4.5" />
            </span>
            <div className="space-y-1.5">
              <p className="font-semibold">No investigations yet</p>
              <p className="text-muted-foreground mx-auto max-w-[44ch] text-sm leading-[1.55] text-pretty">
                Sessions you start appear here for this browser. They are not
                stored on a server.
              </p>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link href="/">Start an investigation</Link>
            </Button>
          </div>
        ) : (
          <ul className="panel divide-border/60 divide-y overflow-hidden">
            {sessions.map((session) => {
              const answered = session.steps.filter(
                (step) => step.user_result !== null,
              ).length;

              return (
                <li key={session.id}>
                  <Link
                    href={`/session/${session.id}`}
                    className="group/row hover:bg-muted/40 focus-visible:ring-ring flex items-center gap-4 px-4 py-3.5 transition-colors duration-150 focus-visible:ring-[3px] focus-visible:outline-none focus-visible:-outline-offset-1 sm:px-5"
                  >
                    <span
                      aria-hidden="true"
                      className={
                        session.status === "active"
                          ? "bg-primary size-1.5 shrink-0 rounded-full"
                          : "bg-muted-foreground/40 size-1.5 shrink-0 rounded-full"
                      }
                    />

                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate text-sm font-medium">
                        {session.issue_text}
                      </p>
                      <p className="mono-meta text-muted-foreground/80 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span>{STATUS_LABEL[session.status]}</span>
                        {session.diagnosis ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{session.diagnosis.category}</span>
                          </>
                        ) : null}
                        <span aria-hidden="true">·</span>
                        <span>
                          {answered} {answered === 1 ? "check" : "checks"}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{formatWhen(session.created_at)}</span>
                        {session.is_demo ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>demo</span>
                          </>
                        ) : null}
                      </p>
                    </div>

                    <ArrowRight
                      aria-hidden="true"
                      className="text-muted-foreground/50 group-hover/row:text-foreground size-4 shrink-0 transition-all duration-150 motion-safe:group-hover/row:translate-x-0.5"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
