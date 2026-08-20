// tests/a11y.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findA11yIssues } from '../skills/design-review/scripts/a11y.mjs';

test('flag img sans alt et saut de niveau de titre', () => {
  const code = `<h2>Titre</h2><img src="a.png" /><h4>Sous</h4>`;
  const issues = findA11yIssues(code);
  const codes = issues.map((i) => i.code).sort();
  assert.ok(codes.includes('img-alt'));
  assert.ok(codes.includes('heading-skip'));
});

test('code accessible ne déclenche rien', () => {
  const code = `<h2>Titre</h2><img src="a.png" alt="schéma" /><h3>Sous</h3>`;
  assert.deepEqual(findA11yIssues(code), []);
});
