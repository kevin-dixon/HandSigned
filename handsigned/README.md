# HandSigned — Human-made Digital Art Marketplace (Mock)

HandSigned is a static React app (Create React App) for showcasing a marketplace focused on human-made digital art. It uses local JSON as a mock database and routes via HashRouter for GitHub Pages compatibility.

## Features

- Marketplace listing grid with search and AI Authenticity Score filters
- Listing detail with watermarked preview and reviews
- Seller profile pages
- Mock login (switch between buyer/seller)
- Mock Create Listing with simulated AI score generation (50–100)
- Tailwind CSS styling (utility-first)

## Quickstart

1. Install dependencies:

```powershell
npm install
npm install react-router-dom gh-pages -S
npm install -D tailwindcss@3 postcss autoprefixer
```

2. Tailwind config is already included. If you need to re-create it (for v3):

```powershell
npx tailwindcss init -p
```

3. Run locally:

```powershell
npm start
```

Open http://localhost:3000 (routing uses hash URLs for GitHub Pages).

## Real AI score endpoint (optional but recommended)

You can plug in a real AI scoring endpoint for the Create Listing analysis button.

Option A — Use the built-in scoring API (OpenAI or Gemini or demo)

1) Start the local API included in this repo at `server/`:

```powershell
cd server
npm install
npm run dev # starts on http://localhost:8787
```

2) In the web app root, create `.env.local` and point to the local API:

```powershell
cd ..
echo REACT_APP_SCORE_API_URL=http://localhost:8787/score > .env.local
```

3) Choose a provider in `server/.env` (copy from `.env.example`):

```env
# server/.env
PORT=8787
CORS_ORIGIN=http://localhost:3000
PROVIDER=openai      # or gemini or demo

# OpenAI (ChatGPT Vision)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-1.5-flash
```

The API will use the selected provider, and falls back to a deterministic demo score if anything fails. Images chosen via file input are sent as data URLs and are supported.

Option B — Deploy the API

Deploy `server/` to your favorite platform (Render, Fly.io, Railway, a small VM, etc.) and set `REACT_APP_SCORE_API_URL` to the deployed `/score` endpoint. The contract is:

- Request: `POST /score` JSON `{ title?: string, description?: string, imageUrl?: string }`
- Response: JSON `{ score: number }` in the range 0–100

If `REACT_APP_SCORE_API_URL` is missing, the app falls back to a local estimate.

## Deploy to GitHub Pages

This repo is configured with:

- `homepage` in `package.json`: `https://kevin-dixon.github.io/handsigned`
- Scripts: `predeploy` and `deploy` (via `gh-pages`)

Deploy with:

```powershell
npm run deploy
```

## Data

- Source: `src/data/mockDatabase.json`
- Assets: `public/assets/images/*`

## Tech Stack

- React (CRA), React Router (HashRouter)
- Tailwind CSS (PostCSS)
- GitHub Pages (static hosting)

## Notes

- All data is static; no server calls. The login and create listing flows are mocks for demonstration only.
