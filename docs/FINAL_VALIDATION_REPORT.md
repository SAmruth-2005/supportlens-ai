# SupportLens AI — Final Validation Report

**Repository:** https://github.com/SAmruth-2005/supportlens-ai
**Validated at commit:** `7d0a76d` — *fix: enforce troubleshooting response contract*
**Phase 3 baseline:** `4e587a0` — *feat: add interactive troubleshooting engine*
**Date:** 19 September 2026
**Scope:** validation of the application at commit `7d0a76d` — source files were not modified during validation, and no dependencies were installed during validation.
---

## 1. Result summary

| Check | Result | Evidence |
|---|---|---|
| Production build | **PASS** | `npm run build` — 6 routes compiled |
| TypeScript | **PASS** | `npx tsc --noEmit` — 0 errors |
| Lint | **PASS** | `npm run lint` — 0 problems |
| Deterministic engine tests | **PASS** | 25 / 25 assertions |
| Vision + image validation tests | **PASS** | 29 / 29 assertions |
| Contract / schema tests | **PASS** | 31 / 31 assertions |
| Protected Phase 3 engine | **UNCHANGED** | 7 files, blob hashes identical to `4e587a0` |
| Git working tree                | **CLEAN AT VALIDATION** | Working tree was clean when validation ran |
| GitHub synchronization | **SYNCED** | HEAD ≡ `origin/main`, 0 ahead / 0 behind |

**Total: 85 assertions, 0 failures. Every validation check passed.**

---

## 2. Build, types and lint

| # | Check | Command | Result |
|---|---|---|---|
| 1 | Production build | `npm run build` (`next build`) | **PASS** |
| 2 | TypeScript | `npx tsc --noEmit` | **PASS** — 0 errors |
| 3 | Lint | `npm run lint` (`eslint`) | **PASS** — 0 problems |

Route table produced by the build:

```
┌ ○ /
├ ○ /_not-found
├ ƒ /api/analyze
├ ƒ /api/troubleshoot
├ ○ /history
└ ƒ /session/[id]

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

## 3. Tests

### Finding: the repository contains no tests

`package.json` defines only four scripts — `dev`, `build`, `start`, `lint`. There is **no test script, no test framework installed, and zero test files tracked in the repository**. No test command was invented for this validation.

The three suites below were written during development as standalone Node scripts and executed against the running application. **They are not part of the repository**, so a reviewer browsing GitHub will not see them.

### Suites executed

| Suite | Assertions | Result | Covers |
|---|---|---|---|
| Deterministic engine | 25 | **PASS** | successful branch, failed branch, unsure branch, step-limit guard, invalid transitions, determinism across repeat runs |
| Vision / image validation | 29 | **PASS** | text validation, unsupported MIME types, invalid base64, `data:` prefix rejection, oversized payloads, magic-byte mismatches, screenshot without text, no image echoed in responses |
| Contract / schema | 31 | **PASS** | branch-result enum accepted/rejected, canonical step IDs match the catalog, response-schema enums, unknown step ID cannot enter the engine |
| **Total** | **85** | **PASS** | |

The contract suite imports the real engine and schema modules directly — no mocks.

---

## 4. Protected Phase 3 files

Verified by comparing git blob hashes against `4e587a0`, not by reading diff output.

| File | Result | Blob |
|---|---|---|
| `lib/engine/index.ts` | **UNCHANGED** | `3cdfbb3f9cdf` |
| `lib/engine/catalog.ts` | **UNCHANGED** | `29df36014410` |
| `lib/engine/bootstrap.ts` | **UNCHANGED** | `56d37f317a18` |
| `app/api/troubleshoot/route.ts` | **UNCHANGED** | `e340d3c768e6` |
| `lib/store/index.ts` | **UNCHANGED** | `de03837b309e` |
| `lib/store/memory.ts` | **UNCHANGED** | `b78fb38e128b` |
| `types/supportlens.ts` | **UNCHANGED** | `368291be5174` |

The deterministic troubleshooting engine is byte-for-byte identical across the screenshot/vision work and the contract fix. This was the central architectural guarantee of both phases: the AI contract could change while the workflow engine did not.

Everything that changed between `4e587a0` and `7d0a76d` sits in the AI, validation and UI layers:

```
 app/api/analyze/route.ts     |  77 +++++++++-
 components/IssueInput.tsx    | 115 ++++++++++++++-
 docs/PHASE_4_VISION_AUDIT.md | 344 ++++++++++++++++++++++++++++++++++++++++++
 lib/gemini.ts                | 117 ++++++++++++---
 lib/image.ts                 |  98 ++++++++++++
 lib/prompts.ts               |  64 ++++++--
 lib/schemas.ts               |  49 +++++-
 7 files changed, 826 insertions(+), 38 deletions(-)
```

---

## 5. Git state

```
$ git status --short
(clean)

$ git log -3 --oneline
7d0a76d fix: enforce troubleshooting response contract
80a1edb feat: add screenshot vision analysis
4e587a0 feat: add interactive troubleshooting engine

