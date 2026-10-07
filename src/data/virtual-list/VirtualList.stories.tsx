import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { VirtualList, type VirtualListHandle } from './VirtualList';

const meta = {
  title: 'surf/virtual-list',
  parameters: { ag: { subject: 'VirtualList', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const rows = Array.from({ length: 1000 }, (_, i) => `Row ${i + 1}`);

export const Default: Story = {
  render: () => (
    <VirtualList
      items={rows}
      getItemKey={(s) => s}
      renderItem={(s, i) => <div style={{ padding: 8 }}>{s} (#{i})</div>}
      estimateSize={() => 36}
      style={{ height: 320, border: '1px solid var(--ag-border, #ccc)' }}
      aria-label="Thousand rows"
    />
  ),
};

export const DynamicHeights: Story = {
  render: () => {
    const tall = new Set([3, 17, 42]);
    return (
      <VirtualList
        items={rows}
        getItemKey={(s) => s}
        renderItem={(s, i) => (
          <div style={{ padding: 8, minHeight: tall.has(i) ? 120 : undefined }}>{s}</div>
        )}
        estimateSize={() => 36}
        style={{ height: 320 }}
        aria-label="Dynamic heights"
      />
    );
  },
};

const AnchorEndDemo = () => {
  const [log, setLog] = React.useState(rows.slice(0, 30));
  return (
      <div>
        <button type="button" onClick={() => setLog((l) => [...l, `Row ${l.length + 1}`])}>
          Append
        </button>
    <VirtualList
      items={log}
      getItemKey={(s) => s}
      renderItem={(s) => <div style={{ padding: 4 }}>{s}</div>}
      estimateSize={() => 28}
      anchor="end"
      style={{ height: 240 }}
      aria-label="Appending log"
    />
  </div>
  );
};
export const AnchorEnd: Story = { render: () => <AnchorEndDemo /> };

export const RTL: Story = {
  globals: { dir: 'rtl' },
  render: () => (
    <VirtualList
      items={rows.slice(0, 200)}
      getItemKey={(s) => s}
      renderItem={(s) => <div style={{ padding: 8 }}>{s}</div>}
      estimateSize={() => 36}
      style={{ height: 320 }}
      aria-label="RTL rows"
    />
  ),
};

const renderDefault = () => (
  <VirtualList
    items={rows}
    getItemKey={(s) => s}
    renderItem={(s, i) => <div style={{ padding: 8 }}>{s} (#{i})</div>}
    estimateSize={() => 36}
    style={{ height: 320, border: '1px solid var(--ag-border, #ccc)' }}
    aria-label="Thousand rows"
  />
);

export const ForcedColors: Story = {
  globals: { forcedColors: 'active' },
  render: renderDefault,
};

const HandleDemoView = () => {
  const ref = React.useRef<VirtualListHandle>(null);
  return (
    <div>
      <button type="button" onClick={() => ref.current?.scrollToKey('Row 900')}>
        Jump to row 900
      </button>
      <VirtualList
        ref={ref}
        items={rows}
        getItemKey={(s) => s}
        renderItem={(s) => <div style={{ padding: 8 }}>{s}</div>}
        estimateSize={() => 36}
        style={{ height: 320 }}
        aria-label="Handle demo"
      />
    </div>
  );
};
export const HandleDemo: Story = { render: () => <HandleDemoView /> };
