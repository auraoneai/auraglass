/* CMP-222 (REQ-CMP-01): Dialog scenes — Default, LongContent, Sizes (args),
   Nested, NonModal, PaletteShell. ids overlays-dialog--*. Scenes that compose
   other components (Form, WithPopover, WithPopoverMenu, WithToastViewport) live
   in DialogScenes.stories.tsx so these stories render only Dialog parts. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Dialog } from '../../../src/components/dialog';
import { Button } from '../../../src/components/button';
import { AuraGlassProvider } from '../../../src/theme';
import { OverlayStage } from '../overlays/OverlayStage';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Dialog',
  component: Dialog.Root,
  tags: ['certified', 'flagship'],
  parameters: { layout: 'fullscreen', ag: { tier: 'standard', subject: 'Dialog', kind: 'component' } },
} satisfies Meta<typeof Dialog.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* Every scene renders over the shared stage: a content window on the scene
   backdrop, so the scrim and the dialog glass have real UI behind them. */
/* a plain page field (Dialog stories render only Dialog parts; composed
   controls live in Dialog Scenes) */
const pageInput: React.CSSProperties = {
  boxSizing: 'border-box', minBlockSize: 'var(--ag-space-8)', padding: '0 var(--ag-space-3)',
  border: '1px solid color-mix(in oklab, var(--ag-color-border) 40%, transparent)',
  borderRadius: 'var(--ag-radius-sm)', background: 'transparent', color: 'inherit', font: 'inherit',
  fontSize: 'var(--ag-type-callout-size)',
};

const Shell = ({ children, toolbar }: { children: React.ReactNode; toolbar?: React.ReactNode }) => (
  <AuraGlassProvider>
    <OverlayStage title="Project settings" subtitle="Acme · Production">{toolbar}</OverlayStage>
    {children}
  </AuraGlassProvider>
);

export const Playground: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--default' } },
  render: () => (
    <AuraGlassProvider>
      <Dialog.Root defaultOpen>
        <OverlayStage title="Project settings" subtitle="Acme · Production">
          <Dialog.Trigger render={<Button />}>Rename project</Dialog.Trigger>
        </OverlayStage>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup size="sm">
            <Dialog.Close />
            <Dialog.Header>
              <Dialog.Title>Rename project</Dialog.Title>
              <Dialog.Description>A regular dialog over a blurred scrim.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <p>Links and integrations keep working; only the display name changes. Forms inside a dialog live in Dialog Scenes › Form.</p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close>Cancel</Dialog.Close>
              <Dialog.Close prominent>Save</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </AuraGlassProvider>
  ),
};

export const LongContent: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--long-content' } },
  render: () => (
    <Shell>
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <Dialog.Header>
              <Dialog.Title>Terms of service</Dialog.Title>
              <Dialog.Description>Header and footer stay pinned; the body scrolls.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              {Array.from({ length: 24 }, (_, i) => (
                <p key={i}>{i + 1}. Each section of the agreement is a paragraph long enough to wrap onto a second line in the dialog body.</p>
              ))}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close>Decline</Dialog.Close>
              <Dialog.Close prominent>Accept</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </Shell>
  ),
};

export const Sizes: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--sizes' } },
  render: () => (
    <Shell>
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup size="md">
            <Dialog.Header>
              <Dialog.Title>Medium dialog</Dialog.Title>
              <Dialog.Description>Sizes axis: sm / md / lg; the old xl / full sizes are appearance wide / fullscreen — this cell md.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <p>Medium is the default width (560px) for forms and confirmations with a short explanation.</p>
            </Dialog.Body>
            <Dialog.Footer><Dialog.Close prominent>Done</Dialog.Close></Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </Shell>
  ),
};


export const Nested: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--nested' } },
  render: () => (
    <Shell>
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup aria-label="outer dialog">
            <Dialog.Header>
              <Dialog.Title>Outer</Dialog.Title>
              <Dialog.Description>Dims while the inner dialog is open.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <Dialog.Root defaultOpen>
                <Dialog.Portal>
                  <Dialog.Backdrop />
                  <Dialog.Popup aria-label="inner dialog" size="sm">
                    <Dialog.Header><Dialog.Title>Inner</Dialog.Title></Dialog.Header>
                    <Dialog.Body><p>Nested dialog content.</p></Dialog.Body>
                    <Dialog.Footer><Dialog.Close prominent>Close</Dialog.Close></Dialog.Footer>
                  </Dialog.Popup>
                </Dialog.Portal>
              </Dialog.Root>
            </Dialog.Body>
            <Dialog.Footer><Dialog.Close>Close outer</Dialog.Close></Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </Shell>
  ),
};



export const NonModal: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--non-modal' } },
  render: () => (
    <Shell toolbar={<input aria-label="Search" placeholder="page input stays interactive" style={pageInput} />}>
      <Dialog.Root defaultOpen modal={false}>
        <Dialog.Portal>
          <Dialog.Popup size="md">
            <Dialog.Header>
              <Dialog.Title>Non-modal</Dialog.Title>
              <Dialog.Description>No scrim; the page stays interactive.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Footer><Dialog.Close prominent>Close</Dialog.Close></Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
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
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup placement="top" size="lg" initialFocus={inputRef} aria-label="Command palette">
              <Dialog.Body padding="none">
                <input
                  ref={inputRef}
                  aria-label="Command"
                  placeholder="Type a command…"
                  style={{
                    boxSizing: 'border-box', inlineSize: '100%', padding: 'var(--ag-space-4) var(--ag-space-5)',
                    border: 0, background: 'transparent', color: 'inherit', outline: 'none',
                    font: 'inherit', fontSize: 'var(--ag-type-body-size)',
                  }}
                />
              </Dialog.Body>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </Shell>
    );
  },
};
