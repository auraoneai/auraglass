// REQ-CMP-130 — Next 16 server canary: renders every REQ-CMP-17 server-list
// component with minimal props and NO AuraGlassProvider. This page must stay a
// Server Component (no 'use client', no hooks) — hydration warnings are asserted
// by ./cmp-server.spec.ts (collected by `npx playwright test` in canaries/next16).
import {
  Alert,
  AvatarGroup,
  Badge,
  Breadcrumbs,
  ButtonGroup,
  Card,
  Container,
  DescriptionList,
  EmptyState,
  ErrorState,
  Grid,
  Heading,
  Kbd,
  Link,
  LoadingState,
  Pagination,
  Separator,
  Skeleton,
  Stack,
  Text,
  Timeline,
  ActivityFeed,
} from 'aura-glass';
import { Button } from 'aura-glass';

export default function CmpServerPage() {
  return (
    <main data-ag-canary="cmp-server">
      <h1>cmp/server</h1>
      <Alert title="Heads up">Server-rendered alert.</Alert>
      <AvatarGroup max={2}>
        <span>AB</span><span>CD</span><span>EF</span>
      </AvatarGroup>
      <Badge intent="info">Beta</Badge>
      <Breadcrumbs.Root aria-label="Breadcrumb">
        <Breadcrumbs.List>
          <Breadcrumbs.Item><Breadcrumbs.Link href="/">Home</Breadcrumbs.Link></Breadcrumbs.Item>
          <Breadcrumbs.Item><Breadcrumbs.Current>Here</Breadcrumbs.Current></Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
      <ButtonGroup><Button>One</Button><Button>Two</Button></ButtonGroup>
      <Card.Root><Card.Header><Card.Title>Card</Card.Title></Card.Header><Card.Body>Body</Card.Body></Card.Root>
      <Container>Contained</Container>
      <DescriptionList><DescriptionList.Item><DescriptionList.Term>Plan</DescriptionList.Term><DescriptionList.Details>Pro</DescriptionList.Details></DescriptionList.Item></DescriptionList>
      <EmptyState title="Nothing here" />
      <ErrorState title="Failed" />
      <LoadingState description="Loading" />
      <Grid columns={2}><div>a</div><div>b</div></Grid>
      <Heading level={2}>Heading</Heading>
      <Text>Body text <Kbd>⌘K</Kbd></Text>
      <Link href="/docs">Docs</Link>
      <Pagination.Root aria-label="Pages">
        <Pagination.Item page={1} current href="?p=1">1</Pagination.Item>
        <Pagination.Item page={2} href="?p=2">2</Pagination.Item>
      </Pagination.Root>
      <Separator />
      <Skeleton lines={2} />
      <Stack gap={2}><span>x</span><span>y</span></Stack>
      <Timeline items={[{ id: 't1', timestamp: '2026-01-01', title: 'Created' }]} />
      <ActivityFeed items={[{ id: 'a1', timestamp: '2026-01-02', title: 'Opened PR', actor: { name: 'dev' } }]} />
    </main>
  );
}
