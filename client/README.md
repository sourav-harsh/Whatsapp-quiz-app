# QuizChat — WhatsApp-style Quiz Application (React + Tailwind CSS)

A production-ready frontend clone of a WhatsApp-style quiz app.

Flow: **Login (dummy) → Exam → Subject → Chapter → Quiz → Result**

## Features

- Dummy authentication — pick one of 50 predefined users (persisted in `localStorage`)
- Protected routes; unauthenticated users are redirected to `/login`
- Multiple-choice questions, single correct answer, **no negative marking**
- One question shown at a time; **previous questions cannot be revisited**
- Answer must be selected before "Next" becomes active
- Result screen with score, accuracy and a per-question review
- WhatsApp-inspired UI: chat header, bubbles, chat wallpaper pattern
- Icons via `react-icons`, static assets in `public/images`

## Getting started

```bash
npm install
npm run seed     # generates src/data/db.json
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview
```

`npm run dev` and `npm run build` run the seed script automatically.

## Seed data

`scripts/seed.js` populates `src/data/db.json` (the local database) with:

| Entity    | Count |
| --------- | ----- |
| Users     | 50    |
| Exams     | 3     |
| Subjects  | 10    |
| Chapters  | 30    |
| Questions | 500   |

Data is deterministic (fixed RNG seed), so every run produces the same dataset.

## Project structure

```
public/
  images/                 static images used by the app
scripts/
  seed.js                 database seeding script
src/
  data/db.json            generated database
  pages/
    Login/index.jsx       + components/
    Exams/index.jsx       + components/
    Subjects/index.jsx    + components/
    Chapters/index.jsx    + components/
    Quiz/index.jsx        + components/
    Result/index.jsx      + components/
  utils/                  shared/common components & helpers
    AuthContext.jsx  ProtectedRoute.jsx  ChatHeader.jsx  PageShell.jsx
    ListRow.jsx  Avatar.jsx  EmptyState.jsx  Loader.jsx  NotFound.jsx
    db.js  storage.jsx
  styles/index.css        Tailwind entry + design-system classes
  App.jsx  main.jsx
```

## Routes

| Path                            | Screen   |
| ------------------------------- | -------- |
| `/login`                        | Login    |
| `/exams`                        | Exams    |
| `/exams/:examId/subjects`       | Subjects |
| `/subjects/:subjectId/chapters` | Chapters |
| `/chapters/:chapterId/quiz`     | Quiz     |
| `/chapters/:chapterId/result`   | Result   |

## Deployment

Any static host works. Build with `npm run build` and serve `dist/` with an
SPA fallback (all paths rewritten to `index.html`).
