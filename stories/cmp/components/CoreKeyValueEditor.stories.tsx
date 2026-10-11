import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { KeyValueEditor, type KeyValuePair } from '../../../src/components/key-value-editor';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'Core/KeyValueEditor',
  component: KeyValueEditor,
  tags: ['core'],
  parameters: { ag: { subject: 'KeyValueEditor', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof KeyValueEditor>;
export default meta;
type Story = StoryObj<typeof meta>;

function Controlled() {
  const [rows, setRows] = React.useState<KeyValuePair[]>([
    { key: 'host', value: 'api.example.com' },
    { key: 'port', value: '443' },
  ]);
  return <KeyValueEditor value={rows} onValueChange={setRows} />;
}

export const Default: Story = {
  render: () => <Controlled />,
};

export const WithDuplicateKeys: Story = {
  render: () => (
    <KeyValueEditor
      value={[
        { key: 'host', value: 'a' },
        { key: 'host', value: 'b' },
      ]}
      onValueChange={() => {}}
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <KeyValueEditor
      disabled
      value={[{ key: 'host', value: 'a' }]}
      onValueChange={() => {}}
    />
  ),
};

export const Keyboard: Story = {
  render: () => (
    <KeyValueEditor
      defaultValue={[
        { key: 'host', value: 'a' },
        { key: 'port', value: '443' },
      ]}
    />
  ),
};
