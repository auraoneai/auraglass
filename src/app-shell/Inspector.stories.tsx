// Inspector.stories.tsx — SURF story contract (S-41).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Inspector } from './Inspector';
import { AppShell } from './AppShell';
import { TopBar } from './TopBar';


const meta: Meta = {
  title: 'surf/inspector',
  component: Inspector.Root,
  parameters: { ag: { subject: 'Inspector', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => <Inspector.Root aria-label="Details"><Inspector.Header title="Details" /><Inspector.Content><Inspector.Field label="Name">Atlas</Inspector.Field></Inspector.Content></Inspector.Root> };
export const RTL: Story = { render: () => <Inspector.Root aria-label="Details"><Inspector.Header title="Details" /><Inspector.Content><Inspector.Field label="Name">Atlas</Inspector.Field></Inspector.Content></Inspector.Root>, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => <Inspector.Root aria-label="Details"><Inspector.Header title="Details" /><Inspector.Content><Inspector.Field label="Name">Atlas</Inspector.Field></Inspector.Content></Inspector.Root>, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => <Inspector.Root aria-label="Details"><Inspector.Header title="Details" /><Inspector.Content><Inspector.Field label="Name">Atlas</Inspector.Field></Inspector.Content></Inspector.Root>, parameters: { globals: { forcedColors: 'active' } } };
export const WithSection: Story = { render: () => <Inspector.Root aria-label="Details"><Inspector.Header title="Details" /><Inspector.Content><Inspector.Section title="General"><Inspector.Field label="Name">Atlas</Inspector.Field></Inspector.Section></Inspector.Content></Inspector.Root> };
/* SURF-38: the inspector inside a shell — docked (wide), floating
   (expanded/medium) and the compact bottom Sheet, all driven by the same
   InspectorToggle. Closed by default (no SSR flash). */
const fields = (
  <>
    <Inspector.Header title="Details" />
    <Inspector.Content>
      <Inspector.Section title="General" defaultOpen>
        <Inspector.Field label="Name">Atlas</Inspector.Field>
        <Inspector.Field label="Owner">Platform</Inspector.Field>
      </Inspector.Section>
    </Inspector.Content>
  </>
);
export const InShell: Story = {
  render: () => (
    <AppShell.Root defaultInspector="closed">
      <TopBar.Root>
        <TopBar.Title>Projects</TopBar.Title>
        <TopBar.Trailing>
          <AppShell.InspectorToggle />
        </TopBar.Trailing>
      </TopBar.Root>
      <AppShell.Main>
        <p>Select a project to inspect it.</p>
      </AppShell.Main>
      {/* Inspector.Root auto-mounts the compact bottom Sheet with the same children. */}
      <Inspector.Root aria-label="Details">{fields}</Inspector.Root>
    </AppShell.Root>
  ),
  // The shell's container queries follow its own width; no canvas padding.
  parameters: { layout: 'fullscreen' },
};
/* SURF-38: the compact layout renders the inspector as the bottom Sheet. */
export const CompactSheet: Story = {
  render: () => (
    <AppShell.Root layout="mobile" defaultInspector="open">
      <AppShell.Main>
        <p>Select a project to inspect it.</p>
      </AppShell.Main>
      <Inspector.Sheet aria-label="Details">{fields}</Inspector.Sheet>
    </AppShell.Root>
  ),
  parameters: { layout: 'fullscreen' },
};
