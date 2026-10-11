import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { DismissableLayer } from '../../../src/primitives/DismissableLayer';
import { Dialog } from '../../../src/components/dialog';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'Foundation/DismissableLayer',
  component: DismissableLayer,
  tags: ['core'],
  parameters: { ag: { subject: 'DismissableLayer', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof DismissableLayer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DismissableLayer onDismiss={() => {}}>
      <div style={{ padding: 8 }}>Layer content</div>
    </DismissableLayer>
  ),
};
export const States: Story = {
  render: () => (
    <DismissableLayer disabled onDismiss={() => {}}>
      <div style={{ padding: 8 }}>Disabled layer</div>
    </DismissableLayer>
  ),
};
export const ForcedColors: Story = {
  render: () => (
    <DismissableLayer onDismiss={() => {}}>
      <div style={{ padding: 8 }}>Layer</div>
    </DismissableLayer>
  ),
};
export const RTL: Story = {
  render: () => (
    <DismissableLayer onDismiss={() => {}}>
      <div style={{ padding: 8 }} dir="rtl">Layer</div>
    </DismissableLayer>
  ),
};

/* CMP-347: two stacked layers — Escape dismisses only the top layer and the
   primitive's unmount cleanup returns focus to the element that was focused
   when the inner layer mounted (the "Open inner" button inside the outer). */
export const Stacked: Story = {
  parameters: { ag: { subject: 'DismissableLayer', id: 'foundation-dismissable-layer--stacked' } },
  render: function StackedScene() {
    const [outerOpen, setOuterOpen] = React.useState(false);
    const [innerOpen, setInnerOpen] = React.useState(false);
    return (
      <div>
        <button type="button" onClick={() => setOuterOpen(true)}>Open outer</button>
        {outerOpen ? (
          <DismissableLayer
            data-ag-part="layer"
            aria-label="outer layer"
            onDismiss={() => setOuterOpen(false)}
            style={{ padding: 12, border: '1px solid', marginTop: 8, display: 'grid', gap: 8 }}
          >
            <div>Outer layer</div>
            <button type="button" onClick={() => setInnerOpen(true)}>Open inner</button>
            <button type="button" onClick={() => setOuterOpen(false)}>Close outer</button>
            {innerOpen ? (
              <DismissableLayer
                data-ag-part="layer"
                aria-label="inner layer"
                onDismiss={() => setInnerOpen(false)}
                style={{ padding: 12, border: '1px dashed', display: 'grid', gap: 8 }}
              >
                <div>Inner layer</div>
                <button type="button" onClick={() => setInnerOpen(false)}>Close inner</button>
              </DismissableLayer>
            ) : null}
          </DismissableLayer>
        ) : null}
      </div>
    );
  },
};

/* REQ-CMP-12: mixed stack — a BU-backed Dialog with a DismissableLayer pushed
   above it. Escape routes through the LayerStack's single dispatcher: the
   first closes only the primitive layer, the second closes the dialog. */
export const MixedDialog: Story = {
  parameters: { ag: { subject: 'DismissableLayer', id: 'foundation-dismissable-layer--mixed-dialog' } },
  render: function MixedDialogScene() {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [layerOpen, setLayerOpen] = React.useState(false);
    return (
      <div>
        <button type="button" onClick={() => setDialogOpen(true)}>Open dialog</button>
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Portal>
            <Dialog.Popup aria-label="mixed dialog" style={{ padding: 16 }}>
              <button type="button" onClick={() => setLayerOpen(true)}>Open layer</button>
              {layerOpen ? (
                <DismissableLayer
                  data-ag-part="layer"
                  aria-label="mixed layer"
                  onDismiss={() => setLayerOpen(false)}
                  style={{ padding: 12, border: '1px dashed', marginTop: 8 }}
                >
                  <div>Primitive layer</div>
                </DismissableLayer>
              ) : null}
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    );
  },
};
