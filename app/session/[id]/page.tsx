import { notFound } from "next/navigation";

import { CausesList } from "@/components/CausesList";
import { DiagnosisCard } from "@/components/DiagnosisCard";
import { SessionTimeline } from "@/components/SessionTimeline";
import { StepCard } from "@/components/StepCard";
import { Badge } from "@/components/ui/badge";
import { DEMO_SCENARIOS, getDemoScenario } from "@/lib/demo/scenarios";

export function generateStaticParams() {
  return DEMO_SCENARIOS.map((scenario) => ({ id: scenario.id }));
}

export default async function SessionPage({
  params,
}: PageProps<"/session/[id]">) {
  const { id } = await params;
  const scenario = getDemoScenario(id);

  if (!scenario) notFound();

  const stepNumber = scenario.completed_steps.length + 1;

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-[46rem] space-y-8">
        <header className="space-y-4">
          <Badge variant="secondary">Demo scenario</Badge>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-balance sm:text-3xl">
            {scenario.label}
          </h1>
          <blockquote className="border-border/70 text-muted-foreground max-w-[68ch] border-l-2 pl-4 leading-[1.65] text-pretty">
            {scenario.issue_text}
          </blockquote>
          <p className="text-muted-foreground text-sm">
            This is a seeded walkthrough used to demonstrate the workflow. It is
            not live model output.
          </p>
        </header>

        <DiagnosisCard diagnosis={scenario.diagnosis} />
        <SessionTimeline steps={scenario.completed_steps} />
        <StepCard
          step={scenario.diagnosis.first_step}
          stepNumber={stepNumber}
        />
        <CausesList causes={scenario.diagnosis.likely_causes} />
      </div>
    </div>
  );
}
