/* REQ-MAT-62 / REQ-SURF-192: rendered target probes shared by the MAT and SURF
   target-size specs. Everything runs inside the page (one evaluate per story).

   probeTargets(page, half) — for every visible interactive element (native
   controls, links, ARIA widget roles, tabindex >= 0) under `scope`:
     owned — elementFromPoint at the centre and at centre ± `half` px on both
             axes resolves to the element (or a descendant, e.g. its hit area),
             so the element owns a (2·half)×(2·half) box centred on itself;
     spaced — the WCAG 2.5.8 spacing exception: a circle of diameter 24 px
             centred on the element's box does not reach any other target's
             box (only meaningful at the fine-pointer minimum). */
import type { Page } from '@playwright/test';

export interface TargetProbe {
  part: string;
  tag: string;
  w: number;
  h: number;
  owned: boolean;
  /** which probe points missed (e.g. "x-11", "y+11") */
  missed: string[];
  spaced: boolean;
}

export const INTERACTIVE_SELECTOR = [
  'a[href]', 'button', 'input:not([type="hidden"])', 'select', 'textarea', 'summary',
  '[role="button"]', '[role="link"]', '[role="tab"]', '[role="menuitem"]', '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]', '[role="option"]', '[role="checkbox"]', '[role="radio"]', '[role="switch"]',
  '[role="slider"]', '[role="spinbutton"]', '[role="treeitem"]', '[role="gridcell"][tabindex]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export async function probeTargets(page: Page, half: number, scope = 'body'): Promise<TargetProbe[]> {
  return page.evaluate(({ half, scope, selector }) => {
    const root = document.querySelector(scope) ?? document.body;
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      const cs = getComputedStyle(el);
      return cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('[inert], [aria-hidden="true"]');
    };
    const els = [...root.querySelectorAll<HTMLElement>(selector)].filter(visible);
    const owns = (el: Element, x: number, y: number) => {
      const top = document.elementFromPoint(x, y);
      return !!top && (top === el || el.contains(top));
    };
    const box = (el: Element) => {
      // probe in view: elementFromPoint only sees the viewport
      el.scrollIntoView({ block: 'center', inline: 'center' });
      return el.getBoundingClientRect();
    };
    return els.map((el, i) => {
      const r = box(el);
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const pts: Array<[string, number, number]> = [
        ['c', cx, cy], [`x-${half}`, cx - half, cy], [`x+${half}`, cx + half, cy],
        [`y-${half}`, cx, cy - half], [`y+${half}`, cx, cy + half],
      ];
      const missed = pts.filter(([, x, y]) => !owns(el, x, y)).map(([n]) => n);
      // spacing exception, in the same scroll position: the 24px circle on
      // this target's centre reaches no other target box, and no other
      // undersized target's circle (centres >= 24px apart)
      const spaced = els.every((other, j) => {
        if (j === i || el.contains(other) || other.contains(el)) return true;
        const o = other.getBoundingClientRect();
        const dx = Math.max(o.left - cx, 0, cx - o.right);
        const dy = Math.max(o.top - cy, 0, cy - o.bottom);
        if (Math.hypot(dx, dy) < 12) return false;
        const undersized = o.width < 24 || o.height < 24;
        return !undersized || Math.hypot(o.left + o.width / 2 - cx, o.top + o.height / 2 - cy) >= 24;
      });
      return {
        part: el.getAttribute('data-ag-part') ?? '', tag: el.tagName.toLowerCase(),
        w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10,
        owned: missed.length === 0, missed, spaced,
      };
    });
  }, { half, scope, selector: INTERACTIVE_SELECTOR });
}
