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
