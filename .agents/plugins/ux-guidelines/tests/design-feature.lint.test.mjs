// tests/design-feature.lint.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const md = readFileSync(new URL('../skills/design-feature/SKILL.md', import.meta.url), 'utf8');

test('frontmatter name + description', () => {
  assert.match(md, /name:\s*design-feature/);
  assert.match(md, /description:\s*Utilise/);
});

test('contient routage, gates, handover et les 5 personas', () => {
  assert.match(md, /routage/i);
  assert.match(md, /approval gate|gate de validation/i);
  assert.match(md, /docs\/design\//);
  for (const p of ['ux-strategist', 'ux-copywriter', 'ui-designer', 'motion-designer', 'design-reviewer']) {
    assert.match(md, new RegExp(p));
  }
});
