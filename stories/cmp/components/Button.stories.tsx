import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button } from '../../../src/components/button';
import meta from '../../../src/components/button/Button.meta';
import { Caption, Glyph, Panel, Row, Scene, Section, Stage } from './controls-stage';

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

/* Playground: one Button over real content so the glass has something to
   sample (a lone control on a flat scene reads as a grey pill). */
export const Default: Story = {
  args: { children: 'Share', startIcon: <Glyph name="share" /> },
  render: (args) => (
    <Stage>
      <Scene>
        <Button {...args} />
      </Scene>
    </Stage>
  ),
};

export const Overview: Story = {
  args: { children: 'Save changes' },
  render: (args) => (
    <Stage>
      <Section title="Glass buttons" note="Chrome-layer controls float over content: the fill, blur, rim and shadow come from the material engine.">
        <Scene>
          <Button variant="regular" startIcon={<Glyph name="plus" />}>New note</Button>
          <Button variant="clear" startIcon={<Glyph name="share" />}>Share</Button>
          {/* one prominent action per view (SC-24): the card's Publish */}
          <Button {...args} />
        </Scene>
      </Section>
      <Section title="On a content card" note="Inside content, buttons share the card's backdrop instead of stacking a second glass layer.">
        <Panel
          title="Publish post"
          description="Your draft is saved. Publishing makes it visible to everyone with the link."
          footer={
            <>
              <Button variant="identity">Cancel</Button>
              <Button prominent>Publish</Button>
            </>
          }
        >
          <Row>
            <Button size="sm" startIcon={<Glyph name="pin" />}>Pin</Button>
            <Button size="sm" startIcon={<Glyph name="heart" />}>Favourite</Button>
            <Button size="sm" intent="danger" startIcon={<Glyph name="trash" />}>Delete</Button>
          </Row>
        </Panel>
      </Section>
    </Stage>
  ),
};

const SIZES = ['sm', 'md', 'lg'] as const;
const STATES: Array<{ label: string; props: Record<string, unknown> }> = [
  { label: 'default', props: {} },
  { label: 'pressed', props: { defaultPressed: true } },
  { label: 'disabled', props: { disabled: true } },
  { label: 'loading', props: { loading: true } },
];

const VARIANTS = meta.variants.variant as readonly string[];

/* One row per variant (regular, clear, identity) × size, every state in the
   row. Glass variants sit on the same scene so the rungs compare directly;
   identity has no optics by design, so it is shown where it is used — on a
   content card — instead of as bare text over artwork. */
function MatrixGrid({ variant }: { variant: string }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--ag-space-3)' }}>
      {SIZES.map((s) => (
        <Row key={s} wrap={false}>
          <Caption width="var(--ag-space-8)">{s}</Caption>
          {STATES.map((st) => (
            <Button key={`${s}-${st.label}`} variant={variant as 'regular'} size={s} {...st.props}>
              {st.label}
            </Button>
          ))}
        </Row>
      ))}
    </div>
  );
}

export const Matrix: Story = {
  render: () => (
    <Stage maxWidth={1180}>
      {VARIANTS.map((v) => (
        <Section key={v} title={v}>
          {v === 'identity' ? (
            <Panel width={720}>
              <MatrixGrid variant={v} />
            </Panel>
          ) : (
            <Scene minBlockSize="auto" justify="flex-start">
              <MatrixGrid variant={v} />
            </Scene>
          )}
        </Section>
      ))}
    </Stage>
  ),
};

export const Density: Story = {
  render: () => (
    <Stage>
      <Section title="Sizes" note="sm / md / lg map to the 28 / 36 / 44 px control-height tokens.">
        <Scene minBlockSize="auto">
          <Row align="center">
            {SIZES.map((s) => (
              <Button key={s} size={s}>
                {s}
              </Button>
            ))}
          </Row>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Keyboard: Story = {
  tags: ['apg'],
  render: () => (
    <Stage>
      <Scene minBlockSize="auto">
        <Button>Press me</Button>
      </Scene>
    </Stage>
  ),
  play: async () => {
    const { userEvent } = await import('storybook/test');
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{Enter}');
  },
};

export const InContext: Story = {
  render: () => (
    <Stage>
      <Scene align="flex-start" justify="space-between">
        <div role="toolbar" aria-label="Top bar" style={{ display: 'flex', gap: 'var(--ag-space-2)', inlineSize: '100%', justifyContent: 'flex-end' }}>
          <Button intent="danger">Delete project</Button>
          <Button variant="clear">Discard</Button>
          <Button prominent>Save changes</Button>
        </div>
      </Scene>
    </Stage>
  ),
};

export const Preferences: Story = {
  render: () => (
    <Stage>
      <Section title="Pointer light and clear" note="Pointer light follows the cursor across the rim; clear dims bright backdrops for legibility.">
        <Scene>
          <Button pointerLight>Pointer light</Button>
          <Button variant="clear">Clear</Button>
        </Scene>
      </Section>
    </Stage>
  ),
};

/* REQ-CMP-33: identical label with/without loading — the label stays mounted
   (hidden via CSS) so the button's offsetWidth must not change. */
export const WidthStability: Story = {
  render: () => (
    <Stage>
      <Scene minBlockSize="auto">
        <Button data-testid="idle">Save changes</Button>
        <Button loading data-testid="busy">Save changes</Button>
      </Scene>
    </Stage>
  ),
};
