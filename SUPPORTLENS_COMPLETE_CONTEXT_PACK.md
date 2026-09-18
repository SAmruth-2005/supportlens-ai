# SUPPORTLENS AI — HACK DEVENGERS 2.0 COMPLETE PREPARATION PACK

This bundle contains the pre-hackathon source-of-truth documents. The actual application must be built during the official hackathon window.



================================================================================
# SUPPORTLENS_MASTER_BLUEPRINT.md
================================================================================

# SupportLens AI — Master Development Blueprint
## Hack Devengers 2.0 | Pre-Hackathon Source of Truth

**Status:** Pre-hackathon planning only  
**Planned build window:** 19 September 2026, 10:00 AM IST → 20 September 2026, 10:00 AM IST  
**Participation:** Individual  
**Project:** SupportLens AI  
**Purpose:** Keep the project, architecture, AI behavior, implementation priorities, and contest rules consistent across ChatGPT, Claude, Gemini, and the developer.

---

## 1. Hackathon Rules — Must Not Be Forgotten

Source: Hack Devengers 2.0 event document supplied for this project.

### Contest format
- 24-hour fully virtual Open Innovation Hackathon.
- Individual participation.
- No fixed problem statement.
- Any domain/problem/technology/tech stack may be chosen.
- The project must be built during the 24-hour hackathon period.
- The submission must be original.
- Plagiarism/copied projects can be disqualified.
- GitHub must contain relevant project code and information needed to understand the work.
- Submission must be completed within the given timeline.
- Organizers/jury reserve final decision on evaluation and results.

### Build window
**19 Sep 2026, 10:00 AM IST → 20 Sep 2026, 10:00 AM IST**

This is the critical implementation boundary. Do not create the actual SupportLens application before the build window.

### Submission
The event document states:
- Submission through Google Form only.
- Submission form is shared through the official WhatsApp channel.
- Form opens at **1:00 PM IST on 19 Sep 2026**.
- Required:
  1. Project Title
  2. Project Description
  3. GitHub Repository Link
- Optional:
  4. Live Demo/Deployment Link
  5. PPT/Presentation
- The document's submission timeline header shows **19 Sep 2026, 1:00 PM IST → 20 Sep 2026, 5:00 PM IST**, while the submission description also says the project should be submitted within the 24-hour hackathon window. Therefore: finish the actual project by 10:00 AM on 20 Sep, and follow the latest official submission-form/WhatsApp instructions for the exact submission cutoff.

### Mandatory communication
Join/monitor the official WhatsApp channel because the document says it is mandatory for receiving the submission form and important updates.

### Evaluation criteria
- Innovation & Originality
- Problem-Solving Approach
- Technical Implementation
- Functionality & Execution
- User Experience
- Real-World Impact
- Scalability & Future Potential

The jury may verify the project through the GitHub repository and submitted project details.

### Rewards stated in the event document
- 1st Prize: ₹50,000 cash + listed additional rewards
- Top 5: Exclusive Unstop Goodies
- Top 10: Lovable Credits + .xyz Domains / related recognition
- All Valid Submissions: Certificate of Achievement
- Additional prizes may be announced (TBA)
- The document states prizes and certificates will be released within 7 days after the event.

---

# 2. Project Definition

## Product name
**SupportLens AI**

## One-line description
An AI-powered IT support assistant that turns an error description or screenshot into an interactive, step-by-step troubleshooting workflow.

## Core differentiator
SupportLens is not intended to be a generic chatbot.

A normal chatbot:
> User asks → AI answers.

SupportLens:
> User reports problem → AI analyzes → identifies likely causes → gives one actionable test/step → user reports result → system branches to the next step → resolution is recorded.

## Target users
- Students learning technical troubleshooting
- Employees/users facing common IT issues
- Help-desk/service-desk trainees
- Small teams without a dedicated support expert

## Initial problem scope
Focus on common software/IT issues that can be demonstrated reliably in 24 hours:
- DNS problems
- Wi-Fi/network connectivity
- Internal application access
- Browser issues
- VPN/connectivity
- IP/connectivity checks
- Common application errors

