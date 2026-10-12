import { Breadcrumbs } from 'aura-glass';

export default function BreadcrumbsMinimal() {
  return (
    <Breadcrumbs.Root>
      <Breadcrumbs.Item><Breadcrumbs.Link href="/">Home</Breadcrumbs.Link></Breadcrumbs.Item>
      <Breadcrumbs.Item><Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link></Breadcrumbs.Item>
      <Breadcrumbs.Item><Breadcrumbs.Current>Atlas</Breadcrumbs.Current></Breadcrumbs.Item>
    </Breadcrumbs.Root>
  );
}
