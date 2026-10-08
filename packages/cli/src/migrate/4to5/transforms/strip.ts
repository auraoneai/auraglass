/** Shared text-span editing helpers (offset-precise, formatting-preserving). */
export interface Span { start: number; end: number }

/** Remove an attribute's text including the whitespace run before it (newline-aware). */
export function cutAttr(source: string, span: Span): { start: number; end: number } {
  let start = span.start;
  // walk back over spaces/tabs; if a newline is in the run, cut from just after it.
  let i = start - 1;
  while (i >= 0 && (source[i] === ' ' || source[i] === '\t')) i -= 1;
  if (i >= 0 && source[i] === '\n') start = i; // cut the newline too
  else start = i + 1; // keep non-ws char
  return { start, end: span.end };
}

/** Splice several spans out of source (sorted by offset desc). */
export function spliceSpans(source: string, spans: Span[]): string {
  let out = source;
  for (const s of [...spans].sort((a, b) => b.start - a.start)) {
    out = out.slice(0, s.start) + out.slice(s.end);
  }
  return out;
}
