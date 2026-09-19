import { ClipboardList, GitBranch, ScanSearch } from "lucide-react";

import { IssueInput } from "@/components/IssueInput";

const PROCESS = [
  {
    icon: ClipboardList,
    title: "Describe it once",
    body: "Type what went wrong and attach a screenshot if you have one.",
  },
  {
    icon: ScanSearch,
    title: "Get a real diagnosis",
    body: "Category, severity, ranked causes, and one safe check to run first.",
  },
  {
    icon: GitBranch,
    title: "Follow the branch",
    body: "Report what happened and the next step adapts to your result.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[46rem] space-y-10 sm:space-y-12">
        <header className="space-y-5">
          <p className="eyebrow text-muted-foreground">
            Interactive IT troubleshooting
          </p>
          <h1 className="text-display font-bold text-balance">
            One problem.
            <br className="hidden sm:block" /> One step at a time.
          </h1>
          <p className="text-muted-foreground max-w-[58ch] text-lg leading-[1.65] text-pretty">
            SupportLens turns an error description into a structured
            troubleshooting workflow. It identifies likely causes, gives you a
            single safe check to run, and uses your result to decide what to
            look at next.
          </p>
        </header>

        <IssueInput />

        <section aria-labelledby="how-it-works" className="space-y-5">
          <h2 id="how-it-works" className="eyebrow text-muted-foreground">
            How it works
          </h2>
          <ol className="grid gap-px overflow-hidden rounded-xl bg-border/70 ring-1 ring-foreground/10 sm:grid-cols-3">
            {PROCESS.map(({ icon: Icon, title, body }, index) => (
              <li key={title} className="bg-background flex gap-3 p-5">
                <Icon
                  aria-hidden="true"
                  className="text-primary mt-0.5 size-4 shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">
                    <span className="text-muted-foreground tabular mr-1.5 font-mono text-xs">
                      {index + 1}
                    </span>
                    {title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-[1.6] text-pretty">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
