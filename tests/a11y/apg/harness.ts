/* tests/a11y/apg/harness.ts — S-40 ApgHarness (QUAL, REQ-QUAL-20 · FIN-439).

   keyboard(page, steps): each step presses/types, then waits for its expectations. A failing step throws
   `step <n>: expected <x>, actual <y>` (n is 1-based) with the actual value read from the page at the deadline:
   the focused element's data-ag-part / role / accessible name, the attribute value on it, or the announcer text.
     - expectFocus '<part>'   — the focused element's own data-ag-part; when the focused element carries none (a native
                                 input inside a part, e.g. a slider thumb's <input type=range>), its nearest
                                 [data-ag-part] ancestor.
     - expectFocus 'role=<role>[name=<name>]' — explicit or implicit ARIA role, accessible name contains <name>.
     - expectState {attr: v}  — attribute values on the focused element.
     - expectAnnounced 'msg'  — substring of the S-26 announcer regions ([data-ag-announcer] [aria-live]).

   axe(page, opts): @axe-core/playwright (pinned 4.13.0) over the FULL ruleset. `colorContrast: true` keeps every rule
   on; otherwise only `color-contrast` is disabled. Throws on serious/critical violations (S-40: return/throw by
   impact); `axeScan` returns every violation with the blocking subset for callers that also fail on moderate
   (REQ-QUAL-19 flagships) or scope the scan to the story root. Browser runs: GitLab CI / gated remote runner only. */
import type { Page } from '@playwright/test';
import type { ApgHarness, ApgStep } from '../../../src/contracts/testing';

export type AxeImpact = 'minor' | 'moderate' | 'serious' | 'critical';
/** S-40 default: serious and critical violations fail; moderate is opt-in (`failOn`). */
export const BLOCKING_IMPACTS: readonly AxeImpact[] = ['serious', 'critical'];
export const FLAGSHIP_BLOCKING_IMPACTS: readonly AxeImpact[] = ['moderate', 'serious', 'critical'];

export interface AxeScanOptions {
  colorContrast?: boolean;
  /** Impacts that make a violation blocking (default BLOCKING_IMPACTS). */
  failOn?: readonly AxeImpact[];
  /** CSS selectors to scope the scan to (selectors matching nothing are dropped; none left → whole page). */
  include?: readonly string[];
}
export interface AxeViolationSummary { id: string; impact: AxeImpact | null; help: string; targets: string[] }
export interface AxeScanResult {
  violations: AxeViolationSummary[];
  blocking: AxeViolationSummary[];
  /** Number of rules axe evaluated (passes + violations + incomplete + inapplicable): proves the full ruleset ran. */
  rulesRun: number;
}

export function blockingViolations(violations: readonly AxeViolationSummary[], failOn: readonly AxeImpact[] = BLOCKING_IMPACTS): AxeViolationSummary[] {
  return violations.filter((v) => v.impact !== null && failOn.includes(v.impact));
}

export function formatViolations(violations: readonly AxeViolationSummary[]): string {
  return violations.map((v) => `${v.id} [${v.impact ?? 'n/a'}] ${v.targets.join(', ')}`).join(' | ');
}

export async function axeScan(page: Page, opts: AxeScanOptions = {}): Promise<AxeScanResult> {
  const { AxeBuilder } = await import('@axe-core/playwright');
  let builder = new AxeBuilder({ page });
  if (opts.colorContrast !== true) builder = builder.disableRules(['color-contrast']);
  if (opts.include?.length) {
    const present: string[] = [];
    for (const sel of opts.include) if ((await page.locator(sel).count()) > 0) present.push(sel);
    for (const sel of present) builder = builder.include(sel);
  }
  const r = await builder.analyze();
  const violations: AxeViolationSummary[] = r.violations.map((v) => ({
    id: v.id, impact: (v.impact ?? null) as AxeImpact | null, help: v.help,
    targets: v.nodes.map((n) => n.target.map(String).join(' ')),
  }));
  return {
    violations,
    blocking: blockingViolations(violations, opts.failOn ?? BLOCKING_IMPACTS),
    rulesRun: r.passes.length + r.violations.length + r.incomplete.length + r.inapplicable.length,
  };
}

