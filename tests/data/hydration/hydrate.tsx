// REQ-SURF-08 hydrate leg — runs under TZ=Pacific/Pago_Pago (-11). Hydrates
// each rendered fixture inside jsdom and reports every hydration warning.
import { hydrateRoot } from 'react-dom/client';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { FIXTURES } from './fixtures';

async function main() {
  const dir = process.argv[2]!;
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
  const g = globalThis as Record<string, unknown>;
  g.window = dom.window; g.document = dom.window.document;
  Object.defineProperty(g, 'navigator', { value: dom.window.navigator, configurable: true });
  g.HTMLElement = dom.window.HTMLElement; g.Element = dom.window.Element; g.Node = dom.window.Node;
  g.SVGElement = dom.window.SVGElement; g.DocumentFragment = dom.window.DocumentFragment;
  g.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
  g.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0);
  g.cancelAnimationFrame = (id: number) => clearTimeout(id);
  // the persisted app-shell cookie fixture — 'sidebar:rail'
  dom.window.document.cookie = 'ag-app-shell=sidebar:rail';
  const consoleErrors: string[] = [];
  const origErr = console.error;
  console.error = (...a: unknown[]) => { consoleErrors.push(a.map(String).join(' ')); };
  const results: Record<string, string[]> = {};
  for (const [name, el] of FIXTURES) {
    const html = readFileSync(join(dir, `${name}.html`), 'utf8');
    const errors: string[] = [];
    const host = dom.window.document.createElement('div');
    host.innerHTML = html;
    dom.window.document.body.appendChild(host);
    hydrateRoot(host, el, { onRecoverableError: (e) => errors.push(String(e)) });
    await new Promise((r) => setTimeout(r, 60));
    results[name] = errors;
  }
  console.error = origErr;
  console.log(JSON.stringify({ results, consoleErrors }));
}
main().catch((e) => { console.log(JSON.stringify({ fatal: String(e) })); });
