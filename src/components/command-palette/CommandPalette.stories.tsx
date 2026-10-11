// CommandPalette.stories.tsx — SURF story contract (S-41): subject = ComponentMeta name,
// kind 'component'; Default + state stories cover the meta's declared states.
//
// Every story renders the palette over a page: a full-viewport stage (so the
// preview Environment's scene paints edge to edge) with an opaque
// content-raised window on it. The palette popup is the only glass layer.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CommandPalette } from './CommandPalette';
import { Command } from './Command';
import { Surface } from '../../root/mat';

const meta: Meta = {
  title: 'surf/command-palette',
  component: CommandPalette,
  parameters: { layout: 'fullscreen', ag: { subject: 'CommandPalette', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

const stage: React.CSSProperties = {
  boxSizing: 'border-box',
  minBlockSize: '100dvh',
  display: 'grid',
  placeItems: 'center',
  padding: 'var(--ag-space-8) var(--ag-space-4)',
  fontFamily: 'var(--ag-font-sans)',
  fontSize: 'var(--ag-type-body-size)',
  lineHeight: 'var(--ag-type-body-leading)',
};
const windowStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  inlineSize: 'min(608px, 100%)',
  display: 'grid',
  gap: 'var(--ag-space-3)',
  padding: 'var(--ag-space-5)',
  borderRadius: 'var(--ag-radius-xl)',
};
const muted: React.CSSProperties = {
  margin: 0,
  color: 'var(--ag-on-surface-muted, var(--ag-color-on-surface-muted))',
  fontSize: 'var(--ag-type-callout-size)',
};
const row: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 'var(--ag-space-3)',
  paddingBlock: 'var(--ag-space-3)',
  borderBlockStart: '1px solid color-mix(in oklab, var(--ag-color-border) 22%, transparent)',
};

/** The page the palette opens over. */
function Page({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div style={stage}>
      <Surface layer="content" content="content-raised" style={windowStyle}>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 'var(--ag-type-title-3-size)',
              fontWeight: 'var(--ag-type-title-3-weight)' as React.CSSProperties['fontWeight'],
              lineHeight: 'var(--ag-type-title-3-leading)',
            }}
          >
            Acme workspace
          </h2>
          <p style={muted}>Press ⌘K to run a command</p>
        </div>
        <div>
          {[['Launch checklist', 'Updated 2h ago'], ['Design review notes', 'Shared with 4 people'], ['Q3 roadmap', 'Draft']].map(([label, metaText]) => (
            <div key={label} style={row}>
              <span>{label}</span>
              <span style={muted}>{metaText}</span>
            </div>
          ))}
        </div>
      </Surface>
      {children}
    </div>
  );
}

/** A realistic command set: groups, shortcuts, a separator. */
function Commands(): React.ReactElement {
  return (
    <Command.Root>
      <Command.Input placeholder="Search commands and documents…" />
      <Command.List>
        <Command.Group heading="Suggestions">
          <Command.Item value="new-document" keywords={['create', 'file']} shortcut="⌘N">New document</Command.Item>
          <Command.Item value="invite" keywords={['share', 'member']}>Invite teammate…</Command.Item>
          <Command.Item value="search" keywords={['find']} shortcut="⌘F">Search in workspace</Command.Item>
        </Command.Group>
        <Command.Separator />
        <Command.Group heading="Navigate">
          <Command.Item value="go-home" shortcut="G H">Go to Home</Command.Item>
          <Command.Item value="go-settings" shortcut="G S">Go to Settings</Command.Item>
          <Command.Item value="archive" disabled>Open archive (no access)</Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Root>
  );
}

const palette = (
  <Page>
    <CommandPalette defaultOpen>
      <Commands />
    </CommandPalette>
  </Page>
);

export const Default: Story = { render: () => palette };
export const RTL: Story = { render: () => palette, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => palette, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => palette, parameters: { globals: { forcedColors: 'active' } } };
export const Anatomy: Story = {
  render: () => (
    <Page>
      <CommandPalette defaultOpen>
        <Command.Root>
          <Command.Input placeholder="Search commands and documents…" />
          <Command.List>
            <Command.Group heading="Navigate">
              <Command.Item value="home" shortcut="G H">Go to Home</Command.Item>
            </Command.Group>
            <Command.Separator />
            <Command.Loading>Loading recent documents…</Command.Loading>
          </Command.List>
        </Command.Root>
      </CommandPalette>
    </Page>
  ),
};
export const Empty: Story = {
  render: () => (
    <Page>
      <CommandPalette defaultOpen>
        <Command.Root>
          <Command.Input placeholder="Search commands and documents…" />
          <Command.List><Command.Empty>No matching commands</Command.Empty></Command.List>
        </Command.Root>
      </CommandPalette>
    </Page>
  ),
};
