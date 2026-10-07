import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { Field, Fieldset } from './index';

function Wire(props: { error?: React.ReactNode; description?: React.ReactNode; invalid?: boolean }) {
  return (
    <Field.Root invalid={props.invalid}>
      <Field.Label>Email</Field.Label>
      <Field.Control data-testid="ctl" />
      {props.description !== undefined && <Field.Description>{props.description}</Field.Description>}
      {props.error !== undefined && <Field.Error match={props.invalid ? true : undefined}>{props.error}</Field.Error>}
    </Field.Root>
  );
}

describe('Field (CMP-107)', () => {
  it('label wires for/id to the control', () => {
    render(<Wire />);
    const label = screen.getByText('Email');
    const ctl = screen.getByTestId('ctl');
    expect(label).toHaveAttribute('for', ctl.id);
    expect(label.id).toBeTruthy();
    expect(ctl).toHaveAttribute('aria-labelledby', expect.stringContaining(label.id));
  });

  it('aria-describedby orders description id then error id', () => {
    render(<Wire description="We never share it" error="Required" invalid />);
    const ctl = screen.getByTestId('ctl');
    const desc = screen.getByText('We never share it');
    const err = screen.getByText('Required');
    const describedBy = ctl.getAttribute('aria-describedby') ?? '';
    expect(describedBy).toContain(desc.id);
    expect(describedBy).toContain(err.id);
    expect(describedBy.indexOf(desc.id)).toBeLessThan(describedBy.indexOf(err.id));
    expect(ctl).toHaveAttribute('aria-invalid', 'true');
  });

  it('toggling error between undefined and a string never throws (E-04)', () => {
    const { rerender } = render(<Wire description="d" />);
    expect(() => {
      rerender(<Wire description="d" error="bad" invalid />);
      rerender(<Wire description="d" />);
      rerender(<Wire description="d" error="bad" invalid />);
    }).not.toThrow();
  });

  it('emits data-ag-part on root/label/control/description/error', () => {
    const { container } = render(<Wire description="d" error="e" invalid />);
    for (const p of ['root', 'label', 'control', 'description', 'error']) {
      expect(container.querySelector(`[data-ag-part="${p}"]`)).toBeTruthy();
    }
  });
});

describe('Fieldset (CMP-417)', () => {
  it('renders a fieldset with a legend part and forwards disabled', () => {
    render(
      <Fieldset.Root legend="Shipping" disabled>
        <input data-testid="inner" />
      </Fieldset.Root>,
    );
    expect(screen.getByText('Shipping').closest('[data-ag-part="legend"]')).toBeTruthy();
    const fs = document.querySelector('fieldset[data-ag-part="root"]') as HTMLFieldSetElement;
    expect(fs).toBeTruthy();
    expect(fs.disabled).toBe(true);
  });
});
