/* MAT-237 (REQ-MOT-72/-73) + REQ-MAT-44 settled-state invariant: after
 * `--ag-duration-large` + 100 ms every visible [data-ag-part] has no running
 * animation, opacity >= 0.99, `scale` in {none, 1}, `translate` in {none, 0px},
 * an identity `transform`, `visibility` != hidden, a non-zero box and no
 * will-change hint. "Visible" = rendered (Element.checkVisibility(): not in a
 * display:none / content-visibility:hidden subtree); a rendered part with
 * visibility:hidden is a failure, not an exclusion. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Locator } from '@playwright/test';

export interface SettleResult {
  runningAnimations: number;
  /** CSS-animation names still running (for diagnostics). */
  runningNames: string[];
  /** elements of [data-ag-part] whose computed opacity < 0.99 */
  fadedParts: string[];
  /** parts whose transform is not 'none' and not identity */
  transformedParts: string[];
  /** parts whose computed `scale` is not none/1 */
  scaledParts: string[];
  /** parts whose computed `translate` is not none/0px */
  translatedParts: string[];
  /** rendered parts with computed visibility hidden/collapse */
  hiddenParts: string[];
  /** parts with a will-change hint at steady state */
  willChangeParts: string[];
  /** parts with an empty bounding box */
  collapsedParts: string[];
  pass: boolean;
}

export interface SettleOptions {
  /** wait before reading (default 100 ms). Specs that assert REQ-MAT-44 pass
   *  settleWaitMs() (= --ag-duration-large + 100 ms). */
  waitMs?: number;
  /** exclude elements matching this selector from the part checks. */
  ignoreSelector?: string;
}

/** `--ag-duration-large` in ms, read from the token source of truth
 *  (tokens/ref/time.tokens.json). Throws if the token is missing or not in ms/s,
 *  so the settle wait can never silently fall back to a guess. */
export const durationLargeMs = (): number => {
  // Playwright runs from the repo root (playwright.config.ts); package.json is
  // "type": "module", so __dirname is not available here.
  const file = join(process.cwd(), 'tokens', 'ref', 'time.tokens.json');
  const json = JSON.parse(readFileSync(file, 'utf8')) as {
    ref?: { time?: { duration?: { large?: { $value?: { value?: unknown; unit?: unknown } } } } };
  };
  const v = json.ref?.time?.duration?.large?.$value;
  if (!v || typeof v.value !== 'number' || (v.unit !== 'ms' && v.unit !== 's')) {
    throw new Error(`ref.time.duration.large not found as {value, unit: ms|s} in ${file}`);
  }
  return v.unit === 's' ? v.value * 1000 : v.value;
};

/** REQ-MAT-44: the settled state is read at --ag-duration-large + 100 ms. */
export const settleWaitMs = (): number => durationLargeMs() + 100;

