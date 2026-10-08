import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Combobox } from '../../../src/components/combobox';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const ASSIGNEES = ['Ada Lovelace', 'Grace Hopper', 'Edsger Dijkstra'];
const LABELS = ['glass', 'tokens', 'a11y', 'docs'];

function Items({ values }: { values: string[] }) {
  return (
    <>
      <Combobox.Group>
        <Combobox.GroupLabel>Options</Combobox.GroupLabel>
        {values.map((v) => (
          <Combobox.Item key={v} value={v}>
            {v}
          </Combobox.Item>
        ))}
      </Combobox.Group>
      <Combobox.Empty />
    </>
  );
}

const sbMeta = {
  title: 'Flagships/Controls/Combobox',
  component: Combobox.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Combobox', kind: 'component' } },
} satisfies Meta<typeof Combobox.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Overview: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 340 }}>
      <p style={{ margin: 0 }}>Assign an owner for this review.</p>
      <Combobox.Root items={ASSIGNEES}>
        <Combobox.Input placeholder="Assignee" />
        <Combobox.Content>
          <Items values={ASSIGNEES} />
        </Combobox.Content>
      </Combobox.Root>
    </div>
  ),
};

export const Default: Story = {
  render: () => (
    <AuraGlassProvider>
      <Combobox.Root items={ASSIGNEES} defaultOpen>
        <Combobox.Input placeholder="Assignee" />
        <Combobox.Content>
          <Items values={ASSIGNEES} />
        </Combobox.Content>
      </Combobox.Root>
    </AuraGlassProvider>
  ),
};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Combobox.Root key={size} items={ASSIGNEES} size={size}>
          <Combobox.Input placeholder={size} />
          <Combobox.Content>
            <Items values={ASSIGNEES} />
          </Combobox.Content>
        </Combobox.Root>
      ))}
    </div>
  ),
};

export const Density: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Combobox.Root key={size} items={ASSIGNEES} size={size}>
          <Combobox.Input placeholder={`Density ${size}`} />
          <Combobox.Content>
            <Items values={ASSIGNEES} />
          </Combobox.Content>
        </Combobox.Root>
      ))}
    </div>
  ),
};

export const Keyboard: Story = {
  render: () => (
    <Combobox.Root items={ASSIGNEES}>
      <Combobox.Input placeholder="Type to filter" />
      <Combobox.Content>
        <Items values={ASSIGNEES} />
      </Combobox.Content>
    </Combobox.Root>
  ),
};

export const InContext: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 380 }}>
      <span>Assignee</span>
      <Combobox.Root items={ASSIGNEES}>
        <Combobox.Input placeholder="Search people" />
        <Combobox.Content>
          <Items values={ASSIGNEES} />
        </Combobox.Content>
      </Combobox.Root>
      <span>Labels</span>
      <Combobox.Root items={LABELS} multiple defaultValue={['glass', 'a11y']}>
        <Combobox.Chips>
          <Combobox.Chip>glass</Combobox.Chip>
          <Combobox.Chip>a11y</Combobox.Chip>
        </Combobox.Chips>
        <Combobox.Input placeholder="Labels" />
        <Combobox.Content>
          <Items values={LABELS} />
        </Combobox.Content>
      </Combobox.Root>
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <AuraGlassProvider>
      <Combobox.Root items={[]} defaultOpen>
        <Combobox.Input placeholder="Search" />
        <Combobox.Content>
          <Items values={[]} />
        </Combobox.Content>
      </Combobox.Root>
    </AuraGlassProvider>
  ),
};

export const Loading: Story = {
  render: () => (
    <AuraGlassProvider>
      <Combobox.Root items={[]} loading defaultOpen>
        <Combobox.Input placeholder="Searching people" />
        <Combobox.Content>
          <Combobox.Loading />
        </Combobox.Content>
      </Combobox.Root>
    </AuraGlassProvider>
  ),
};

export const Creatable: Story = {
  render: () => (
    <AuraGlassProvider>
      <Combobox.Root items={LABELS} creatable defaultInputValue="new-tag" defaultOpen>
        <Combobox.Input placeholder="Add label" />
        <Combobox.Content>
          <Items values={LABELS} />
        </Combobox.Content>
      </Combobox.Root>
    </AuraGlassProvider>
  ),
};

export const RTL: Story = {
  render: () => (
    <div dir="rtl">
      <Combobox.Root items={LABELS} multiple defaultValue={['glass']}>
        <Combobox.Chips>
          <Combobox.Chip>glass</Combobox.Chip>
        </Combobox.Chips>
        <Combobox.Input placeholder="بحث" />
        <Combobox.Content>
          <Items values={LABELS} />
        </Combobox.Content>
      </Combobox.Root>
    </div>
  ),
};
