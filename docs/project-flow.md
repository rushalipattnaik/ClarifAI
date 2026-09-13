# ClarifAI — Project Flow

## 1. Idea Input

The user lands on the home page and enters a one-line project idea (or picks a quick example). This is stored in `ProjectContext`.

## 2. Clarification Questionnaire

The user answers a short fixed set of questions (target users, accounts, payments, notifications, file uploads, analytics). Answers are collected into a single object keyed by question id.

## 3. Report Generation

On the final question, the frontend calls `POST /clarify/` with the project idea and answers. The backend:

1. Builds a structured prompt (`prompt_builder.py`) instructing Gemini to produce a 9-section IEEE-style SRS.
2. Sends the prompt to Gemini (`gemini_client.py`).
3. Cleans up the returned Markdown (`formatter.py`).
4. Returns the report as Markdown text.

## 4. Persistence

Immediately after generation, the frontend calls `POST /reports/` (authenticated) to save the project, answers, and report to SQLite, associated with the logged-in user.

## 5. Viewing and Export

- The freshly generated report is shown at `/report` from in-memory context.
- Previously saved reports are listed at `/history` and viewed at `/reports/:id`, fetched from the backend.
- From either view, the user can copy the Markdown, download it as a `.md` file, download a PDF (rendered via `html2canvas` + `jspdf`), or print it.

## 6. Auth

Signup and login issue a JWT (`auth/security.py`). The token is stored in `localStorage` and attached to every API request via an axios interceptor. Protected routes (`/questions`, `/report`, `/history`, `/reports/:id`) redirect unauthenticated users to `/login`.