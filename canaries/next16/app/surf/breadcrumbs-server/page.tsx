// SURF-080 — Next 16 + React 19.3 server page (no 'use client'): renders the
// Breadcrumbs trail with complete markup in the RSC payload — nav > ol > li,
// aria-current on the current crumb, and the overflow control rendered
// server-side for the non-interactive path (REQ-SURF-07).
import { Breadcrumbs } from 'aura-glass';

export default function BreadcrumbsServerCanaryPage() {
  return (
    <main data-ag-canary="surf-breadcrumbs-server">
      <h1>Breadcrumbs, server-rendered</h1>
      <Breadcrumbs.Root aria-label="Breadcrumb">
        <Breadcrumbs.Item><Breadcrumbs.Link href="/">Home</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Item><Breadcrumbs.Link href="/library">Library</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Item><Breadcrumbs.Link href="/library/components">Components</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Current>Breadcrumbs</Breadcrumbs.Current>
      </Breadcrumbs.Root>
    </main>
  );
}
