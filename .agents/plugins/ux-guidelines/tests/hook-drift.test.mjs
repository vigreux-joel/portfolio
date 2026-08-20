// tests/hook-drift.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildWarning } from '../tools/hook-drift.mjs';

test('produit un avertissement pour un fichier UI avec drift', () => {
  const w = buildWarning('Hero.tsx', `<div style={{ color: '#abc' }} />`);
  assert.match(w, /drift/i);
  assert.match(w, /#abc/);
  assert.match(w, /design-review/);
});

test("pas d'avertissement pour un fichier non-UI ou sans drift", () => {
  assert.equal(buildWarning('util.ts', `const x = 1`), '');
  assert.equal(buildWarning('Hero.tsx', `<div style={{ color: 'var(--c)' }} />`), '');
});
