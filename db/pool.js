import 'dotenv/config';
import pg from 'pg';

export function createPool(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) throw new Error('Set DATABASE_URL in .env before starting the app.');
  const url = new URL(connectionString);
  const externalRender = url.hostname.endsWith('.render.com');
  // Render external connections use TLS with certificate verification.
  if (externalRender) url.searchParams.delete('sslmode');
  const pool = new pg.Pool({
    connectionString: url.toString(),
    ...(externalRender ? { ssl: { rejectUnauthorized: true } } : {}),
    max: 5,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    statement_timeout: 10000,
  });
  pool.on('error', () => console.error('An idle database connection failed.'));
  return pool;
}
