/**
 * Pure command fuzzy score (SURF-005).
 * commandScore(query, value, keywords?) -> number in [0,1]; higher is better.
 * - case-insensitive, NFD + \p{Diacritic} folding (café ~ cafe)
 * - ranking: exact > prefix > word-start > subsequence
 * - index-walk only: never builds a RegExp from user input
 */

function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function isWordBoundary(value: string, index: number): boolean {
  if (index <= 0) return true;
  const prev = value.charCodeAt(index - 1);
  // space, -, _, /, ., :, and camelCase boundaries (lower->Upper on the RAW string)
  if (prev === 0x20 || prev === 0x2d || prev === 0x5f || prev === 0x2f || prev === 0x2e || prev === 0x3a) return true;
  const cur = value.charCodeAt(index);
  const prevLower = prev >= 0x61 && prev <= 0x7a;
  const curUpper = cur >= 0x41 && cur <= 0x5a;
  return prevLower && curUpper;
}

function scoreOne(query: string, value: string): number {
  const q = fold(query);
  const v = fold(value);
  if (q.length === 0) return 1;
  if (q.length > v.length) return 0;

  if (v === q) return 1;
  if (v.startsWith(q)) {
    return 0.9 - Math.min(0.2, (v.length - q.length) / 100);
  }

  // index-walk subsequence match; remember positions for ranking
  const pos: number[] = [];
  let qi = 0;
  for (let vi = 0; vi < v.length && qi < q.length; vi++) {
    if (v[vi] === q[qi]) {
      pos.push(vi);
      qi++;
    }
  }
  if (qi < q.length) return 0; // not a subsequence

  const first = pos[0] ?? 0;
  const last = pos[pos.length - 1] ?? 0;
  const allWordStart = pos.every((p) => isWordBoundary(v, p));
  const contiguous = pos.every((p, i) => i === 0 || p === (pos[i - 1] ?? 0) + 1);
  const span = last - first + 1;

  if (allWordStart) {
    // word-start hit: every query char lands on a word boundary (contiguous
    // or scattered across words — both beat a mid-word subsequence)
    return 0.65 - Math.min(0.15, first / 200);
  }
  if (contiguous) {
    // contiguous but mid-word
    return 0.5 - Math.min(0.1, first / 200);
  }
  // scattered subsequence: reward density, penalize late starts
  const density = q.length / span;
  return 0.3 * density + 0.05 - Math.min(0.05, first / 400);
}

/** Max over the value and its keyword list; 0 when nothing matches. */
export function commandScore(query: string, value: string, keywords?: readonly string[]): number {
  const q = query.trim();
  if (q.length === 0) return 0;
  let best = scoreOne(q, value);
  if (keywords) {
    for (const kw of keywords) {
      best = Math.max(best, scoreOne(q, kw) * 0.95);
    }
  }
  return Math.max(0, Math.min(1, best));
}
