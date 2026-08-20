// tests/review.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reviewCode } from '../skills/design-review/scripts/review.mjs';

test('agrège drift + a11y et conclut FAIL', () => {
  const code = `<img src="x.png" /><div style={{ color: '#fff' }} />`;
  const r = reviewCode(code);
  assert.equal(r.verdict, 'FAIL');
  assert.ok(r.findings.some((f) => f.code === 'img-alt'));
  assert.ok(r.findings.some((f) => f.type === 'color'));
});

test('code propre conclut PASS', () => {
  const code = `<img src="x.png" alt="ok" /><div style={{ color: 'var(--c)' }} />`;
  const r = reviewCode(code);
  assert.equal(r.verdict, 'PASS');
  assert.equal(r.findings.length, 0);
});

test('rapport markdown listant les findings', () => {
  const code = `<img src="x.png" />`;
  assert.match(reviewCode(code).toMarkdown(), /img-alt/);
});
