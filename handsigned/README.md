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

## Real AI score endpoint (optional)

You can plug in a real AI scoring endpoint for the Create Listing analysis button.

1) Deploy a small serverless function (e.g., Vercel/Netlify/Cloudflare) that accepts `{ title, description, imageUrl }` and returns `{ score: 0-100 }`.

2) Set the endpoint URL in an env var before building/running this app:

```powershell
# .env.local (not committed)
echo REACT_APP_SCORE_API_URL=https://your-app.vercel.app/api/score > .env.local
```

3) The app will call the endpoint if `REACT_APP_SCORE_API_URL` is defined; otherwise it uses a local estimate.

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
