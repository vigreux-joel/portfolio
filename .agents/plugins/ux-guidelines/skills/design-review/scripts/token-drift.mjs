// skills/design-review/scripts/token-drift.mjs
// Repère les valeurs de couleur/espacement codées en dur (hors var()).
export function findDrift(code) {
  const hits = [];
  // Couleurs hex littérales
  for (const m of code.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
    hits.push({ type: 'color', value: m[0], index: m.index });
  }
  // Espacements en px (>0), hors 0px et hors media queries triviales
  for (const m of code.matchAll(/\b(\d+)px\b/g)) {
    if (m[1] !== '0') hits.push({ type: 'spacing', value: m[0], index: m.index });
  }
  return hits;
}

export function scanFiles(files, readFile) {
  const report = [];
  for (const f of files) {
    const hits = findDrift(readFile(f));
    for (const h of hits) report.push({ file: f, ...h });
  }
  return report;
}
