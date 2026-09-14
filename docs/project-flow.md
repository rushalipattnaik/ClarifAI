# ClarifAI — Project Flow

## 1. Idea Input

The user lands on the home page and enters a one-line project idea (or picks a quick example). This is stored in `ProjectContext`.

## 2. Dynamic Clarification Questions

On clicking "Analyze Project", the frontend calls `POST /questions/generate` with the project idea. The backend prompts Gemini to produce six multiple-choice questions specific to that project's domain (for example, a hospital system and a food delivery app receive different questions). If Gemini fails or returns malformed output, the backend automatically falls back to a standard question set so the flow never breaks.

## 3. Questionnaire

The user answers the generated questions one at a time. Answers are collected into an object keyed by question id.

## 4. Report Generation

On the final question, the frontend calls `POST /clarify/` with the project idea and answers. The backend:

1. Builds a structured prompt (`prompt_builder.py`) instructing Gemini to produce a 9-section IEEE-style SRS.
2. Sends the prompt to Gemini (`gemini_client.py`).
3. Cleans up the returned Markdown (`formatter.py`).
4. Returns the report as Markdown text.

Both AI endpoints are rate-limited per IP to protect the free Gemini quota.

## 5. Persistence

Immediately after generation, the frontend calls `POST /reports/` (authenticated) to save the project, answers, and report to SQLite, associated with the logged-in user.

## 6. Viewing and Export

- The freshly generated report is shown at `/report` from in-memory context.
- Previously saved reports are listed at `/history` (reachable from the Navbar once logged in) and viewed at `/reports/:id`.
- From either view, the user can copy the Markdown, download it as a `.md` file, download a PDF, or print it.

## 7. Auth

Signup and login issue a JWT (`auth/security.py`). The token is stored in `localStorage` and attached to every API request via an axios interceptor. Protected routes redirect unauthenticated users to `/login`.