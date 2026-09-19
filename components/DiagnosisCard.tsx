import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Diagnosis, Severity } from "@/types/supportlens";

const SEVERITY_VARIANT: Record<
  Severity,
  "secondary" | "outline" | "destructive"
> = {
  low: "secondary",
  medium: "outline",
  high: "destructive",
};

export function DiagnosisCard({ diagnosis }: { diagnosis: Diagnosis }) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
            {diagnosis.category}
          </span>
          <Badge variant={SEVERITY_VARIANT[diagnosis.severity]}>
            {diagnosis.severity} severity
          </Badge>
        </div>
        <h2 className="text-xl font-semibold tracking-[-0.01em] text-balance">
          Assessment
        </h2>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground max-w-[68ch] leading-[1.65] text-pretty">
          {diagnosis.summary}
        </p>
      </CardContent>
    </Card>
  );
}
