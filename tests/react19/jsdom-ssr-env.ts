/**
 * jsdom does not expose TextEncoder/TextDecoder or MessageChannel, which
 * react-dom/server's browser build needs at import time (React 19 creates a
 * MessageChannel at module load for task scheduling). Import this module before
 * `react-dom/server` in the react19 legs.
 *
 * MessageChannel is a minimal in-process shim (postMessage -> setTimeout ->
 * the other port's onmessage). Node's worker_threads MessageChannel is not
 * used: a port with an onmessage handler holds the event loop open, so jest
 * never exits.
 */
import { TextDecoder, TextEncoder } from 'util';

type Handler = ((ev: { data: unknown }) => void) | null;

class ShimPort {
  onmessage: Handler = null;
  other: ShimPort | null = null;
  postMessage(data: unknown): void {
    const target = this.other;
    setTimeout(() => target?.onmessage?.({ data }), 0);
  }
  start(): void {}
  close(): void {
    this.onmessage = null;
  }
}

class ShimMessageChannel {
  readonly port1 = new ShimPort();
  readonly port2 = new ShimPort();
  constructor() {
    this.port1.other = this.port2;
    this.port2.other = this.port1;
  }
}

const g = globalThis as unknown as Record<string, unknown>;
if (typeof g.TextEncoder === 'undefined') g.TextEncoder = TextEncoder;
if (typeof g.TextDecoder === 'undefined') g.TextDecoder = TextDecoder;
if (typeof g.MessageChannel === 'undefined') g.MessageChannel = ShimMessageChannel;
