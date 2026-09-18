import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fights } from './data/fights.js';

const root = path.dirname(fileURLToPath(import.meta.url));
export const app = express();
app.disable('x-powered-by');

// Serve only public assets, never the project source or all of node_modules.
app.use('/assets', express.static(path.join(root, 'public')));
app.get('/vendor/pico.min.css', (_req, res) =>
  res.sendFile(path.join(root, 'node_modules/@picocss/pico/css/pico.min.css')));

app.get('/api/fights', (_req, res) => res.json(fights));
app.get('/api/fights/:slug', (req, res) => {
  const fight = fights.find(item => item.slug === req.params.slug);
  if (!fight) return res.status(404).json({ error: 'Fight not found' });
  res.json(fight);
});
app.use('/api', (_req, res) => res.status(404).json({ error: 'Route not found' }));

app.get('/', (_req, res) => res.sendFile(path.join(root, 'pages/index.html')));
app.get('/fights/:slug', (req, res, next) => {
  if (!fights.some(item => item.slug === req.params.slug)) return next();
  res.sendFile(path.join(root, 'pages/fight.html'));
});
// A real HTTP 404, including unknown fight slugs and missing assets.
app.use((_req, res) => res.status(404).sendFile(path.join(root, 'pages/404.html')));
