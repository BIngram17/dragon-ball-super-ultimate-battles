import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createPool } from './pool.js';
import { fights } from '../data/fights.js';

export async function setupDatabase(pool) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(await readFile(new URL('./schema.sql', import.meta.url), 'utf8'));
    const columns = Object.keys(fights[0]);
    const names = columns.map(name => `"${name}"`).join(', ');
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
    const updates = columns.filter(name => name !== 'id').map(name => `"${name}" = EXCLUDED."${name}"`).join(', ');
    for (const fight of fights) {
      await client.query(`INSERT INTO fights (${names}) VALUES (${placeholders}) ON CONFLICT (id) DO UPDATE SET ${updates}`,
        columns.map(name => fight[name]));
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}

// Seed only when explicitly requested; normal server startup never resets data.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let pool;
  try {
    pool = createPool();
    await setupDatabase(pool);
    console.log('Database ready: six fight records seeded.');
  } catch {
    console.error('Database setup failed. Check DATABASE_URL and database availability.');
    process.exitCode = 1;
  } finally { if (pool) await pool.end(); }
}
