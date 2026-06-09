// skills/design-review/scripts/review.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { findDrift } from './token-drift.mjs';
import { findA11yIssues } from './a11y.mjs';
import { findWalls } from './wall-of-text.mjs';

// Extrait les paragraphes texte d'un JSX/HTML (texte entre balises).
function extractText(code) {
  return [...code.matchAll(/>([^<>{}]{3,})</g)]
    .map((m) => m[1].trim())
    .filter((t) => /\s/.test(t));
}

export function reviewCode(code) {
  const findings = [];
  for (const d of findDrift(code)) findings.push({ category: 'token-drift', ...d });
  for (const a of findA11yIssues(code)) findings.push({ category: 'a11y', ...a });
  for (const w of findWalls(extractText(code))) findings.push({ category: 'wall-of-text', ...w });

  const verdict = findings.length === 0 ? 'PASS' : 'FAIL';
  return {
    verdict,
    findings,
    toMarkdown() {
      const lines = findings.map(
        (f) => `- **[${f.category}]** ${f.code || f.type || ''} ${f.message || f.value || f.excerpt || ''}`.trim(),
      );
      return [
        '# Rapport de vérification déterministe',
        '',
        `**Verdict automatique :** ${verdict}`,
        '',
        findings.length ? '## Findings\n' + lines.join('\n') : '_Aucun finding déterministe._',
        '',
        '> Ce rapport ne couvre que les checks automatisés. La revue qualitative',
        '> (AI slop, cohérence narrative) est faite par la persona design-reviewer.',
      ].join('\n');
    },
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = process.argv[2];
  if (!file) { console.error('Usage: review.mjs <fichier>'); process.exit(2); }
  const r = reviewCode(readFileSync(file, 'utf8'));
  console.log(r.toMarkdown());
  process.exit(r.verdict === 'PASS' ? 0 : 1);
}
