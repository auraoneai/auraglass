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

export function closeStreamingMarkdown(text: string): string {
  let out = text;
  const fences = (out.match(/```/g) ?? []).length;
  if (fences % 2 === 1) out += '\n```';
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
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  return text.split(re).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith('[')) {
      const m = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (m && /^https?:/i.test(m[2]!)) return <a key={i} href={m[2]} rel="noopener noreferrer" target="_blank">{m[1]}</a>;
      return <React.Fragment key={i}>{part}</React.Fragment>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
