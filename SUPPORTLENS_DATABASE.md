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
