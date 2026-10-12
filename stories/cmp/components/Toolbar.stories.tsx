import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Toolbar } from '../../../src/components/toolbar';
import { IconButton } from '../../../src/components/icon-button';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Glyph, Scene, Section, Stage } from './controls-stage';

const sbMeta = {
  title: 'Flagships/Controls/Toolbar',
  component: Toolbar.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Toolbar', kind: 'component' } satisfies StoryAgParameters },
  args: { 'aria-label': 'Formatting' },
} satisfies Meta<typeof Toolbar.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* Toolbar is chrome: one glass bar floating over the scene. Its items are
   flat on that glass (no per-item pills); separators are hairlines. */
const renderBar: NonNullable<Story['render']> = (args) => (
  <Stage>
    <Section title="Toolbar" note="A single glass bar; items stay flat until hovered.">
      <Scene align="flex-start">
        <Toolbar.Root {...args}>
          <Toolbar.Button>Bold</Toolbar.Button>
          <Toolbar.Button render={<IconButton label="Undo" icon={<Glyph name="undo" />} />} />
          <Toolbar.Separator />
          <Toolbar.Link href="/docs">Docs</Toolbar.Link>
        </Toolbar.Root>
      </Scene>
    </Section>
  </Stage>
);

/* Usage: a short action bar. */
export const Playground: Story = {
  args: { 'aria-label': 'Document actions' },
  render: (args) => (
    <Stage>
      <Section title="Toolbar" note="One tab stop; arrow keys move between items.">
        <Scene align="flex-start">
          <Toolbar.Root {...args}>
            <Toolbar.Button>Share</Toolbar.Button>
            <Toolbar.Button>Export</Toolbar.Button>
            <Toolbar.Separator />
            <Toolbar.Button render={<IconButton label="Settings" icon={<Glyph name="gear" />} />} />
          </Toolbar.Root>
        </Scene>
      </Section>
    </Stage>
  ),
};

/* Enabled items, a disabled item (skipped by the arrow keys) and a grouped pair. */
export const States: Story = {
  args: { 'aria-label': 'Editing' },
  render: (args) => (
    <Stage>
      <Section title="States" note="A disabled item keeps its slot and is skipped while arrowing.">
        <Scene align="flex-start">
          <Toolbar.Root {...args}>
            <Toolbar.Button>Cut</Toolbar.Button>
            <Toolbar.Button disabled>Paste</Toolbar.Button>
            <Toolbar.Separator />
            <Toolbar.Group>
              <Toolbar.Button render={<IconButton label="Undo" icon={<Glyph name="undo" />} />} />
              <Toolbar.Button render={<IconButton label="Redo" icon={<Glyph name="redo" />} disabled />} />
            </Toolbar.Group>
          </Toolbar.Root>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Default: Story = { args: { 'aria-label': 'Toolbar' }, render: renderBar };

/* The story tests/a11y/apg/cmp/toolbar.apg.spec.ts drives (one tab stop; arrows loop; Home/End; disabled skipped). */
export const Keyboard: Story = { tags: ['apg'], args: { 'aria-label': 'Toolbar' }, render: renderBar };

export const Overview: Story = {
  render: (args) => (
    <Stage>
      <Section title="Formatting bar" note="Text actions, a grouped undo/redo pair and a link, divided by hairline separators.">
        <Scene align="flex-start">
          <Toolbar.Root {...args}>
            <Toolbar.Button>Bold</Toolbar.Button>
            <Toolbar.Button>Italic</Toolbar.Button>
            <Toolbar.Separator />
            <Toolbar.Group>
              <Toolbar.Button render={<IconButton label="Undo" icon={<Glyph name="undo" />} />} />
              <Toolbar.Button render={<IconButton label="Redo" icon={<Glyph name="redo" />} />} />
            </Toolbar.Group>
            <Toolbar.Separator />
            <Toolbar.Link href="/docs">Docs</Toolbar.Link>
          </Toolbar.Root>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Vertical: Story = {
  args: { 'aria-label': 'Tools' },
  render: () => (
    <Stage>
      <Section title="Vertical" note="A tool rail docked to the start edge of the canvas.">
        <Scene align="flex-start" justify="flex-start">
          <Toolbar.Root aria-label="Tools" orientation="vertical">
            <Toolbar.Button render={<IconButton label="Select" icon={<Glyph name="pointer" />} />} />
            <Toolbar.Button render={<IconButton label="Move" icon={<Glyph name="move" />} />} />
            <Toolbar.Separator />
            <Toolbar.Button render={<IconButton label="Pin" icon={<Glyph name="pin" />} />} />
          </Toolbar.Root>
        </Scene>
      </Section>
    </Stage>
  ),
};
