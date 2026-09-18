## Run locally

Install Node.js 20 or newer. Open a terminal in this project folder:

```sh
npm install
npm start
```

Open http://localhost:3000. During development, use `npm run dev` to restart the server automatically after edits. Set the `PORT` environment variable if port 3000 is already in use.

Pico CSS is served locally. Fight snapshots load from Toei Animation and YouTube; embedded YouTube videos require internet access. Videos play inside their detail pages using YouTube embeds. English-dub uploads were selected, and actual in-page playback was checked on localhost. Some videos are highlights or compilations rather than entire fights. Remote video availability can change.

## Project structure

- `server.js` starts the Express server.
- `app.js` defines page routes, API routes, static assets, and 404 handling.
- `data/fights.js` holds the six records with a shared structure, ready for a Unit 2 database.
- `pages/` contains static HTML shells and the custom 404 page.
- `public/app.js` fetches data and renders it using vanilla DOM methods.
- `public/styles.css` customizes Pico CSS and handles responsive layouts.
- `test/routes.test.js` checks page routes, the API, assets, and 404 responses.
- `docs/` contains desktop/mobile screenshots and the GIF walkthrough.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Ranked list of six fights |
| `/fights/:slug` | Details for a known fight |
| `/api/fights` | All fight records as JSON |
| `/api/fights/:slug` | One fight record as JSON |
| Any unmatched route | Custom 404 page (unknown API routes return JSON with status 404) |

Example: `/fights/goku-vs-jiren`.

## Data and customization

Edit `data/fights.js` to change the ranking or descriptions. Every record uses the same fields: `id`, `slug`, `rank`, `title`, `fighters`, `arc`, `format`, `location`, `spotlight`, `description`, `standoutMoment`, `whyItRanks`, `outcome`, `source`, `coverImage`, `coverAlt`, `coverSource`, `videoId`, `videoChannel`, and `videoLabel`.

The app currently stores data in a JavaScript array; it does not claim to have a database. The browser loads that data through Express. DOM text is inserted with `textContent` rather than interpreted as HTML.

## Checks

```sh
npm test
```

Also verified in a real Chromium browser: all six rendered cards and detail pages, every detail field, back navigation, 404 recovery, mobile overflow at 390px, data-fetch failure/retry, and absence of JavaScript errors.


