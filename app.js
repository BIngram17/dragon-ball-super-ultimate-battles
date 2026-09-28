import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchAttributes } from './db/fights.js';

const root = path.dirname(fileURLToPath(import.meta.url));
export function createApp(repository) {
const app = express();
app.disable('x-powered-by');

// Serve only public assets, never the project source or all of node_modules.
app.use('/assets', express.static(path.join(root, 'public')));
app.get('/vendor/pico.min.css', (_req, res) =>
  res.sendFile(path.join(root, 'node_modules/@picocss/pico/css/pico.min.css')));

app.get('/api/fights', async (req, res) => {
  const { q = '', attribute = 'title' } = req.query;
  if (typeof q !== 'string' || q.length > 120 || typeof attribute !== 'string' || !searchAttributes.includes(attribute)) {
    return res.status(400).json({ error: 'Use a search of up to 120 characters and a valid attribute.' });
  }
  res.json(await repository.list({ q: q.trim(), attribute }));
});
app.get('/api/fights/vegeta-vs-toppo', (_req, res) => res.redirect(301, '/api/fights/vegeta-vs-top'));
app.get('/api/fights/:slug', async (req, res) => {
  const fight = await repository.find(req.params.slug);
  if (!fight) return res.status(404).json({ error: 'Fight not found' });
  res.json(fight);
});
app.use('/api', (_req, res) => res.status(404).json({ error: 'Route not found' }));

app.get('/', (_req, res) => res.sendFile(path.join(root, 'pages/index.html')));
// Keep existing bookmarks working after the name correction.
app.get('/fights/vegeta-vs-toppo', (_req, res) => res.redirect(301, '/fights/vegeta-vs-top'));
app.get('/fights/:slug', async (req, res, next) => {
  if (!await repository.find(req.params.slug)) return next();
  res.sendFile(path.join(root, 'pages/fight.html'));
});
// A real HTTP 404, including unknown fight slugs and missing assets.
app.use((_req, res) => res.status(404).sendFile(path.join(root, 'pages/404.html')));
app.use((_error, req, res, _next) => {
  if (req.path.startsWith('/api/')) return res.status(503).json({ error: 'Fight data is temporarily unavailable. Please try again.' });
  res.status(503).type('text').send('Fight data is temporarily unavailable. Please try again shortly.');
});
return app;
}
