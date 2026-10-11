/* QUAL negative fixture (G-18, REQ-QUAL-21): a render that reads Date.now(),
   so the server HTML and the hydrating client disagree. The SSR lane
   (certification/lanes/ssr-hydration.spec.ts) must report a hydration
   violation for it in every engine. Tagged no-cert: never a certification
   subject; addressed by id as a negative control only. */
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'QUAL/Fixtures/Hydration Mismatch',
  tags: ['no-cert'],
  parameters: { ag: { subject: 'fixture:hydration-mismatch', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta;
export default meta;

export const DateNow: StoryObj<typeof meta> = {
  render: () => (
    <p data-ag-part="body">
      Rendered at <time data-ag-part="clock">{String(Date.now())}</time>
    </p>
  ),
};
