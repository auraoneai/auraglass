// app/[...slug]/page.tsx — REQ-PLAT-99 (REQ-FIN-43). One statically exported
// page per route of lib/routes.ts: Markdown/MDX-as-Markdown sources from
// apps/docs/content/**, docs/quickstart, docs/guides and apps/docs/generated/**,
// component pages from *.meta.ts, certified registry surfaces, API subpaths,
// and explicit pending pages for nav targets whose owner has not landed them.
import { readFileSync } from 'node:fs';
import { posix } from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildSite, docsAppDir, staticParams, type PageSpec, type SiteModel } from '../../lib/routes';
import { renderMarkdown, type LinkLike } from '../../lib/markdown';
import { Example } from '../../components/Example';
import { PartsTable } from '../../components/PartsTable';
import { EXAMPLES } from '../../generated/examples';

export const dynamicParams = false;

let cached: SiteModel | null = null;
const site = () => (cached ??= buildSite(docsAppDir()));
const BASE_PATH = process.env.DOCS_BASE_PATH ?? '';

export function generateStaticParams() {
  return staticParams(site());
}

type Params = { slug: string[] };
const routeOf = (slug: string[]) => '/' + slug.map(decodeURIComponent).join('/');

function lookup(slug: string[]): PageSpec {
  const page = site().pages.get(routeOf(slug));
  if (!page) notFound();
  return page;
}

const NextLink = ({ href, children, className }: LinkLike) => <Link href={href} className={className}>{children}</Link>;

/** Authored href → site route. Relative links resolve against the source file's repo path. */
function hrefResolver(sourceRepoPath: string) {
  const byRepoPath = new Map<string, string>();
  for (const p of site().pages.values()) {
    const src = p.kind === 'markdown' ? p.source : p.kind === 'component' ? p.source : null;
    if (src) byRepoPath.set(src.repoPath, p.route);
  }
  return (href: string) => {
    if (href.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(href)) return { href, internal: false };
    const [path, hash = ''] = href.split('#');
    const suffix = hash ? `#${hash}` : '';
    if (path.startsWith('/')) return { href: path.replace(/\.(md|mdx)$/, '').replace(/\/$/, '') + suffix || '/', internal: true };
    const target = posix.normalize(posix.join(posix.dirname(sourceRepoPath), path));
    const route = byRepoPath.get(target) ?? byRepoPath.get(`${target}.md`) ?? byRepoPath.get(`${target}.mdx`);
    return route ? { href: route + suffix, internal: true } : { href, internal: false };
  };
}

function renderSource(file: string, repoPath: string) {
  return renderMarkdown(readFileSync(file, 'utf8'), { Link: NextLink, resolveHref: hrefResolver(repoPath), file: repoPath });
}

function Code({ children, label }: { children: string; label: string }) {
  return (
    <div role="region" aria-label={label} tabIndex={0} data-ag-part="code-region" className="docs-scroll">
      <pre><code>{children}</code></pre>
    </div>
  );
}

function Pending({ what, expected }: { what: string; expected: string[] }) {
  return (
    <p data-ag-state="pending">
      Pending: {what} has not landed yet. Expected at {expected.map((e, i) => <span key={e}>{i ? ' or ' : ''}<code>{e}</code></span>)}.
    </p>
  );
}

function titleOf(page: PageSpec): string {
  switch (page.kind) {
    case 'markdown': return renderSource(page.source.file, page.source.repoPath).title ?? page.route;
    case 'component': return page.component.name;
    case 'surface': return page.surface.title;
    case 'api': return page.api.label;
    case 'pending': return page.title;
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: titleOf(lookup(slug)) };
}

export default async function DocsPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = lookup(slug);
  const { data } = site();

  if (page.kind === 'markdown') {
    return <article data-ag-doc={page.source.repoPath}>{renderSource(page.source.file, page.source.repoPath).body}</article>;
  }

  if (page.kind === 'component') {
    const c = page.component;
    const importPath = c.entry === '.' ? 'aura-glass' : `aura-glass/${c.entry.replace(/^\.\//, '')}`;
    const prose = page.source ? renderSource(page.source.file, page.source.repoPath) : null;
    const examples = EXAMPLES[c.slug] ?? [];
    return (
      <article data-ag-doc={c.file}>
        {prose ? prose.body : <h1>{c.name}</h1>}
        <Code label={`Import ${c.name}`}>{`import { ${c.name} } from '${importPath}';`}</Code>
        <dl className="docs-meta">
          <dt>Tier</dt><dd>{c.tier}{c.flagship !== null ? ` · flagship #${c.flagship}` : ''}</dd>
          <dt>Server components</dt><dd>{c.rsc ?? 'unspecified'}</dd>
          <dt>Owner</dt><dd>{c.owner ?? 'unspecified'}</dd>
        </dl>
        <h2 id="parts">Parts</h2>
        <div role="region" aria-label={`${c.name} parts`} tabIndex={0} className="docs-scroll">
          <PartsTable rows={c.parts.map((part) => ({ part }))} />
        </div>
        {c.states.length ? (<><h2 id="states">States</h2><ul>{c.states.map((s) => <li key={s}><code>{s}</code></li>)}</ul></>) : null}
        <h2 id="examples">Examples</h2>
        {examples.length
          ? examples.map(({ name, Component }) => (
            <Example key={name} name={`${c.name} — ${name}`} scenes={data.scenes} basePath={BASE_PATH}><Component /></Example>
          ))
          : <Pending what={`the ${c.name} example`} expected={[`apps/docs/examples/${c.slug}/<name>.tsx`]} />}
      </article>
    );
  }

  if (page.kind === 'surface') {
    const s = page.surface;
    return (
      <article data-ag-doc={`registry/blocks/${s.name}`}>
        <h1>{s.title}</h1>
        {s.description ? <p>{s.description}</p> : null}
        <Code label={`Install ${s.name}`}>{`npx @auraglass/cli add ${s.name}`}</Code>
        <h2 id="files">Files</h2>
        <ul>{s.files.map((f) => <li key={f}><code>{f}</code></li>)}</ul>
      </article>
    );
  }

  if (page.kind === 'api') {
    const a = page.api;
    return (
      <article data-ag-doc={a.report}>
        <h1>{a.label}</h1>
        {page.report ? renderSource(page.report, a.report).body : <Pending what={`the API report for ${a.label}`} expected={[a.report]} />}
      </article>
    );
  }

  return (
    <article data-ag-state="pending">
      <h1>{page.title}</h1>
      <Pending what={`this ${page.owner} page`} expected={page.expected.slice(0, 1)} />
    </article>
  );
}
