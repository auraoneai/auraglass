'use client';
import * as React from 'react';
import { Collapsible } from '../../foundation/base-ui/collapsible';
import type { AgPart } from '../types';
import { AiIcon } from '../icons/AiIcon';

export type AgSourcePart = Extract<AgPart, { type: 'source-url' | 'source-document' }>;

export interface SourceListProps {
  messageId: string;
  sources: readonly AgSourcePart[];
  defaultOpen?: boolean | undefined;
  className?: string | undefined;
}

function isHttp(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function hostname(url: string): string {
  try { return new URL(url).hostname; } catch { return ''; }
}

/** Visible name of a URL source: title, else hostname, else the raw URL. */
export function sourceUrlLabel(s: { url: string; title?: string | undefined }): string {
  return s.title || hostname(s.url) || s.url;
}

/* Source registry (SURF-330 / REQ-SURF-124). Citation activation expands the
 * in-message list and focuses the item. The registry is scoped by a React
 * context: `SourceScope` (rendered by Thread/Message) owns one registry,
 * so two threads or two lists with the same message id never clobber each
 * other. Without a Scope, each mounted list is reachable only through its own
 * DOM element (a WeakMap keyed by the element, not by message id), and a
 * Citation resolves the list inside its own message article. */
interface SourceListApi { openAndFocus(sourceId: string): void }
type SourceRegistry = Map<string, SourceListApi>;

const SourceScopeContext = React.createContext<SourceRegistry | null>(null);
const byElement = new WeakMap<Element, SourceListApi>();

/** Internal (not re-exported from `aura-glass/ai`): Thread/Message render it
 * once around their parts to scope the registry. */
export function SourceScope({ children }: { children?: React.ReactNode }) {
  const [registry] = React.useState<SourceRegistry>(() => new Map());
  return <SourceScopeContext.Provider value={registry}>{children}</SourceScopeContext.Provider>;
}

/** Hook for Citation: returns `open(anchor, messageId, sourceId) → handled`. */
export function useOpenSource(): (anchor: Element, messageId: string, sourceId: string) => boolean {
  const scope = React.useContext(SourceScopeContext);
  return React.useCallback((anchor, messageId, sourceId) => {
    const scoped = scope?.get(messageId);
    if (scoped) { scoped.openAndFocus(sourceId); return true; }
    const within = anchor.closest('article, [data-ag-part="message"]') ?? anchor.ownerDocument;
    for (const el of within.querySelectorAll('[data-ag-part="source-list"]')) {
      if (el.getAttribute('data-message-id') !== messageId) continue;
      const api = byElement.get(el);
      if (api) { api.openAndFocus(sourceId); return true; }
    }
    return false;
  }, [scope]);
}

/**
 * REQ-SURF-124: Base UI Collapsible "{n} sources" (closed when n > 3), list
 * items addressable as #ag-src-{messageId}-{sourceId}; the panel stays mounted
 * (hidden) so item ids and `aria-controls` always resolve; non-http(s) URLs
 * render as text only (javascript:/data: rejected).
 */
export function SourceList({ messageId, sources, defaultOpen, className }: SourceListProps) {
  const [open, setOpen] = React.useState(defaultOpen ?? sources.length <= 3);
  const contentId = React.useId();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const scope = React.useContext(SourceScopeContext);

  React.useEffect(() => {
    const api: SourceListApi = {
      openAndFocus(sourceId) {
        setOpen(true);
        // The panel un-hides on the next commit; focus after it paints.
        requestAnimationFrame(() => {
          rootRef.current?.ownerDocument.getElementById(`ag-src-${messageId}-${sourceId}`)?.focus();
        });
      },
    };
    const el = rootRef.current;
    if (el) byElement.set(el, api);
    scope?.set(messageId, api);
    return () => {
      if (el) byElement.delete(el);
      if (scope?.get(messageId) === api) scope.delete(messageId);
    };
  }, [messageId, scope]);

  return (
    <Collapsible.Root
      ref={rootRef}
      open={open}
      onOpenChange={(next: boolean) => setOpen(next)}
      data-ag-part="source-list"
      data-message-id={messageId}
      data-count={sources.length}
      className={className}
    >
      <Collapsible.Trigger data-ag-part="trigger" aria-controls={contentId}>
        <AiIcon name="source" />
        {`${sources.length} source${sources.length === 1 ? '' : 's'}`}
        <AiIcon name="chevron" />
      </Collapsible.Trigger>
      <Collapsible.Panel id={contentId} keepMounted render={<ol />} data-ag-part="sources">
        {sources.map((s) => {
          const id = `ag-src-${messageId}-${s.sourceId}`;
          if (s.type === 'source-url') {
            const ok = isHttp(s.url);
            const label = sourceUrlLabel(s);
            return (
              <li key={s.sourceId} id={id} data-ag-part="source" tabIndex={-1}>
                {ok ? (
                  <a href={s.url} rel="noopener noreferrer" target="_blank" data-ag-part="source-link">
                    {label}
                    <span className="ag-visually-hidden"> (opens in new tab)</span>
                  </a>
                ) : (
                  <span data-ag-part="source-text">{label}</span>
                )}
                <span data-ag-part="source-host">{hostname(s.url)}</span>
              </li>
            );
          }
          return (
            <li key={s.sourceId} id={id} data-ag-part="source" data-kind="document" tabIndex={-1}>
              <span data-ag-part="source-text">{s.title}</span>
              {s.filename ? <span data-ag-part="source-file">{s.filename}</span> : null}
            </li>
          );
        })}
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
