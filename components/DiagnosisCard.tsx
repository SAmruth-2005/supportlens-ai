import { cn } from "@/lib/utils";
import type { Diagnosis, Severity } from "@/types/supportlens";

const SEVERITY_LEVEL: Record<Severity, number> = { low: 1, medium: 2, high: 3 };

function SeverityMeter({ severity }: { severity: Severity }) {
  const level = SEVERITY_LEVEL[severity];

  return (
    <span className="flex items-center gap-2">
      <span aria-hidden="true" className="flex items-end gap-[3px]">
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={cn(
              "w-[3px] rounded-full",
              bar === 1 && "h-1.5",
              bar === 2 && "h-2.5",
              bar === 3 && "h-3.5",
              bar <= level
                ? severity === "high"
                  ? "bg-destructive"
                  : "bg-foreground"
                : "bg-foreground/15",
            )}
          />
        ))}
      </span>
      <span className="text-sm font-semibold capitalize">{severity}</span>
    </span>
  );
}

export function DiagnosisCard({ diagnosis }: { diagnosis: Diagnosis }) {
  return (
    <section
      aria-labelledby="diagnosis-heading"
      className="panel animate-rise overflow-hidden"
    >
      <div className="panel-inset border-border/70 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b px-4 py-2.5 sm:px-5">
        <h2 id="diagnosis-heading" className="eyebrow text-muted-foreground">
          Incident analysis
        </h2>

        <dl className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex items-center gap-2">
            <dt className="eyebrow text-muted-foreground/70">Category</dt>
            <dd className="mono-meta font-semibold">{diagnosis.category}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="eyebrow text-muted-foreground/70">Severity</dt>
            <dd>
              <SeverityMeter severity={diagnosis.severity} />
            </dd>
          </div>
        </dl>
      </div>

      <p className="max-w-[68ch] px-4 py-4 text-[0.9375rem] leading-[1.65] text-pretty sm:px-5">
        {diagnosis.summary}
      </p>
    </section>
  );
}
