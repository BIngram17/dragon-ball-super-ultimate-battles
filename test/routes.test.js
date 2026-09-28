import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../app.js';
import { PGlite } from '@electric-sql/pglite';
import { setupDatabase } from '../db/setup.js';
import { createFightRepository } from '../db/fights.js';

test('list, all detail routes, local assets, and real 404 responses', async () => {
  const database = new PGlite();
  const pool = { query: (...args) => database.query(...args), connect: async () => ({ query: (...args) => database.query(...args), release() {} }) };
  await setupDatabase(pool);
  await setupDatabase(pool);
  const app = createApp(createFightRepository(pool));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const home = await fetch(base);
    assert.equal(home.status, 200);
    assert.match(await home.text(), /SIX FIGHTS/);
    const fights = await (await fetch(`${base}/api/fights`)).json();
    assert.equal(fights.length, 6);
    assert.equal(fights[0].slug, 'goku-vs-kefla');
    assert.deepEqual(fights.map(f => f.rank), [1, 2, 3, 4, 5, 6]);
    assert.equal(fights.find(f => f.id === 5).title, 'Vegeta vs. Top');
    for (const path of ['/fights/vegeta-vs-toppo', '/api/fights/vegeta-vs-toppo']) {
      const redirect = await fetch(base + path, { redirect: 'manual' });
      assert.equal(redirect.status, 301);
      assert.equal(redirect.headers.get('location'), path.replace('toppo', 'top'));
    }
    assert.equal(new Set(fights.map(f => f.slug)).size, 6);
    for (const [attribute, q, expected] of [['fighter', 'kefla', 1], ['arc', 'Tournament of Power', 4], ['format', 'movie', 1], ['title', 'Goku', 3], ['title', "' OR 1=1 --", 0], ['title', '%', 0], ['title', '_', 0]]) {
      const result = await fetch(`${base}/api/fights?${new URLSearchParams({ attribute, q })}`);
      assert.equal(result.status, 200);
      assert.equal((await result.json()).length, expected);
    }
    for (const query of ['attribute=password', 'q=x&q=y', `q=${'a'.repeat(121)}`]) {
      assert.equal((await fetch(`${base}/api/fights?${query}`)).status, 400);
    }
    await database.query('UPDATE fights SET spotlight = $1 WHERE id = $2', ['Changed in database', 3]);
    assert.equal((await (await fetch(`${base}/api/fights/goku-vs-kefla`)).json()).spotlight, 'Changed in database');
    await database.query('UPDATE fights SET spotlight = $1 WHERE id = $2', [fights[0].spotlight, 3]);
    for (const fight of fights) {
      assert.equal((await fetch(`${base}/fights/${fight.slug}`)).status, 200);
      assert.deepEqual(await (await fetch(`${base}/api/fights/${fight.slug}`)).json(), fight);
    }
    for (const path of ['/fights/missing', '/missing', '/assets/missing.css']) {
      const result = await fetch(base + path);
      assert.equal(result.status, 404);
      assert.match(await result.text(), /This fight doesn’t exist/);
    }
    for (const path of ['/api/fights/missing', '/api/missing']) {
      const result = await fetch(base + path);
      assert.equal(result.status, 404);
      assert.ok((await result.json()).error);
    }
    for (const path of ['/assets/styles.css', '/assets/app.js', '/vendor/pico.min.css']) {
      assert.equal((await fetch(base + path)).status, 200);
    }
  } finally { await new Promise(resolve => server.close(resolve)); await database.close(); }
});

test('database failures return safe service-unavailable responses', async () => {
  const fail = async () => { throw new Error('postgresql://private-password@host/database'); };
  const server = createApp({ list: fail, find: fail }).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try {
    for (const path of ['/api/fights', '/api/fights/goku-vs-kefla', '/fights/goku-vs-kefla']) {
      const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`);
      assert.equal(response.status, 503);
      assert.doesNotMatch(await response.text(), /private-password|postgresql/);
    }
  } finally { await new Promise(resolve => server.close(resolve)); }
});
