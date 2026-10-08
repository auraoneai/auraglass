/* MAT-293: S-26 useAnnouncer. Writes into the provider's [data-ag-announcer]
   regions (polite default / assertive). Identical messages inside 500 ms are
   coalesced; announcing with an id replaces that id's pending message; each
   region clears 7 000 ms after its last write. Without a portal root announce()
   is a no-op with a single development warning. */
'use client';
import * as React from 'react';
import type { AnnounceOptions } from '../../contracts/preferences';
import { PortalRootContext } from '../portal';

interface Lane {
  last: string | null;
  lastAt: number;
  byId: Map<string, string>;
  timer: ReturnType<typeof setTimeout> | null;
}

const newLane = (): Lane => ({ last: null, lastAt: 0, byId: new Map(), timer: null });

interface AnnouncerState {
  polite: Lane;
  assertive: Lane;
  politeEl: HTMLElement | null;
  assertiveEl: HTMLElement | null;
}

const states = new WeakMap<HTMLElement, AnnouncerState>();
let warnedOnce = false;

const resolveRegions = (doc: Document | null, portalRoot: HTMLElement | null):
  { polite: HTMLElement; assertive: HTMLElement; host: HTMLElement } | null => {
  const host = (portalRoot ?? doc)?.querySelector<HTMLElement>('[data-ag-announcer]') ?? null;
  if (!host) return null;
  const polite = host.querySelector<HTMLElement>('[aria-live="polite"]');
  const assertive = host.querySelector<HTMLElement>('[aria-live="assertive"]');
  if (!polite || !assertive) return null;
  return { polite, assertive, host };
};

const stateFor = (host: HTMLElement): AnnouncerState => {
  let s = states.get(host);
  if (!s) {
    s = { polite: newLane(), assertive: newLane(), politeEl: null, assertiveEl: null };
    states.set(host, s);
  }
  return s;
};

const scheduleClear = (state: AnnouncerState, lane: Lane, el: HTMLElement): void => {
  void state;
  if (lane.timer) clearTimeout(lane.timer);
  lane.timer = setTimeout(() => {
    lane.last = null;
    lane.lastAt = 0;
    lane.byId.clear();
    el.textContent = '';
  }, 7000);
};

export const announceTo = (
  host: HTMLElement, message: string, opts: AnnounceOptions = {},
): void => {
  const politeness = opts.politeness ?? 'polite';
  const el = host.querySelector<HTMLElement>(`[aria-live="${politeness}"]`);
  if (!el) return;
  const state = stateFor(host);
  const lane = politeness === 'assertive' ? state.assertive : state.polite;
  const now = Date.now();
  if (lane.last === message && now - lane.lastAt < 500) return;
  if (opts.id !== undefined) lane.byId.set(opts.id, message);
  lane.last = message;
  lane.lastAt = now;
  el.textContent = message;
  scheduleClear(state, lane, el);
};

export const clearAnnouncer = (host: HTMLElement): void => {
  const state = stateFor(host);
  for (const lane of [state.polite, state.assertive]) {
    lane.last = null;
    lane.lastAt = 0;
    lane.byId.clear();
    if (lane.timer) { clearTimeout(lane.timer); lane.timer = null; }
  }
  const polite = host.querySelector<HTMLElement>('[aria-live="polite"]');
  const assertive = host.querySelector<HTMLElement>('[aria-live="assertive"]');
  if (polite) polite.textContent = '';
  if (assertive) assertive.textContent = '';
};

export function useAnnouncer(): {
  announce(message: string, opts?: AnnounceOptions): void;
  clear(): void;
} {
  const portal = React.useContext(PortalRootContext);
  const root = portal?.root ?? null;
  return React.useMemo(() => ({
    announce(message: string, opts?: AnnounceOptions) {
      const doc = typeof document === 'undefined' ? null : document;
      const regions = resolveRegions(doc, root);
      if (!regions) {
        if (!warnedOnce && process.env.NODE_ENV !== 'production') {
          warnedOnce = true;
          // eslint-disable-next-line no-console
          console.warn('aura-glass: useAnnouncer without AuraGlassProvider — announce() is a no-op');
        }
        return;
      }
      announceTo(regions.host, message, opts);
    },
    clear() {
      const doc = typeof document === 'undefined' ? null : document;
      const regions = resolveRegions(doc, root);
      if (regions) clearAnnouncer(regions.host);
    },
  }), [root]);
}

/** REQ-MAT-64: streaming announcer — buffers chunks and flushes the latest
   buffered text at most once per intervalMs (default 1000). */
export const createStreamingAnnouncer = (
  announce: (message: string) => void,
  opts: { intervalMs?: number } = {},
): { push(chunk: string): void; stop(): void } => {
  const intervalMs = opts.intervalMs ?? 1000;
  let buffer = '';
  let timer: ReturnType<typeof setInterval> | null = null;
  const flush = (): void => {
    if (buffer === '') return;
    const out = buffer;
    buffer = '';
    announce(out);
  };
  return {
    push(chunk: string) {
      buffer += chunk;
      if (timer === null) {
        flush();
        timer = setInterval(flush, intervalMs);
      }
    },
    stop() {
      if (timer !== null) { clearInterval(timer); timer = null; }
      buffer = '';
    },
  };
};
