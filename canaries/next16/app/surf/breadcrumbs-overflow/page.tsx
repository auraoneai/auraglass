// REQ-SURF-57 positive control for tests/rsc/surf/breadcrumbs-server.spec.ts:
// a server page whose trail collapses (maxItems) renders the
// Breadcrumbs.Overflow client island, so its RSC payload must reference it.
import { Breadcrumbs } from 'aura-glass';

export default function BreadcrumbsOverflowCanaryPage() {
  return (
    <main data-ag-canary="surf-breadcrumbs-overflow">
      <h1>Breadcrumbs, collapsed</h1>
      <Breadcrumbs.Root aria-label="Breadcrumb" maxItems={3}>
        <Breadcrumbs.Item><Breadcrumbs.Link href="/">Home</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Item><Breadcrumbs.Link href="/library">Library</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Item><Breadcrumbs.Link href="/library/components">Components</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Item><Breadcrumbs.Link href="/library/components/navigation">Navigation</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Current>Breadcrumbs</Breadcrumbs.Current>
      </Breadcrumbs.Root>
    </main>
  );
}
