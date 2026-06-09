// tests/contrast.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contrastRatio, wcagLevel } from '../skills/design-review/scripts/contrast.mjs';

test('noir sur blanc = 21:1', () => {
  assert.equal(Math.round(contrastRatio('#000000', '#ffffff')), 21);
});

test('niveau WCAG', () => {
  assert.equal(wcagLevel(21), 'AAA');
  assert.equal(wcagLevel(4.6), 'AA');
  assert.equal(wcagLevel(3.5), 'AA-large');
  assert.equal(wcagLevel(2), 'FAIL');
});

test('gère les hex courts', () => {
  assert.equal(Math.round(contrastRatio('#000', '#fff')), 21);
});
