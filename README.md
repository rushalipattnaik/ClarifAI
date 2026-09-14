# ClarifAI

ClarifAI turns a one-line software project idea into a full IEEE-style Software Requirements Specification (SRS). It generates clarification questions tailored to the specific project described, then uses Google Gemini to produce functional requirements, user stories, acceptance criteria, MVP scope, and AI-driven recommendations.

## Tech Stack

- Backend: FastAPI, SQLite, JWT auth, Google Gemini (google-genai SDK)
- Frontend: React 19, Vite, Tailwind CSS, React Router, react-markdown

## Features

- AI-generated clarification questions specific to the entered project idea (falls back to a standard question set if generation fails)
- Full SRS generation from Gemini
- Save, browse, and revisit past reports
- Export reports as PDF, Markdown, or print
- JWT-based authentication
- Per-IP rate limiting on AI endpoints to protect free-tier API quotas

## Project Structure

```
clarifAI/
├── backend/
│   └── app/
│       ├── auth/        JWT security, password hashing, SQLite connection
│       ├── data/        Fallback questions used if AI generation fails
│       ├── models/      Pydantic request/response schemas
│       ├── routes/      /auth, /clarify, /questions, /reports endpoints
│       ├── services/    Prompt building, Gemini client, response parsing
│       └── utils/       Rate limiter
└── frontend/
    └── src/
        ├── components/  Reusable UI pieces
        ├── context/     Auth, project, and toast state providers
        ├── hooks/       useAuth, useProject, useToast
        └── pages/       Home, Questionnaire, Report, History, Auth
```

## Getting Started (Local Development)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Fill in `.env`:

- `GEMINI_API_KEY` — a free Google AI Studio API key (https://aistudio.google.com/apikey)
- `GEMINI_MODEL` — a currently supported model, e.g. `gemini-3.6-flash`
- `JWT_SECRET_KEY` — any long random string
- `ALLOWED_ORIGINS` — comma-separated list of allowed frontend origins
- `RATE_LIMIT_MAX_REQUESTS` / `RATE_LIMIT_WINDOW_SECONDS` — optional, defaults to 20 requests per hour per IP on AI endpoints

Run the server:

```bash
uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app is available at `http://localhost:5173`.

## API Overview

| Method | Endpoint            | Auth | Description                              |
|--------|----------------------|------|-------------------------------------------|
| POST   | /auth/signup         | No   | Create an account                         |
| POST   | /auth/login          | No   | Log in, receive a JWT                     |
| POST   | /questions/generate  | No   | Generate project-specific questions       |
| POST   | /clarify/            | No   | Generate an SRS from answers              |
| POST   | /reports/            | Yes  | Save a generated report                   |
| GET    | /reports/            | Yes  | List saved reports                        |
| GET    | /reports/{id}        | Yes  | Fetch a single saved report               |
| GET    | /health              | No   | Health check                              |

## Deploying for Free

Every piece of this stack can run entirely on free tiers.

### 1. Gemini API (free)

Get a free API key at https://aistudio.google.com/apikey. The free tier has generous daily limits, which is why this project includes a built-in rate limiter — it keeps a public deployment from accidentally burning through your quota.

### 2. Backend — Render (free tier)

1. Push this repository to GitHub.
2. On Render, create a new Web Service from your repo, root directory `backend`.
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add the same environment variables as your local `.env` (`GEMINI_API_KEY`, `GEMINI_MODEL`, `JWT_SECRET_KEY`, `ALLOWED_ORIGINS` set to your deployed frontend URL).
6. Render's free tier spins the service down after inactivity — the first request after idling will be slow to wake up, which is normal.

Railway's free trial credits or Fly.io's free allowance work the same way as alternatives.

### 3. Frontend — Vercel or Netlify (free tier)

1. Import the repository, set the root directory to `frontend`.
2. Build command: `npm run build`, output directory: `dist`.
3. Add environment variable `VITE_API_BASE_URL` pointing to your deployed backend URL.

### 4. Self-hosted alternative — Docker Compose

If you'd rather run both services yourself (a free-tier VM, or your own machine):

```bash
cp backend/.env.example backend/.env
docker compose up --build
```

This builds the backend and a static, nginx-served frontend and runs them together. The SQLite database persists in a named Docker volume so it survives container restarts.

## Known Limitations

- SQLite is fine for a single-instance deployment or portfolio use; it is not meant for multi-instance horizontal scaling.
- JWTs do not currently support refresh — sessions expire after 60 minutes.
- No automated test suite yet.

## License

MIT — see [LICENSE](./LICENSE).