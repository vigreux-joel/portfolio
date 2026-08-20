// tests/frontmatter.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter } from '../tools/frontmatter.mjs';

test('extrait scalaires, booléens et tableaux inline + corps', () => {
  const src = [
    '---',
    'name: ux-strategist',
    'description: Utilise quand une feature UI doit définir sa cible.',
    'hidden: false',
    'tools: [view_file, grep_search, search_web]',
    '---',
    'Corps du prompt.',
    'Deuxième ligne.',
  ].join('\n');
  const { data, body } = parseFrontmatter(src);
  assert.equal(data.name, 'ux-strategist');
  assert.equal(data.description, 'Utilise quand une feature UI doit définir sa cible.');
  assert.equal(data.hidden, false);
  assert.deepEqual(data.tools, ['view_file', 'grep_search', 'search_web']);
  assert.equal(body, 'Corps du prompt.\nDeuxième ligne.');
});

test('lève une erreur si pas de frontmatter', () => {
  assert.throws(() => parseFrontmatter('pas de frontmatter'), /frontmatter/i);
});
