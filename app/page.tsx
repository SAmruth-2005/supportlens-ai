import { IssueInput } from "@/components/IssueInput";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-[46rem] space-y-8">
        <header className="space-y-4">
          <p className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
            Interactive IT troubleshooting
          </p>
          <h1 className="text-4xl leading-[1.1] font-bold tracking-[-0.03em] text-balance sm:text-5xl">
            One problem. One step at a time.
          </h1>
          <p className="text-muted-foreground max-w-[60ch] text-lg leading-[1.65] text-pretty">
            SupportLens turns an error description into a structured
            troubleshooting workflow. It identifies likely causes, gives you a
            single safe check to run, and uses your result to decide what to
            look at next.
          </p>
        </header>

        <IssueInput />
      </div>
    </div>
  );
}
