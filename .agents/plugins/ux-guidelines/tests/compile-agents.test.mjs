// tests/compile-agents.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compileAgent } from '../tools/compile-agents.mjs';

const src = [
  '---',
  'name: ux-strategist',
  'description: Utilise quand il faut définir cible et objectif business.',
  'hidden: false',
  'tools: [view_file, grep_search]',
  'includeSections: [skills, user_rules, artifacts]',
  '---',
  'Tu es le UX Strategist.',
].join('\n');

test('produit la structure agent.json attendue', () => {
  const json = compileAgent(src);
  assert.equal(json.name, 'ux-strategist');
  assert.equal(json.hidden, false);
  assert.equal(json.config.customAgent.systemPromptSections[0].title, 'Agent System Instructions');
  assert.match(json.config.customAgent.systemPromptSections[0].content, /UX Strategist/);
  assert.deepEqual(json.config.customAgent.toolNames, ['view_file', 'grep_search']);
  assert.deepEqual(
    json.config.customAgent.systemPromptConfig.includeSections,
    ['skills', 'user_rules', 'artifacts'],
  );
});

test("n’émet pas le champ model (schéma non confirmé) mais ne plante pas s’il est présent", () => {
  const withModel = src.replace('hidden: false', 'hidden: false\nmodel: heavy');
  const json = compileAgent(withModel);
  assert.equal('model' in json, false);
});
