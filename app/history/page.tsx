import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "History",
};

export default function HistoryPage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-[46rem] space-y-6">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">History</h1>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-semibold">No saved sessions yet</p>
            <p className="text-muted-foreground mx-auto mt-2 max-w-[48ch] text-sm leading-[1.65] text-pretty">
              Completed troubleshooting sessions will be listed here once
              persistence is connected.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
