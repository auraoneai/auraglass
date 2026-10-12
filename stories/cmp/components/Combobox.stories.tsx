import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Combobox } from '../../../src/components/combobox';
import { ComboboxLoading } from '../../../src/components/combobox/Combobox.client';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Caption, Panel, Scene, Section, Stage } from './controls-stage';

const ASSIGNEES = ['Ada Lovelace', 'Grace Hopper', 'Edsger Dijkstra'];
const LABELS = ['glass', 'tokens', 'a11y', 'docs'];

function Items({ values, group }: { values: string[]; group: string }) {
  return (
    <>
      <Combobox.Group>
        <Combobox.GroupLabel>{group}</Combobox.GroupLabel>
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

/* Visible field caption above the input. */
function FieldCaption({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 'var(--ag-type-label-size)',
        lineHeight: 'var(--ag-type-label-leading)',
        fontWeight: 'var(--ag-type-label-weight)',
      }}
    >
      {children}
    </span>
  );
}

const field: React.CSSProperties = { display: 'grid', gap: 'var(--ag-space-1)' };
/* Room under the panel for stories that render the popup open. */
const OPEN_SCENE = 'calc(var(--ag-space-16) * 6)';

const sbMeta = {
  title: 'Flagships/Controls/Combobox',
  component: Combobox.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Combobox', kind: 'component' } },
} satisfies Meta<typeof Combobox.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* The input is a content-sunken field on a content-raised panel; the popup
   is overlay glass. */
