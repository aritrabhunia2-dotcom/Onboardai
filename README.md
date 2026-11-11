# 🚀 OnboardAI

> **Intelligent, Evidence-Linked Developer Onboarding Platform**  
> Accelerate intern and engineer ramp-up with AI-powered codebase exploration, verifiable source citations, structured milestone tracking, and automated repository intelligence.

---

## ✨ Features

- **💬 Evidence-Linked AI Chatpot**:
  - Ingests public GitHub repositories and Google Drive documents.
  - Multi-model automatic fallback cascade across **Google Gemini 2.0 / 3.5 / 3.8 Flash**.
  - Returns structured answers backed by verifiable source citations (file names, line numbers, snippet previews, and direct URLs).
- **🎯 Goals & Milestones Management**:
  - Interactive onboarding targets with completion toggles, progress bars, and custom goal creation.
  - 4-week structured milestone roadmap with dynamic deliverable checklists.
  - Strategic OKR alignment mapping company priorities to squad objectives and intern contributions.
  - Cross-team blocker and dependency tracker with priority badges and status toggles.
- **💡 Repository Blueprint & Architecture Intelligence**:
  - Parses public GitHub repositories to extract point-form architectural blueprints, component pipelines, tech stack matrices, and key features.
  - One-click repository presets (`OnboardAI Core`, `octocat/Hello-World`, `facebook/react`, `expressjs/express`).
  - Instant export of markdown blueprints and direct query handoff to Chatpot.
- **⏱️ Timesheet Activity Estimator**:
  - Analyzes repository commit frequency, author velocity, and active code changes against submission deadlines.
- **🔐 Secure Authentication & Demo Sandbox**:
  - Supabase Auth integration with JWT session persistence.
  - One-click **Demo Intern** sign-in for evaluation without requiring an external email confirmation.

---

## 🏗️ Architecture & Tech Stack

```
[ Frontend: React 19 + Tailwind v4 + Vite ]
                   │
             HTTP / REST (CORS)
                   │
                   ▼
       [ API Gateway: Express.js (Node v24) ]
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
[ Google Gemini Flash ]   [ External Connectors ]
(GenAI SDK Multi-Model)   • GitHub REST API v3
                          • Google Drive v3 / Docs
                          • Supabase PostgreSQL
```

- **Frontend**: React 19, Tailwind CSS v4, Vite, Lucide Icons
- **Backend**: Node.js, Express, CORS, dotenv
- **AI Engine**: Google GenAI SDK (`@google/genai`), Gemini 2.0/3.5/3.8 Flash
- **Auth & Database**: Supabase (GoTrue, PostgreSQL, Row Level Security)
- **Integrations**: GitHub API, Google Drive API

---

## 🚀 Quickstart Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Onboardai.git
cd Onboardai
```

---

### 2. Backend Setup (`server/`)
```bash
cd server
npm install
```

Copy the environment template and add your API keys:
```bash
cp .env.example .env
```

Edit `server/.env`:
```env
# Google Gemini API key (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# Google Drive API key (Optional)
GOOGLE_DRIVE_API_KEY=your_google_drive_api_key_here

# GitHub Personal Access Token (Optional - increases rate limits)
# GITHUB_TOKEN=your_github_token_here

PORT=5000
```

Start the backend:
```bash
npm start
# Server running on http://localhost:5000
```

---

### 3. Frontend Setup (`client/`)
In a new terminal window:
```bash
cd client
npm install
```

Copy the environment template:
```bash
cp .env.example .env
```

Edit `client/.env` (or `.env.local`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-anon-key
```

The client uses same-origin `/api` requests by default. During local development,
Vite proxies these requests to `http://localhost:5000`; on Vercel, the project
rewrites `/api/*` to the Express service. Set `VITE_API_BASE_URL` only when
intentionally using a separately hosted API.

Start the frontend development server:
```bash
npm run dev
# Vite server running on http://localhost:5173
```

---

### 4. Running the Application
Open your browser at **`http://localhost:5173`**.
- Sign in with your Supabase credentials or click **"Try Demo Intern Account"** to immediately explore the dashboard.

---

## 🧪 Testing & Verification

Run linter checks:
```bash
cd client
npm run lint
```

Build production client assets:
```bash
cd client
npm run build
```

Verify backend health:
```bash
curl http://localhost:5000/api/health
# {"status":"ok","message":"OnboardAI Backend Running"}
```

---

## 🔒 Security & Privacy

- Secret keys (`.env`, `client/.env.local`) are strictly excluded from git tracking via `.gitignore`.
- Context ingestion sanitizes untrusted input files and blocks sensitive environment variables, lockfiles, and private keys.
- Rate limiting is enforced on all generative AI summarization and chat endpoints.

---

## 📄 License
MIT License. Created for Developer Onboarding & AI Productivity.
