'use client';
import * as React from 'react';
import { useAnnouncer } from '../../theme';

export interface ThreadScrollApi {
  scrollToBottom(options?: { behavior?: ScrollBehavior | undefined }): void;
  scrollToMessage(id: string, options?: { block?: ScrollLogicalPosition | undefined }): void;
  isPinned(): boolean;
}

/**
 * REQ-SURF-108: pinned while `scrollHeight − scrollTop − clientHeight ≤ pinThreshold`.
 * While pinned, growth keeps the bottom in view by assigning `scrollTop` once
 * per frame (rAF batching); a user scroll-up unpins; a new `user` message
 * re-pins. No smooth scrolling while streaming, never scrollIntoView.
 */
export function useThreadScroll(
  viewportRef: React.RefObject<HTMLElement | null>,
  opts: {
    messagesLength: number;
    lastRole?: string | undefined;
    pinThreshold: number;
    scrollToKey?: ((key: React.Key, o?: { align?: 'start' | 'center' | 'end' | 'auto' }) => void) | undefined;
  },
) {
  const { pinThreshold, scrollToKey } = opts;
  const pinned = React.useRef(true);
  const [unpinnedCount, setUnpinnedCount] = React.useState(0);
  const raf = React.useRef(0);
  const { announce } = useAnnouncer();

  const scrollToBottom = React.useCallback((options?: { behavior?: ScrollBehavior }) => {
    const el = viewportRef.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const node = viewportRef.current;
      if (node) node.scrollTop = node.scrollHeight;
    });
  }, [viewportRef]);

  const repin = React.useCallback(() => {
    pinned.current = true;
    setUnpinnedCount(0);
  }, []);

  const onScroll = React.useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const was = pinned.current;
    pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight <= pinThreshold;
    if (!was && pinned.current) setUnpinnedCount(0);
  }, [viewportRef, pinThreshold]);

  // Growth while pinned → keep bottom in view; growth while unpinned → count.
  const prevLen = React.useRef(opts.messagesLength);
  React.useEffect(() => {
    const delta = opts.messagesLength - prevLen.current;
    prevLen.current = opts.messagesLength;
    if (delta <= 0) return;
    if (opts.lastRole === 'user' || pinned.current) {
      pinned.current = true;
      scrollToBottom();
    } else {
      setUnpinnedCount((c) => c + delta);
    }
  }, [opts.messagesLength, opts.lastRole, scrollToBottom]);

  // Streaming content growth: observe scrollHeight changes while pinned.
  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      if (pinned.current) scrollToBottom();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [viewportRef, scrollToBottom]);

  React.useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  const api = React.useMemo<ThreadScrollApi>(() => ({
    scrollToBottom,
    scrollToMessage(id, options) {
      if (scrollToKey) {
        scrollToKey(id, { align: options?.block === 'center' ? 'center' : 'start' });
        return;
      }
      const el = viewportRef.current;
      const target = el?.querySelector(`#ag-msg-${CSS.escape(id)}`);
      if (el && target) {
        el.scrollTop = (target as HTMLElement).offsetTop - el.offsetTop;
      }
    },
    isPinned: () => pinned.current,
  }), [scrollToBottom, scrollToKey, viewportRef]);

  const jumpToLatest = React.useCallback(() => {
    repin();
    scrollToBottom();
    announce(`${unpinnedCount} new message${unpinnedCount === 1 ? '' : 's'}`);
    viewportRef.current?.focus();
  }, [repin, scrollToBottom, announce, unpinnedCount, viewportRef]);

  return { pinned, unpinnedCount, onScroll, scrollToBottom, jumpToLatest, api };
}
