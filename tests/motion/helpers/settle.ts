/* MAT-237 (REQ-MOT-72/-73): settle invariant — after the motion duration the
 * subject must have no running animations, full opacity, identity transform,
 * positive bounds and no will-change hints on [data-ag-part] elements. */
import type { Locator } from '@playwright/test';

export interface SettleResult {
  runningAnimations: number;
  /** CSS-animation names still running (for diagnostics). */
  runningNames: string[];
  /** elements of [data-ag-part] whose computed opacity < 0.99 */
  fadedParts: string[];
  /** parts whose transform is not 'none' and not identity */
  transformedParts: string[];
  /** parts with a will-change hint at steady state */
  willChangeParts: string[];
  /** parts with an empty bounding box */
  collapsedParts: string[];
  pass: boolean;
}

export interface SettleOptions {
  /** slack after the spec's own wait; the helper also waits this long before
   *  reading (default 100 ms — "large + 100ms" per REQ-MOT-72). */
  waitMs?: number;
  /** exclude elements matching this selector from the part checks. */
  ignoreSelector?: string;
}

const identityTransform = (m: string): boolean =>
  m === 'none' || /^matrix\(\s*1,\s*0,\s*0,\s*1,\s*0,\s*0\s*\)$/.test(m) ||
  /^matrix3d\(1,0,0,0,\s*0,1,0,0,\s*0,0,1,0,\s*0,0,0,1\)$/.test(m.replace(/\s+/g, ''));

export const settle = async (root: Locator, opts: SettleOptions = {}): Promise<SettleResult> => {
  const wait = opts.waitMs ?? 100;
  if (wait > 0) await root.page().waitForTimeout(wait);

  const res = await root.evaluate((el, ignore) => {
    const parts = [...el.querySelectorAll('[data-ag-part]')]
      .filter((p) => !ignore || !(p as Element).matches(ignore));
    const anims = (el as Element).getAnimations({ subtree: true })
      .filter((a) => a.playState === 'running');
    const names = anims
      .map((a) => (a as { animationName?: string }).animationName ?? '')
      .filter(Boolean);
    const faded: string[] = [];
    const transformed: string[] = [];
    const will: string[] = [];
    const collapsed: string[] = [];
    const label = (p: Element) =>
      `${p.getAttribute('data-ag-part') ?? p.tagName.toLowerCase()}`;
    for (const p of parts) {
      const cs = getComputedStyle(p);
      if (parseFloat(cs.opacity) < 0.99) faded.push(`${label(p)}=${cs.opacity}`);
      if (cs.transform !== 'none' && cs.transform !== '' &&
          !/^matrix\(1,\s*0,\s*0,\s*1,\s*0,\s*0\)$/.test(cs.transform) &&
          !/^matrix3d\(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1\)$/.test(cs.transform.replace(/\s+/g, ''))) {
        transformed.push(`${label(p)}=${cs.transform}`);
      }
      if (cs.willChange !== 'auto' && cs.willChange !== '') will.push(`${label(p)}=${cs.willChange}`);
      const r = p.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) collapsed.push(label(p));
    }
    return { running: anims.length, names, faded, transformed, will, collapsed };
  }, opts.ignoreSelector ?? null);

  const pass =
    res.running === 0 && res.faded.length === 0 && res.transformed.length === 0 &&
    res.will.length === 0 && res.collapsed.length === 0;
  return {
    runningAnimations: res.running,
    runningNames: res.names,
    fadedParts: res.faded,
    transformedParts: res.transformed,
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