Do not attempt to support every possible IT problem in V1.

---

# 3. Core User Flow

1. Open SupportLens.
2. Enter an issue in natural language.
3. Optionally upload an error screenshot.
4. AI returns:
   - issue category
   - severity
   - likely causes
   - concise explanation
   - first troubleshooting action
5. User performs the action.
6. User reports the result.
7. SupportLens chooses the next branch.
8. Continue until:
   - issue is resolved,
   - escalation is recommended,
   - or the system cannot confidently continue.
9. Show session summary.
10. Save history when persistence is enabled.

---

# 4. V1 Features

## Must-have
- Landing/dashboard
- Text issue input
- Screenshot upload
- AI issue analysis
- Structured diagnosis
- Likely causes
- One-step troubleshooting
- Result/feedback buttons
- Branching next-step logic
- Session state
- Resolution/unsolved end state
- Basic history
- Responsive UI
- Error/loading states
- Safe API-key handling

## Nice-to-have if time remains
- Issue category filters
- Searchable history
- Confidence visualization
- Suggested commands
- Copy command button
- Demo/example issues
- Session export
- Small analytics panel

## Explicitly avoid unless everything else works
- Full enterprise ticketing integration
- Real remote device control
- Automatic command execution on user machines
- Complex multi-agent systems
- Custom model training
- Native mobile apps
- Overbuilt admin panel
- Large knowledge-base ingestion
- Payment system
- Unnecessary authentication complexity

---

# 5. Planned Architecture

```text
Browser
  |
  v
Next.js + TypeScript + Tailwind + shadcn/ui
  |
  v
Next.js API / server-side logic
  |
  +------> Gemini API
  |          - text analysis
  |          - screenshot/vision analysis
  |          - structured troubleshooting output
  |
  +------> Supabase
  |          - sessions
  |          - steps/results
  |          - history
  |
  v
Vercel deployment
```

## Planned technology stack
- VS Code
- Git + GitHub
- Node.js
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Gemini API
- Supabase
- Vercel

The stack is a plan, not a hackathon requirement. The event allows any programming language, framework, platform, or technology.

---

# 6. AI Design

## AI responsibilities
Gemini should:
1. Understand the user's issue.
2. Interpret screenshot evidence when provided.
3. Classify the issue.
4. Generate likely causes.
5. Select a safe first troubleshooting action.
6. Interpret the user's result.
7. Select the next branch.
8. Stop/escalate when evidence is insufficient.

## AI should NOT
- Pretend certainty when uncertain.
- Claim it ran a command it did not run.
- Claim it accessed the user's device.
- Request passwords/API keys.
- Tell users to expose sensitive credentials.
- Automatically execute dangerous commands.
- Invent logs/results.
- Hide uncertainty.

---

# 7. Structured AI Output

Recommended first-pass response:

```json
{
  "category": "network",
  "severity": "medium",
  "summary": "The application may be unreachable because of a DNS or network-path issue.",
  "likely_causes": [
    {
      "cause": "DNS resolution failure",
      "reason": "The hostname may not resolve to an IP address."
    },
    {
      "cause": "Network connectivity issue",
      "reason": "The device may not have a working route to the service."
    }
  ],
  "first_step": {
    "id": "dns_check",
    "title": "Check DNS resolution",
    "instruction": "Run nslookup for the application hostname and report the result.",
    "expected_signal": "A valid IP address is returned.",
    "safe": true
  },
  "next_step_options": [
    {
      "result": "success",
      "next_step": "connectivity_check"
    },
    {
      "result": "failure",
      "next_step": "dns_troubleshooting"
    }
  ]
}
```

The exact production schema can be refined during implementation, but the application should prefer structured JSON over free-form AI text for core workflow logic.

---

# 8. API Plan

Potential routes:

```text
POST /api/analyze
POST /api/troubleshoot
POST /api/screenshot
POST /api/session
PATCH /api/session/:id
GET /api/history
GET /api/history/:id
```

