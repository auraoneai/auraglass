import * as React from 'react';
import type { AgMessage, AgPart } from '../types';
import type { AgPartRenderer, AgTextRenderer } from '../renderers';
import { StreamingText } from './StreamingText';
import { Reasoning } from '../reasoning/Reasoning';
import { ToolCall } from '../tool/ToolCall';
import { SourceList } from '../sources/SourceList';
import { Citation } from '../sources/Citation';
import { ProviderErrorState } from '../error/ProviderErrorState';

export interface MessagePartsProps {
  message: AgMessage;
  renderers?: Record<string, AgPartRenderer | undefined> | undefined;
  renderText?: AgTextRenderer | undefined;
  /** Citation mode: 'markers' parses [n]/[^sourceId] into inline Citation links. */
  citations?: 'markers' | 'off' | undefined;
  showSteps?: boolean | undefined;
  thumbnailSize?: number | undefined;
  onApprovalResponse?: ((detail: {
    approvalId: string;
    toolCallId: string;
    approved: boolean;
    reason?: string;
  }) => void) | undefined;
}

type SourcePart = Extract<AgPart, { type: 'source-url' | 'source-document' }>;

type Marker = { raw: string; source: SourcePart | undefined; index: number };

/**
 * REQ-SURF-112: splits text into string | citation-marker chunks. `[n]` cites
 * `sources[n - 1]` (the number inside the brackets, not the marker's position);
 * `[^sourceId]` resolves through the message's sourceId index. A marker with
 * no matching source stays literal text.
 */