// ---- keyboard ------------------------------------------------------------------------------------------------------

/** What the page reports about focus/attributes/announcer at one instant. */
export interface ActiveSnapshot {
  tag: string | null;          // null: nothing focused but <body>
  ownPart: string | null;
  part: string | null;         // ownPart, else nearest [data-ag-part] ancestor
  role: string | null;
  name: string;
  attrs: Record<string, string | null>;
  announcements: string[];
  announcer: boolean;
}

/** Page-side reader (serialised into the page; must stay self-contained). */
export function readActive(attrNames: string[]): ActiveSnapshot {
  const el = document.activeElement;
  const regions = Array.from(document.querySelectorAll('[data-ag-announcer] [aria-live]'));
  const base = { announcements: regions.map((r) => (r.textContent ?? '').trim()), announcer: regions.length > 0 };
  if (!el || el === document.body || el === document.documentElement) {
    return { tag: null, ownPart: null, part: null, role: null, name: '', attrs: {}, ...base };
  }
  const tag = el.tagName.toLowerCase();
  const ownPart = el.getAttribute('data-ag-part');
  const part = ownPart ?? el.parentElement?.closest('[data-ag-part]')?.getAttribute('data-ag-part') ?? null;
  let role = el.getAttribute('role');
  if (!role) {
    const type = (el.getAttribute('type') ?? 'text').toLowerCase();
    if (tag === 'button' || tag === 'summary') role = 'button';
    else if (tag === 'a' && el.hasAttribute('href')) role = 'link';
    else if (tag === 'select') role = 'combobox';
    else if (tag === 'textarea') role = 'textbox';
    else if (tag === 'input') {
      role = ({ checkbox: 'checkbox', radio: 'radio', range: 'slider', search: 'searchbox', button: 'button', submit: 'button',
        reset: 'button', number: 'spinbutton' } as Record<string, string>)[type] ?? 'textbox';
    } else role = tag;
  }
  let name = el.getAttribute('aria-label') ?? '';
  if (!name) {
    const ids = (el.getAttribute('aria-labelledby') ?? '').split(/\s+/).filter(Boolean);
    name = ids.map((id) => document.getElementById(id)?.textContent ?? '').join(' ');
  }
  if (!name && el.id) name = document.querySelector(`label[for="${CSS.escape(el.id)}"]`)?.textContent ?? '';
  if (!name) name = el.textContent ?? '';
  if (!name) name = el.getAttribute('title') ?? '';
  const attrs: Record<string, string | null> = {};
  for (const a of attrNames) attrs[a] = el.getAttribute(a);
  return { tag, ownPart, part, role, name: name.trim().replace(/\s+/g, ' '), attrs, ...base };
}

const ROLE_SEL = /^role=([\w-]+)(?:\[name=(.+)\])?$/;

export function describeFocus(s: ActiveSnapshot): string {
  if (s.tag === null) return 'nothing focused (document.body)';
  return `<${s.tag}> part=${s.part ?? '(none)'} role=${s.role ?? '(none)'} name=${JSON.stringify(s.name)}`;
}

/** null when the expectation holds, else `expected …, actual …` (without the step prefix). */
export function focusMismatch(sel: string, s: ActiveSnapshot): string | null {
  const m = ROLE_SEL.exec(sel);
  if (sel.startsWith('role=') && !m) return `expected a valid expectFocus selector, actual ${JSON.stringify(sel)}`;
  const ok = m
    ? s.tag !== null && s.role === m[1] && (m[2] === undefined || s.name.includes(m[2]))
    : s.tag !== null && s.part === sel;
  if (ok) return null;
  const expected = m ? `focus on role=${m[1]}${m[2] !== undefined ? ` name~${JSON.stringify(m[2])}` : ''}` : `focus on part ${JSON.stringify(sel)}`;
  return `expected ${expected}, actual ${describeFocus(s)}`;
}

