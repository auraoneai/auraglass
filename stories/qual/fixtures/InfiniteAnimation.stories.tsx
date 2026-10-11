/* QUAL negative fixture (G-18, REQ-QUAL-23): an element whose animation
   never ends. The motion lane's settled-idle check
   (certification/lanes/motion.spec.ts) must reject it: an infinite
   animation on a property other than transform/opacity is never allowed,
   and the subject is not indeterminate progress. Tagged no-cert. */
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'QUAL/Fixtures/Infinite Animation',
  tags: ['no-cert'],
  parameters: { ag: { subject: 'fixture:infinite-animation', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta;
export default meta;

const css = `
@keyframes qual-fixture-pulse { from { background-color: #1d4ed8; } to { background-color: #9333ea; } }
.qual-fixture-pulse { inline-size: 160px; block-size: 48px; border-radius: 12px;
  animation: qual-fixture-pulse 800ms ease-in-out infinite alternate; }
`;

export const Pulse: StoryObj<typeof meta> = {
  render: () => (
    <>
      <style>{css}</style>
      <div className="qual-fixture-pulse" data-ag-part="root" role="img" aria-label="Pulsing badge" />
    </>
  ),
};
