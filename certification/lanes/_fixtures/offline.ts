/* REQ-QUAL-67 offline worker (QUAL, FIN-425). On the gated AWS runner the bundle has no egress
   (scripts/qual/remote/worker-entry.sh sets AG_OFFLINE_BUNDLE=1): every browser context routes `**` and aborts any
   request whose host is not 127.0.0.1, so a lane can never reach the network (and never silently depends on it).
   Wired through the shared lane fixture (determinism.ts) for the default `context` and for every `browser.newContext`. */
import type { Browser, BrowserContext, Route } from '@playwright/test';

/** Non-network schemes a page may load without leaving the worker. */
const LOCAL_SCHEMES = new Set(['data:', 'blob:', 'about:']);

export function offlineMode(env: Record<string, string | undefined> = process.env): boolean {
  return env.AG_OFFLINE_BUNDLE === '1';
}

/** true when `url` stays on the worker: http(s)/ws(s) to 127.0.0.1 or a local scheme. */
export function isLoopbackUrl(url: string): boolean {
  let u: URL;
  try { u = new URL(url); } catch { return false; }
  if (LOCAL_SCHEMES.has(u.protocol)) return true;
  return ['http:', 'https:', 'ws:', 'wss:'].includes(u.protocol) && u.hostname === '127.0.0.1';
}

/** context.route('**') — non-127.0.0.1 requests are aborted; loopback requests fall through to other handlers. */
export async function blockNonLoopback(context: BrowserContext): Promise<void> {
  await context.route('**', (route: Route) => (isLoopbackUrl(route.request().url()) ? route.fallback() : route.abort('blockedbyclient')));
}

/** Patches `browser.newContext` (and so `browser.newPage`) to apply blockNonLoopback to every new context. */
export function offlineBrowser(browser: Browser): Browser {
  const newContext = browser.newContext.bind(browser);
  browser.newContext = async (...args: Parameters<Browser['newContext']>) => {
    const ctx = await newContext(...args);
    await blockNonLoopback(ctx);
    return ctx;
  };
  return browser;
}
