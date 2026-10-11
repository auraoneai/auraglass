/* CMP-241 (REQ-CMP-95): RightPanel, LeftPanelRTL, BottomDetents,
   ActionPreset, NonModalInspector, FullHeight — open by default, ids
   overlays-sheet--*. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Sheet } from '../../../src/components/sheet';
import { Button } from '../../../src/components/button';
import { AuraGlassProvider } from '../../../src/theme';
import { OverlayStage } from '../overlays/OverlayStage';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Sheet',
  component: Sheet.Root,
  tags: ['certified', 'flagship'],
  parameters: { layout: 'fullscreen', ag: { tier: 'standard', subject: 'Sheet', kind: 'component' } },
} satisfies Meta<typeof Sheet.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const Demo = ({ root = {}, title = 'Details', children }: { root?: Record<string, unknown>; title?: string; children?: React.ReactNode }) => (
  <AuraGlassProvider>
    <OverlayStage title="Launch checklist" subtitle="Acme · 3 open items" />
    <Sheet.Root defaultOpen {...root}>
      <Sheet.Portal>
        <Sheet.Backdrop />
        <Sheet.Popup>
          <Sheet.Handle />
          <Sheet.Header>
            <Sheet.Title>{title}</Sheet.Title>
            <Sheet.Description>Launch checklist · updated 2h ago</Sheet.Description>
          </Sheet.Header>
          <Sheet.Body><p>{children ?? 'Sheet content'}</p></Sheet.Body>
          <Sheet.Footer><Sheet.Close>Close</Sheet.Close></Sheet.Footer>
        </Sheet.Popup>
      </Sheet.Portal>
    </Sheet.Root>
  </AuraGlassProvider>
);

export const RightPanel: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Sheet', id: 'overlays-sheet--right-panel' } },
  render: () => <Demo root={{ side: 'end' }}>Right-edge panel sheet (side="end" in LTR).</Demo>,
};
export const LeftPanelRTL: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Sheet', id: 'overlays-sheet--left-panel-rtl' } },
  render: () => <Demo root={{ side: 'start' }}>Start side (flips under RTL).</Demo>,
};
export const BottomDetents: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Sheet', id: 'overlays-sheet--bottom-detents' } },
  render: () => <Demo root={{ side: 'bottom', detents: [0.5, 'full'] }}>Drag the handle: half → full.</Demo>,
};
export const ActionPreset: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Sheet', id: 'overlays-sheet--action-preset' } },
  render: () => (
    <AuraGlassProvider>
      <OverlayStage title="Photo library" subtitle="1 item selected" />
      <Sheet.Root defaultOpen preset="action">
        <Sheet.Portal>
          <Sheet.Backdrop />
          <Sheet.Popup>
            <Sheet.Handle />
            <Sheet.Body>
              <Sheet.Action>Save to Photos</Sheet.Action>
              <Sheet.Action>Share…</Sheet.Action>
            </Sheet.Body>
            <Sheet.Close>Cancel</Sheet.Close>
          </Sheet.Popup>
        </Sheet.Portal>
      </Sheet.Root>
    </AuraGlassProvider>
  ),
};
export const NonModalInspector: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Sheet', id: 'overlays-sheet--non-modal-inspector' } },
  render: () => (
    <AuraGlassProvider>
      <OverlayStage title="Canvas" subtitle="Select a layer to inspect">
        <input
          aria-label="Search layers"
          placeholder="page input stays interactive"
          style={{
            boxSizing: 'border-box', minBlockSize: 'var(--ag-space-8)', padding: '0 var(--ag-space-3)',
            border: '1px solid color-mix(in oklab, var(--ag-color-border) 40%, transparent)',
            borderRadius: 'var(--ag-radius-sm)', background: 'transparent', color: 'inherit', font: 'inherit',
          }}
        />
      </OverlayStage>
      <Sheet.Root defaultOpen side="end" modal={false}>
        <Sheet.Portal>
          <Sheet.Popup size="sm">
            <Sheet.Header><Sheet.Title>Inspector</Sheet.Title></Sheet.Header>
            <Sheet.Body><p>Non-modal: page remains interactive; Tab can leave.</p></Sheet.Body>
            <Sheet.Close>Close</Sheet.Close>
          </Sheet.Popup>
        </Sheet.Portal>
      </Sheet.Root>
    </AuraGlassProvider>
  ),
};
export const FullHeight: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Sheet', id: 'overlays-sheet--full-height' } },
  render: () => <Demo root={{ side: 'bottom', detents: ['full'] }}>At the full detent: data-ag-appearance="full-height".</Demo>,
};

/* Every Sheet part: Trigger and Description alongside the default layout. */
export const Anatomy: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Sheet', id: 'overlays-sheet--anatomy' } },
  render: () => (
    <AuraGlassProvider>
      <Sheet.Root defaultOpen>
        <OverlayStage title="Issues" subtitle="24 open">
          <Sheet.Trigger render={<Button />}>Open filters</Sheet.Trigger>
        </OverlayStage>
        <Sheet.Portal>
          <Sheet.Backdrop />
          <Sheet.Popup>
            <Sheet.Handle />
            <Sheet.Header>
              <Sheet.Title>Filters</Sheet.Title>
              <Sheet.Description>Narrow the list by status and owner.</Sheet.Description>
            </Sheet.Header>
            <Sheet.Body><p>Filter controls</p></Sheet.Body>
            <Sheet.Footer><Sheet.Close>Done</Sheet.Close></Sheet.Footer>
          </Sheet.Popup>
        </Sheet.Portal>
      </Sheet.Root>
    </AuraGlassProvider>
  ),
};
