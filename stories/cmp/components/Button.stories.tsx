import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button } from '../../../src/components/button';
import meta from '../../../src/components/button/Button.meta';

const sbMeta = {
  title: 'Flagships/Controls/Button',
  component: Button,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'Certified', subject: 'Button', kind: 'component' } },
  argTypes: Object.fromEntries(
    Object.entries(meta.variants).map(([axis, values]) => [
      axis,
      { control: 'select', options: [...values] },
    ]),
  ),
} satisfies Meta<typeof Button>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  args: { children: 'Save changes', startIcon: <svg width="14" height="14" aria-hidden="true" /> },
};

export const Overview: Story = {
  args: { children: 'Save changes' },
};

const SIZES = ['sm', 'md', 'lg'] as const;
const STATES: Array<{ label: string; props: Record<string, unknown> }> = [
  { label: 'default', props: {} },
  { label: 'pressed', props: { defaultPressed: true } },
  { label: 'disabled', props: { disabled: true } },
  { label: 'loading', props: { loading: true } },
];

const VARIANTS = meta.variants.variant as readonly string[];

export const Matrix: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      {VARIANTS.map((v) => (
        <div key={v}>
          <div>{v}</div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {SIZES.map((s) =>
              STATES.map((st) => (
                <Button key={`${s}-${st.label}`} variant={v as 'regular'} size={s} {...st.props}>
                  {`${s} ${st.label}`}
                </Button>
              )),
            )}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Density: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
      {SIZES.map((s) => (
        <Button key={s} size={s}>
          {s}
        </Button>
      ))}
    </div>
  ),
};

export const Keyboard: Story = {
  tags: ['apg'],
  render: () => <Button>Press me</Button>,
  play: async () => {
    const { userEvent } = await import('storybook/test');
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{Enter}');
  },
};

export const InContext: Story = {
  render: () => (
    <div role="toolbar" aria-label="Top bar" style={{ display: 'flex', gap: '8px' }}>
      <Button prominent>Save changes</Button>
      <Button variant="identity">Discard</Button>
      <Button intent="danger">Delete project</Button>
    </div>
  ),
};

export const Preferences: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button pointerLight>Pointer light</Button>
      <Button variant="clear">Clear</Button>
    </div>
  ),
};
