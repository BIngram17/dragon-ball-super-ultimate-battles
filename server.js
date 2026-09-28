import { createApp } from './app.js';
import { createPool } from './db/pool.js';
import { createFightRepository } from './db/fights.js';
const pool = createPool();
const app = createApp(createFightRepository(pool));
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Ultimate Battles is running at http://localhost:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
  server.close(async () => { await pool.end(); process.exit(0); });
});
