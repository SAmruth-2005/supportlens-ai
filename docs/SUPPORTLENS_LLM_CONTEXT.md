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
