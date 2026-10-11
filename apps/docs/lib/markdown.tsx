// lib/markdown.tsx — REQ-PLAT-99. Markdown → React renderer for the static
// docs export (CommonMark subset + GFM tables; heading ids incl. `{#id}`).
// Code blocks and tables scroll inside their own focusable role="region"
// container so the page never scrolls sideways at 320 px.
// MDX ESM/JSX is NOT evaluated: a block-level `import`/`export` line or a raw
// HTML/JSX block outside a fence throws with file:line, so no content is ever
// silently dropped. (Evaluating JSX needs @mdx-js/mdx, which is not in the
// frozen contract dependency set — see the PR's deviations.)
import * as React from 'react';

export interface LinkLike { href: string; children?: React.ReactNode; className?: string }
export interface RenderOptions {
  /** Internal-link component (next/link in the app). */
  Link: React.ComponentType<LinkLike>;
  /** Maps an authored href to { href, internal }; default keeps it as-is. */
  resolveHref?: (href: string) => { href: string; internal: boolean };
  /** Source path for error messages. */
  file?: string;
}
export interface Heading { depth: number; text: string; id: string }
export interface RenderResult { body: React.ReactElement; title: string | null; headings: Heading[]; frontmatter: Record<string, string> }

export function slugifyHeading(text: string): string {
  return text.toLowerCase().replace(/[`*_~[\]()]/g, '').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-');
}

const FENCE = /^(\s{0,3})(`{3,}|~{3,})\s*([^\s`]*)?.*$/;
const HEADING = /^\s{0,3}(#{1,6})\s+(.*?)\s*(?:\{#([\w-]+)\})?\s*#*\s*$/;
const HR = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/;
const LIST = /^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$/;
const TABLE_SEP = /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)*\|?\s*$/;
const QUOTE = /^\s{0,3}>\s?(.*)$/;

/** Regex match as a group accessor: g(n) is the group text or '' (absent group). */
type Groups = (n: number) => string;
function match(re: RegExp, s: string): Groups | null {
  const m = s.match(re);
  return m ? (n: number) => m[n] ?? '' : null;
}

const splitRow = (line: string) => {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  const cells: string[] = []; let cur = ''; let inCode = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s.charAt(i);
    if (ch === '\\' && s.charAt(i + 1) === '|') { cur += '|'; i++; continue; }
    if (ch === '`') inCode = !inCode;
    if (ch === '|' && !inCode) { cells.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  cells.push(cur.trim());
  return cells;
};
const alignOf = (c: string): 'left' | 'right' | 'center' | undefined =>
  c.startsWith(':') && c.endsWith(':') ? 'center' : c.endsWith(':') ? 'right' : c.startsWith(':') ? 'left' : undefined;

const isBlank = (l: string | undefined) => l === undefined || /^\s*$/.test(l);
const isTableStart = (line: string, next: string | undefined) => line.includes('|') && next !== undefined && TABLE_SEP.test(next) && next.includes('-');

class Renderer {
  private key = 0;
  private ids = new Map<string, number>();
  headings: Heading[] = [];
  constructor(private opts: RenderOptions, private mdx: boolean) {}
  k() { return `n${this.key++}`; }

  private uniqueId(base: string) {
    const n = this.ids.get(base) ?? 0;
    this.ids.set(base, n + 1);
    return n === 0 ? base : `${base}-${n}`;
  }

  private fail(lineNo: number, why: string): never {
    throw new Error(`${this.opts.file ?? '<markdown>'}:${lineNo}: ${why}`);
  }

  link(href: string, children: React.ReactNode): React.ReactElement {
    const r = this.opts.resolveHref ? this.opts.resolveHref(href) : { href, internal: href.startsWith('/') };
    if (r.internal) return React.createElement(this.opts.Link, { key: this.k(), href: r.href }, children);
    const external = /^[a-z][a-z0-9+.-]*:/i.test(r.href);
    return <a key={this.k()} href={r.href} {...(external ? { rel: 'noreferrer' } : {})}>{children}</a>;
  }

  inline(text: string, lineNo = 0): React.ReactNode[] {
    const out: React.ReactNode[] = [];
    let buf = '';
    const flush = () => { if (buf) { out.push(buf); buf = ''; } };
    let i = 0;
    while (i < text.length) {
      const rest = text.slice(i);
      let m: Groups | null;
      if (rest.startsWith('\\') && /[\\`*_{}[\]()#+\-.!|<>]/.test(rest.charAt(1))) { buf += rest.charAt(1); i += 2; continue; }
      if ((m = match(/^(`+)([\s\S]*?[^`])\1(?!`)/, rest))) { flush(); out.push(<code key={this.k()}>{m(2).trim()}</code>); i += m(0).length; continue; }
      if ((m = match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/, rest))) { flush(); out.push(<img key={this.k()} src={m(2)} alt={m(1)} />); i += m(0).length; continue; }
      if ((m = match(/^\[((?:[^\]\\]|\\.|\[[^\]]*\])+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/, rest))) { flush(); out.push(this.link(m(2), this.inline(m(1), lineNo))); i += m(0).length; continue; }
      if ((m = match(/^<(https?:\/\/[^>\s]+)>/, rest))) { flush(); out.push(this.link(m(1), m(1))); i += m(0).length; continue; }
      if ((m = match(/^(\*\*|__)(?=\S)([\s\S]*?\S)\1/, rest))) { flush(); out.push(<strong key={this.k()}>{this.inline(m(2), lineNo)}</strong>); i += m(0).length; continue; }
      if ((m = match(/^(\*|_)(?=\S)([\s\S]*?\S)\1(?![\w*])/, rest)) && !(m(1) === '_' && /\w/.test(text.charAt(i - 1)))) {
        flush(); out.push(<em key={this.k()}>{this.inline(m(2), lineNo)}</em>); i += m(0).length; continue;
      }
      if ((m = match(/^~~(?=\S)([\s\S]*?\S)~~/, rest))) { flush(); out.push(<del key={this.k()}>{this.inline(m(1), lineNo)}</del>); i += m(0).length; continue; }
      if (this.mdx && /^<\/?[A-Z][\w.]*[\s/>]/.test(rest)) this.fail(lineNo, `inline JSX '${rest.slice(0, 30)}' is not supported`);
      buf += text.charAt(i); i++;
    }
    flush();
    return out;
  }

  blocks(lines: string[], base = 1): React.ReactNode[] {
    const out: React.ReactNode[] = [];
    const at = (j: number) => lines[j] ?? '';
    let i = 0;
    while (i < lines.length) {
      const line = at(i);
      const lineNo = base + i;
      if (isBlank(line)) { i++; continue; }
      let m: Groups | null;
      if ((m = match(FENCE, line))) {
        const indent = m(1).length; const marker = m(2); const lang = m(3);
        const close = new RegExp(`^\\s{0,3}${marker.startsWith('`') ? '`' : '~'}{${marker.length},}\\s*$`);
        const body: string[] = []; i++;
        while (i < lines.length && !close.test(at(i))) { body.push(at(i).replace(new RegExp(`^\\s{0,${indent}}`), '')); i++; }
        i++;
        out.push(
          <div key={this.k()} role="region" aria-label={lang ? `Code example (${lang})` : 'Code example'} tabIndex={0} data-ag-part="code-region" className="docs-scroll">
            <pre><code className={lang ? `language-${lang}` : undefined}>{body.join('\n')}</code></pre>
          </div>,
        );
        continue;
      }
      if (/^(import|export)\s/.test(line)) this.fail(lineNo, 'MDX ESM (import/export) is not supported by the docs renderer');
      if (/^\s{0,3}<[A-Za-z!/]/.test(line)) this.fail(lineNo, 'raw HTML/JSX blocks are not supported by the docs renderer');
      if ((m = match(HEADING, line))) {
        const depth = m(1).length; const text = m(2); const explicit = m(3);
        const id = explicit || this.uniqueId(slugifyHeading(text) || `section-${this.key}`);
        if (explicit) this.ids.set(explicit, (this.ids.get(explicit) ?? 0) + 1);
        this.headings.push({ depth, text, id });
        out.push(React.createElement(`h${depth}`, { key: this.k(), id }, this.inline(text, lineNo)));
        i++; continue;
      }
      if (HR.test(line)) { out.push(<hr key={this.k()} />); i++; continue; }
      if (QUOTE.test(line)) {
        const body: string[] = [];
        while (i < lines.length && !isBlank(at(i))) { const q = match(QUOTE, at(i)); body.push(q ? q(1) : at(i)); i++; }
        out.push(<blockquote key={this.k()}>{this.blocks(body, lineNo)}</blockquote>);
        continue;
      }
      if (isTableStart(line, lines[i + 1])) {
        const head = splitRow(line);
        const aligns = splitRow(at(i + 1)).map(alignOf);
        i += 2;
        const rows: string[][] = [];
        while (i < lines.length && !isBlank(at(i)) && at(i).includes('|')) { rows.push(splitRow(at(i))); i++; }
        const style = (j: number) => { const a = aligns[j]; return a ? { textAlign: a } : undefined; };
        out.push(
          <div key={this.k()} role="region" aria-label="Table" tabIndex={0} data-ag-part="table-region" className="docs-scroll">
            <table>
              <thead><tr>{head.map((c, j) => <th key={j} scope="col" style={style(j)}>{this.inline(c, lineNo)}</th>)}</tr></thead>
              <tbody>{rows.map((r, ri) => <tr key={ri}>{head.map((_, j) => <td key={j} style={style(j)}>{this.inline(r[j] ?? '', lineNo)}</td>)}</tr>)}</tbody>
            </table>
          </div>,
        );
        continue;
      }
      if ((m = match(LIST, line))) {
        const indent = m(1).length; const ordered = /\d/.test(m(2));
        const start = ordered ? parseInt(m(2), 10) : undefined;
        const items: string[][] = [];
        const last = () => items[items.length - 1] ?? [];
        let loose = false;
        let col = 0; // content column of the current item
        while (i < lines.length) {
          const l = at(i);
          const lm = match(LIST, l);
          const lead = l.search(/\S/);
          if (lm && lm(1).length === indent && /\d/.test(lm(2)) === ordered) {
            items.push([lm(3)]); col = indent + lm(2).length + 1; i++; continue;
          }
          if (lm && lm(1).length < indent) break;
          if (isBlank(l)) {
            const next = lines[i + 1];
            const nm = next === undefined ? null : match(LIST, next);
            const sameList = !!nm && nm(1).length === indent && /\d/.test(nm(2)) === ordered;
            if (next !== undefined && (sameList || (!isBlank(next) && next.search(/\S/) >= col))) {
              loose = true; last().push(''); i++; continue;
            }
            break;
          }
          if (lead >= col) { last().push(l.slice(col)); i++; continue; }
          /* Lazy paragraph continuation (previous line still in the item's paragraph). */
          if (!lm && !FENCE.test(l) && !HEADING.test(l) && !QUOTE.test(l) && !HR.test(l) && !isBlank(lines[i - 1])) {
            last().push(l.trim()); i++; continue;
          }
          break;
        }
        const children = items.map((it, j) => {
          const inner = this.blocks(it, lineNo);
          const first = inner[0];
          const tight = !loose && React.isValidElement<{ children: React.ReactNode }>(first) && first.type === 'p';
          const content = tight ? [first.props.children, ...inner.slice(1)] : inner;
          return <li key={j}>{content}</li>;
        });
        out.push(ordered ? <ol key={this.k()} start={start !== 1 ? start : undefined}>{children}</ol> : <ul key={this.k()}>{children}</ul>);
        continue;
      }
      const para: string[] = [];
      const firstPara = i;
      while (i < lines.length && !isBlank(at(i)) && !FENCE.test(at(i)) && !HEADING.test(at(i)) && !HR.test(at(i))
        && !QUOTE.test(at(i)) && !(para.length && LIST.test(at(i))) && !isTableStart(at(i), lines[i + 1])) {
        para.push(at(i).trim()); i++;
      }
      const nodes: React.ReactNode[] = [];
      para.forEach((p, j) => {
        const hard = / {2,}$/.test(at(firstPara + j)) || p.endsWith('\\');
        nodes.push(...this.inline(p.replace(/\\$/, ''), base + firstPara + j));
        if (j < para.length - 1) nodes.push(hard ? <br key={this.k()} /> : ' ');
      });
      out.push(<p key={this.k()}>{nodes}</p>);
    }
    return out;
  }
}

function frontmatter(src: string): { fm: Record<string, string>; body: string; offset: number } {
  const m = match(/^---\n([\s\S]*?)\n---\n/, src);
  if (!m) return { fm: {}, body: src, offset: 0 };
  const fm: Record<string, string> = {};
  for (const line of m(1).split('\n')) {
    const kv = match(/^([\w-]+):\s*(.*)$/, line);
    if (kv) fm[kv(1)] = kv(2).replace(/^["']|["']$/g, '');
  }
  return { fm, body: src.slice(m(0).length), offset: m(0).split('\n').length - 1 };
}

export function renderMarkdown(source: string, opts: RenderOptions): RenderResult {
  const { fm, body, offset } = frontmatter(source.replace(/\r\n/g, '\n'));
  const r = new Renderer(opts, /\.mdx$/.test(opts.file ?? ''));
  const nodes = r.blocks(body.split('\n'), offset + 1);
  const h1 = r.headings.find((h) => h.depth === 1);
  return { body: <>{nodes}</>, title: fm['title'] ?? (h1 ? h1.text.replace(/[`*_]/g, '') : null), headings: r.headings, frontmatter: fm };
}
