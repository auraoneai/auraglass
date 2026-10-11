'use client';
import * as React from 'react';

/**
 * ai-markdown (REQ-SURF-173): streaming-safe renderer behind `renderText` —
 * while `streaming`, unterminated code fences and emphasis are closed so a
 * half-delivered token never corrupts the rest of the message. Lightweight:
 * fenced code, inline code, bold/italic, links, lists.
 */
export function StreamingMarkdown({ text, streaming = false }: { text: string; streaming?: boolean }) {
  const rendered = React.useMemo(() => closeStreamingMarkdown(text), [text]);
  const src = streaming ? rendered : text;
  return <>{renderMarkdown(src)}</>;
}

/** Closes what a half-delivered stream leaves open: an unterminated code
 * fence, then — in the last paragraph outside any fence — an open inline-code
 * span and open `**`, `*` and `_` emphasis (innermost first). A marker with
 * nothing after it yet is dropped instead of closed, so `**` alone never
 * renders as literal asterisks. List bullets (`* item`), spaced operators
 * (`a * b`), escaped markers and intraword `_` (snake_case) are not emphasis. */
export function closeStreamingMarkdown(text: string): string {
  const fences = (text.match(/```/g) ?? []).length;
  if (fences % 2 === 1) return `${text}\n\`\`\``;
  const fenceEnd = text.lastIndexOf('```');
  const segStart = fenceEnd === -1 ? 0 : fenceEnd + 3;
  const paraBreak = text.slice(segStart).search(/\n\n+(?![\s\S]*\n\n)/);
  const start = paraBreak === -1 ? segStart : segStart + paraBreak;
  return text.slice(0, start) + closeInline(text.slice(start));
}

type Marker = '**' | '*' | '_' | '`';
const isWord = (c: string | undefined) => c !== undefined && /[\p{L}\p{N}]/u.test(c);
const isSpace = (c: string | undefined) => c === undefined || /\s/.test(c);

function closeInline(para: string): string {
  const open: { marker: Marker; at: number }[] = [];
  const top = () => open[open.length - 1];
  for (let i = 0; i < para.length; i++) {
    const c = para[i]!;
    if (c === '\\') { i++; continue; }
    if (top()?.marker === '`') {
      if (c === '`') open.pop();
      continue;
    }
    let marker: Marker | null = null;
    if (c === '`') marker = '`';
    else if (c === '*' && para[i + 1] === '*') marker = '**';
    else if (c === '*') marker = '*';
    else if (c === '_') marker = '_';
    if (!marker) continue;
    const prev = para[i - 1];
    const next = para[i + marker.length];
    if (marker === '_' && isWord(prev) && isWord(next)) continue;
    // Whitespace on both sides is an operator/bullet, not emphasis. A marker at
    // the very end has no right side yet: treat it as a pending opener (dropped below).
    if (marker !== '`' && isSpace(prev) && next !== undefined && isSpace(next)) { i += marker.length - 1; continue; }
    if (top()?.marker === marker) open.pop();
    else open.push({ marker, at: i });
    i += marker.length - 1;
  }
  let out = para;
  for (let k = open.length - 1; k >= 0; k--) {
    const { marker, at } = open[k]!;
    if (out.slice(at + marker.length).trim() === '') out = out.slice(0, at) + out.slice(at + marker.length);
    else out += marker;
  }
  return out;
}

function renderMarkdown(src: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const chunks = src.split(/(```[\s\S]*?```)/g);
  chunks.forEach((chunk, i) => {
    if (chunk.startsWith('```')) {
      const body = chunk.replace(/^```[^\n]*\n?/, '').replace(/\n?```$/, '');
      nodes.push(<pre key={i} data-ag-part="md-code"><code>{body}</code></pre>);
      return;
    }
    nodes.push(
      <React.Fragment key={i}>
        {chunk.split(/\n\n+/).map((para, j) => (
          <p key={j}>{inlineMarkdown(para)}</p>
        ))}
      </React.Fragment>,
    );
  });
  return nodes;
}

function inlineMarkdown(text: string): React.ReactNode[] {
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|(?<![\p{L}\p{N}])_[^_]+_(?![\p{L}\p{N}])|`[^`]+`|\[[^\]]+\]\([^)]+\))/gu;
  // split() with one capture group puts matched tokens at odd indices; even
  // indices are plain text and must never be read as markup (an unclosed
  // `**bold` outside streaming stays literal).
  return text.split(re).map((part, i) => {
    if (i % 2 === 0) return <React.Fragment key={i}>{part}</React.Fragment>;
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith('[')) {
      const m = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (m && /^https?:/i.test(m[2]!)) return <a key={i} href={m[2]} rel="noopener noreferrer" target="_blank">{m[1]}</a>;
      return <React.Fragment key={i}>{part}</React.Fragment>;
    }
    if (part.length > 2 && ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_')))) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
