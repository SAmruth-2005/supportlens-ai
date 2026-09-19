import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { LikelyCause } from "@/types/supportlens";

export function CausesList({ causes }: { causes: LikelyCause[] }) {
  if (causes.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold tracking-[-0.01em]">
          Likely causes
        </h2>
        <p className="text-muted-foreground text-sm">
          Ranked by how well each one explains the reported symptoms. None is
          confirmed yet.
        </p>
      </CardHeader>
      <CardContent>
        <ol className="divide-border/70 divide-y">
          {causes.map((cause, index) => (
            <li key={cause.cause} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <span
                aria-hidden="true"
                className="text-muted-foreground tabular mt-0.5 font-mono text-sm"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="space-y-1">
                <h3 className="font-semibold">{cause.cause}</h3>
                <p className="text-muted-foreground max-w-[68ch] text-sm leading-[1.65] text-pretty">
                  {cause.reason}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