$ git branch -vv
* main 7d0a76d [origin/main] fix: enforce troubleshooting response contract
```

| Property | Value |
|---|---|
| HEAD | `7d0a76d6d5ea74ae7c65deae4ad8f974f6198ae8` |
| `origin/main` | `7d0a76d6d5ea74ae7c65deae4ad8f974f6198ae8` |
| Identical | **Yes** (confirmed after `git fetch`) |
| Ahead / behind | 0 / 0 |
| Working tree | clean |
| Tracked files | 55 |
| Commits | 7 |
| `.env.local` tracked | 0 — only `.env.example` is in the tree |

---

## 6. Warnings

No validation failed. Four items are worth knowing before submission.

1. **No tests in the repository.** All 85 assertions live outside the repo, so a reviewer sees zero test coverage on GitHub. Moving the suites into the repository would be a code change and was therefore not performed.
2. **The contract fix is unverified against live Gemini.** The enums and runtime validation are enforced and proven by unit-level assertions, but no successful model response has been observed since the fix landed. The two attempts made afterwards both returned `502` following upstream `503`s.
3. **Upstream instability.** `gemini-3.6-flash` has intermittently returned `503 UNAVAILABLE`; successful calls have taken 15–40 seconds. The free tier allows 20 requests per day, and a single request can consume up to four of them through retries.
4. **No deployment exists.** There is no `.vercel` directory, no `vercel.json` and no deployment configuration. The live-demo field should be left blank unless a deployment is created first.

---

## 7. Architecture as validated

```
User issue text + optional screenshot
  → Gemini 3.6 Flash (text + vision, native structured JSON output)
  → structured Diagnosis
  → strict Zod validation  →  one repair retry  →  safe fallback
  → canonical troubleshooting step IDs (from the application's own catalog)
  → deterministic troubleshooting engine
  → user reports result (worked / didn't work / not sure)
  → next troubleshooting step
  → resolved / escalated / unsolved
```

The division of labour is the point: **the model supplies intelligence, the application owns the workflow.** Gemini is never asked to remember a session or to decide what a button press means. It is a stateless classifier and step-selector whose output is validated before it is trusted.

---

## 8. Submission content

### Project Title

SupportLens AI

### Short Description

An AI IT-support assistant that turns an error description or screenshot into an
interactive, step-by-step troubleshooting workflow — Gemini diagnoses the
problem, while a deterministic engine controls the troubleshooting path.

### Detailed Description

Most AI support tools answer a question and stop, leaving the user with a list of
things to try and no idea which to try first. SupportLens runs a diagnostic loop
instead.

You describe the problem and optionally attach a screenshot. Gemini analyses
both — reading error codes and UI state directly out of the image — and returns a
structured diagnosis: an issue category, a severity, ranked likely causes, and
one safe read-only check to run first. You perform that single check and report
*Worked*, *Didn't work*, or *Not sure*. The application's own troubleshooting
engine uses that result to select the next step, and continues until the issue is
resolved, escalated to human support, or declared unsolved because the evidence
ran out.

The key design decision is the division of labour: the model provides
intelligence, the application owns the workflow.

### Innovation

- The model diagnoses; a deterministic state machine troubleshoots. Every branch
  is explicit data in a step catalog rather than a hidden prompt decision, so the
  same inputs always produce the same path and the workflow can be tested without
  calling an AI at all.
- A closed vocabulary between AI and engine. The model must choose step
  identifiers from the application's own catalog and label branches with exactly
  `success` / `failure` / `unsure`, enforced at three layers: the model's response
  schema, runtime validation, and the engine. This was not designed in the
  abstract — a live test showed the model inventing its own step names and branch
  labels, and the contract was tightened in response.
- Screenshots are treated as evidence, never as instructions, with an explicit
  prompt-injection guard and structured-output validation bounding what any
  crafted image could achieve.
- Honest failure. When evidence is insufficient the system escalates and says so
  rather than inventing a next step. It never claims to have run a command or
  accessed a device.

### Technical Implementation

**Stack:** Next.js 16 (App Router, React Server Components) · TypeScript strict ·
Tailwind CSS v4 · shadcn/ui · Zod · Google Gemini (`@google/genai`).

- Two server-side API routes: `POST /api/analyze` (text and optional screenshot →
  diagnosis) and `POST /api/troubleshoot` (result → next step, no model call).
- Model output never reaches workflow logic unvalidated: Gemini's native
  structured output, then Zod, then one controlled repair attempt, then a safe
  fallback.
- Retry with exponential backoff on transient upstream failures, a 45-second
  per-attempt timeout and a hard total budget. A daily-quota error is deliberately
  not retried, because retrying it only spends more quota.
- Screenshots are downscaled and re-encoded in the browser with the Canvas API
  (no image dependency), validated server-side by MIME type, decoded byte size and
  magic bytes, then discarded. They are never stored, never logged and never
  returned to the client.
- The API key is server-only and is never exposed to the browser.
- Persistence sits behind a `SessionStore` interface, so the storage backend can
  change without touching a component.

### Problem Solved

People facing a technical problem usually get either a long list of unranked fixes
or a chatbot answer that loses the thread. Neither tells you what to do *next*.
SupportLens gives one safe check at a time, explains why that check matters, and
adapts based on what actually happened — the way a competent support engineer
works. It suits students learning to troubleshoot, help-desk trainees, and small
teams with no dedicated support expert.

### GitHub Repository

https://github.com/SAmruth-2005/supportlens-ai

Public · 55 files · 7 commits · all work committed inside the hackathon window.

### Live Demo Status

**No live deployment exists.** There is no `.vercel` directory, no `vercel.json`
and no deployment configuration in the repository. The optional demo-link field
should be left blank unless a deployment is created first.

---

## 9. Recommendation

The repository is in a submittable state: it builds, type-checks and lints
cleanly, the deterministic workflow is verified by 85 passing assertions, no
secrets are tracked, and local and remote are synchronized.

Two optional improvements, in priority order:

1. **One successful live run after the contract fix.** The interactive workflow is
   the project's central claim and is fully verified deterministically, but its
   live AI path has produced only one successful end-to-end result so far — before
   the contract fix landed. A single successful run would confirm the model now
   returns canonical step IDs and branch labels.
2. **Prepare the seeded scenarios as a demo fallback**, given the observed upstream
   `503` rate. The two worked examples at `/session/internal-app-dns` and
   `/session/wifi-drops` exercise the full branching workflow without consuming
   any API quota.
