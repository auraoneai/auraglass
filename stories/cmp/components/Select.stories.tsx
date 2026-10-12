import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Select } from '../../../src/components/select';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Caption, Panel, Scene, Section, Stage } from './controls-stage';

type Option = { value: string; label: string };
type OptionSet = { placeholder: string; group: string; options: Option[]; extra?: Option };

const REGIONS: OptionSet = {
  placeholder: 'Choose a region',
  group: 'Europe',
  options: [
    { value: 'no', label: 'Norway' },
    { value: 'se', label: 'Sweden' },
    { value: 'fi', label: 'Finland' },
    { value: 'is', label: 'Iceland' },
    { value: 'dk', label: 'Denmark' },
  ],
  extra: { value: 'other', label: 'Somewhere else' },
};

const TIME_ZONES: OptionSet = {
  placeholder: 'Choose a time zone',
  group: 'Common',
  options: [
    { value: 'utc', label: 'UTC' },
    { value: 'cet', label: 'Central European (UTC+1)' },
    { value: 'eet', label: 'Eastern European (UTC+2)' },
    { value: 'pst', label: 'Pacific (UTC−8)' },
  ],
};

function OptionSelect({ set = REGIONS, ...props }: { set?: OptionSet } & Record<string, unknown>) {
  return (
    <Select.Root {...props}>
      <Select.Trigger placeholder={set.placeholder} />
      <Select.Content>
        <Select.Group>
          <Select.GroupLabel>{set.group}</Select.GroupLabel>
          {set.options.map((o) => (
            <Select.Item key={o.value} value={o.value} label={o.label} />
          ))}
        </Select.Group>
        {set.extra ? (
          <>
            <Select.Separator />
            <Select.Item value={set.extra.value} label={set.extra.label} />
          </>
        ) : null}
      </Select.Content>
    </Select.Root>
  );
}

/* Visible field caption above the trigger (visual only: the trigger's
   props do not take aria-labelledby, and a wrapping <label> would also
   capture Base UI's hidden form input). */
function Labelled({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--ag-space-1)' }}>
      <span
        style={{
          fontSize: 'var(--ag-type-label-size)',
          lineHeight: 'var(--ag-type-label-leading)',
          fontWeight: 'var(--ag-type-label-weight)',
        }}
      >
        {text}
      </span>
      {children}
    </div>
  );
}

const sbMeta = {
  title: 'Flagships/Controls/Select',
  component: Select.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Select', kind: 'component' } },
} satisfies Meta<typeof Select.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* The trigger is a content-sunken field on a content-raised panel; the
   popup is overlay glass over the panel and the scene. */
export const Overview: Story = {
  render: () => (
    <Stage>
      <Section title="Select" note="Sunken trigger; the list opens as overlay glass.">
        <Scene>
          <Panel title="Shipping" description="Where should we send your prints?" width={380}>
            <Labelled text="Region">
              <OptionSelect />
            </Labelled>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Select' } },
  render: () => (
    <AuraGlassProvider>
      <Stage>
        <Scene minBlockSize="calc(var(--ag-space-16) * 6)" align="flex-start">
          <Panel title="Shipping" width={380}>
            <Labelled text="Region">
              <OptionSelect defaultOpen />
            </Labelled>
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
      <Section title="Sizes and states" note="sm / md / lg on the control-height tokens, enabled and disabled.">
        <Scene>
          <Panel width={560}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', alignItems: 'center', gap: 'var(--ag-space-3) var(--ag-space-4)' }}>
              {SIZES.map((size) => (
                <React.Fragment key={size}>
                  <Caption>{size}</Caption>
                  <OptionSelect size={size} />
                  <OptionSelect size={size} disabled />
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
          <Panel width={380}>
            <div style={{ display: 'grid', gap: 'var(--ag-space-2)' }}>
              {SIZES.map((size) => (
                <OptionSelect key={size} size={size} />
              ))}
            </div>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const InContext: Story = {
  render: () => (
    <Stage>
      <Section title="In a form" note="Two selects in a settings panel.">
        <Scene>
          <Panel title="Account" description="Used for invoices and reminders." width={400}>
            <div style={{ display: 'grid', gap: 'var(--ag-space-4)' }}>
              <Labelled text="Country">
                <OptionSelect />
              </Labelled>
              <Labelled text="Time zone">
                <OptionSelect set={TIME_ZONES} />
              </Labelled>
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
        <Panel width={380}>
          <Labelled text="Region">
            <OptionSelect />
          </Labelled>
        </Panel>
      </Scene>
    </Stage>
  ),
};

export const Preferences: Story = {
  render: () => (
    <Stage>
      <Scene>
        <Panel width={380}>
          <Labelled text="Region">
            <OptionSelect defaultValue="se" items={{ no: 'Norway', se: 'Sweden' }} />
          </Labelled>
        </Panel>
      </Scene>
    </Stage>
  ),
};
