import type { Metadata } from "next";
import Link from "next/link";
import { History } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "History",
};

export default function HistoryPage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[46rem] space-y-6">
        <header className="space-y-3">
          <p className="eyebrow text-muted-foreground">Session history</p>
          <h1 className="text-section font-bold">Past troubleshooting</h1>
        </header>

        <div className="bg-card flex flex-col items-center gap-4 rounded-xl px-6 py-12 text-center ring-1 ring-foreground/10">
          <span className="bg-muted text-muted-foreground flex size-11 items-center justify-center rounded-full">
            <History aria-hidden="true" className="size-5" />
          </span>
          <div className="space-y-1.5">
            <p className="font-semibold">No saved sessions yet</p>
            <p className="text-muted-foreground mx-auto max-w-[44ch] text-sm leading-[1.6] text-pretty">
              Completed troubleshooting sessions will be listed here once
              persistence is connected.
            </p>
          </div>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Start a diagnosis</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
