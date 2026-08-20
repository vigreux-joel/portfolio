// skills/design-review/scripts/wall-of-text.mjs
const MAX_WORDS = 45;
const MAX_SENTENCES = 3;

export function findWalls(paragraphs) {
  const walls = [];
  paragraphs.forEach((p, i) => {
    const words = p.trim().split(/\s+/).filter(Boolean).length;
    const sentences = (p.match(/[.!?](\s|$)/g) || []).length;
    if (words > MAX_WORDS || sentences > MAX_SENTENCES) {
      walls.push({ index: i, words, sentences, excerpt: p.slice(0, 60) + '…' });
    }
  });
  return walls;
}
