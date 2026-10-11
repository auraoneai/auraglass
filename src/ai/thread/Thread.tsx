'use client';
import * as React from 'react';
import type { AgMessage } from '../types';
import { useAiRenderers, AiRenderersProvider } from '../renderers';
import { Message } from '../message/Message';
import { VirtualList } from '../../data/virtual-list/VirtualList';
import type { VirtualListHandle } from '../../data/virtual-list/VirtualList';
import { useResolvedPreferences } from '../../theme';
import { useThreadScroll } from './useThreadScroll';
import type { ThreadScrollApi } from './useThreadScroll';

export interface ThreadLabels {
  conversation?: string;
  newMessages?: (n: number) => string;
  /**
   * @deprecated Ignored since REQ-SURF-108: the JumpToLatest pill's accessible
   * name is its visible text (`newMessages(n)`, WCAG 2.5.3 label-in-name).
   */
  jumpToLatest?: string;
  empty?: string;
}

export interface ThreadRootProps {
  messages: readonly AgMessage[];
  label?: string | undefined;
  pinThreshold?: number | undefined;
  virtualizeAfter?: number | undefined;
  onReachTop?: (() => void) | undefined;
  locale?: string | undefined;
  timeZone?: string | undefined;
  labels?: ThreadLabels | undefined;
  className?: string | undefined;
  /** Defaults to `<Thread.Viewport><Thread.Items/></Thread.Viewport>`. */
  children?: React.ReactNode;
  ref?: React.Ref<ThreadHandle>;
}

export type ThreadHandle = ThreadScrollApi;

interface ThreadContextValue {
  messages: readonly AgMessage[];
  locale: string;
  timeZone: string;
  label: string;
  virtualized: boolean;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  vlRef: React.RefObject<VirtualListHandle | null>;
  onScroll: () => void;
  onUserInput: () => void;
}

const ThreadContext = React.createContext<ThreadContextValue | null>(null);

function useThread(): ThreadContextValue {
  const ctx = React.useContext(ThreadContext);
  if (!ctx) throw new Error('Thread.* must render inside <Thread.Root>');
  return ctx;
}

const defaultNewMessages = (n: number) => `${n} new message${n === 1 ? '' : 's'}`;
const getMessageKey = (m: AgMessage) => m.id;
const estimateMessage = () => 96;

/**
 * REQ-SURF-107: the `role="log"` scroll container. Owns the scroll ref, the
 * scroll handler and both sentinels; there is exactly one per Thread.
 */
export function ThreadViewport({ children }: { children?: React.ReactNode }) {
  const { viewportRef, contentRef, sentinelRef, label, onScroll, onUserInput } = useThread();
  return (
    <div
      ref={viewportRef}
      role="log"
      aria-label={label}
      aria-relevant="additions"
      tabIndex={0}
      data-ag-part="log"
      className="ag-thread-viewport"
      onScroll={onScroll}
      onWheel={onUserInput}
      onPointerDown={onUserInput}
      onKeyDown={onUserInput}
    >
      <div ref={sentinelRef} data-ag-part="top-sentinel" aria-hidden="true" style={{ blockSize: 1 }} />
      <div ref={contentRef}>{children}</div>
      <div data-ag-part="bottom-sentinel" aria-hidden="true" style={{ blockSize: 1 }} />
    </div>
  );
}

export interface ThreadItemsProps {
  /** Render prop: defaults to <Message message={m} …/>. */
  render?: ((message: AgMessage) => React.ReactNode) | undefined;
}

/**
 * Renders every message through one renderer, virtualized or not, so
 * `RenderersProvider` overrides and `render` apply above `virtualizeAfter`.
 */
export function ThreadItems({ render }: ThreadItemsProps) {
  const { messages, locale, timeZone, virtualized, viewportRef, vlRef } = useThread();
  const { renderers, renderText, onApprovalResponse } = useAiRenderers();
  const renderOne = (m: AgMessage) =>
    render ? (
      render(m)
    ) : (
      <Message message={m} locale={locale} timeZone={timeZone}>
        <Message.Content>
          <Message.Parts message={m} renderers={renderers} renderText={renderText} onApprovalResponse={onApprovalResponse} />
        </Message.Content>
      </Message>
    );
  if (virtualized) {
    return (
      <VirtualList
        ref={vlRef}
        items={messages}
        anchor="start"
        estimateSize={estimateMessage}
        getItemKey={getMessageKey}
        getScrollElement={() => viewportRef.current}
        overscan={6}
        renderItem={(m: AgMessage) => renderOne(m)}
      />
    );
  }
  return (
    <>
      {messages.map((m) => (
        <React.Fragment key={m.id}>{renderOne(m)}</React.Fragment>
      ))}
    </>
  );
}

