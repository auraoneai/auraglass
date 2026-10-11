import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tour } from '../../../src/components/tour';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Tour',
  component: Tour.Root,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Tour', kind: 'component' } },
 args: { steps: [{ target: '#t1', title: 'Step', description: 'd' }] } } satisfies Meta<typeof Tour.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Tour', id: 'core-tour--default' } },
  render: () => (
    <Tour.Root defaultOpen steps={[{ target: 'body', title: 'Welcome', description: 'Step one' }]} />
  ),
};
function StartTourDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button id="tour-start" type="button" onClick={() => setOpen(true)}>
        Start tour
      </button>
      <p id="tour-second">The second step anchors here.</p>
      <Tour.Root
        open={open}
        onOpenChange={(next) => setOpen(next)}
        steps={[
          { target: '#tour-start', title: 'Welcome', description: 'This tour explains the button.' },
          { target: '#tour-second', title: 'Second step', description: 'Use Back to return or Done to finish.' },
        ]}
      />
    </div>
  );
}
/* REQ-CMP-128 / CMP-359: opener-driven tour used by tests/a11y/apg/cmp/tour.apg.spec.ts. */
export const StartTour: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Tour', id: 'core-tour--start-tour' } },
  render: () => <StartTourDemo />,
};
