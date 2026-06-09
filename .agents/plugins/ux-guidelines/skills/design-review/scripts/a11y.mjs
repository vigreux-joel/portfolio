// skills/design-review/scripts/a11y.mjs
export function findA11yIssues(code) {
  const issues = [];

  // <img> sans attribut alt
  for (const m of code.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt\s*=/.test(m[0])) {
      issues.push({ code: 'img-alt', message: 'Image sans attribut alt.', excerpt: m[0] });
    }
  }

  // Saut de niveau de titre (h2 -> h4)
  const levels = [...code.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      issues.push({ code: 'heading-skip', message: `Saut de titre h${levels[i - 1]} → h${levels[i]}.` });
    }
  }

  return issues;
}
