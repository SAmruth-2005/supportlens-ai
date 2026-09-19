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
    <header className="border-border/70 border-b">
      <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="focus-visible:ring-ring rounded-md text-[1.0625rem] font-bold tracking-[-0.03em] focus-visible:ring-[3px] focus-visible:outline-none"
        >
          SupportLens<span className="text-primary"> AI</span>
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
                  "focus-visible:ring-ring rounded-md px-3 py-2 text-[0.9375rem] font-semibold transition-colors duration-150 focus-visible:ring-[3px] focus-visible:outline-none",
                  isActive
                    ? "text-foreground"
                    : "text-foreground/65 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
