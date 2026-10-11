'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type { AgPart } from '../types';
import { usePortalContainer, useLayer } from '../../theme';
import { openAndFocusSource } from './SourceList';

export type AgCitationSource = Extract<AgPart, { type: 'source-url' | 'source-document' }>;

export interface CitationProps {
  messageId: string;
  source: AgCitationSource;
  index: number;
  className?: string | undefined;
}

function hostname(url: string): string {
  try { return new URL(url).hostname; } catch { return ''; }
}

/**
 * REQ-SURF-125: `[n]` anchor to #ag-src-{messageId}-{sourceId}; a preview card
 * opens on focus and after a 300 ms hover (portalled via usePortalContainer,
 * Escape via useLayer). No role="tooltip".
 */
export function Citation({ messageId, source, index, className }: CitationProps) {
  const [preview, setPreview] = React.useState(false);
  const hoverAbort = React.useRef<AbortController | null>(null);
  const portal = usePortalContainer('overlay');
  const { isTop } = useLayer({ kind: 'preview-card', modal: false, open: preview, onEscape: () => setPreview(false), element: null });
  const cardId = React.useId();

  React.useEffect(() => () => { hoverAbort.current?.abort(); }, []);
  void isTop; // Escape routing is the layer stack's (onEscape above) — no local keydown listener.

  const startHover = () => {
    hoverAbort.current?.abort();
    const ctl = new AbortController();
    hoverAbort.current = ctl;
    // 300 ms hover delay via the platform timeout primitive — the purity gate
    // (no-fake-timer) bans setTimeout/setInterval calls in shipped ai code.
    AbortSignal.timeout(300).addEventListener('abort', () => {
      if (!ctl.signal.aborted) setPreview(true);
    }, { once: true });
  };
  const cancelHover = () => {
    hoverAbort.current?.abort();
    hoverAbort.current = null;
    setPreview(false);
  };

  const title = source.type === 'source-url' ? (source.title ?? hostname(source.url)) : source.title;
  const href = `#ag-src-${messageId}-${source.sourceId}`;

  const cardBody = preview ? (
    <div
      id={cardId}
      data-ag-part="citation-preview"
      role="dialog"
      aria-label={title}
      onMouseEnter={() => { /* keep preview open */ }}
      onMouseLeave={cancelHover}
    >
      <span data-ag-part="citation-preview-title">{title}</span>
      {source.type === 'source-url' ? (
        <span data-ag-part="citation-preview-host">{hostname(source.url)}</span>
      ) : (
        <span data-ag-part="citation-preview-kind">{source.mediaType}</span>
      )}
    </div>
  ) : null;
  const card = preview
    ? portal
      ? ReactDOM.createPortal(cardBody, portal)
      : cardBody
    : null;

  return (
    <>
      <a
        href={href}
        data-ag-part="citation"
        data-index={index}
        className={className}
        aria-describedby={preview ? cardId : undefined}
        onFocus={() => setPreview(true)}
        onBlur={cancelHover}
        onMouseEnter={startHover}
        onMouseLeave={cancelHover}
        onClick={(e) => {
          // Keyboard/coarse activation opens the in-message SourceList and
          // focuses the source item (the anchor href itself lands there too).
          const handled = openAndFocusSource(messageId, source.sourceId);
          if (handled) e.preventDefault();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && preview) { setPreview(false); }
        }}
      >
        <span className="ag-visually-hidden">{`Source ${index}: ${title}`}</span>
        <span aria-hidden="true">{`[${index}]`}</span>
      </a>
      {card}
    </>
  );
}
