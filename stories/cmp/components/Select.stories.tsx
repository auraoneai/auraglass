import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Select } from '../../../src/components/select';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Dragonfruit', 'Elderberry'];

function FruitSelect(props: Record<string, unknown>) {
  return (
    <Select.Root {...props}>
      <Select.Trigger placeholder="Pick a fruit" />
      <Select.Content>
        <Select.Group>
          <Select.GroupLabel>Fruits</Select.GroupLabel>
          {FRUITS.map((f) => (
            <Select.Item key={f} value={f.toLowerCase()} label={f} />
          ))}
        </Select.Group>
        <Select.Separator />
        <Select.Item value="other" label="Other" />
      </Select.Content>
    </Select.Root>
  );
}

const sbMeta = {
  title: 'Flagships/Controls/Select',
  component: Select.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Select', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Select.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Overview: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
      <p style={{ margin: 0 }}>Choose a fruit to pair with your order.</p>
      <FruitSelect />
    </div>
  ),
};

export const Default: Story = {
  render: () => (
    <AuraGlassProvider>
      <FruitSelect defaultOpen />
    </AuraGlassProvider>
  ),
};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ width: 32 }}>{size}</span>
          <FruitSelect size={size} />
          <FruitSelect size={size} disabled />
        </div>
      ))}
    </div>
  ),
};

export const Density: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <FruitSelect key={size} size={size} />
      ))}
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <span>Country</span>
      <FruitSelect />
      <span>Time zone</span>
      <FruitSelect />
    </div>
  ),
};

export const Keyboard: Story = {
  render: () => <FruitSelect />,
};

export const Preferences: Story = {
  render: () => <FruitSelect defaultValue="banana" items={{ apple: 'Apple', banana: 'Banana' }} />,
};
