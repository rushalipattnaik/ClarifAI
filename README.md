# ClarifAI

ClarifAI turns a one-line software project idea into a full IEEE-style Software Requirements Specification (SRS). It asks a short set of clarification questions, then uses Google Gemini to generate functional requirements, user stories, acceptance criteria, MVP scope, and AI-driven recommendations.

## Tech Stack

- Backend: FastAPI, SQLite, JWT auth, Google Gemini (google-genai SDK)
- Frontend: React 19, Vite, Tailwind CSS, React Router, react-markdown

## Project Structure

```
clarifAI/
├── backend/
│   └── app/
│       ├── auth/        JWT security, password hashing, SQLite connection
│       ├── models/      Pydantic request/response schemas
│       ├── routes/      /auth, /clarify, /reports endpoints
│       └── services/    Prompt building and Gemini client
└── frontend/
    └── src/
        ├── components/  Reusable UI pieces
        ├── context/     Auth and project state providers
        ├── hooks/       useAuth, useProject
        └── pages/       Home, Questionnaire, Report, History, Auth
```

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Fill in `.env`:

- `GEMINI_API_KEY` — a Google AI Studio API key
- `GEMINI_MODEL` — e.g. `gemini-2.0-flash`
- `JWT_SECRET_KEY` — any long random string
- `ALLOWED_ORIGINS` — comma-separated list of allowed frontend origins

Run the server:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Overview

| Method | Endpoint         | Auth | Description                        |
|--------|------------------|------|-------------------------------------|
| POST   | /auth/signup     | No   | Create an account                   |
| POST   | /auth/login      | No   | Log in, receive a JWT               |
| POST   | /clarify/        | No   | Generate an SRS from answers        |
| POST   | /reports/        | Yes  | Save a generated report             |
| GET    | /reports/        | Yes  | List saved reports                  |
| GET    | /reports/{id}    | Yes  | Fetch a single saved report         |

## License

MIT — see [LICENSE](./LICENSE).