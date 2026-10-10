/* REQ-CMP-17: cmp/server — all 23 RSC-safe CMP components rendered with no
   provider and no 'use client'. The page itself stays a Server Component. */
import {
  Alert, AvatarGroup, Badge, ButtonGroup, Card, Container,
  DescriptionList, Grid, Heading, ImageList, Kbd, Link, Separator,
  Skeleton, Stack, EmptyState, ErrorState, LoadingState, Steps, Text,
  Timeline, Label, Slot, VisuallyHidden,
} from 'aura-glass';
import { Icon } from 'aura-glass/icons';

export default function CmpServerPage() {
  return (
    <main data-ag-canary="cmp-server">
      <h1>cmp/server</h1>
      <Alert title="a" />
      <AvatarGroup items={[]} />
      <Badge>1</Badge>
      <ButtonGroup />
      <Card>c</Card>
      <Container>c</Container>
      <DescriptionList items={[]} />
      <Grid>g</Grid>
      <Heading level={1}>h</Heading>
      <ImageList />
      <Kbd>K</Kbd>
      <Link href="#">l</Link>
      <Separator />
      <Skeleton />
      <Stack>s</Stack>
      <EmptyState title="e" />
      <ErrorState title="er" />
      <LoadingState title="ld" />
      <Steps items={[]} />
      <Text>t</Text>
      <Timeline items={[]} />
      <Label>lb</Label>
      <Slot />
      <VisuallyHidden>vh</VisuallyHidden>
      <Icon name="check" />
    </main>
  );
}
