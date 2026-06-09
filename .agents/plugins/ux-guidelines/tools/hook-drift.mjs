// tools/hook-drift.mjs
import { readFileSync } from 'node:fs';
import { findDrift } from '../skills/design-review/scripts/token-drift.mjs';

const UI_EXT = /\.(tsx|jsx|astro|vue|css|scss)$/i;

export function buildWarning(filePath, content) {
  if (!UI_EXT.test(filePath)) return '';
  const hits = findDrift(content);
  if (hits.length === 0) return '';
  const values = [...new Set(hits.map((h) => h.value))].slice(0, 5).join(', ');
  return `⚠️ ux-guidelines : valeurs en dur (drift de tokens) dans ${filePath} : ${values}. Lance /design-review et passe par les tokens de design.md.`;
}

// Entrée hook : reçoit le chemin du fichier édité en argv[2].
if (process.argv[1] && process.argv[1].endsWith('hook-drift.mjs')) {
  const file = process.argv[2];
  try {
    const w = file ? buildWarning(file, readFileSync(file, 'utf8')) : '';
    if (w) console.log(w);
  } catch { /* hook advisory : jamais bloquant */ }
}
