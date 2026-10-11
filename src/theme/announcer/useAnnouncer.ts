/* MAT-293 / REQ-MAT-58: S-26 useAnnouncer. Writes into the provider's
   [data-ag-announcer] regions (polite default / assertive).

   Each region (lane) owns a FIFO queue:
   - Writes are spaced by WRITE_GAP_MS (500 ms). A message that arrives while the
     lane is idle and carries no id is written immediately; anything that lands
     inside the gap is queued and written when the gap expires.
   - Identical messages inside 500 ms are coalesced (dropped) — both against the
     last write and against an identical queued entry.
   - A message with an id is queued for ID_SETTLE_MS before it can be written.
     Announcing again with the same id while the entry is still queued replaces
     the queued text in place, so a superseded status ("Step 1 of 3") is never
     written when its replacement ("Step 2 of 3") follows within the settle
     window.
   - Each region clears CLEAR_MS (7 000 ms) after its last write; clear()
     empties both regions and drops every queued entry.
   Without a portal root announce() is a no-op with a single development
   warning. */
'use client';
import * as React from 'react';
import type { AnnounceOptions } from '../../contracts/preferences';
import { PortalRootContext } from '../portal';

/** Minimum spacing between two writes into the same region; also the identical-message coalescing window. */
export const WRITE_GAP_MS = 500;
/** How long an id'd message waits for a same-id replacement before it is written. */
export const ID_SETTLE_MS = 150;
/** A region is emptied this long after its last write. */
export const CLEAR_MS = 7000;

interface QueuedEntry {
  message: string;
  id: string | undefined;
  /** Earliest time (ms since epoch) this entry may be written. */
  notBefore: number;
}

interface Lane {
  /** Last text written into the region (null after a clear). */
  last: string | null;
  /** Time of the last write; 0 when the lane is idle. */
  lastAt: number;
  queue: QueuedEntry[];
  pumpTimer: ReturnType<typeof setTimeout> | null;
  clearTimer: ReturnType<typeof setTimeout> | null;
}

/** Event-time clock (announce() runs in handlers/effects, never during render). */
const clock = (): number => Date.now();

const newLane = (): Lane => ({ last: null, lastAt: 0, queue: [], pumpTimer: null, clearTimer: null });

interface AnnouncerState {
  polite: Lane;
  assertive: Lane;
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
    s = { polite: newLane(), assertive: newLane() };
    states.set(host, s);
  }
  return s;
};

const resetLane = (lane: Lane): void => {
  lane.last = null;
  lane.lastAt = 0;
  lane.queue = [];
  if (lane.pumpTimer) { clearTimeout(lane.pumpTimer); lane.pumpTimer = null; }
  if (lane.clearTimer) { clearTimeout(lane.clearTimer); lane.clearTimer = null; }
};

const write = (lane: Lane, el: HTMLElement, message: string, now: number): void => {
  lane.last = message;
  lane.lastAt = now;
  el.textContent = message;
  if (lane.clearTimer) clearTimeout(lane.clearTimer);
  lane.clearTimer = setTimeout(() => {
    lane.clearTimer = null;
    lane.last = null;
    lane.lastAt = 0;
    el.textContent = '';
  }, CLEAR_MS);
};

/** Earliest time the next write may land in this lane. */
const nextSlot = (lane: Lane): number => (lane.lastAt === 0 ? 0 : lane.lastAt + WRITE_GAP_MS);

/** Writes every due queue head (one per WRITE_GAP_MS) and re-arms itself for the rest. */
const pump = (lane: Lane, el: HTMLElement): void => {
  if (lane.pumpTimer) { clearTimeout(lane.pumpTimer); lane.pumpTimer = null; }
  const head = lane.queue[0];
  if (!head) return;
  const now = clock();
  const due = Math.max(head.notBefore, nextSlot(lane));
  if (due <= now) {
    lane.queue.shift();
    write(lane, el, head.message, now);
  }
  const nextHead = lane.queue[0];
  if (!nextHead) return;
  const wait = Math.max(nextHead.notBefore, nextSlot(lane)) - now;
  lane.pumpTimer = setTimeout(() => {
    lane.pumpTimer = null;
    pump(lane, el);
  }, Math.max(0, wait));
};

export const announceTo = (
  host: HTMLElement, message: string, opts: AnnounceOptions = {},
): void => {
  const politeness = opts.politeness ?? 'polite';
  const el = host.querySelector<HTMLElement>(`[aria-live="${politeness}"]`);
  if (!el) return;
  const state = stateFor(host);
  const lane = politeness === 'assertive' ? state.assertive : state.polite;
  const now = clock();
  const { id } = opts;

  if (id !== undefined) {
    // Same id still queued: replace its text in place (it keeps its slot).
    const queued = lane.queue.find((e) => e.id === id);
    if (queued) {
      queued.message = message;
      queued.notBefore = now + ID_SETTLE_MS;
      pump(lane, el);
      return;
    }
  }

  // Identical-message coalescing inside the 500 ms window.
  if (lane.queue.length === 0 && lane.last === message && now - lane.lastAt < WRITE_GAP_MS) return;
  const tail = lane.queue[lane.queue.length - 1];
  if (tail && tail.message === message && tail.id === id) return;

  if (id === undefined && lane.queue.length === 0 && now >= nextSlot(lane)) {
    write(lane, el, message, now);
    return;
  }
  lane.queue.push({ message, id, notBefore: id === undefined ? now : now + ID_SETTLE_MS });
  pump(lane, el);
};

export const clearAnnouncer = (host: HTMLElement): void => {
  const state = stateFor(host);
  resetLane(state.polite);
  resetLane(state.assertive);
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

export interface StreamingAnnouncer {
  /** Appends a chunk; the first chunk is announced immediately, later ones at most once per interval. */
  push(chunk: string): void;
  /** Ends the stream: stops the interval and announces any buffered tail as one final write. */
  stop(): void;
  /** Aborts the stream: stops the interval and discards the buffered tail without announcing it. */
  cancel(): void;
}

/** REQ-MAT-64 / REQ-MAT-58: streaming announcer — buffers chunks and flushes
   the text buffered since the previous write at most once per intervalMs
   (default 1000). stop() writes the remaining tail so the final token is the
   last thing announced; cancel() is the separate discard path. */
export const createStreamingAnnouncer = (
  announce: (message: string) => void,
  opts: { intervalMs?: number } = {},
): StreamingAnnouncer => {
  const intervalMs = opts.intervalMs ?? 1000;
  let buffer = '';
  let timer: ReturnType<typeof setInterval> | null = null;
  const flush = (): void => {
    if (buffer === '') return;
    const out = buffer;
    buffer = '';
    announce(out);
  };
  const halt = (): void => {
    if (timer !== null) { clearInterval(timer); timer = null; }
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
      halt();
      flush();
    },
    cancel() {
      halt();
      buffer = '';
    },
  };
};
