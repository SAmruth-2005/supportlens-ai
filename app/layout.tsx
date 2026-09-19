import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppHeader } from "@/components/AppHeader";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SupportLens AI",
    template: "%s · SupportLens AI",
  },
  description:
    "An AI IT support assistant that turns an error description or screenshot into an interactive, step-by-step troubleshooting workflow.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <a
          href="#main"
          className="bg-background focus-visible:ring-ring sr-only rounded-md px-4 py-2 focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:ring-[3px] focus-visible:outline-none"
        >
          Skip to content
        </a>
        <AppHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <footer className="border-border/70 mt-16 border-t">
          <div className="mx-auto w-full max-w-[1100px] px-5 py-8 sm:px-8">
            <p className="text-muted-foreground text-sm">
              SupportLens AI guides troubleshooting. It never accesses your
              device, runs commands for you, or asks for passwords.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
