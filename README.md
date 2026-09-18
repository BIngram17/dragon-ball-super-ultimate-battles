# Web Development Project 1 — Super Fights

**Super Fights** is a personal ranking of six Dragon Ball Super fights, including Dragon Ball Super: Broly. Visitors browse the cards and open a fight to read its standout moment, outcome, and ranking explanation.

## Required Features

- [x] The web app uses HTML, CSS, and JavaScript without a frontend framework.
- [x] The front page is functional and appropriately styled.
- [x] The web app displays a title.
- [x] The website displays at least five unique list items (six included).
- [x] Each item displays at least three attributes: rank, title, story arc/movie, format, description, and spotlight.
- [x] Each list item has its own corresponding page.
- [x] Clicking an item opens a detailed view with every stored field, including the ID, slug, source reference, and outcome.
- [x] Undefined routes serve an appropriate page with HTTP status 404.
- [x] The webpage uses Pico CSS, installed and served locally.

## Stretch Features

- [x] Items are displayed as responsive cards with hover and keyboard-focus states.

## Video Walkthrough

![Walkthrough of the ranking, fight details, and custom 404](docs/walkthrough.gif)

## Run locally

Install Node.js 20 or newer. Open a terminal in this project folder:

```sh
npm install
npm start
```

Open http://localhost:3000. During development, use `npm run dev` to restart the server automatically after edits. Set the `PORT` environment variable if port 3000 is already in use.

Pico CSS is served from the installed package, so the app needs no external stylesheets, fonts, or images at runtime.

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

Edit `data/fights.js` to change the ranking or descriptions. Every record uses the same fields: `id`, `slug`, `rank`, `title`, `fighters`, `arc`, `format`, `location`, `spotlight`, `description`, `standoutMoment`, `whyItRanks`, `outcome`, and `source`.

The app currently stores data in a JavaScript array; it does not claim to have a database. The browser loads that data through Express. DOM text is inserted with `textContent` rather than interpreted as HTML.

## Checks

```sh
npm test
```

Also verified in a real Chromium browser: all six rendered cards and detail pages, every detail field, back navigation, 404 recovery, mobile overflow at 390px, data-fetch failure/retry, and absence of JavaScript errors.

## Notes and submission

- The ranking and commentary are subjective fan opinions. Detail pages contain story spoilers.
- This is an unofficial educational project. Dragon Ball and its characters belong to their respective owners.
- The pasted assignment did not include the actual course README template or its link. This README includes a checked feature list and recorded walkthrough; transfer these into the exact course template before submission if its headings differ.
- Review and personalize the ranking and explanations before submitting. Follow your course’s AI-use disclosure rules.
- Submit your repository link and walkthrough through the course portal; this project has not been uploaded or submitted for you.

## References

- [Express static files](https://expressjs.com/en/starter/static-files/)
- [Pico CSS documentation](https://picocss.com/docs)
- [Dragon Ball Super episode summaries](https://en.wikipedia.org/wiki/List_of_Dragon_Ball_Super_episodes)
- [Dragon Ball Super: Broly plot](https://en.wikipedia.org/wiki/Dragon_Ball_Super:_Broly)

Fight commentary is original; story references are linked on each detail page.
