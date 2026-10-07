/* CMP-241 (REQ-CMP-95): RightPanel, LeftPanelRTL, BottomDetents,
   ActionPreset, NonModalInspector, FullHeight — open by default, ids
   overlays-sheet--*. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Sheet } from './index';
import { AuraGlassProvider } from '../../theme';
import type { StoryAgParameters } from '../../contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Sheet',
  component: Sheet.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Sheet', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Sheet.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const Demo = ({ root = {}, children }: { root?: Record<string, unknown>; children?: React.ReactNode }) => (
  <AuraGlassProvider>
    <Sheet.Root defaultOpen {...root}>
      <Sheet.Portal>
        <Sheet.Backdrop />
        <Sheet.Popup>
          <Sheet.Handle />
          <Sheet.Header><Sheet.Title>Sheet</Sheet.Title></Sheet.Header>
          <Sheet.Body>{children ?? 'Sheet content'}</Sheet.Body>
          <Sheet.Footer><Sheet.Close>Close</Sheet.Close></Sheet.Footer>
        </Sheet.Popup>
      </Sheet.Portal>
    </Sheet.Root>
  </AuraGlassProvider>
);

export const RightPanel: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Sheet', id: 'overlays-sheet--right-panel' } },
  render: () => <Demo root={{ side: 'end' }}>Right-edge panel sheet.</Demo>,
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
      <input placeholder="page input stays interactive" />
      <Sheet.Root defaultOpen side="end" modal={false}>
        <Sheet.Portal>
          <Sheet.Popup size="sm">
            <Sheet.Header><Sheet.Title>Inspector</Sheet.Title></Sheet.Header>
            <Sheet.Body>Non-modal: page remains interactive; Tab can leave.</Sheet.Body>
            <Sheet.Close>Close</Sheet.Close>
          </Sheet.Popup>
        </Sheet.Portal>
      </Sheet.Root>
    </AuraGlassProvider>
  ),
};
export const FullHeight: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Sheet', id: 'overlays-sheet--full-height' } },
  render: () => <Demo root={{ side: 'bottom', detents: ['full'] }}>At the full detent: data-ag-full-height.</Demo>,
};
