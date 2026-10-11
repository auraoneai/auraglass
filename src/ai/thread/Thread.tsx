'use client';
import * as React from 'react';
import type { AgMessage } from '../types';
import type { AgPartRenderer, AgTextRenderer } from '../renderers';
import { useAiRenderers, AiRenderersProvider } from '../renderers';
import { Message } from '../message/Message';
import { VirtualList } from '../../data/virtual-list/VirtualList';
import type { VirtualListHandle } from '../../data/virtual-list/VirtualList';
import { useThreadScroll } from './useThreadScroll';
import type { ThreadScrollApi } from './useThreadScroll';

export interface ThreadLabels {
  conversation?: string;
  newMessages?: (n: number) => string;
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
  children?: React.ReactNode;
  ref?: React.Ref<ThreadHandle>;
}

export type ThreadHandle = ThreadScrollApi;

interface ThreadContextValue {
  messages: readonly AgMessage[];
  locale: string;
  timeZone: string;
}

const ThreadContext = React.createContext<ThreadContextValue | null>(null);

function useThread(): ThreadContextValue {
  const ctx = React.useContext(ThreadContext);
  if (!ctx) throw new Error('Thread.* must render inside <Thread.Root>');
  return ctx;
}

export function ThreadViewport({ children }: { children?: React.ReactNode }) {
  return (
    <div data-ag-part="viewport" className="ag-thread-viewport">
      {children}
    </div>
  );
}

export interface ThreadItemsProps {
  /** Render prop: defaults to <Message message={m} …/>. */
  render?: ((message: AgMessage) => React.ReactNode) | undefined;
}

export function ThreadItems({ render }: ThreadItemsProps) {
  const { messages, locale, timeZone } = useThread();
  const { renderers, renderText, onApprovalResponse } = useAiRenderers();
  return (
    <>
      {messages.map((m) =>
        render ? (
          <React.Fragment key={m.id}>{render(m)}</React.Fragment>
        ) : (
          <Message key={m.id} message={m} locale={locale} timeZone={timeZone}>
            <Message.Content>
              <Message.Parts message={m} renderers={renderers} renderText={renderText} onApprovalResponse={onApprovalResponse} />
            </Message.Content>
          </Message>
        ),
      )}
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
 * REQ-SURF-107..110: `role="log"` viewport, pinned-scroll, virtualization over
 * `virtualizeAfter` (I-1 `VirtualList`, anchor 'end'), `JumpToLatest` pill and
 * an imperative `ThreadHandle`.
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
  const vlRef = React.useRef<VirtualListHandle>(null);
  const scrollKeyRef = React.useRef<((key: React.Key, o?: { align?: 'start' | 'center' | 'end' | 'auto' }) => void) | undefined>(undefined);
  scrollKeyRef.current = (key, o) => vlRef.current?.scrollToKey(key, o);

  const scroll = useThreadScroll(viewportRef, {
    messagesLength: messages.length,
    lastRole: messages[messages.length - 1]?.role,
    pinThreshold,
    scrollToKey: (key, o) => scrollKeyRef.current?.(key, o),
  });

  React.useImperativeHandle(ref, () => scroll.api, [scroll.api]);

  // Top sentinel → onReachTop, once per intersection.
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const lastHit = React.useRef(0);
  React.useEffect(() => {
    const el = sentinelRef.current;
    const root = viewportRef.current;
    if (!el || !root || !onReachTop) return;
    if (typeof IntersectionObserver === 'undefined') return; // SSR / no-IO environments: no top paging
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (e?.isIntersecting) {
        const now = Date.now();
        if (now - lastHit.current > 250) {
          lastHit.current = now;
          onReachTop();
        }
      }
    }, { root });
    io.observe(el);
    return () => io.disconnect();
  }, [onReachTop]);

  const virtualized = messages.length > virtualizeAfter;
  const ctx = React.useMemo<ThreadContextValue>(() => ({ messages, locale, timeZone }), [messages, locale, timeZone]);

  const items = children ?? <ThreadItems />;

  return (
    <ThreadContext.Provider value={ctx}>
      <section data-ag-part="thread" className={className} data-virtualized={virtualized || undefined}>
        <div
          ref={(el) => { viewportRef.current = el; }}
          role="log"
          aria-label={labels?.conversation ?? label}
          aria-relevant="additions"
          aria-live={undefined}
          tabIndex={0}
          data-ag-part="log"
          onScroll={scroll.onScroll}
        >
          <div ref={sentinelRef} data-ag-part="top-sentinel" aria-hidden="true" style={{ blockSize: 1 }} />
          {virtualized ? (
            <VirtualList
              ref={vlRef}
              items={messages}
              anchor="end"
              estimateSize={() => 96}
              getItemKey={(m: AgMessage) => m.id}
              overscan={6}
              renderItem={(m: AgMessage) => (
                <Message message={m} locale={locale} timeZone={timeZone}>
                  <Message.Content>
                    <Message.Parts message={m} />
                  </Message.Content>
                </Message>
              )}
            />
          ) : (
            items
          )}
          <div data-ag-part="bottom-sentinel" aria-hidden="true" style={{ blockSize: 1 }} />
        </div>
        {messages.length === 0 ? <ThreadEmpty>{labels?.empty ?? 'No messages yet'}</ThreadEmpty> : null}
        {scroll.unpinnedCount > 0 ? (
          <ThreadJumpToLatest onClick={scroll.jumpToLatest} aria-label={labels?.jumpToLatest ?? 'Jump to latest'}>
            {(labels?.newMessages ?? ((n: number) => `${n} new message${n === 1 ? '' : 's'}`))(scroll.unpinnedCount)}
          </ThreadJumpToLatest>
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
