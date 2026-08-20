// tests/token-drift.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findDrift } from '../skills/design-review/scripts/token-drift.mjs';

test('flag les hex et px en dur, ignore var() et les classes', () => {
  const code = `
    const a = <div style={{ color: '#3b82f6', padding: '17px' }} />;
    const b = <div style={{ color: 'var(--color-primary)' }} />;
    const c = <div className="p-4 text-primary" />;
  `;
  const hits = findDrift(code);
  const values = hits.map((h) => h.value).sort();
  assert.deepEqual(values, ['#3b82f6', '17px']);
});

test('aucun drift sur du code 100% tokens', () => {
  const code = `<div style={{ color: 'var(--c)', gap: 'var(--space-3)' }} />`;
  assert.deepEqual(findDrift(code), []);
});
