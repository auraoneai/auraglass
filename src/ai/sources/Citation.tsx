'use client';
import * as React from 'react';
import { PreviewCard } from '../../foundation/base-ui/preview-card';
import type { AgPart } from '../types';
import { usePortalContainer, useLayer } from '../../theme';
import { sourceUrlLabel, useOpenSource } from './SourceList';
import { defaultPositionerProps } from '../../components/overlays/_shared/positioning';

/** A citable source; `snippet` (optional) is the quoted passage shown in the preview. */
export type AgCitationSource = Extract<AgPart, { type: 'source-url' | 'source-document' }> & {
  snippet?: string | undefined;
};

export interface CitationProps {
  /** Id of the message that cites the source. */
  messageId: string;
  /** The cited source. */
  source: AgCitationSource;
  /** Citation number shown in the marker and announced as "Source {index}". */
  index: number;
  /** Initial open state of the preview card (uncontrolled). Default false. */
  defaultOpen?: boolean | undefined;
  /** Class name merged onto the root element. */
  className?: string | undefined;
}

function hostname(url: string): string {
  try { return new URL(url).hostname; } catch { return ''; }
}

/**
 * Registers the open card with the LayerStack. Mounted only while the card is
 * open, so closed citations never sit on the stack. `onEscape` returns
 * `false`: the stack then passes the native Escape through untouched and Base
 * UI's dismiss performs the single close (see useOverlayLayer.ts); any other
 * return value makes the stack consume the key, so the card would never close.
 */
function PreviewLayer() {
  useLayer({ kind: 'preview-card', modal: false, open: true, onEscape: passEscapeToBaseUi, element: null, restoreFocusTo: false });
  return null;
}
const passEscapeToBaseUi = () => false as const;

/** Hover-open delay (ms) — REQ-SURF-125. */
export const CITATION_PREVIEW_DELAY = 300;

/**
 * REQ-SURF-125: `[n]` anchor to #ag-src-{messageId}-{sourceId}, named
 * "Source {index}: {title}". A Base UI PreviewCard (title, snippet, hostname)
 * opens after a 300 ms hover and on focus, is portalled into
 * `usePortalContainer('overlay')`, uses the shared CMP positioner config
 * (`defaultPositionerProps`: 8 px offset, 8 px collision padding, flip → shift), carries no
 * popup role (no dialog/tooltip), and closes on blur and on Escape. Escape
 * follows the repo's Base-UI-overlay rule (src/components/overlays/_shared/
 * useOverlayLayer.ts): the open card is registered with the LayerStack via
 * `useLayer({ kind: 'preview-card' })` so the stack orders it and layers below
 * never see that Escape, while Base UI's dismiss performs the single close
 * (reason 'escape-key'); there is no local keydown listener.
 * Activation (touch, Enter, click — including below 480 px and at coarse
 * pointers) opens the in-message SourceList and moves focus to the item.
 */
export function Citation({ messageId, source, index, defaultOpen = false, className }: CitationProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const portal = usePortalContainer('overlay');
  const openSource = useOpenSource();
  const cardId = React.useId();

  const title = source.type === 'source-url' ? sourceUrlLabel(source) : source.title;
  const host = source.type === 'source-url' ? hostname(source.url) : '';
  const href = `#ag-src-${messageId}-${source.sourceId}`;

  return (
    <PreviewCard.Root
      open={open}
      onOpenChange={(next: boolean) => setOpen(next)}
    >
      <PreviewCard.Trigger
        href={href}
        delay={CITATION_PREVIEW_DELAY}
        closeDelay={0}
        data-ag-part="citation"
        data-index={index}
        className={className}
        aria-describedby={open ? cardId : undefined}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          // Touch, Enter and click all land here: expand the in-message
          // SourceList and focus the item. If no list is mounted, the native
          // href navigation to #ag-src-… is kept.
          if (openSource(e.currentTarget, messageId, source.sourceId)) {
            e.preventDefault();
            setOpen(false);
          }
        }}
      >
        <span className="ag-visually-hidden">{`Source ${index}: ${title}`}</span>
        <span aria-hidden="true">{`[${index}]`}</span>
      </PreviewCard.Trigger>
      <PreviewCard.Portal container={portal ?? undefined}>
        {/* REQ-CMP-85 (S-30): the shared anchored-popup contract — sideOffset 8,
            collisionPadding 8, flip → shift; transform-origin and
            max-block-size come from the [data-ag-part=citation-preview] rule
            in ai.css. */}
        <PreviewCard.Positioner {...defaultPositionerProps} data-ag-part="citation-preview-positioner">
          <PreviewCard.Popup id={cardId} data-ag-part="citation-preview">
            {open ? <PreviewLayer /> : null}
            <span data-ag-part="citation-preview-title">{title}</span>
            {source.snippet ? <span data-ag-part="citation-preview-snippet">{source.snippet}</span> : null}
            {source.type === 'source-url' ? (
              <span data-ag-part="citation-preview-host">{host}</span>
            ) : (
              <span data-ag-part="citation-preview-kind">{source.mediaType}</span>
            )}
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}
