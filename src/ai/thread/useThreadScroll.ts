'use client';
import * as React from 'react';
import { useAnnouncer } from '../../theme';
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
 * `scrollIntoView`; smooth scrolling only for the explicit jump at motion full.
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
  const raf = React.useRef(0);
  /** A smooth jump is in flight: intermediate scroll events must not unpin. */
  const jumping = React.useRef(false);
  const anchor = React.useRef<Anchor | null>(null);
  const { announce } = useAnnouncer();

  const distance = (el: HTMLElement) => el.scrollHeight - el.scrollTop - el.clientHeight;

  const scrollToBottom = React.useCallback((options?: { behavior?: ScrollBehavior | undefined }) => {
    if (!viewportRef.current) return;
    const smooth = options?.behavior === 'smooth';
    // One assignment per frame: a frame already scheduled covers this growth.
    if (raf.current && !smooth) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
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
  React.useLayoutEffect(() => {
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

    // Append: count only messages after the previous last one.
    if (last === undefined || last === before.last) return;
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
  // measurement): ResizeObserver on the content wrapper plus a
  // MutationObserver for text/child changes; both collapse into one rAF.
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
    const mo = typeof MutationObserver === 'undefined' ? null : new MutationObserver(onGrow);
    mo?.observe(content, { childList: true, subtree: true, characterData: true });
    return () => { ro?.disconnect(); mo?.disconnect(); };
  }, [contentRef, viewportRef, scrollToBottom]);

  React.useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

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
    pinned.current = true;
    jumping.current = smoothJump;
    setUnpinnedCount(0);
    scrollToBottom({ behavior: smoothJump ? 'smooth' : 'auto' });
    if (n > 0) announce(newMessagesText(n));
    viewportRef.current?.focus({ preventScroll: true });
  }, [unpinnedCount, smoothJump, scrollToBottom, announce, newMessagesText, viewportRef]);

  return { pinned, unpinnedCount, onScroll, onUserInput, scrollToBottom, jumpToLatest, api };
}
