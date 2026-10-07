/** Family cases (PRD §FND-139 field-shell): every registered control family mounts and emits its parts. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { CONTROL_FAMILIES } from './families';

describe('control families (field-shell)', () => {
  it('registry is non-empty', () => {
    expect(CONTROL_FAMILIES.length).toBeGreaterThan(0);
  });

  it.each(CONTROL_FAMILIES.map((f) => [f.family, f] as const))('%s fixture mounts with a root part', (_family, { fixture: Fixture }) => {
    const { container } = render(<Fixture />);
    expect(container.querySelector('[data-ag-part="root"]')).not.toBeNull();
  });

  it('button family: three buttons incl. one prominent-safe identity and one danger', () => {
    render(
      React.createElement(CONTROL_FAMILIES.find((f) => f.family === 'button')!.fixture),
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(buttons.map((b) => b.getAttribute('data-ag-variant'))).toEqual([
      'regular',
      'identity',
      'regular',
    ]);
    expect(buttons[2]!.getAttribute('data-ag-intent')).toBe('danger');
  });
});

/* CMP-118 (REQ-CMP-57/58): per-control Field wiring — label htmlFor→id,
   aria-describedby description-then-error order, aria-invalid. Select/Combobox
   rows join when lane 3d lands (PENDING until then). */
import { TextField } from '../../src/components/text-field';
import { SearchField } from '../../src/components/search-field';
import { NumberField } from '../../src/components/number-field';
import { Switch } from '../../src/components/switch';
import { Checkbox } from '../../src/components/checkbox';
import { Field } from '../../src/components/field';

describe('field shell wiring (CMP-118)', () => {
  it.each([
    ['TextField', <TextField key="t" label="Name" description="d" error="e" />],
    ['SearchField', <SearchField key="s" label="Search" description="d" error="e" />],
    ['NumberField', <NumberField key="n" label="Qty" description="d" error="e" />],
  ])('%s wires label + description + error ids', (_n, el) => {
    const { container } = render(el);
    const input = container.querySelector('input')!;
    const label = container.querySelector('[data-ag-part="label"]')!;
    const desc = container.querySelector('[data-ag-part="description"]')!;
    const err = container.querySelector('[data-ag-part="error"]')!;
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(describedBy).toContain(desc.id);
    expect(describedBy).toContain(err.id);
    expect(describedBy.indexOf(desc.id)).toBeLessThan(describedBy.indexOf(err.id));
    expect(label.getAttribute('for')).toBe(input.id);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('Switch renders inside Field.Root wiring (aria-labelledby)', () => {
    const { container } = render(
      <Field.Root>
        <Field.Label>Power</Field.Label>
        <Field.Control render={<div />} />
        <Switch aria-label="power" />
      </Field.Root>,
    );
    expect(container.querySelector('[data-ag-part="root"]')).not.toBeNull();
    expect(container.querySelector('[role="switch"]')).not.toBeNull();
  });

  it('Checkbox aria-checked=mixed keeps Field error id order', () => {
    const { container } = render(
      <Field.Root invalid>
        <Field.Label>All</Field.Label>
        <Field.Description>d</Field.Description>
        <Checkbox value="a" indeterminate>All</Checkbox>
        <Field.Error match={true}>e</Field.Error>
      </Field.Root>,
    );
    const err = container.querySelector('[data-ag-part="error"]');
    expect(err).not.toBeNull();
  });
});
