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
    <header className="border-border/70 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[1100px] items-center gap-6 px-5 sm:h-16 sm:px-8">
        <Link
          href="/"
          className="focus-visible:ring-ring flex items-center gap-2 rounded-md focus-visible:ring-[3px] focus-visible:outline-none"
        >
          <span
            aria-hidden="true"
            className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md text-[0.6875rem] font-bold"
          >
            SL
          </span>
          <span className="text-[1.0625rem] font-bold tracking-[-0.03em]">
            SupportLens
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-auto flex items-center gap-1">
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
                  "focus-visible:ring-ring relative rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:ring-[3px] focus-visible:outline-none",
                  isActive
                    ? "text-foreground"
                    : "text-foreground/60 hover:text-foreground",
                )}
              >
                {link.label}
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="bg-primary absolute inset-x-3 -bottom-px h-0.5 rounded-full"
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
