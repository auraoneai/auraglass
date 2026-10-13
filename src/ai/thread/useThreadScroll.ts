'use client';
import * as React from 'react';
import { useAnnouncer } from '../../theme';
import { scheduleFrame } from '../../motion/ticker';
import type { AgMessage } from '../types';

export interface ThreadScrollApi {
  scrollToBottom(options?: { behavior?: ScrollBehavior | undefined }): void;
  scrollToMessage(id: string, options?: { block?: ScrollLogicalPosition | undefined }): void;
  isPinned(): boolean;
}

type ScrollToKey = (key: React.Key, o?: { align?: 'start' | 'center' | 'end' | 'auto' }) => void;

interface Anchor {
  id: string;
  top: number;
  scrollTop: number;
  scrollHeight: number;
}

/** REQ-SURF-110: true while any message streams (message status, a text or
    reasoning part still streaming, or a tool input still streaming). */
export const isStreaming = (messages: readonly AgMessage[]): boolean =>
  messages.some((m) => m.metadata?.status === 'streaming' || m.parts.some((p) =>
    ((p.type === 'text' || p.type === 'reasoning') && p.state === 'streaming')
    || (typeof p.type === 'string' && (p.type.startsWith('tool-') || p.type === 'dynamic-tool')
      && (p as { state?: string }).state === 'input-streaming')));

const messageEl = (log: HTMLElement, id: string): HTMLElement | null => {
  const el = log.ownerDocument.getElementById(`ag-msg-${id}`);
  return el && log.contains(el) ? el : null;
};

/** First message whose bottom edge is below the log's top edge. */
const readAnchor = (log: HTMLElement): Anchor | null => {
  const top = log.getBoundingClientRect().top;
  for (const el of log.querySelectorAll<HTMLElement>('article[id^="ag-msg-"]')) {
    const r = el.getBoundingClientRect();
    if (r.bottom > top) {
      return { id: el.id.slice('ag-msg-'.length), top: r.top - top, scrollTop: log.scrollTop, scrollHeight: log.scrollHeight };
    }
  }
  return { id: '', top: 0, scrollTop: log.scrollTop, scrollHeight: log.scrollHeight };
};

/**
 * REQ-SURF-108..110. Pinned while `scrollHeight − scrollTop − clientHeight ≤
 * pinThreshold`. While pinned, any growth of the log content (new messages,
 * streaming text inside the last message, late layout) assigns
 * `scrollTop = scrollHeight` at most once per animation frame. A user
 * scroll-up unpins; a new `user` message re-pins. Prepending history while
 * unpinned keeps the first visible message at the same offset. Never
 * `scrollIntoView`; smooth scrolling only for the explicit jump at motion full,
 * and never while any message streams (every scroll is then `auto`). Frames
 * go through the shared motion ticker (REQ-MAT-51), not requestAnimationFrame.
 */
