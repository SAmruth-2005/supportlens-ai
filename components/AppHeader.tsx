"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Diagnose" },
  { href: "/history", label: "History" },
] as const;

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="border-border/70 bg-background/85 sticky top-0 z-40 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[1100px] items-center gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="focus-visible:ring-ring group/brand flex items-center gap-2.5 rounded-md focus-visible:ring-[3px] focus-visible:outline-none"
        >
          <span
            aria-hidden="true"
            className="bg-foreground text-background flex size-6 items-center justify-center rounded-[7px] text-[0.625rem] font-bold tracking-tight"
          >
            SL
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-[0.9375rem] font-bold tracking-[-0.02em]">
              SupportLens
            </span>
            <span className="eyebrow text-muted-foreground/70 hidden sm:inline">
              Incident desk
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-auto flex items-center gap-0.5">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "focus-visible:ring-ring relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:ring-[3px] focus-visible:outline-none",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="bg-primary absolute inset-x-3 -bottom-[9px] h-px"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
