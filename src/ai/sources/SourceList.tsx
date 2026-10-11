'use client';
import * as React from 'react';
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

/**
 * REQ-SURF-124: collapsible "{n} sources" (closed when n > 3), list items
 * addressable as #ag-src-{messageId}-{sourceId}; non-http(s) URLs render as
 * text only (javascript:/data: rejected).
 */
/* Per-message registry (SURF-330): Citation activation calls
 * `openAndFocusSource(messageId, sourceId)` to expand the list and focus the
 * item. Client-only, cleared on unmount. */
interface SourceListApi { openAndFocus(sourceId: string): void }
const registry = new Map<string, SourceListApi>();
export function openAndFocusSource(messageId: string, sourceId: string): boolean {
  const api = registry.get(messageId);
  if (!api) return false;
  api.openAndFocus(sourceId);
  return true;
}

export function SourceList({ messageId, sources, defaultOpen, className }: SourceListProps) {
  const [open, setOpen] = React.useState(defaultOpen ?? sources.length <= 3);
  const contentId = React.useId();

  React.useEffect(() => {
    registry.set(messageId, {
      openAndFocus(sourceId) {
        setOpen(true);
        requestAnimationFrame(() => {
          document.getElementById(`ag-src-${messageId}-${sourceId}`)?.focus();
        });
      },
    });
    return () => { registry.delete(messageId); };
  }, [messageId]);
  return (
    <div data-ag-part="source-list" data-count={sources.length} className={className}>
      <button
        type="button"
        data-ag-part="trigger"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((o) => !o)}
      >
        <AiIcon name="source" />
        {`${sources.length} source${sources.length === 1 ? '' : 's'}`}
        <AiIcon name="chevron" />
      </button>
      {open ? (
        <ol id={contentId} data-ag-part="sources">
          {sources.map((s) => {
            const id = `ag-src-${messageId}-${s.sourceId}`;
            if (s.type === 'source-url') {
              const ok = isHttp(s.url);
              return (
                <li key={s.sourceId} id={id} data-ag-part="source" tabIndex={-1}>
                  {ok ? (
                    <a href={s.url} rel="noopener noreferrer" target="_blank" data-ag-part="source-link">
                      {s.title ?? hostname(s.url) ?? s.url}
                      <span className="ag-visually-hidden"> (opens in new tab)</span>
                    </a>
                  ) : (
                    <span data-ag-part="source-text">{s.title ?? s.url}</span>
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
        </ol>
      ) : null}
    </div>
  );
}
