# Hackathon AI Handoff — Instructions for Any LLM

You are assisting with the SupportLens AI project during Hack Devengers 2.0.

## Non-negotiable project context

SupportLens is an AI-powered IT support assistant.

Core interaction:
**Issue → Diagnosis → One Step → User Result → Branch → Next Step → Resolution/Escalation**

This is an interactive troubleshooting workflow, not a generic chatbot.

## Hackathon constraint

The official event document says the project should be built during the 24-hour hackathon period.

Build:
**19 Sep 2026 10:00 AM IST → 20 Sep 2026 10:00 AM IST**

Do not encourage or create pre-built application functionality before the window.

## Stack

Planned:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Gemini API
- Supabase
- Vercel
- GitHub
- VS Code

Do not add another major framework/database/AI provider unless there is a strong technical reason.

## Working principles

1. Preserve existing architecture.
2. Prefer the smallest working implementation.
3. Do not over-engineer.
4. Do not add features just because they sound impressive.
5. Validate AI outputs.
6. Keep API keys secret.
7. Do not claim a feature works unless it has been tested.
8. Do not fabricate GitHub commits, deployment, tests, screenshots, or results.
9. When changing architecture, explain the reason first.
10. Fix broken core functionality before adding extras.

## AI safety

Never:
- claim access to the user's device;
- claim a command was executed;
- request passwords;
- expose API keys;
- invent logs;
- assert a server is down without evidence.

## Priority

**P0:** end-to-end text troubleshooting  
**P1:** branching workflow  
**P2:** screenshot analysis  
**P3:** persistence/history  
**P4:** polish/extras

## Preferred response format during development

When asked to implement something:
1. State what will change.
2. Identify files affected.
3. Give exact implementation steps/code when appropriate.
4. Explain how to test.
5. Mention risks or assumptions.
6. Do not silently redesign unrelated parts.

## If time is running out

Freeze new features.

Ensure:
- diagnosis works;
- troubleshooting branch works;
- UI is usable;
- no secrets are exposed;
- GitHub is complete;
- README is complete;
- deployment works if used;
- required submission information is ready.

## Submission facts

Required:
- Project Title
- Project Description
- GitHub Repository Link

Optional:
- Live Demo/Deployment Link
- PPT

Submission is through Google Form, shared through the official WhatsApp channel. The form opens at 1:00 PM on 19 Sep. The event page displays a timeline through 5:00 PM on 20 Sep, while the submission description says submission is within the 24-hour window; follow the latest official instructions.

## Current status

Before the contest:
**Planning/documentation only.**

During the contest:
**Implementation begins at 10:00 AM IST.**
