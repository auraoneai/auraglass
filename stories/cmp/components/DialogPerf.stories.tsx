/* CMP-223: perf scene — Dialog over six standard page surfaces (successor of
   the 4.x dashboard perf fixture). */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Dialog } from '../../../src/components/dialog';
import { AuraGlassProvider } from '../../../src/theme';

/* A perf fixture (tests/perf/browser/cmp/overlays-*), not a documentation story: no parameters.ag, tagged no-cert,
   and not a Flagships title (the Dialog flagship title is Dialog.stories.tsx + DialogScenes.stories.tsx). */
const sbMeta = {
  title: 'CMP/Fixtures/Dialog Perf',
  tags: ['no-cert'],
} satisfies Meta;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const Surface = ({ label }: { label: string }) => (
  <div data-ag-surface="content" style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>{label}</div>
);

export const DialogOverDashboard: Story = {
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
      {/* REQ-CMP-90: trigger-driven so the perf spec measures click→paint
          open_ms under 4x CPU throttle. */}
      <Dialog.Root>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header><Dialog.Title>Perf subject</Dialog.Title></Dialog.Header>
          <Dialog.Body>Dialog over six content surfaces.</Dialog.Body>
          <Dialog.Footer><Dialog.Close>Close</Dialog.Close></Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </AuraGlassProvider>
  ),
};