function markText(
  text: string,
  sources: SourcePart[],
  sourceIndex: Map<string, number>,
): Array<string | Marker> {
  const out: Array<string | Marker> = [];
  const re = /\[(\d+)\]|\[\^([^\]]+)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const index = m[1] !== undefined ? Number(m[1]) : (sourceIndex.get(m[2] ?? '') ?? 0);
    out.push({ raw: m[0], index, source: index > 0 ? sources[index - 1] : undefined });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function isSource(p: AgPart): p is SourcePart {
  return p.type === 'source-url' || p.type === 'source-document';
}

function isTool(p: AgPart): p is Extract<AgPart, { type: `tool-${string}` | 'dynamic-tool' }> {
  return p.type === 'dynamic-tool' || p.type.startsWith('tool-');
}

function FilePart({ part, size }: { part: Extract<AgPart, { type: 'file' }>; size: number }) {
  if (part.mediaType.startsWith('image/')) {
    return (
      <img
        data-ag-part="attachment"
        src={part.url}
        alt={part.filename ?? 'Attached image'}
        loading="lazy"
        decoding="async"
        width={size}
        height={size}
      />
    );
  }
  const href = safeFileHref(part.url);
  const name = part.filename ?? 'Attachment';
  const local = href !== null && /^(?:blob|data):/i.test(href);
  return (
    <span data-ag-part="attachment" data-media-type={part.mediaType}>
      {href !== null ? (
        <a
          data-ag-part="attachment-link"
          href={href}
          {...(local ? { download: part.filename ?? true } : { rel: 'noopener' })}
        >
          {name}
        </a>
      ) : (
        <span data-ag-part="attachment-name">{name}</span>
      )}
      <span data-ag-part="attachment-type">{part.mediaType}</span>
    </span>
  );
}

/**
 * REQ-SURF-115: file links accept http(s), blob:, data: and scheme-less
 * (relative) URLs only; anything else (javascript:, vbscript:, file:, …)
 * renders as text. Browsers strip ASCII whitespace/control characters
 * inside a scheme, so they are stripped before the check.
 */
function safeFileHref(url: string): string | null {
  const compact = url.replace(/[\u0000-\u0020\u007f]/g, '');
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(compact)?.[1]?.toLowerCase();
  if (scheme === undefined) return compact ? url.trim() : null;
  return scheme === 'http' || scheme === 'https' || scheme === 'blob' || scheme === 'data' ? url.trim() : null;
}

/*
 * Renderer precedence (REQ-SURF-112): exact type > prefix ('tool-*' for
 * `tool-<name>` and `dynamic-tool`, 'data-*' for `data-<name>`) > built-in.
 * There is no catch-all key: unknown types render null with one dev warning.
 */
function pickRenderer(renderers: Record<string, AgPartRenderer | undefined>, type: string): AgPartRenderer | undefined {
  const exact = renderers[type];
  if (exact) return exact;
  if (type === 'dynamic-tool' || type.startsWith('tool-')) return renderers['tool-*'];
  if (type.startsWith('data-')) return renderers['data-*'];
  return undefined;
}

const KNOWN_PART = new Set(['text', 'reasoning', 'dynamic-tool', 'source-url', 'source-document', 'file', 'step-start']);
function isUnknown(part: AgPart): boolean {
  if (KNOWN_PART.has(part.type)) return false;
  if (part.type.startsWith('tool-') || part.type.startsWith('data-')) return false;
  return true;
}

const warnedTypes = new Set<string>();
function warnOnce(msg: string) {
  const key = msg;
  if (warnedTypes.has(key)) return;
  warnedTypes.add(key);
  if (process.env.NODE_ENV !== 'production') console.warn(msg);
}

/** REQ-SURF-112/115: renders message parts in order; server-safe (no hooks/context). */
export function MessageParts({
  message,
  renderers,
  renderText,
  citations = 'off',
  showSteps = false,
  thumbnailSize = 96,
  onApprovalResponse,
}: MessagePartsProps) {
  const parts = message.parts;
  const sources = parts.filter(isSource);
  const sourceIndex = new Map<string, number>(sources.map((s, i) => [s.sourceId, i + 1]));
  const nodes: React.ReactNode[] = [];
  let lastTextIdx = -1;
  parts.forEach((p, i) => { if (p.type === 'text') lastTextIdx = i; });
  let sourcesEmitted = false;

  parts.forEach((part, i) => {
    const key = `${message.id}-p${i}`;
    const custom = renderers ? pickRenderer(renderers, part.type) : undefined;
    if (custom) {
      nodes.push(<React.Fragment key={key}>{custom(part)}</React.Fragment>);
      return;
    }
    if (isUnknown(part)) {
      warnOnce(`Message.Parts: unknown part type "${part.type}"`);
      return;
    }
    if (part.type === 'text') {
      const streaming = part.state === 'streaming';
      const body = renderText ? (
        renderText(part.text, { streaming, messageId: message.id })
      ) : streaming ? (
        <StreamingText text={part.text} streaming />
      ) : (
        part.text
      );
      const marked = citations === 'markers' && typeof body === 'string' ? markText(body, sources, sourceIndex) : null;
      nodes.push(
        <div key={key} data-ag-part="text-part" data-state={part.state ?? 'done'}>
          {marked
            ? marked.map((chunk, j) =>
                typeof chunk === 'string'
                  ? chunk
                  : chunk.source ? (
                      <Citation key={j} messageId={message.id} source={chunk.source} index={chunk.index} />
                    ) : (
                      chunk.raw
                    ),
              )
            : body}
        </div>,
      );
      if (!sourcesEmitted && sources.length > 0 && i === lastTextIdx) {
        sourcesEmitted = true;
        nodes.push(<SourceList key={`${key}-sources`} messageId={message.id} sources={sources} />);
      }
      return;
    }
    if (part.type === 'reasoning') {
      nodes.push(<Reasoning key={key} text={part.text} state={part.state ?? 'done'} />);
      return;
    }
    if (isTool(part)) {
      nodes.push(
        <ToolCall
          key={key}
          part={part}
          onApprovalResponse={onApprovalResponse}
        />,
      );
      return;
    }
    if (part.type === 'file') {
      nodes.push(<FilePart key={key} part={part} size={thumbnailSize} />);
      return;
    }
    if (part.type === 'step-start') {
      if (showSteps) nodes.push(<div key={key} role="separator" data-ag-part="step-separator" />);
      return;
    }
    // data-* / unknown: only a named renderer may render them (handled above).
  });

  // Sources with no text part: the one SourceList goes after the last part.
  if (!sourcesEmitted && sources.length > 0) {
    nodes.push(<SourceList key={`${message.id}-sources`} messageId={message.id} sources={sources} />);
  }

  if (message.metadata?.status === 'error') {
    nodes.push(<ProviderErrorState key={`${message.id}-err`} kind="unknown" variant="compact" />);
  } else if (message.metadata?.status === 'aborted') {
    nodes.push(<p key={`${message.id}-abort`} data-ag-part="stopped">Stopped</p>);
  }

  return <>{nodes}</>;
}
