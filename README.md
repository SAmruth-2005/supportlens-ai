# SupportLens AI

An AI-powered IT support assistant that turns an error description or screenshot
into an interactive, step-by-step troubleshooting workflow.

Built for Hack Devengers 2.0.

## The difference

A general chatbot answers a question and stops:

> Ask → receive a long list of things to try.

SupportLens runs a diagnostic loop:

> Report issue → diagnose → perform **one** safe check → report the result →
> branch → next check → resolution or escalation.

The application owns the workflow state. The model classifies the issue and
chooses the next step; it is never asked to remember the session.

## Status

Under active development during the 24-hour build window.

Working now:
- Application shell, routing, and design system
- Issue input with validation
- Diagnosis, likely-cause, step and timeline components
- Two seeded walkthrough scenarios at `/session/[id]`

Not yet connected:
- Gemini analysis endpoint
- Result-driven branching engine
- Screenshot analysis
- Supabase persistence and history

Seeded scenarios are labelled as such in the interface and are never presented
as live model output.

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Zod ·
Gemini API · Supabase · Vercel

## Architecture

```text
Browser
  └─ Next.js App Router (React Server Components)
       └─ Route handlers (server-only)
            ├─ Gemini API      — classification, step selection, vision
            └─ SessionStore    — in-memory now, Supabase behind the same interface
```

Model output is validated with Zod (`lib/schemas.ts`) before it reaches any
workflow logic. Invalid output is repaired or replaced with a safe fallback.

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in your own keys
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build      # production build
npx tsc --noEmit   # type check
npm run lint       # lint
```

## Safety

SupportLens does not access your device, execute commands on your behalf, ask
for passwords or API keys, or claim to have run a test it did not run. Secrets
are read server-side only and `.env.local` is never committed.

## Documentation

Planning documents written before the build window are in [`docs/`](docs/) —
blueprint, prompt pack, database design, runbook and AI handoff notes.
