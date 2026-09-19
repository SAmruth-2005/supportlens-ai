import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { TroubleshootingSessionView } from "@/components/TroubleshootingSession";
import { Badge } from "@/components/ui/badge";
import { loadOrSeedSession, resetDemoSession } from "@/lib/engine/bootstrap";

// Sessions are mutable in-memory state, so this page cannot be prerendered.
export const dynamic = "force-dynamic";

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
    <div className="mx-auto w-full max-w-[1100px] px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-[46rem] space-y-6">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md text-sm font-medium transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          New diagnosis
        </Link>

        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow text-muted-foreground">
              Troubleshooting session
            </p>
            {session.is_demo ? (
              <Badge variant="secondary">Demo scenario</Badge>
            ) : null}
          </div>

          <h1 className="text-section font-bold text-balance">
            {session.issue_text}
          </h1>

          {session.is_demo ? (
            <p className="text-muted-foreground text-sm leading-[1.6] text-pretty">
              A seeded walkthrough used to demonstrate the workflow. The
              branching below is real; the initial diagnosis is not live model
              output.
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
