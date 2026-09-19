import { notFound, redirect } from "next/navigation";

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
    <div className="mx-auto w-full max-w-[1100px] px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-[46rem] space-y-8">
        <header className="space-y-4">
          {session.is_demo ? <Badge variant="secondary">Demo scenario</Badge> : null}
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-balance sm:text-3xl">
            Troubleshooting session
          </h1>
          <blockquote className="border-border/70 text-muted-foreground max-w-[68ch] border-l-2 pl-4 leading-[1.65] text-pretty">
            {session.issue_text}
          </blockquote>
          {session.is_demo ? (
            <p className="text-muted-foreground text-sm">
              This is a seeded walkthrough used to demonstrate the workflow. The
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
