// REQ-SURF-08 hydrate leg — runs under TZ=Pacific/Pago_Pago (UTC−11).
// Usage: hydrate.cjs <dir> <fixtures|control>. Hydrates each server-rendered
// fixture inside jsdom and reports, per fixture, every recoverable hydration
// error and every console.error React logs during hydration (attribute
// mismatches surface there), plus the post-hydration AppShell state.
import { hydrateRoot } from 'react-dom/client';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { CONTROL_FIXTURES, FIXTURES, SHELL_SET_COOKIE } from './fixtures';

interface FixtureResult { recoverable: string[]; consoleErrors: string[] }

// jsdom has no `CSS` namespace; browsers do, and React Aria calls CSS.escape
// while hydrating. CSSOM `CSS.escape` per https://drafts.csswg.org/cssom/#serialize-an-identifier.
function cssEscape(value: string): string {
  const s = String(value);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c === 0) { out += '�'; continue; }
    if ((c >= 0x1 && c <= 0x1f) || c === 0x7f ||
      (i === 0 && c >= 0x30 && c <= 0x39) ||
      (i === 1 && c >= 0x30 && c <= 0x39 && s.charCodeAt(0) === 0x2d)) {
      out += `\\${c.toString(16)} `; continue;
    }
    if (i === 0 && s.length === 1 && c === 0x2d) { out += `\\${s.charAt(i)}`; continue; }
    if (c >= 0x80 || c === 0x2d || c === 0x5f || (c >= 0x30 && c <= 0x39) || (c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a)) {
      out += s.charAt(i); continue;
    }
    out += `\\${s.charAt(i)}`;
  }
  return out;
}

async function main() {
  const dir = process.argv[2]!;
  const set = process.argv[3] === 'control' ? CONTROL_FIXTURES : FIXTURES;
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
  const g = globalThis as Record<string, unknown>;
  g.window = dom.window; g.document = dom.window.document;
  Object.defineProperty(g, 'navigator', { value: dom.window.navigator, configurable: true });
  // Browser globals the components touch while hydrating come from the same
  // jsdom window (a Node AbortSignal is rejected by jsdom's addEventListener).
  for (const k of ['HTMLElement', 'Element', 'Node', 'SVGElement', 'DocumentFragment', 'Event', 'KeyboardEvent', 'MouseEvent', 'FocusEvent', 'PointerEvent', 'MutationObserver', 'AbortController', 'AbortSignal', 'HTMLMediaElement', 'HTMLVideoElement']) {
    if ((dom.window as unknown as Record<string, unknown>)[k]) g[k] = (dom.window as unknown as Record<string, unknown>)[k];
  }
  g.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
  g.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0);
  g.cancelAnimationFrame = (id: number) => clearTimeout(id);
  g.IS_REACT_ACT_ENVIRONMENT = false;
  if (!g.CSS) g.CSS = { escape: cssEscape, supports: () => false };
  // Persisted shell cookie, exactly as AppShellSidebarToggle writes it.
  dom.window.document.cookie = SHELL_SET_COOKIE;

  let sink: string[] = [];
  const origErr = console.error;
  console.error = (...a: unknown[]) => { sink.push(a.map(String).join(' ')); };
  const results: Record<string, FixtureResult> = {};
  for (const [name, el] of set) {
    sink = [];
    const recoverable: string[] = [];
    const html = readFileSync(join(dir, `${name}.html`), 'utf8');
    const host = dom.window.document.createElement('div');
    host.setAttribute('data-fixture', name);
    host.innerHTML = html;
    dom.window.document.body.appendChild(host);
    hydrateRoot(host, el, {
      onRecoverableError: (e) => recoverable.push(String((e as Error)?.message ?? e)),
    });
    await new Promise((r) => setTimeout(r, 60));
    results[name] = { recoverable, consoleErrors: sink };
  }
  console.error = origErr;

  const shell = dom.window.document.querySelector<HTMLElement>('[data-fixture="appshell-rail"] .ag-app-shell');
  const toggle = dom.window.document.querySelector<HTMLElement>('[data-fixture="appshell-rail"] [data-testid="rail-toggle"]');
  console.log(JSON.stringify({
    timeZone: Intl.DateTimeFormat('en-US').resolvedOptions().timeZone,
    cookie: dom.window.document.cookie,
    results,
    appShell: shell ? { sidebar: shell.dataset['agSidebar'] ?? null, toggleLabel: toggle?.getAttribute('aria-label') ?? null } : null,
  }));
}
main().catch((e) => { console.log(JSON.stringify({ fatal: String((e as Error)?.stack ?? e) })); });
