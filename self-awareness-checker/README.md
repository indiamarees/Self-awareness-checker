# Self-Awareness Checker (Vite + React + Tailwind)

A goal-readiness self-assessment questionnaire with an instant scorecard, radar chart, and personalized insights.

## ✨ Features
- 26 Likert-scale questions across 8 categories
- Per-category scores and overall readiness
- Radar chart (Recharts)
- Actionable insights per category
- Reset, Print/Export, and Copy JSON responses

## 🚀 Local Development

```bash
npm install
npm run dev
```

Visit the printed local URL (usually http://localhost:5173).

## 🏗️ Build
```bash
npm run build
npm run preview
```

## ☁️ Deploy to Netlify (Free)

**Method A: Connect GitHub (recommended)**
1. Push this folder to a new GitHub repo.
2. Go to https://app.netlify.com → **Add new site** → **Import from Git**.
3. Pick your repo. Build command: `npm run build`. Publish dir: `dist`.
4. Deploy. Done ✅

**Method B: Drag-and-drop (no Git)**
1. Run `npm run build` locally.
2. Drag the generated `dist/` folder into https://app.netlify.com/drop.

Netlify config is already included in `netlify.toml`.

## 🛠️ Stack
- Vite + React 18
- Tailwind CSS 3
- Recharts 2

## 📁 Project Structure
```
self-awareness-checker/
├─ index.html
├─ netlify.toml
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ vite.config.js
└─ src/
   ├─ App.jsx
   ├─ index.css
   └─ main.jsx
```

## 🧾 License
MIT
