import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../../../src/icons';
import type { StoryAgParameters } from '../../../src/contracts/testing';

/* REQ-CMP-17: Icon is rsc:'server'; this story gives the SSR/hydration
   contract (tests/ssr/cmp/ssr.test.tsx) a real Icon tree to hydrate —
   one decorative glyph and one labelled (role="img") glyph. */
const sbMeta = {
  title: 'Core/Icon',
  component: Icon,
  parameters: { ag: { tier: 'standard', subject: 'Icon', kind: 'component' } },
} satisfies Meta<typeof Icon>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  args: { name: 'search' },
  parameters: { ag: { tier: 'standard', subject: 'Icon', id: 'core-icon--default' } },
  render: () => (
    <span>
      <Icon name="search" />
      <Icon name="settings" aria-label="Settings" />
    </span>
  ),
};
