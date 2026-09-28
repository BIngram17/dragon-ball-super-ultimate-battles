## Run locally with Render PostgreSQL

1. Install Node.js 20 or newer and run `npm install`.
2. Create or resume the project PostgreSQL database in the Render dashboard.
3. Copy `.env.example` to `.env`. Put the **External Database URL** in `DATABASE_URL`. Never commit `.env` or show connection credentials in screenshots.
4. Run `npm run db:setup` to create the `fights` table and seed six records.
5. Run `npm start`, then open `http://localhost:3000`.

For a Render-hosted server in the database's region, use the Internal Database URL. External connections use TLS with certificate verification. Database credentials never reach the frontend.

`npm run dev` restarts the server after edits. `PORT` defaults to 3000. The app requires `DATABASE_URL`; there is no fallback to the seed array.

## Database and project structure

- `db/schema.sql`: table with a primary-key ID, unique positive rank, unique URL slug, title, a PostgreSQL text array of fighters, arc, format, location, editorial details, images, credits, and videos. Quoted camelCase column names preserve the frontend JSON contract.
- `db/setup.js`: schema and seed inserts in one transaction. Upserts update the six seed records without duplicates. Normal app startup never reseeds.
- `db/pool.js`: connection configuration and pooling.
- `db/fights.js`: parameterized list, search, and detail queries.
- `data/fights.js`: seed records only.
- `server.js`, `app.js`: Express server and HTTP routes.
- `pages/`, `public/`: framework-free HTML, CSS, JavaScript, and assets.
- `test/`: database and HTTP integration checks.

## Routes and search

- `/`: ranking with search form.
- `/api/fights`: all records ordered by rank.
- `/api/fights?attribute=fighter&q=Goku`: search fighters. Other attributes are `title`, `arc`, and `format`.
- `/api/fights/:slug`: one database record or HTTP 404.
- `/fights/:slug`: detail page after checking the slug against PostgreSQL.
- Old `vegeta-vs-toppo` routes redirect to `vegeta-vs-top`.
- Unknown routes return the custom 404 page.

Search is case-insensitive and treats percent signs, underscores, and backslashes literally. SQL values use placeholders; searchable columns come from a fixed allowlist. Search is saved in the URL and browser Back/Forward restores it. Database outages return HTTP 503.

## Verification and submission recording

Run `npm test`. The tests execute the actual schema and SQL against isolated PGlite PostgreSQL, seed twice, check search/input validation, confirm database edits appear through the API, and verify 404/503 behavior. These tests do not replace live Render verification.

For the assignment GIF, show the Render database status as **Available**. In psql connected to that same database, run:

```sql
\pset pager off
\x auto
SELECT * FROM fights;
```

Show the query and table contents, then demonstrate the ranking, search, and detail pages. Keep passwords and connection URLs off-screen. `docs/project2-walkthrough.gif` includes the Render Available status, actual psql query transcript, and the live app. `docs/walkthrough.gif` preserves the Project 1 recording. The configured free Render database expires October 23, 2026.

## Media

Snapshots include local and remote images. Embedded English-dub videos require internet access and continued uploader availability. Some clips are highlights rather than complete fights. Playback was verified in Edge. Rankings are subjective and contain spoilers.