export const settle = async (root: Locator, opts: SettleOptions = {}): Promise<SettleResult> => {
  const wait = opts.waitMs ?? 100;
  if (wait > 0) await root.page().waitForTimeout(wait);

  const res = await root.evaluate((el, ignore) => {
    const parts = [...el.querySelectorAll('[data-ag-part]')]
      .filter((p) => !ignore || !(p as Element).matches(ignore))
      .filter((p) => (p as Element).checkVisibility());
    const anims = (el as Element).getAnimations({ subtree: true })
      .filter((a) => a.playState === 'running');
    const names = anims
      .map((a) => (a as { animationName?: string }).animationName ?? '')
      .filter(Boolean);
    const faded: string[] = [];
    const transformed: string[] = [];
    const scaled: string[] = [];
    const translated: string[] = [];
    const hidden: string[] = [];
    const will: string[] = [];
    const collapsed: string[] = [];
    const label = (p: Element) =>
      `${p.getAttribute('data-ag-part') ?? p.tagName.toLowerCase()}`;
    const isIdentity = (m: string) =>
      m === 'none' || m === '' ||
      /^matrix\(1,0,0,1,0,0\)$/.test(m.replace(/\s+/g, '')) ||
      /^matrix3d\(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1\)$/.test(m.replace(/\s+/g, ''));
    // computed `scale`: 'none' or 1..3 numbers; settled only when every one is 1
    const isUnitScale = (s: string) =>
      s === 'none' || s.trim().split(/\s+/).every((n) => parseFloat(n) === 1);
    // computed `translate`: 'none' or 1..3 lengths; settled only when every one is 0
    const isZeroTranslate = (t: string) =>
      t === 'none' || t.trim().split(/\s+/).every((n) => parseFloat(n) === 0);
    for (const p of parts) {
      const cs = getComputedStyle(p);
      if (parseFloat(cs.opacity) < 0.99) faded.push(`${label(p)}=${cs.opacity}`);
      if (!isIdentity(cs.transform)) transformed.push(`${label(p)}=${cs.transform}`);
      if (!isUnitScale(cs.scale)) scaled.push(`${label(p)}=${cs.scale}`);
      if (!isZeroTranslate(cs.translate)) translated.push(`${label(p)}=${cs.translate}`);
      if (cs.visibility === 'hidden' || cs.visibility === 'collapse') hidden.push(label(p));
      if (cs.willChange !== 'auto' && cs.willChange !== '') will.push(`${label(p)}=${cs.willChange}`);
      const r = p.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) collapsed.push(label(p));
    }
    return { running: anims.length, names, faded, transformed, scaled, translated, hidden, will, collapsed };
  }, opts.ignoreSelector ?? null);

  const pass =
    res.running === 0 && res.faded.length === 0 && res.transformed.length === 0 &&
    res.scaled.length === 0 && res.translated.length === 0 && res.hidden.length === 0 &&
    res.will.length === 0 && res.collapsed.length === 0;
  return {
    runningAnimations: res.running,
    runningNames: res.names,
    fadedParts: res.faded,
    transformedParts: res.transformed,
    scaledParts: res.scaled,
    translatedParts: res.translated,
    hiddenParts: res.hidden,
    willChangeParts: res.will,
    collapsedParts: res.collapsed,
    pass,
  };
};

/** will-change budget: 0 at steady state, <=3 during animation (REQ-MOT-T05). */
export const willChangeCount = async (root: Locator): Promise<number> =>
  root.evaluate((el) => {
    let n = 0;
    for (const p of [el as Element, ...el.querySelectorAll('[data-ag-part]')]) {
      if (getComputedStyle(p).willChange !== 'auto') n++;
    }
    return n;
  });

/** One CSS animation declaration on a part or its ::before/::after. */
export interface DeclaredAnimation {
  /** `<data-ag-part>` or `<data-ag-part>::before|::after` */
  target: string;
  name: string;
  /** computed animation-iteration-count for that name ('infinite' or a number) */
  iterations: string;
}

/** Computed animation declarations (animation-name × iteration-count, per
 *  comma-separated entry) on every [data-ag-part]/[data-ag-surface] under root
 *  and their ::before/::after. Reads computed style, not running Animation
 *  objects, so it is independent of timing (a finished finite animation still
 *  shows up). */
export const declaredAnimations = async (root: Locator): Promise<DeclaredAnimation[]> =>
  root.evaluate((el) => {
    const out: DeclaredAnimation[] = [];
    const nodes = [el as Element, ...el.querySelectorAll('[data-ag-part], [data-ag-surface]')]
      .filter((n) => n.hasAttribute('data-ag-part') || n.hasAttribute('data-ag-surface'));
    for (const n of nodes) {
      const base = n.getAttribute('data-ag-part') ?? n.getAttribute('data-ag-surface') ?? n.tagName.toLowerCase();
      for (const pseudo of [null, '::before', '::after'] as const) {
        const cs = getComputedStyle(n, pseudo);
        if (pseudo && (cs.content === 'none' || cs.content === 'normal')) continue;
        const names = cs.animationName.split(',').map((s) => s.trim());
        const counts = cs.animationIterationCount.split(',').map((s) => s.trim());
        names.forEach((name, i) => {
          if (name === 'none') return;
          out.push({ target: pseudo ? `${base}${pseudo}` : base, name, iterations: counts[i % counts.length] ?? '1' });
        });
      }
    }
    return out;
  });
