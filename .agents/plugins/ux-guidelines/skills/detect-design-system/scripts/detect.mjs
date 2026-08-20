// skills/detect-design-system/scripts/detect.mjs
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

function walk(dir, exts, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, exts, acc);
    else if (exts.includes(extname(full))) acc.push(full);
  }
  return acc;
}

function extractTokens(css) {
  const tokens = {};
  for (const m of css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[m[1]] = m[2].trim();
  }
  return tokens;
}

function extractFonts(css) {
  const fonts = new Set();
  for (const m of css.matchAll(/font-family\s*:\s*([^;]+);/g)) {
    for (const part of m[1].split(',')) {
      const name = part.trim().replace(/^['"]|['"]$/g, '');
      if (name && !/^(sans-serif|serif|monospace|system-ui|inherit)$/i.test(name)) fonts.add(name);
    }
  }
  return [...fonts];
}

function extractPalette(css) {
  const colors = new Set();
  for (const m of css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) colors.add(m[0].toLowerCase());
  for (const m of css.matchAll(/(rgb|hsl)a?\([^)]+\)/g)) colors.add(m[0]);
  return [...colors];
}

function extractComponents(projDir) {
  const files = [];
  for (const sub of ['src/components', 'components', 'app/components']) {
    const dir = join(projDir, sub);
    try { statSync(dir); files.push(...walk(dir, ['.tsx', '.jsx', '.astro', '.vue'])); } catch {}
  }
  const components = [];
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const name = basename(file).replace(/\.\w+$/, '');
    const props = new Set();
    const iface = /interface\s+\w*Props\s*\{([\s\S]*?)\}/.exec(text);
    if (iface) {
      for (const m of iface[1].matchAll(/(\w+)\s*\??\s*:/g)) props.add(m[1]);
    }
    components.push({ name, file: file.replace(projDir + '/', ''), props: [...props] });
  }
  return components;
}

export async function detectDesignSystem(projDir) {
  const cssFiles = walk(projDir, ['.css', '.scss']);
  let tokens = {}, fonts = new Set(), palette = new Set();
  for (const f of cssFiles) {
    const css = readFileSync(f, 'utf8');
    Object.assign(tokens, extractTokens(css));
    extractFonts(css).forEach((x) => fonts.add(x));
    extractPalette(css).forEach((x) => palette.add(x));
  }
  const components = extractComponents(projDir);
  return {
    tokens,
    fonts: [...fonts],
    palette: [...palette],
    components,
    toMarkdown() {
      const tk = Object.entries(tokens).map(([k, v]) => `| \`${k}\` | \`${v}\` |`).join('\n');
      const cp = components
        .map((c) => `- **${c.name}** (\`${c.file}\`) — props : ${c.props.map((p) => `\`${p}\``).join(', ') || '—'}`)
        .join('\n');
      return [
        '# design.md — Manifeste du design system',
        '',
        '> Généré par le skill `detect-design-system`. Les sections UX/Writing en bas sont à compléter à la main.',
        '',
        '## Tokens',
        '',
        '| Token | Valeur |',
        '|-------|--------|',
        tk || '| — | — |',
        '',
        '## Polices',
        '',
        this.fonts.map((f) => `- ${f}`).join('\n') || '- (aucune détectée)',
        '',
        '## Palette',
        '',
        this.palette.map((c) => `- \`${c}\``).join('\n') || '- (aucune détectée)',
        '',
        '## Composants',
        '',
        cp || '- (aucun détecté)',
        '',
        '## Charte UX & Writing (à compléter)',
        '',
        '- **Positionnement** : …',
        '- **Cibles** : …',
        '- **Ton de voix** : …',
        '',
      ].join('\n');
    },
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const projDir = process.argv[2] || process.cwd();
  const ds = await detectDesignSystem(projDir);
  writeFileSync(join(projDir, 'design.md'), ds.toMarkdown());
  console.log(`design.md écrit : ${Object.keys(ds.tokens).length} tokens, ${ds.fonts.length} polices, ${ds.components.length} composants.`);
}
