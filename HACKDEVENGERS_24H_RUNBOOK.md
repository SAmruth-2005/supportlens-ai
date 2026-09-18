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
