// tests/detect.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectDesignSystem } from '../skills/detect-design-system/scripts/detect.mjs';

const projDir = new URL('./fixtures/proj1', import.meta.url).pathname;

test('extrait tokens, polices, palette et composants', async () => {
  const ds = await detectDesignSystem(projDir);
  assert.ok(ds.tokens['--color-primary'] === '#3b82f6');
  assert.ok(ds.tokens['--space-3'] === '16px');
  assert.ok(ds.fonts.includes('Montserrat'));
  assert.ok(ds.fonts.includes('Roboto'));
  assert.ok(ds.palette.includes('#3b82f6'));
  const card = ds.components.find((c) => c.name === 'Card');
  assert.ok(card, 'Card détecté');
  assert.deepEqual(card.props.sort(), ['elevated', 'title']);
});

test('rend un markdown design.md avec les sections attendues', async () => {
  const ds = await detectDesignSystem(projDir);
  const md = ds.toMarkdown();
  assert.match(md, /## Tokens/);
  assert.match(md, /## Polices/);
  assert.match(md, /## Palette/);
  assert.match(md, /## Composants/);
  assert.match(md, /--color-primary/);
});