export function useThreadScroll(
  viewportRef: React.RefObject<HTMLElement | null>,
  contentRef: React.RefObject<HTMLElement | null>,
  opts: {
    messages: readonly AgMessage[];
    pinThreshold: number;
    /** Present only when the thread is virtualized (REQ-SURF-110). */
    scrollToKey?: ScrollToKey | undefined;
    /** motion === 'full' → the jump pill scrolls smoothly. */
    smoothJump: boolean;
    newMessagesText: (n: number) => string;
  },
) {
  const { messages, pinThreshold, scrollToKey, smoothJump, newMessagesText } = opts;
  const pinned = React.useRef(true);
  const [unpinnedCount, setUnpinnedCount] = React.useState(0);
  /** Cancel for the scheduled scroll frame; null when none is pending. */
  const raf = React.useRef<(() => void) | null>(null);
  const streaming = React.useRef(false);
  streaming.current = isStreaming(messages);
  /** A smooth jump is in flight: intermediate scroll events must not unpin. */
  const jumping = React.useRef(false);
  const anchor = React.useRef<Anchor | null>(null);
  const { announce } = useAnnouncer();

  const distance = (el: HTMLElement) => el.scrollHeight - el.scrollTop - el.clientHeight;

  const scrollToBottom = React.useCallback((options?: { behavior?: ScrollBehavior | undefined }) => {
    if (!viewportRef.current) return;
    // REQ-SURF-110: no smooth scrolling while any message streams.
    const smooth = options?.behavior === 'smooth' && !streaming.current;
    // One assignment per frame: a frame already scheduled covers this growth.
    if (raf.current && !smooth) return;
    raf.current?.();
    raf.current = scheduleFrame(() => {
      raf.current = null;
      const node = viewportRef.current;
      if (!node) return;
      if (smooth && typeof node.scrollTo === 'function') {
        node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
      } else {
        node.scrollTop = node.scrollHeight;
      }
    });
  }, [viewportRef]);

  const onScroll = React.useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const atBottom = distance(el) <= pinThreshold;
    if (jumping.current) {
      if (atBottom) jumping.current = false;
      anchor.current = readAnchor(el);
      return;
    }
    const was = pinned.current;
    pinned.current = atBottom;
    if (!was && atBottom) setUnpinnedCount(0);
    anchor.current = readAnchor(el);
  }, [viewportRef, pinThreshold]);

  /** Wheel/pointer/key input cancels an in-flight smooth jump. */
  const onUserInput = React.useCallback(() => { jumping.current = false; }, []);

  // Message-list changes: appended messages follow or count; prepended
  // history keeps the first visible message in place.
  const prev = React.useRef<{ first?: string | undefined; last?: string | undefined; length: number }>({
    first: messages[0]?.id, last: messages[messages.length - 1]?.id, length: messages.length,
  });
  const mounted = React.useRef(false);
  React.useLayoutEffect(() => {
    const wasMounted = mounted.current;
    mounted.current = true;
    const before = prev.current;
    const first = messages[0]?.id;
    const last = messages[messages.length - 1]?.id;
    prev.current = { first, last, length: messages.length };
    const el = viewportRef.current;

    // Prepend: the old first message now sits at index k > 0.
    if (before.first !== undefined && first !== before.first && !pinned.current && el) {
      const k = messages.findIndex((m) => m.id === before.first);
      const a = anchor.current;
      if (k > 0 && a) {
        const target = a.id ? messageEl(el, a.id) : null;
        if (target) {
          const now = target.getBoundingClientRect().top - el.getBoundingClientRect().top;
          el.scrollTop += now - a.top;
        } else {
          // Virtualized and the anchor is not mounted yet: the prepended rows'
          // estimated height is the scrollHeight growth.
          el.scrollTop = a.scrollTop + (el.scrollHeight - a.scrollHeight);
        }
        anchor.current = readAnchor(el);
      }
    }

    // Same last message (streaming text growth inside it): while pinned the
    // frame-coalesced follow still applies — the ResizeObserver below is a
    // second signal, not the only one (it never fires when no box changes).
    if (last !== undefined && last === before.last) {
      if (wasMounted && pinned.current) scrollToBottom();
      return;
    }
    // Append: count only messages after the previous last one.
    if (last === undefined) return;
    const lastIdx = before.last === undefined ? -1 : messages.findIndex((m) => m.id === before.last);
    const appended = lastIdx >= 0 ? messages.length - 1 - lastIdx : Math.max(0, messages.length - before.length);
    if (appended <= 0) return;
    if (messages[messages.length - 1]?.role === 'user' || pinned.current) {
      pinned.current = true;
      setUnpinnedCount(0);
      scrollToBottom();
    } else {
      setUnpinnedCount((c) => c + appended);
    }
  }, [messages, viewportRef, scrollToBottom]);

  // Content growth (streaming tokens inside the last message, images, late
  // measurement): a ResizeObserver on the content wrapper is the only signal
  // scroll needs — a mutation that changes no box moves neither scrollHeight
  // nor any anchor offset, and appends/prepends are handled by the layout
  // effect above (REQ-QUAL-46: no MutationObserver in shipped code).
  React.useEffect(() => {
    const content = contentRef.current;
    const el = viewportRef.current;
    if (!content || !el) return;
    const onGrow = () => {
      if (pinned.current) scrollToBottom();
      else if (!jumping.current) anchor.current = readAnchor(el);
    };
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onGrow);
    ro?.observe(content);
    return () => { ro?.disconnect(); };
  }, [contentRef, viewportRef, scrollToBottom]);

  React.useEffect(() => () => { raf.current?.(); raf.current = null; }, []);

  const api = React.useMemo<ThreadScrollApi>(() => ({
    scrollToBottom,
    scrollToMessage(id, options) {
      const block = options?.block ?? 'start';
      if (scrollToKey) {
        scrollToKey(id, { align: block === 'nearest' ? 'auto' : block });
        return;
      }
      const el = viewportRef.current;
      const target = el ? messageEl(el, id) : null;
      if (!el || !target) return;
      const box = el.getBoundingClientRect();
      const r = target.getBoundingClientRect();
      const top = r.top - box.top; // target top relative to the visible log top
      const view = el.clientHeight;
      let delta: number;
      if (block === 'center') delta = top - (view - r.height) / 2;
      else if (block === 'end') delta = top + r.height - view;
      else if (block === 'nearest') delta = top < 0 ? top : top + r.height > view ? top + r.height - view : 0;
      else delta = top;
      if (delta !== 0) el.scrollTop += delta;
    },
    isPinned: () => pinned.current,
  }), [scrollToBottom, scrollToKey, viewportRef]);

  const jumpToLatest = React.useCallback(() => {
    const n = unpinnedCount;
    const smooth = smoothJump && !streaming.current;
    pinned.current = true;
    jumping.current = smooth;
    setUnpinnedCount(0);
    scrollToBottom({ behavior: smooth ? 'smooth' : 'auto' });
    if (n > 0) announce(newMessagesText(n));
    viewportRef.current?.focus({ preventScroll: true });
  }, [unpinnedCount, smoothJump, scrollToBottom, announce, newMessagesText, viewportRef]);

  return { pinned, unpinnedCount, onScroll, onUserInput, scrollToBottom, jumpToLatest, api };
}