Do not implement every route until the core workflow is working.

Recommended priority:
1. `/api/analyze`
2. `/api/troubleshoot`
3. session persistence
4. screenshot support
5. history

---

# 9. Supabase Data Model

Initial tables:

## troubleshooting_sessions
- id
- created_at
- issue_text
- category
- severity
- status
- final_resolution
- updated_at

## troubleshooting_steps
- id
- session_id
- step_order
- step_id
- instruction
- user_result
- ai_reasoning_summary
- created_at

## optional screenshots
- id
- session_id
- storage_path
- created_at

Keep personally sensitive data to a minimum.

---

# 10. Security

Environment variables:

```text
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Rules:
- Never commit `.env.local`.
- Never place Gemini secret keys in client-side code.
- Never put secrets in screenshots.
- Never paste secrets into GitHub.
- Do not use a service-role key in browser code.
- Add `.env*` to `.gitignore` as appropriate.
- Use server-side API calls for secrets.

---

# 11. UI Direction

Visual goal:
- Clean
- Professional
- Technical but approachable
- Minimal
- Strong information hierarchy
- No fitness/smartwatch aesthetic
- No unnecessary neon/glassmorphism

Suggested screens:
1. Home
2. Diagnose
3. Troubleshooting session
4. Resolution
5. History

Main session layout:
```text
Issue
  ↓
Diagnosis
  ↓
Likely causes
  ↓
Current troubleshooting step
  ↓
