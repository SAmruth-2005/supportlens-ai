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