export const Overview: Story = {
  render: () => (
    <Stage>
      <Section title="Combobox" note="Type to filter; the list opens as overlay glass.">
        <Scene>
          <Panel title="Review" description="Assign an owner for this review." width={400}>
            <div style={field}>
              <FieldCaption>Assignee</FieldCaption>
              <Combobox.Root items={ASSIGNEES}>
                <Combobox.Input placeholder="Search people" />
                <Combobox.Content>
                  <Items values={ASSIGNEES} group="People" />
                </Combobox.Content>
              </Combobox.Root>
            </div>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Combobox', id: 'overlays-combobox--playground' } },
  render: () => (
    <AuraGlassProvider>
      <Stage>
        <Scene minBlockSize={OPEN_SCENE} align="flex-start">
          <Panel title="Review" width={400}>
            <div style={field}>
              <FieldCaption>Assignee</FieldCaption>
              <Combobox.Root items={ASSIGNEES} defaultOpen>
                <Combobox.Input placeholder="Search people" />
                <Combobox.Content>
                  <Items values={ASSIGNEES} group="People" />
                </Combobox.Content>
              </Combobox.Root>
            </div>
          </Panel>
        </Scene>
      </Stage>
    </AuraGlassProvider>
  ),
};

const SIZES = ['sm', 'md', 'lg'] as const;

export const Matrix: Story = {
  render: () => (
    <Stage>
      <Section title="Sizes" note="sm / md / lg on the control-height tokens.">
        <Scene>
          <Panel width={460}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: 'var(--ag-space-3) var(--ag-space-4)' }}>
              {SIZES.map((size) => (
                <React.Fragment key={size}>
                  <Caption>{size}</Caption>
                  <Combobox.Root items={ASSIGNEES} size={size}>
                    <Combobox.Input placeholder="Search people" />
                    <Combobox.Content>
                      <Items values={ASSIGNEES} group="People" />
                    </Combobox.Content>
                  </Combobox.Root>
                </React.Fragment>
              ))}
            </div>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Density: Story = {
  render: () => (
    <Stage>
      <Section title="Density" note="The same field at each size, stacked.">
        <Scene>
          <Panel width={400}>
            <div style={{ display: 'grid', gap: 'var(--ag-space-2)' }}>
              {SIZES.map((size) => (
                <Combobox.Root key={size} items={ASSIGNEES} size={size}>
                  <Combobox.Input placeholder="Search people" />
                  <Combobox.Content>
                    <Items values={ASSIGNEES} group="People" />
                  </Combobox.Content>
                </Combobox.Root>
              ))}
            </div>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Keyboard: Story = {
  render: () => (
    <Stage>
      <Scene>
        <Panel width={400}>
          <div style={field}>
            <FieldCaption>Assignee</FieldCaption>
            <Combobox.Root items={ASSIGNEES}>
              <Combobox.Input placeholder="Type to filter" />
              <Combobox.Content>
                <Items values={ASSIGNEES} group="People" />
              </Combobox.Content>
            </Combobox.Root>
          </div>
        </Panel>
      </Scene>
    </Stage>
  ),
};

export const InContext: Story = {
  render: () => (
    <Stage>
      <Section title="In a form" note="Single and multiple selection; chosen labels render as accent-tinted chips.">
        <Scene>
          <Panel title="Pull request" width={420}>
            <div style={{ display: 'grid', gap: 'var(--ag-space-4)' }}>
              <div style={field}>
                <FieldCaption>Assignee</FieldCaption>
                <Combobox.Root items={ASSIGNEES}>
                  <Combobox.Input placeholder="Search people" />
                  <Combobox.Content>
                    <Items values={ASSIGNEES} group="People" />
                  </Combobox.Content>
                </Combobox.Root>
              </div>
              <div style={field}>
                <FieldCaption>Labels</FieldCaption>
                <Combobox.Root items={LABELS} multiple defaultValue={['glass', 'a11y']}>
                  <Combobox.Chips>
                    <Combobox.Chip>glass</Combobox.Chip>
                    <Combobox.Chip>a11y</Combobox.Chip>
                  </Combobox.Chips>
                  <Combobox.Input placeholder="Add labels" />
                  <Combobox.Content>
                    <Items values={LABELS} group="Labels" />
                  </Combobox.Content>
                </Combobox.Root>
              </div>
            </div>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Empty: Story = {
  render: () => (
    <AuraGlassProvider>
      <Stage>
        <Scene minBlockSize={OPEN_SCENE} align="flex-start">
          <Panel width={400}>
            <Combobox.Root items={[]} defaultOpen>
              <Combobox.Input placeholder="Search people" />
              <Combobox.Content>
                <Items values={[]} group="People" />
              </Combobox.Content>
            </Combobox.Root>
          </Panel>
        </Scene>
      </Stage>
    </AuraGlassProvider>
  ),
};

export const Loading: Story = {
  render: () => (
    <AuraGlassProvider>
      <Stage>
        <Scene minBlockSize={OPEN_SCENE} align="flex-start">
          <Panel width={400}>
            <Combobox.Root items={[]} loading defaultOpen>
              <Combobox.Input placeholder="Searching people" />
              <Combobox.Content>
                <ComboboxLoading />
              </Combobox.Content>
            </Combobox.Root>
          </Panel>
        </Scene>
      </Stage>
    </AuraGlassProvider>
  ),
};

export const Creatable: Story = {
  render: () => (
    <AuraGlassProvider>
      <Stage>
        <Scene minBlockSize={OPEN_SCENE} align="flex-start">
          <Panel width={400}>
            <Combobox.Root items={LABELS} creatable defaultInputValue="release-notes" defaultOpen>
              <Combobox.Input placeholder="Add label" />
              <Combobox.Content>
                <Items values={LABELS} group="Labels" />
              </Combobox.Content>
            </Combobox.Root>
          </Panel>
        </Scene>
      </Stage>
    </AuraGlassProvider>
  ),
};

export const RTL: Story = {
  render: () => (
    <Stage>
      <Scene>
        <Panel width={400}>
          <div dir="rtl">
            <Combobox.Root items={LABELS} multiple defaultValue={['glass']}>
              <Combobox.Chips>
                <Combobox.Chip>glass</Combobox.Chip>
              </Combobox.Chips>
              <Combobox.Input placeholder="بحث" />
              <Combobox.Content>
                <Items values={LABELS} group="التصنيفات" />
              </Combobox.Content>
            </Combobox.Root>
          </div>
        </Panel>
      </Scene>
    </Stage>
  ),
};
