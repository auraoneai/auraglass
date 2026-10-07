/* CMP-223: perf scene — Dialog over six standard page surfaces (successor of
   the 4.x dashboard perf fixture). */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Dialog } from './index';
import { AuraGlassProvider } from '../../theme';
import type { StoryAgParameters } from '../../contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/DialogPerf',
  component: Dialog.Root,
  parameters: { ag: { tier: 'standard', subject: 'Dialog', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Dialog.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const Surface = ({ label }: { label: string }) => (
  <div data-ag-surface="content" style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>{label}</div>
);

export const DialogOverDashboard: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--perf-dashboard' } },
  render: () => (
    <AuraGlassProvider>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 12 }}>
        <Surface label="TopBar" />
        <Surface label="Sidebar" />
        <Surface label="Card 1" />
        <Surface label="Card 2" />
        <Surface label="Card 3" />
        <Surface label="Card 4" />
      </div>
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <Dialog.Header><Dialog.Title>Perf subject</Dialog.Title></Dialog.Header>
            <Dialog.Body>Dialog over six content surfaces.</Dialog.Body>
            <Dialog.Footer><Dialog.Close>Close</Dialog.Close></Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </AuraGlassProvider>
  ),
};
