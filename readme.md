# 🐰 Talking Rabbitt
### Conversational Analytics + Insight Curation Engine

> Ask questions about your data in plain English. Get AI-generated insights and visualizations. Export them as an executive-ready presentation — in seconds.

---

## 📌 What It Does

Talking Rabbitt replaces:
- Manual Excel filtering
- Static dashboards
- Manual PowerPoint creation

With a single conversational workflow:

```
Upload CSV → Ask a question → Get insight + chart → Highlight key points → Export PPT
```

---

## 🚧 Current Progress

### ✅ Step 1 — Project Setup
- Full-stack monorepo initialized (`client/` + `server/`)
- React + Vite frontend scaffolded
- Python + FastAPI backend scaffolded
- Clean architecture with separation of concerns:
  - `api/` — route handlers
  - `services/` — business logic
  - `models/` — Pydantic schemas
  - `core/` — config and settings

### ✅ Step 2 — CSV Upload + Parsing
- Drag-and-drop file upload UI
- Client-side file validation (CSV only, 10MB limit)
- Backend CSV parsing via `pandas`
- In-memory session-based data store
- Returns dataset metadata: filename, row count, columns, sample rows
- Session ID passed via request header to identify user data

### ✅ Step 3 — Conversational Query Layer
- Chat-style UI with message history
- Natural language questions sent to backend
- Backend forwards query + dataset context to LLM
- LLM returns structured JSON: `{ insight, chart }`
- Response parsed and validated via Pydantic
- Error handling for malformed LLM responses

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Backend | Python 3.14 + FastAPI |
| LLM | Groq API (Llama 3.3 70B) |
| Charts | Recharts |
| PPT Export | python-pptx *(coming soon)* |
| HTTP Client | Axios |
| Data Parsing | Pandas + PapaParse |

---

## 📁 Project Structure

```
talking-rabbitt/
├── client/                        # React + Vite frontend
│   └── src/
│       ├── api/                   # API call functions
│       ├── components/            # Reusable UI components
│       ├── pages/                 # Page-level components
│       ├── hooks/                 # Custom React hooks
│       └── utils/                 # Helper functions
│
├── server/                        # Python + FastAPI backend
│   ├── app/
│   │   ├── api/                   # Route handlers
│   │   ├── services/              # Business logic (LLM, CSV, PPT)
│   │   ├── models/                # Pydantic schemas
│   │   └── core/                  # Config + settings
│   ├── main.py
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 25+
- Python 3.14+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repo
```bash
git clone https://github.com/Arnv24505/talking-rabbitt.git
cd talking-rabbitt
```

### 2. Backend setup
```bash
cd server
python -m venv venv
```
**Mac/Linux**
```bash
source venv/bin/activate
```

**Windows (PowerShell)**
```bash
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
cd server
venv\Scripts\activate
pip install -r requirements.txt
```

*Create your `.env` file*:
```bash
cp .env.example .env
# Add your Groq API key to .env
```

*Start the backend*:
```bash
python -m uvicorn main:app --reload --port 8000
```

### 3. Frontend setup
```bash
cd client
npm install
npm run dev
```

### 4. Open the app
Visit `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/upload` | Upload and parse CSV |
| `POST` | `/api/query` | Send natural language query |

---

<!-- ## 🗺️ Roadmap

- [x] Project setup and architecture
- [x] CSV upload and parsing
- [x] Conversational query layer (LLM integration)
- [ ] Chart visualization (Recharts)
- [ ] Insight highlighting and curation
- [ ] Chart selection for report
- [ ] PPT export (python-pptx)
- [ ] Deployment

--- -->

## 💡 How the LLM Integration Works

1. User uploads a CSV — backend parses it and stores it in memory keyed by session ID
2. User asks a question in plain English
3. Backend sends the question + dataset summary (columns + first 40 rows) to Groq
4. Groq returns a structured JSON response with an insight paragraph and chart data
5. Frontend renders the insight as text and the chart data via Recharts
6. User can highlight insights and select charts to build a report
7. Report exports as a PowerPoint presentation

The full CSV is never sent to the LLM — only column names and a sample of rows. This keeps requests fast and within token limits.

---

## 🔒 Environment Variables

| Variable | Description |
|---|---|
| `GROK_API_KEY` | Your Groq API key from console.groq.com |
