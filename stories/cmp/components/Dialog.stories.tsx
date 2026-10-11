/* CMP-222 (REQ-CMP-01): Dialog scenes — Default, LongContent, Sizes (args),
   Nested, NonModal, PaletteShell. ids overlays-dialog--*. Scenes that compose
   other components (Form, WithPopover, WithPopoverMenu, WithToastViewport) live
   in DialogScenes.stories.tsx so these stories render only Dialog parts. */
import { OverlayStage } from '../overlays/OverlayStage';
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Dialog } from '../../../src/components/dialog';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Dialog',
  component: Dialog.Root,
  tags: ['certified', 'flagship'],
  parameters: { layout: 'fullscreen', ag: { tier: 'standard', subject: 'Dialog', kind: 'component' } },
} satisfies Meta<typeof Dialog.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const Shell = ({ children }: { children: React.ReactNode }) => (
  <AuraGlassProvider><OverlayStage>{children}</OverlayStage></AuraGlassProvider>
);

export const Playground: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--default' } },
  render: () => (
    <Shell>
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header><Dialog.Title>Dialog title</Dialog.Title></Dialog.Header>
          <Dialog.Body><Dialog.Description>A regular dialog over a blurred scrim.</Dialog.Description></Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close>Cancel</Dialog.Close>
            <Dialog.Close>Save</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </Shell>
  ),
};

export const LongContent: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--long-content' } },
  render: () => (
    <Shell>
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Header><Dialog.Title>Long content</Dialog.Title></Dialog.Header>
          <Dialog.Body>
            {Array.from({ length: 24 }, (_, i) => <p key={i}>Scrollable row {i + 1}</p>)}
          </Dialog.Body>
          <Dialog.Footer><Dialog.Close>Close</Dialog.Close></Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </Shell>
  ),
};

export const Sizes: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--sizes' } },
  render: () => (
    <Shell>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Dialog.Root key={size} defaultOpen modal={false}>
            <Dialog.Content size={size} aria-label={`dialog-${size}`}>
              <Dialog.Header><Dialog.Title>{`size ${size}`}</Dialog.Title></Dialog.Header>
              <Dialog.Body>Sizes cell</Dialog.Body>
            </Dialog.Content>
        </Dialog.Root>
      ))}
      <Dialog.Root defaultOpen modal={false}>
          <Dialog.Content appearance="wide" aria-label="dialog-wide">
            <Dialog.Header><Dialog.Title>appearance wide</Dialog.Title></Dialog.Header>
            <Dialog.Body>Appearance cell</Dialog.Body>
          </Dialog.Content>
      </Dialog.Root>
    </Shell>
  ),
};


export const Nested: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--nested' } },
  render: () => (
    <Shell>
      <Dialog.Root defaultOpen>
        <Dialog.Content aria-label="outer dialog">
          <Dialog.Header><Dialog.Title>Outer</Dialog.Title></Dialog.Header>
          <Dialog.Body>
            <Dialog.Root defaultOpen>
              <Dialog.Content aria-label="inner dialog" size="sm">
                <Dialog.Header><Dialog.Title>Inner</Dialog.Title></Dialog.Header>
                <Dialog.Body>Nested dialog content.</Dialog.Body>
                <Dialog.Footer><Dialog.Close>Close</Dialog.Close></Dialog.Footer>
              </Dialog.Content>
            </Dialog.Root>
          </Dialog.Body>
          <Dialog.Footer><Dialog.Close>Close outer</Dialog.Close></Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </Shell>
  ),
};



export const NonModal: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--non-modal' } },
  render: () => (
    <Shell>
      <input placeholder="page input stays interactive" style={{ marginBottom: 12 }} />
      <Dialog.Root defaultOpen modal={false}>
        <Dialog.Content size="md" backdrop={false}>
          <Dialog.Header><Dialog.Title>Non-modal</Dialog.Title></Dialog.Header>
          <Dialog.Body>No scrim; page stays interactive.</Dialog.Body>
          <Dialog.Footer><Dialog.Close>Close</Dialog.Close></Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </Shell>
  ),
};

export const PaletteShell: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--palette-shell' } },
  render: () => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    return (
      <Shell>
        <Dialog.Root defaultOpen>
          <Dialog.Content placement="top" size="lg" initialFocus={inputRef}>
            <Dialog.Body padding="none">
              <input ref={inputRef} placeholder="Type a command…" style={{ width: '100%', padding: 12, font: 'inherit' }} />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>
      </Shell>
    );
  },
};
