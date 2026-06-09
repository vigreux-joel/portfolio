// tools/frontmatter.mjs
function coerce(raw) {
  const v = raw.trim();
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim();
    if (inner === '') return [];
    return inner.split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
  }
  return v.replace(/^['"]|['"]$/g, '');
}

export function parseFrontmatter(src) {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(src);
  if (!match) throw new Error('Document sans frontmatter YAML (--- requis).');
  const [, head, body] = match;
  const data = {};
  for (const line of head.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    data[key] = coerce(line.slice(idx + 1));
  }
  return { data, body: body.trim() };
}
