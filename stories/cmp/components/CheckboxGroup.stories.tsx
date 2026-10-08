import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CheckboxGroup } from '../../../src/components/checkbox';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'CheckboxGroup', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof CheckboxGroup>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  render: () => (
    <CheckboxGroup defaultValue={['a']}>
      <input type="checkbox" aria-label="a" defaultChecked />
      <input type="checkbox" aria-label="b" />
    </CheckboxGroup>
  ),
};
