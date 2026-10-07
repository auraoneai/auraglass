/* @jest-environment node */
/* MAT-236 REQ-MOT-82: zero overshoot artefacts outside designConstants.ts —
   no bounceIn/bounceOut/elasticIn/elasticOut names, no animate-bounce utility,
   no underdamped spring configs, no cubic-bezier y outside [0,1] in CSS/TS
   across src + dist. */
import { describe, expect, it } from '@jest/globals';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';

const ROOT = process.cwd();
const EXEMPT = /designConstants\.ts$|node_modules|__tests__|fixtures|\.test\.|\.d\.ts$/;

const walk = (dir: string, out: string[] = []): string[] => {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { if (!['node_modules', '.git', 'dist'].includes(e)) walk(p, out); }
    else if (/\.(css|ts|tsx|js|jsx|mjs|cjs)$/.test(e) && !EXEMPT.test(p)) out.push(p);
  }
  return out;
};

const files = [
  ...walk(join(ROOT, 'src')),
  ...walk(join(ROOT, 'fragments')),
  ...walk(join(ROOT, 'tests')),
  ...(existsSync(join(ROOT, 'dist')) ? [join(ROOT, 'dist', 'styles.css')].filter(existsSync) : []),
];

describe('no overshoot artefacts (REQ-MOT-82)', () => {
  it('no bounce/elastic keyframes or utility names', () => {
    const hits: string[] = [];
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      if (/bounceIn|bounceOut|elasticIn|elasticOut|animate-bounce|spring-bounce|springBounce/.test(src)) {
        hits.push(f);
      }
    }
    expect(hits).toEqual([]);
  });
  it('no cubic-bezier with y outside [0,1] in CSS', () => {
    const hits: string[] = [];
    for (const f of files.filter((p) => p.endsWith('.css'))) {
      const root = postcss.parse(readFileSync(f, 'utf8'), { from: f });
      root.walkDecls((d) => {
        for (const m of String(d.value).matchAll(/cubic-bezier\(([^)]+)\)/g)) {
          const p = m[1].split(',').map((x) => parseFloat(x));
          if (p.length === 4 && (p[1]! < 0 || p[1]! > 1 || p[3]! < 0 || p[3]! > 1)) {
            hits.push(`${f}: ${m[0]}`);
          }
        }
      });
    }
    expect(hits).toEqual([]);
  });
  it('no underdamped spring literal configs (zeta < 0.8 pairs)', () => {
    const hits: string[] = [];
    for (const f of files.filter((p) => /\.tsx?$/.test(p))) {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/stiffness:\s*(\d+),\s*damping:\s*(\d+)/g)) {
        const k = Number(m[1]); const c = Number(m[2]);
        if (k > 0 && c / (2 * Math.sqrt(k)) < 0.8) hits.push(`${f}: ${m[0]}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
