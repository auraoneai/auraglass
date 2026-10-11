/**
 * @jest-environment node
 */
/* tests/docs/docs-markdown.test.tsx — REQ-PLAT-99 (REQ-FIN-43). The docs
   renderer: code blocks and tables scroll in focusable role="region"
   containers, headings carry stable ids (incl. `{#id}`), internal links go
   through the injected Link (next/link in the app), MDX ESM/JSX fails loudly,
   and every routed source in the repo renders. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { renderMarkdown, type LinkLike } from '../../apps/docs/lib/markdown';
import { discoverSources } from '../../apps/docs/lib/routes';

const TestLink = ({ href, children }: LinkLike) => <a href={href} data-link="internal">{children}</a>;
const html = (src: string, file = 'x.md') => renderToStaticMarkup(renderMarkdown(src, { Link: TestLink, file }).body);

describe('docs markdown renderer', () => {
  it('wraps fenced code in a focusable, labelled scroll region', () => {
    expect(html('```tsx\nconst a = <A />;\n```\n')).toBe(
      '<div role="region" aria-label="Code example (tsx)" tabindex="0" data-ag-part="code-region" class="docs-scroll">'
      + '<pre><code class="language-tsx">const a = &lt;A /&gt;;</code></pre></div>',
    );
  });

  it('wraps tables in a focusable scroll region with header cells', () => {
    const out = html('| Prop | Type |\n| --- | :-: |\n| `a` | `string \\| number` |\n');
    expect(out).toContain('<div role="region" aria-label="Table" tabindex="0" data-ag-part="table-region" class="docs-scroll"><table>');
    expect(out).toContain('<th scope="col">Prop</th><th scope="col" style="text-align:center">Type</th>');
    expect(out).toContain('<td><code>a</code></td><td style="text-align:center"><code>string | number</code></td>');
  });

  it('gives headings ids: explicit {#id}, slugged and de-duplicated', () => {
    const r = renderMarkdown('# Migrate to 5.0\n\n## B1 {#b-1}\n\n## Notes\n\n## Notes\n', { Link: TestLink });
    expect(r.title).toBe('Migrate to 5.0');
    expect(r.headings.map((h) => h.id)).toEqual(['migrate-to-50', 'b-1', 'notes', 'notes-1']);
    expect(renderToStaticMarkup(r.body)).toContain('<h2 id="b-1">B1</h2>');
  });

  it('renders lists, nesting, emphasis, inline code and links', () => {
    const out = html('- one **bold** and *em*\n- two [intro](/plat/introduction) and [ext](https://example.com)\n  - nested `code`\n\n1. first\n2. second\n');
    expect(out).toBe(
      '<ul><li>one <strong>bold</strong> and <em>em</em></li>'
      + '<li>two <a href="/plat/introduction" data-link="internal">intro</a> and <a href="https://example.com" rel="noreferrer">ext</a>'
      + '<ul><li>nested <code>code</code></li></ul></li></ul>'
      + '<ol><li>first</li><li>second</li></ol>',
    );
  });

  it('keeps snake_case words and blockquotes intact', () => {
    expect(html('use data_ag_part here\n')).toBe('<p>use data_ag_part here</p>');
    expect(html('> **Note** quoted\n')).toBe('<blockquote><p><strong>Note</strong> quoted</p></blockquote>');
  });

  it('reads frontmatter titles', () => {
    expect(renderMarkdown('---\ntitle: "From MUI"\n---\n\nBody\n', { Link: TestLink }).title).toBe('From MUI');
  });

  it('fails loudly with file:line on MDX ESM or raw JSX blocks instead of dropping them', () => {
    expect(() => html('# T\n\nimport { X } from "y";\n', 'a.mdx')).toThrow('a.mdx:3: MDX ESM (import/export) is not supported');
    expect(() => html('# T\n\n<Example name="x" />\n', 'b.mdx')).toThrow('b.mdx:3: raw HTML/JSX blocks are not supported');
  });

  it('renders every routed source in the repository, one region per fenced block', () => {
    const sources = [...discoverSources(join(__dirname, '..', '..', 'apps', 'docs')).values()];
    expect(sources.length).toBeGreaterThan(20);
    for (const s of sources) {
      const src = readFileSync(s.file, 'utf8');
      const out = renderToStaticMarkup(renderMarkdown(src, { Link: TestLink, file: s.repoPath }).body);
      const fences = (src.match(/^\s{0,3}(```|~~~)/gm) ?? []).length / 2;
      expect([s.repoPath, (out.match(/data-ag-part="code-region"/g) ?? []).length]).toEqual([s.repoPath, Math.floor(fences)]);
      /* No block syntax leaks into paragraphs (unparsed list items or headings). */
      expect([s.repoPath, out.match(/<p>(?:[-*+] |\d+\. |#{1,6} |\|)/g)]).toEqual([s.repoPath, null]);
    }
  });
});
