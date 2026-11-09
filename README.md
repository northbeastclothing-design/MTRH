# MTRH Interactive Map

Mapping the Rabbit Hole (https://mappingtherabbithole.com): an interactive world map, timeline, historical cartography gallery and codex of unexplained phenomena, ancient sites, cryptids, UFO cases and related lore.

## Run locally

Requires Node.js 22+.

```sh
npm install
cp .env.example .env   # fill in the keys you need
PORT=3000 npm run dev  # Vite + Express via tsx
```

`npm run lint` type-checks, `npm run build` produces `dist/` (client bundle + `dist/server.cjs`), and `npm start` serves that build.

## Deploy

A push to `main` on GitHub triggers Cloud Run continuous deployment. Double-click `Deploy to Live Site.command` to run the pre-flight checks and push. Firestore rules live in `firestore.rules` and are deployed separately with the Firebase CLI.

## Layout

- `src/App.tsx` – map page and app shell; `CartographyPage`, `TimelinePage`, `CodexPage` are lazy-loaded
- `src/*Data.ts`, `src/*.json` – the content datasets
- `src/layers.ts` – single source of truth for layer names, colors and icons
- `server.ts` – Express API (moderation, share previews, media proxy)
- `scripts/` – maintenance tooling (Alien Archivist watcher, codex audit)
- `validate-data.ts` – data consistency check