export function stateMismatch(state: Record<string, string>, s: ActiveSnapshot): string | null {
  const wrong = Object.entries(state).filter(([a, v]) => s.tag === null || s.attrs[a] !== v);
  if (!wrong.length) return null;
  const expected = wrong.map(([a, v]) => `${a}=${JSON.stringify(v)}`).join(' ');
  const actual = s.tag === null ? describeFocus(s) : `${wrong.map(([a]) => `${a}=${s.attrs[a] === null || s.attrs[a] === undefined ? '(absent)' : JSON.stringify(s.attrs[a])}`).join(' ')} on ${describeFocus(s)}`;
  return `expected ${expected} on the focused element, actual ${actual}`;
}

export function announcedMismatch(msg: string, s: ActiveSnapshot): string | null {
  if (s.announcements.some((t) => t.includes(msg))) return null;
  const actual = s.announcer ? `announcer text ${JSON.stringify(s.announcements)}` : 'no [data-ag-announcer] [aria-live] region in the page';
  return `expected announcement containing ${JSON.stringify(msg)}, actual ${actual}`;
}

export class ApgStepError extends Error {
  constructor(readonly index: number, readonly detail: string) {
    super(`step ${index}: ${detail}`);
    this.name = 'ApgStepError';
  }
}

const POLL_MS = 50;

async function waitFor(page: Page, attrs: string[], check: (s: ActiveSnapshot) => string | null, timeoutMs: number): Promise<string | null> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const snap = await page.evaluate(readActive, attrs);
    const mismatch = check(snap);
    if (mismatch === null || Date.now() >= deadline) return mismatch;
    await page.waitForTimeout(POLL_MS);
  }
}

async function runStep(page: Page, s: ApgStep, index: number, timeoutMs: number): Promise<void> {
  const fail = (detail: string): never => { throw new ApgStepError(index, detail); };
  if (s.press !== undefined) {
    try { await page.keyboard.press(s.press); } catch (e) { fail(`expected press ${JSON.stringify(s.press)} to dispatch, actual ${(e as Error).message.split('\n')[0]}`); }
  }
  if (s.type !== undefined) {
    try { await page.keyboard.type(s.type); } catch (e) { fail(`expected type ${JSON.stringify(s.type)} to dispatch, actual ${(e as Error).message.split('\n')[0]}`); }
  }
  const attrs = Object.keys(s.expectState ?? {});
  if (s.expectFocus !== undefined) {
    const sel = s.expectFocus;
    const m = await waitFor(page, attrs, (snap) => focusMismatch(sel, snap), timeoutMs);
    if (m) fail(m);
  }
  if (s.expectState !== undefined) {
    const state = s.expectState;
    const m = await waitFor(page, attrs, (snap) => stateMismatch(state, snap), timeoutMs);
    if (m) fail(m);
  }
  if (s.expectAnnounced !== undefined) {
    const msg = s.expectAnnounced;
    const m = await waitFor(page, attrs, (snap) => announcedMismatch(msg, snap), timeoutMs);
    if (m) fail(m);
  }
}

export interface ApgHarnessOptions { /** Per-expectation wait (default 5 000 ms). */ timeoutMs?: number }

export function createApgHarness(options: ApgHarnessOptions = {}): ApgHarness {
  const timeoutMs = options.timeoutMs ?? 5_000;
  return {
    async keyboard(page, script) {
      for (const [i, s] of script.entries()) await runStep(page, s, i + 1, timeoutMs);
    },
    async axe(page, opts = {}) {
      const r = await axeScan(page, { colorContrast: opts.colorContrast === true });
      if (r.blocking.length) {
        throw new Error(`axe: ${r.blocking.length} serious/critical violation(s): ${formatViolations(r.blocking)}`);
      }
    },
  };
}

export const apg: ApgHarness = createApgHarness();
