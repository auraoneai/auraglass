/* REQ-CMP-130 — T2 composite page: ~20 server/core components on one surface.
   Used by tests/perf/browser/cmp/t2-page.spec.ts to prove the page stays quiet
   (computed backdrop-filter !== 'none' on at most 1 element). */
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Alert, Badge, Card, Container, DescriptionList, EmptyState,
  Grid, Heading, Kbd, Link, Separator, Skeleton, Stack, Text,
} from '../../../src/root/cmp';
import { Breadcrumbs } from '../../../src/components/breadcrumbs/Breadcrumbs';
import { Steps } from '../../../src/components/steps/Steps';
import { Timeline } from '../../../src/components/timeline/Timeline';
import type { StoryAgParameters } from '../../../src/contracts/testing';

function T2Page() {
  return (
    <Container>
      <Stack gap={4}>
        <Breadcrumbs.Root aria-label="Breadcrumb">
          <Breadcrumbs.List>
            <Breadcrumbs.Item><Breadcrumbs.Link href="#">Home</Breadcrumbs.Link></Breadcrumbs.Item>
            <Breadcrumbs.Item><Breadcrumbs.Current>Dashboard</Breadcrumbs.Current></Breadcrumbs.Item>
          </Breadcrumbs.List>
        </Breadcrumbs.Root>
        <Heading level={1}>Team overview</Heading>
        <Text>Quarterly status for the platform group. Press <Kbd>⌘K</Kbd> to search.</Text>
        <Alert title="Maintenance — window on Saturday"><Link href="#">Details</Link></Alert>
        <Grid columns={3}>
          <Card.Root><Card.Header><Card.Title>Alpha</Card.Title></Card.Header><Card.Body><Badge intent="success">Live</Badge></Card.Body></Card.Root>
          <Card.Root><Card.Header><Card.Title>Beta</Card.Title></Card.Header><Card.Body><Badge intent="info">Preview</Badge></Card.Body></Card.Root>
          <Card.Root><Card.Header><Card.Title>Gamma</Card.Title></Card.Header><Card.Body><Badge intent="warning">At risk</Badge></Card.Body></Card.Root>
        </Grid>
        <Separator />
        <DescriptionList><DescriptionList.Item><DescriptionList.Term>Owner</DescriptionList.Term><DescriptionList.Details>Platform</DescriptionList.Details></DescriptionList.Item><DescriptionList.Item><DescriptionList.Term>SLA</DescriptionList.Term><DescriptionList.Details>99.9%</DescriptionList.Details></DescriptionList.Item></DescriptionList>
        <Steps>
          <Steps.Item status="complete">Plan</Steps.Item>
          <Steps.Item status="current">Build</Steps.Item>
          <Steps.Item status="upcoming">Ship</Steps.Item>
        </Steps>
        <Timeline items={[{ id: '1', timestamp: '2026-01-01', title: 'Kickoff' }, { id: '2', timestamp: '2026-02-01', title: 'Beta' }]} />
        <EmptyState title="No archived items" />
        <Skeleton lines={2} />
      </Stack>
    </Container>
  );
}

const sbMeta = {
  title: 'Pages/T2',
  component: T2Page,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'T2Page', kind: 'showcase' } satisfies StoryAgParameters },
} satisfies Meta<typeof T2Page>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'T2Page', id: 'pages-t2--default' } },
  render: () => <T2Page />,
};