[Worked] [Didn't work] [Not sure]
  ↓
Next branch
```

The current step should be visually dominant.

---

# 12. Demonstration Scenario

Use a safe, understandable example:

> "I can browse public websites, but I cannot access one internal company application."

Potential workflow:
1. Identify category: network/internal application.
2. Explain that public browsing working does not prove internal-app connectivity.
3. Ask for one safe diagnostic.
4. Example: DNS resolution check.
5. User reports result.
6. Branch to connectivity/path checks or DNS troubleshooting.
7. End with resolution/escalation.

The system must never claim a real company network was accessed.

---

# 13. Git Strategy

At 10:00 AM:
```bash
git init
git add .
git commit -m "chore: initialize SupportLens hackathon project"
```

Then make meaningful checkpoints:
```text
feat: add initial SupportLens UI
feat: add Gemini diagnosis API
feat: add interactive troubleshooting flow
feat: add screenshot analysis
feat: add Supabase session history
fix: handle AI response validation
fix: improve troubleshooting branches
chore: prepare deployment and README
```

Do not create fake historical commits before the contest. The repository should truthfully show work completed during the hackathon.

---

# 14. Testing Matrix

Before submission test at least:

| Scenario | Expected |
|---|---|
| DNS issue | DNS-focused diagnosis |
| Wi-Fi/network issue | connectivity-focused workflow |
| Internal app unavailable | internal/network workflow |
| Browser issue | browser-focused workflow |
| VPN issue | VPN-focused workflow |
| Screenshot with visible error | screenshot evidence influences diagnosis |
| Empty input | validation |
| AI timeout | friendly fallback |
| Malformed AI JSON | validation/retry/fallback |
| User says step failed | next branch changes |
| User says solved | session resolves |
| Mobile viewport | usable UI |
| Missing API key | clear configuration error, no crash |

---

# 15. AI Failure/Fallback Strategy

If Gemini fails:
- Show a useful error.
- Preserve user's issue text.
- Do not expose internal errors/secrets.
- Allow retry.
- If possible, use a small deterministic demo fallback for known example scenarios, clearly marked as fallback/demo behavior.

If AI returns invalid JSON:
1. Validate.
2. Attempt a controlled repair/retry.
3. If still invalid, return a safe fallback.
4. Never feed arbitrary AI text directly into critical workflow logic.

---

# 16. 24-Hour Implementation Priorities

## 10:00–12:00
- Create project
- Git
- Next.js
- UI skeleton
- Environment configuration
- Basic deployment path

## 12:00–16:00
- Gemini integration
- Text issue → structured diagnosis
- Display diagnosis

## 16:00–20:00
- Interactive troubleshooting
- Branching
- Session state

## 20:00–23:00
- Screenshot analysis
- Error handling
- UI polish

## 23:00–02:00
- Supabase persistence/history
- More scenarios

## 02:00–05:00
- Testing
- Fixes
- Responsive UI

## 05:00–07:00
- Deployment
- README
- Demo preparation

## 07:00–09:00
- Final testing
- Git cleanup
- Submission information

## 09:00–10:00
- Freeze features
- Verify build/deployment
- Verify GitHub
- Prepare submission
- Follow official submission instructions

This is a suggested execution schedule, not an organizer-provided schedule.

---

# 17. Decision Framework

When a new idea appears:

### Ask:
1. Does it directly improve troubleshooting?
2. Can it be built safely within the remaining time?
3. Does it improve demonstrability?
4. Does it risk breaking existing functionality?
5. Is it necessary for the core story?

If the answer is not clearly positive, defer it.

Priority order:
**Working core > reliable AI > interactive workflow > screenshot feature > persistence > polish > extras**

---

# 18. Definition of Done

SupportLens V1 is done when:

- User can submit an issue.
- AI analyzes it.
- Diagnosis is structured.
- User receives a first step.
- User can report the result.
- Next step changes based on result.
- Session can reach resolved/unsolved state.
- Screenshot path works or is clearly marked as fallback if unfinished.
- App handles AI failure gracefully.
- No secrets are exposed.
- GitHub contains the actual hackathon work.
- Deployment works if used.
- README explains the project.
- Required Google Form fields are ready.

---

# 19. Pre-Hackathon Boundary

Allowed to prepare before 19 Sep:
- This documentation.
- Architecture.
- Prompt drafts.
- JSON schemas.
- Database design.
- UX wireframes.
- Testing plans.
- README template.
- Git strategy.
- Account/login readiness.
- Tool installation/readiness.

Do NOT pre-build the actual SupportLens application if doing so would conflict with the event rule that the project should be built during the 24-hour period.

---

# 20. Final Principle

Do not optimize for the largest number of features.

Optimize for:
**A clear problem → intelligent diagnosis → visible reasoning structure → interactive troubleshooting → working demo → clean repository → truthful submission.**



================================================================================
# SUPPORTLENS_LLM_CONTEXT.md
================================================================================

# SupportLens AI — LLM Context Pack

Use this document as the compact source of truth when giving this project to another LLM.

## Hackathon
Hack Devengers 2.0 is a 24-hour fully virtual Open Innovation Hackathon with individual participation. There is no fixed problem statement and no restricted tech stack. The project must be original and built during the 24-hour hackathon period.

**Build:** 19 Sep 2026 10:00 AM IST → 20 Sep 2026 10:00 AM IST.

Submission:
- Google Form only.
- Form shared through official WhatsApp channel.
- Opens 19 Sep at 1:00 PM IST.
- Required: Project Title, Project Description, GitHub Repository Link.
- Optional: Live Demo/Deployment Link, PPT.
- Event page timeline displays submission through 20 Sep 5:00 PM IST, but the rules also say submission should be completed within the 24-hour window. Treat 10:00 AM as the build freeze and follow the latest official WhatsApp/form instruction for submission cutoff.

Evaluation:
Innovation & Originality; Problem-Solving Approach; Technical Implementation; Functionality & Execution; User Experience; Real-World Impact; Scalability & Future Potential.

## Product
**SupportLens AI:** an AI-powered IT support assistant that turns an error description or screenshot into an interactive step-by-step troubleshooting workflow.

It is NOT just a chatbot.

Flow:
User issue → AI diagnosis → likely causes → one troubleshooting step → user result → branch → next step → resolution/escalation → history.

## Planned stack
Next.js + TypeScript + Tailwind + shadcn/ui; Next.js API/server logic; Gemini API for text and vision; Supabase for persistence; Vercel for deployment; GitHub; VS Code.

## Core V1
- Text issue input
- Screenshot input
- AI diagnosis
- Likely causes
- One-step workflow
- Branching based on user result
- Session state
- Resolution/unsolved outcome
- Basic history
- Error/loading states
- Responsive UI
- Secure environment variables

## AI rules
Use structured JSON for workflow logic.
Never claim to have run commands or accessed a device.
Never request passwords/API keys.
Never expose secrets.
Never invent evidence.
Show uncertainty.
Stop/escalate when evidence is insufficient.

## Important design rule
Prioritize working functionality over feature count.

Priority:
1. Core workflow
2. Reliable Gemini integration
3. Branching
4. Screenshot analysis
5. Persistence/history
6. Polish
7. Extras

## Security
Secrets stay server-side. `.env.local` must not be committed.

## LLM behavior
- Preserve this architecture unless a change is necessary.
- Do not add unnecessary technologies.
- Do not redesign the whole app without a concrete reason.
- Ask before major architectural changes.
- Keep code simple enough for a 24-hour hackathon.
- Prefer small testable components.
- Validate AI JSON.
- Handle API failures.
- Never fabricate completed work.
- Remember that the project must be built during the official hackathon window.

## Demo
Best example: user can browse public websites but cannot access one internal application. SupportLens explains possible DNS/network causes and asks for one diagnostic at a time, branching according to the reported result.

## Current status
Pre-hackathon planning only. Do not claim the app has already been built, deployed, tested, or submitted.



================================================================================
# HACKDEVENGERS_24H_RUNBOOK.md
================================================================================

# Hack Devengers 2.0 — 24-Hour Runbook

## 0. Official constraints to keep visible

**Build window:** 19 Sep 2026 10:00 AM IST → 20 Sep 2026 10:00 AM IST.

**Submission:** Google Form only; form opens 19 Sep 2026 1:00 PM IST; required Project Title, Project Description, GitHub Repository Link; optional deployment/demo and PPT.

**Mandatory:** official WhatsApp channel for submission form and updates.

**Rules:** original project, built during 24 hours, relevant GitHub code/info, no plagiarism, submit within timeline.

**Evaluation:** Innovation & Originality; Problem-Solving Approach; Technical Implementation; Functionality & Execution; User Experience; Real-World Impact; Scalability & Future Potential.

---

# BEFORE 10:00 AM — PREP ONLY

### Verify
- [ ] GitHub account works
- [ ] VS Code works
- [ ] Node.js works
- [ ] Gemini API key exists and is stored safely
- [ ] Vercel account works
- [ ] Supabase account works
- [ ] Official WhatsApp channel joined
- [ ] Hackathon event page accessible
- [ ] Power/internet stable
- [ ] Browser tabs/bookmarks prepared

### Documentation
- [ ] Master blueprint available
- [ ] LLM context available
- [ ] Prompt pack available
- [ ] Database schema available
- [ ] README template available
- [ ] This runbook available

### Do not
- [ ] Do not pre-build the actual SupportLens application.
- [ ] Do not create fake historical Git commits.
- [ ] Do not upload pre-built code as hackathon work.
- [ ] Do not claim unfinished features.

---

# 10:00–10:30 — START

- [ ] Start timer
- [ ] Create the actual project
- [ ] Initialize Git
- [ ] Create GitHub repository
- [ ] Create initial Next.js app
- [ ] Add Tailwind/shadcn as needed
- [ ] Configure environment
- [ ] First truthful commit

---

# 10:30–12:00 — FOUNDATION

- [ ] Layout
- [ ] Navigation
- [ ] Home/diagnosis UI
- [ ] Input component
- [ ] Session state
- [ ] Loading/error states

**Checkpoint:** UI can accept an issue.

---

# 12:00–16:00 — AI CORE

- [ ] Gemini server-side API
- [ ] `/api/analyze`
- [ ] Prompt
- [ ] Structured JSON validation
- [ ] Diagnosis display
- [ ] Likely causes
- [ ] First troubleshooting step

**Checkpoint:** issue → AI diagnosis works end-to-end.

---

# 16:00–20:00 — INTERACTIVE ENGINE

- [ ] Step result buttons
- [ ] Result submission
- [ ] Branch selection
- [ ] Next step
- [ ] Session state
- [ ] Resolved/unsolved state

**Checkpoint:** the app is visibly more than a chatbot.

---

# 20:00–23:00 — SCREENSHOT + ROBUSTNESS

- [ ] Screenshot upload
- [ ] Gemini vision analysis
- [ ] Error handling
- [ ] Invalid AI output handling
- [ ] Empty input handling
- [ ] API timeout handling

---

# 23:00–02:00 — PERSISTENCE

- [ ] Supabase tables
- [ ] Session save
- [ ] Step history
- [ ] History page
- [ ] Verify data flow

If Supabase becomes a time sink, preserve the core workflow and use local/in-memory state for the demo rather than breaking the app.

---

# 02:00–05:00 — POLISH

- [ ] Responsive layout
- [ ] Clear hierarchy
- [ ] Empty states
- [ ] Error states
- [ ] Loading states
- [ ] Accessibility basics
- [ ] Remove unnecessary UI
- [ ] Add demo examples

---

# 05:00–07:00 — DEPLOYMENT + README

- [ ] Production build
- [ ] Vercel deployment
- [ ] Environment variables configured
- [ ] Test deployed URL
- [ ] README complete
- [ ] Screenshots
- [ ] Architecture explanation
- [ ] Setup instructions
- [ ] AI usage documented

---

# 07:00–09:00 — FINAL TEST

Test:
- [ ] DNS scenario
- [ ] Wi-Fi scenario
- [ ] Internal application scenario
- [ ] Browser scenario
- [ ] VPN scenario
- [ ] Screenshot scenario
- [ ] AI failure
- [ ] Invalid AI response
- [ ] Mobile layout
- [ ] Fresh browser session

---

# 09:00–10:00 — FREEZE

- [ ] Stop adding features
- [ ] Fix only critical issues
- [ ] Run build
- [ ] Verify GitHub
- [ ] Verify deployment
- [ ] Verify README
- [ ] Prepare Project Title
- [ ] Prepare Project Description
- [ ] Copy GitHub link
- [ ] Copy deployment link if working
- [ ] PPT only if already complete

---

# SUBMISSION

The official event document says the Google Form is shared via WhatsApp and opens at 1:00 PM on 19 Sep.

Required:
- [ ] Project Title
- [ ] Project Description
- [ ] GitHub Repository Link

Optional:
- [ ] Live Demo/Deployment Link
- [ ] PPT

Important: the event page displays a submission timeline extending to 20 Sep 5:00 PM, while its submission description says to submit within the 24-hour window. Do not use the later display as permission to keep building after 10:00 AM. Follow the latest official form/WhatsApp instructions for submission timing.

---

# EMERGENCY FALLBACK

If Gemini fails:
1. Verify environment variable.
2. Verify server-side route.
3. Check API error.
4. Retry with a minimal prompt.
5. Validate response.
6. If necessary, use deterministic demo scenarios for the presentation while clearly treating them as fallback behavior.

If Supabase fails:
- Keep core session state local/in-memory.
- Remove history rather than breaking diagnosis/troubleshooting.

If screenshot processing fails:
- Keep text workflow working.
- Show screenshot feature as graceful optional input.

If Vercel fails:
- Ensure GitHub repository is complete.
- Fix build locally.
- Deployment is optional according to the event document.

---

# FINAL SUBMISSION CHECK

- [ ] Original project
- [ ] Built during window
- [ ] GitHub code present
- [ ] No secrets
- [ ] No copied project
- [ ] Project title ready
- [ ] Project description ready
- [ ] GitHub link ready
- [ ] Demo link if available
- [ ] PPT if available
- [ ] Google Form submitted
- [ ] Submission confirmation captured
- [ ] Keep evidence/screenshot of submission



================================================================================
# SUPPORTLENS_AI_PROMPTS.md
================================================================================

# SupportLens AI — Prompt Pack

## 1. Global System Prompt

You are SupportLens AI, an interactive IT troubleshooting assistant.

Your purpose is to help users diagnose common technical problems through safe, structured, step-by-step troubleshooting.

Rules:
- Do not pretend you accessed the user's device, network, logs, or applications.
- Do not claim that a command was executed unless the user provided its result.
- Do not request passwords, API keys, authentication tokens, or other secrets.
- Do not recommend exposing credentials.
- Prefer one diagnostic/troubleshooting action at a time.
- Explain why the action matters in simple language.
- Use the user's reported result to select the next step.
- Do not invent evidence.
- If evidence is insufficient, say so and request a safe next diagnostic.
- If a problem may require administrator/support access, explain the escalation.
- Return structured JSON matching the requested schema.
- Keep instructions concise and actionable.

---

## 2. Diagnosis Prompt

Input:
- issue_text
- optional screenshot evidence

Task:
1. Identify the most likely issue category.
2. Estimate severity.
3. List plausible causes.
4. Explain the reasoning using only available evidence.
5. Select the safest useful first diagnostic.
6. Define possible outcomes.

Return JSON only.

Schema:

```json
{
  "category": "network|dns|wifi|vpn|browser|application|system|unknown",
  "severity": "low|medium|high",
  "summary": "string",
  "likely_causes": [
    {
      "cause": "string",
      "reason": "string"
    }
  ],
  "first_step": {
    "id": "string",
    "title": "string",
    "instruction": "string",
    "expected_signal": "string",
    "safe": true
  },
  "next_step_options": [
    {
      "result": "string",
      "next_step": "string"
    }
  ]
}
```

---

## 3. Screenshot Prompt

Analyze the supplied screenshot only for technical evidence relevant to troubleshooting.

Extract:
- visible error text
- application/browser context
- obvious technical indicators
- likely category
- useful next diagnostic

Do not infer hidden information.
Do not identify private people.
Do not request credentials.

Return structured JSON.

---

## 4. Result Interpretation Prompt

Inputs:
- original issue
- previous steps
- user's latest result

Task:
- Interpret the result.
- Determine whether the previous hypothesis became more or less likely.
- Select one next action.
- If resolved, mark resolved.
- If uncertain, choose a safe diagnostic.
- If escalation is appropriate, mark escalation.

Return:

```json
{
  "status": "continue|resolved|escalate|unknown",
  "updated_assessment": "string",
  "next_step": {
    "id": "string",
    "title": "string",
    "instruction": "string",
    "why": "string"
  }
}
```

---

## 5. Network Troubleshooting Guidance

Example scenario:
User can browse public websites but cannot access an internal application.

Possible sequence:
1. Clarify whether the internal application uses a hostname or IP.
2. Test DNS resolution if hostname is used.
3. Interpret DNS result.
4. Check basic connectivity/path as appropriate.
5. Consider VPN/internal network requirements.
6. Consider application/service availability.
7. Escalate when evidence points beyond the user's device.

Never state that the application/server is actually down without evidence.

---

## 6. Fallback Prompt

If normal AI output cannot be produced:

Return a safe structured response:

```json
{
  "category": "unknown",
  "severity": "low",
  "summary": "I could not confidently analyze this issue.",
  "likely_causes": [],
  "first_step": {
    "id": "clarify",
    "title": "Provide more information",
    "instruction": "Describe what you expected, what happened instead, and any visible error message.",
    "expected_signal": "More diagnostic information",
    "safe": true
  },
  "next_step_options": []
}
```

---

## 7. Prompt Engineering Principles

- Keep prompts explicit.
- Define JSON schema.
- Tell the model what it must not claim.
- Give examples for difficult branching cases.
- Validate output in application code.
- Never trust model output blindly.
- Keep workflow state in application logic rather than asking the model to remember everything.



================================================================================
# SUPPORTLENS_DATABASE.md
================================================================================

# SupportLens AI — Database Blueprint

## Goal
Persist troubleshooting sessions and their steps without making the database a blocker for the 24-hour build.

## Table: troubleshooting_sessions

| Column | Type | Purpose |
|---|---|---|
| id | uuid | Primary key |
| created_at | timestamp | Session creation |
| updated_at | timestamp | Last update |
| issue_text | text | User's issue |
| category | text | AI category |
| severity | text | AI severity |
| status | text | active/resolved/escalated/unsolved |
| final_resolution | text | Final summary |

## Table: troubleshooting_steps

| Column | Type | Purpose |
|---|---|---|
| id | uuid | Primary key |
| session_id | uuid | Parent session |
| step_order | integer | Sequence |
| step_id | text | Logical step identifier |
| instruction | text | User instruction |
| user_result | text | User's reported result |
| ai_reasoning_summary | text | Short reasoning summary |
| created_at | timestamp | Creation time |

Relationship:
`troubleshooting_sessions.id -> troubleshooting_steps.session_id`

## Optional table: screenshots

| Column | Type |
|---|---|
| id | uuid |
| session_id | uuid |
| storage_path | text |
| created_at | timestamp |

## Implementation order

1. Create sessions table.
2. Create steps table.
3. Test insert/read.
4. Add screenshot metadata only if needed.
5. Add history UI.

## RLS/security
If authentication is used:
- Users should only access their own sessions.
- Do not expose service-role credentials to the browser.

If authentication is not implemented in V1:
- Keep stored data minimal.
- Do not store secrets or unnecessary personal information.

## Fallback
If Supabase blocks progress:
- Keep active session in application state.
- Complete the core AI workflow.
- Add persistence later if time permits.

The hackathon is 24 hours; database completeness is less important than a working end-to-end troubleshooting experience.



================================================================================
# HACKATHON_AI_HANDOFF.md
================================================================================

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



================================================================================
# SUPPORTLENS_GITHUB_README_TEMPLATE.md
================================================================================

# SupportLens AI

AI-powered interactive IT troubleshooting assistant.

## Problem

Technical support often gives users long lists of possible fixes. Users may not know which diagnostic to try first, and a generic chatbot does not maintain a clear troubleshooting path.

## Solution

SupportLens AI converts an issue description or screenshot into a structured troubleshooting workflow.

Instead of:

> Ask AI → Receive a long answer

SupportLens follows:

> Report issue → Diagnose → Perform one step → Report result → Branch → Continue → Resolve/Escalate

## Key Features

- AI-powered issue analysis
- Screenshot-based error analysis
- Likely-cause identification
- One-step troubleshooting
- Result-based branching
- Resolution/escalation state
- Session history
- Responsive UI

## Architecture

```text
Next.js UI
   |
Next.js API
   |
Gemini API
   |
Supabase
   |
Vercel
```

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Gemini API
- Supabase
- Vercel
- GitHub

## AI Usage

Gemini is used for:
- issue classification
- screenshot interpretation
- likely-cause generation
- troubleshooting step selection
- result interpretation

The application validates structured AI output before using it in the workflow.

## Example

A user reports:

> "I can access public websites but cannot open an internal company application."

SupportLens can guide the user through safe diagnostics such as DNS resolution and connectivity checks, using each reported result to choose the next step.

## Safety

SupportLens does not:
- access devices remotely;
- execute commands automatically;
- request passwords/API keys;
- claim to have performed tests it did not perform.

## Running Locally

Add environment variables to `.env.local`:

```env
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Never commit secret values.

Install:

```bash
npm install
```

Run:

```bash
npm run dev
```

Build:

```bash
npm run build
```

## Project Status

Built for Hack Devengers 2.0.

## Future Scope

- Service-desk integrations
- Larger troubleshooting knowledge base
- Organization-specific workflows
- Analytics
- Authentication and role-based access
- More screenshot/error formats
- Human support escalation

## Hackathon Submission

Project Title: SupportLens AI

Project Description:
[Write final concise description here.]

GitHub:
[Insert final repository link]

Live Demo:
[Insert only if working]

PPT:
[Insert only if prepared]

