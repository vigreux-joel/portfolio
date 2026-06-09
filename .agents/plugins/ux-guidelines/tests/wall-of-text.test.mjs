// tests/wall-of-text.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findWalls } from '../skills/design-review/scripts/wall-of-text.mjs';

test('flag un paragraphe > 45 mots ou > 3 phrases', () => {
  const long = Array.from({ length: 50 }, (_, i) => `mot${i}`).join(' ') + '.';
  const fourSentences = 'Phrase une. Phrase deux. Phrase trois. Phrase quatre.';
  assert.equal(findWalls([long]).length, 1);
  assert.equal(findWalls([fourSentences]).length, 1);
});

test('un texte court et scannable ne déclenche rien', () => {
  assert.deepEqual(findWalls(['Phrase courte. Et nette.']), []);
});
