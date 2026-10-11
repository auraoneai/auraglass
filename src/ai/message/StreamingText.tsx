'use client';
import * as React from 'react';
import { useAnnouncer, usePreference } from '../../theme';

export interface StreamingTextHandle {
  /** Replaces the text. Same-frame calls coalesce into one commit (next animation frame). */
  setText(text: string): void;
  /** Appends a chunk. Same-frame calls coalesce into one commit (next animation frame). */
  append(chunk: string): void;
}

export interface StreamingTextProps {
  text: string;
  streaming?: boolean | undefined;
  /** Live-annunciation policy; complete announcements go through the MAT announcer. */
  announce?: 'complete' | 'sentences' | 'off' | undefined;
  className?: string | undefined;
  /** Imperative token sink: `setText`/`append` from a transport without re-rendering the parent. */
  ref?: React.Ref<StreamingTextHandle> | undefined;
}

/** REQ-SURF-113: the complete announcement is capped; the transcript keeps the rest. */
export const ANNOUNCE_MAX_CHARS = 600;
export const ANNOUNCE_TRUNCATION_SUFFIX = '…response continues in the conversation';
/** REQ-SURF-113: `announce="sentences"` batches are at least this far apart. */
export const SENTENCE_BATCH_MS = 1000;

export function truncateAnnouncement(text: string): string {
  const t = text.trim();
  return t.length > ANNOUNCE_MAX_CHARS ? `${t.slice(0, ANNOUNCE_MAX_CHARS)}${ANNOUNCE_TRUNCATION_SUFFIX}` : t;
}

const hasRaf = (): boolean => typeof requestAnimationFrame === 'function';

/**
 * Per-instance external store. Imperative writes land in `pending` and are
 * published once per animation frame; `current === null` means "show the
 * `text` prop" (the prop is the source of truth until a handle write).
 */
interface TextStore {
  subscribe(listener: () => void): () => void;
  get(): string | null;
  setText(text: string): void;
  append(chunk: string): void;
  /** The `text` prop changed: it wins over any earlier handle write. */
  resetToProp(text: string): void;
  dispose(): void;
}

function createTextStore(initialProp: string): TextStore {
  let base = initialProp;
  let current: string | null = null;
  let pending: string | null = null;
  let frame: number | null = null;
  const listeners = new Set<() => void>();
  const emit = () => { for (const l of listeners) l(); };
  const flush = () => {
    frame = null;
    if (pending === null) return;
    const next = pending;
    pending = null;
    if (next === current) return;
    current = next;
    emit();
  };
  const schedule = () => {
    if (frame !== null) return;
    if (!hasRaf()) { flush(); return; }
    frame = requestAnimationFrame(flush);
  };
  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    get: () => current,
    setText(text) { pending = text; schedule(); },
    append(chunk) { pending = (pending ?? current ?? base) + chunk; schedule(); },
    resetToProp(text) {
      base = text;
      pending = null;
      if (frame !== null && hasRaf()) cancelAnimationFrame(frame);
      frame = null;
      if (current !== null) { current = null; emit(); }
    },
    dispose() {
      if (frame !== null && hasRaf()) cancelAnimationFrame(frame);
      frame = null;
      pending = null;
      listeners.clear();
    },
  };
}

const serverSnapshot = (): string | null => null;

/**
 * REQ-SURF-113: renders `text` plus a blinking caret while `streaming`.
 * Imperative writes through the `ref` handle are coalesced by a per-instance
 * external store (`useSyncExternalStore`) flushed in one animation frame, so
 * 1,000 `setText` calls in one frame make one commit. The content carries
 * `aria-busy` only while streaming; speech goes through the MAT announcer.
 */
export const StreamingText = React.memo(function StreamingText({
  text,
  streaming = false,
  announce = 'complete',
  className,
  ref,
}: StreamingTextProps) {
  const storeRef = React.useRef<TextStore | null>(null);
  if (storeRef.current === null) storeRef.current = createTextStore(text);
  const store = storeRef.current;

  const written = React.useSyncExternalStore(store.subscribe, store.get, serverSnapshot);
  const shown = written ?? text;

  // A new `text` prop takes over from earlier handle writes.
  const lastProp = React.useRef(text);
  React.useLayoutEffect(() => {
    if (lastProp.current === text) return;
    lastProp.current = text;
    store.resetToProp(text);
  }, [text, store]);
  React.useEffect(() => () => store.dispose(), [store]);

  React.useImperativeHandle(ref, () => ({
    setText: (t: string) => store.setText(t),
    append: (c: string) => store.append(c),
  }), [store]);

  const { announce: speak } = useAnnouncer();
  // SURF-362 (§4.5): the text node itself is aria-live="off" — inside the
  // role="log" viewport, per-token additions would double-announce. Speech
  // goes through the MAT announcer: completed sentences in batches at least
  // SENTENCE_BATCH_MS apart, or the whole (capped) text once streaming ends.
  const spoken = React.useRef(0);
  const lastBatchAt = React.useRef(Number.NEGATIVE_INFINITY);
  const wasStreaming = React.useRef(streaming);
  const shownRef = React.useRef(shown);
  shownRef.current = shown;

  React.useEffect(() => {
    if (announce === 'off') {
      wasStreaming.current = streaming;
      return undefined;
    }
    if (wasStreaming.current && !streaming) {
      const rest = shown.slice(spoken.current);
      spoken.current = shown.length;
      if (rest.trim()) speak(truncateAnnouncement(rest));
    }
    if (!wasStreaming.current && streaming) {
      // A new streaming run starts from the current text.
      spoken.current = 0;
      lastBatchAt.current = Number.NEGATIVE_INFINITY;
    }
    wasStreaming.current = streaming;
    if (announce !== 'sentences' || !streaming || !hasRaf()) return undefined;

    // Batch completed sentences with an rAF-timestamp gate (the SURF purity
    // gate bans setTimeout in shipped ai code).
    let frame: number | null = null;
    const tick = (now: number) => {
      frame = null;
      const t = shownRef.current;
      const boundary = lastSentenceEnd(t);
      if (boundary <= spoken.current) return;
      if (now - lastBatchAt.current < SENTENCE_BATCH_MS) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const batch = t.slice(spoken.current, boundary).trim();
      spoken.current = boundary;
      lastBatchAt.current = now;
      if (batch) speak(truncateAnnouncement(batch));
    };
    if (lastSentenceEnd(shown) > spoken.current) frame = requestAnimationFrame(tick);
    return () => { if (frame !== null) cancelAnimationFrame(frame); };
  }, [shown, streaming, announce, speak]);

  const motion = usePreference('motion');
  return (
    <span
      data-ag-part="streaming-text"
      data-state={streaming ? 'streaming' : 'done'}
      data-announce={announce}
      aria-busy={streaming ? true : undefined}
      className={className}
    >
      <span data-ag-part="text" aria-live="off">{shown}</span>
      {streaming ? <span data-ag-part="caret" data-motion={motion} aria-hidden="true" /> : null}
    </span>
  );
});

/** Index just past the last sentence terminator (". ", "! ", "? " or a final newline), or 0. */
function lastSentenceEnd(text: string): number {
  const re = /[.!?](?=\s)|\n/g;
  let end = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) end = m.index + 1;
  return end;
}