export function ThreadEmpty({ children }: { children?: React.ReactNode }) {
  return <div data-ag-part="empty">{children}</div>;
}

export function ThreadJumpToLatest(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { children, ...rest } = props;
  return (
    <button type="button" data-ag-part="jump-to-latest" {...rest}>
      {children}
    </button>
  );
}

/**
 * REQ-SURF-107..110: compound root. Renders
 * `<Thread.Viewport><Thread.Items/></Thread.Viewport>` unless composed;
 * pinned follow on content growth; one scroll container when virtualized
 * (VirtualList scrolls the log); `onReachTop` once per top-sentinel entry;
 * imperative `ThreadHandle`.
 */
export function ThreadRoot({
  messages,
  label = 'Conversation',
  pinThreshold = 64,
  virtualizeAfter = 100,
  onReachTop,
  locale = 'en-US',
  timeZone = 'UTC',
  labels,
  className,
  children,
  ref,
}: ThreadRootProps) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const vlRef = React.useRef<VirtualListHandle | null>(null);
  const virtualized = messages.length > virtualizeAfter;
  const { motion } = useResolvedPreferences();
  const newMessages = labels?.newMessages ?? defaultNewMessages;

  const scrollToKey = React.useCallback(
    (key: React.Key, o?: { align?: 'start' | 'center' | 'end' | 'auto' }) => vlRef.current?.scrollToKey(key, o),
    [],
  );

  const scroll = useThreadScroll(viewportRef, contentRef, {
    messages,
    pinThreshold,
    scrollToKey: virtualized ? scrollToKey : undefined,
    smoothJump: motion === 'full',
    newMessagesText: newMessages,
  });

  React.useImperativeHandle(ref, () => scroll.api, [scroll.api]);

  // Top sentinel → onReachTop on the isIntersecting false→true edge only.
  const reachTopRef = React.useRef(onReachTop);
  reachTopRef.current = onReachTop;
  const hasReachTop = onReachTop !== undefined;
  React.useEffect(() => {
    const el = sentinelRef.current;
    const root = viewportRef.current;
    if (!el || !root || !hasReachTop || typeof IntersectionObserver === 'undefined') return;
    let inside = false;
    const io = new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1];
      if (!e) return;
      if (e.isIntersecting && !inside) reachTopRef.current?.();
      inside = e.isIntersecting;
    }, { root });
    io.observe(el);
    return () => io.disconnect();
  }, [hasReachTop]);

  const ctx = React.useMemo<ThreadContextValue>(() => ({
    messages,
    locale,
    timeZone,
    label: labels?.conversation ?? label,
    virtualized,
    viewportRef,
    contentRef,
    sentinelRef,
    vlRef,
    onScroll: scroll.onScroll,
    onUserInput: scroll.onUserInput,
  }), [messages, locale, timeZone, labels?.conversation, label, virtualized, scroll.onScroll, scroll.onUserInput]);

  return (
    <ThreadContext.Provider value={ctx}>
      <section data-ag-part="thread" className={className} data-virtualized={virtualized || undefined}>
        {children ?? (
          <ThreadViewport>
            <ThreadItems />
          </ThreadViewport>
        )}
        {messages.length === 0 ? <ThreadEmpty>{labels?.empty ?? 'No messages yet'}</ThreadEmpty> : null}
        {scroll.unpinnedCount > 0 ? (
          <ThreadJumpToLatest onClick={scroll.jumpToLatest}>{newMessages(scroll.unpinnedCount)}</ThreadJumpToLatest>
        ) : null}
      </section>
    </ThreadContext.Provider>
  );
}

export interface ThreadComponent {
  (props: ThreadRootProps): React.ReactElement;
  Root: typeof ThreadRoot;
  Viewport: typeof ThreadViewport;
  Items: typeof ThreadItems;
  Empty: typeof ThreadEmpty;
  JumpToLatest: typeof ThreadJumpToLatest;
  RenderersProvider: typeof AiRenderersProvider;
}

export const Thread = Object.assign(ThreadRoot, {
  Root: ThreadRoot,
  Viewport: ThreadViewport,
  Items: ThreadItems,
  Empty: ThreadEmpty,
  JumpToLatest: ThreadJumpToLatest,
  RenderersProvider: AiRenderersProvider,
}) as ThreadComponent;
