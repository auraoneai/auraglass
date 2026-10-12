import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SearchField } from '../../../src/components/search-field';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Panel, Scene, Section, Stage } from './controls-stage';

const sbMeta = {
  title: 'Flagships/Controls/SearchField',
  component: SearchField,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'SearchField', kind: 'component' } },
  args: { 'aria-label': 'Search' },
} satisfies Meta<typeof SearchField>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* SearchField is chrome: a thin glass capsule. It sits directly on the
   scene so the blur and tint floor have real content to work against. */
const bar: React.CSSProperties = { inlineSize: 'min(100%, 420px)' };

export const Default: Story = {
  render: () => (
    <Stage>
      <Section title="Search field" note="Chrome-thin glass capsule with a keyboard hint and an inline loading ring.">
        <Scene align="flex-start">
          <div style={bar}>
            <SearchField aria-label="Search" placeholder="Search photos, places, people" shortcut="⌘K" loading />
          </div>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const WithValue: Story = {
  render: () => (
    <Stage>
      <Section title="With a value" note="The clear button appears once there is something to clear.">
        <Scene align="flex-start">
          <div style={bar}>
            <SearchField aria-label="Search" defaultValue="glacier" />
          </div>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const WithMessages: Story = {
  render: () => (
    <Stage>
      <Section title="Label, description and error" note="Field text sits on the panel, outside the glass shell.">
        <Scene>
          <Panel title="Library" width={420}>
            <SearchField
              label="Search the library"
              description="Matches titles, tags and locations."
              error="The search index is rebuilding. Try again in a minute."
              placeholder="Search"
            />
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

/* REQ-CMP-63: TextField's single-line props — a scope adornment, a trailing hint and a length counter. */
export const WithAdornments: Story = {
  render: () => (
    <Stage>
      <Section title="Adornments and counter" note="Start/end adornments sit inside the capsule; the counter sits under it.">
        <Scene align="flex-start">
          <div style={bar}>
            <SearchField
              aria-label="Search issues"
              placeholder="Search issues"
              startAdornment="in:"
              endAdornment="repo"
              maxLength={60}
              showCount
            />
          </div>
        </Scene>
      </Section>
    </Stage>
  ),
};

/* Usage: an empty search capsule with its placeholder. */
export const Playground: Story = {
  render: () => (
    <Stage>
      <Section title="Search field" note="Type to filter; Escape clears a non-empty field.">
        <Scene align="flex-start">
          <div style={bar}>
            <SearchField aria-label="Search" placeholder="Search invoices" />
          </div>
        </Scene>
      </Section>
    </Stage>
  ),
};

/* Empty, filled (clear button), loading and disabled. */
export const States: Story = {
  render: () => (
    <Stage>
      <Section title="States" note="Empty, filled with its clear button, loading, and disabled.">
        <Scene align="flex-start">
          <div style={{ ...bar, display: 'grid', gap: 'var(--ag-space-4)' }}>
            <SearchField aria-label="Search orders" placeholder="Search orders" />
            <SearchField aria-label="Search customers" defaultValue="Northwind" />
            <SearchField aria-label="Search products" defaultValue="lamp" loading />
            <SearchField aria-label="Search archive" placeholder="Archive search is offline" disabled />
          </div>
        </Scene>
      </Section>
    </Stage>
  ),
};

/* The story tests/a11y/apg/cmp/search-field.apg.spec.ts drives: Escape clears the value, then propagates when empty. */
export const Keyboard: Story = {
  tags: ['apg'],
  render: () => (
    <Stage>
      <Section title="Keyboard" note="Escape clears the value; a second Escape on the empty field is not consumed.">
        <Scene align="flex-start">
          <div style={bar}>
            <SearchField aria-label="Search" defaultValue="glacier" />
          </div>
        </Scene>
      </Section>
    </Stage>
  ),
};
