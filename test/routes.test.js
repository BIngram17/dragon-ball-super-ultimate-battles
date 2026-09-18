import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../app.js';

test('list, all detail routes, local assets, and real 404 responses', async () => {
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
  } finally { await new Promise(resolve => server.close(resolve)); }
});
