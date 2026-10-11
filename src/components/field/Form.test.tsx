/* CMP-049: Form — errors map feeds Field.Root invalid + Field.Error;
   an invalid submit is blocked and focus moves to the first invalid
   control in DOM order. */
import { describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/jest-globals';
import { Form } from './Form.client';
import { Field } from './Field.client';

function TwoFields() {
  return (
    <Form>
      <Field.Root name="alpha">
        <Field.Label>Alpha</Field.Label>
        <Field.Control aria-label="alpha control" />
        <Field.Error />
      </Field.Root>
      <Field.Root name="beta">
        <Field.Label>Beta</Field.Label>
        <Field.Control aria-label="beta control" />
        <Field.Error />
      </Field.Root>
      <button type="submit">Submit</button>
    </Form>
  );
}

describe('Form', () => {
  it('renders a form element with data-ag-part="root"', () => {
    const { container } = render(<TwoFields />);
    const form = container.querySelector('form');
    expect(form).toBeTruthy();
    expect(form).toHaveAttribute('data-ag-part', 'root');
    expect(form).toHaveAttribute('novalidate');
  });

  it('errors map marks the named field invalid and shows its Field.Error', () => {
    render(
      <Form errors={{ alpha: 'Alpha is required' }}>
        <Field.Root name="alpha">
          <Field.Label>Alpha</Field.Label>
          <Field.Control aria-label="alpha control" />
          <Field.Error />
        </Field.Root>
        <Field.Root name="beta">
          <Field.Label>Beta</Field.Label>
          <Field.Control aria-label="beta control" />
          <Field.Error />
        </Field.Root>
      </Form>,
    );
    expect(screen.getByLabelText('alpha control')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Alpha is required')).toBeInTheDocument();
    // Unrelated field stays valid.
    expect(screen.getByLabelText('beta control')).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('array errors join into the field error', () => {
    render(
      <Form errors={{ alpha: ['Too short', 'Must be letters'] }}>
        <Field.Root name="alpha">
          <Field.Control aria-label="alpha control" />
          <Field.Error />
        </Field.Root>
      </Form>,
    );
    expect(screen.getByText(/Too short/)).toBeInTheDocument();
  });

  it('onSubmit receives the collected values map; invalid submit is blocked', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <Form onSubmit={onSubmit}>
        <Field.Root name="alpha" validate={() => null}>
          <Field.Control aria-label="alpha control" defaultValue="hello" />
        </Field.Root>
        <button type="submit">Submit</button>
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ alpha: 'hello' });
  });

  it('invalid submit moves focus to the first invalid control in DOM order', async () => {
    const user = userEvent.setup();
    render(
      <Form>
        <Field.Root name="alpha" validate={() => 'Alpha required'}>
          <Field.Control aria-label="alpha control" />
          <Field.Error />
        </Field.Root>
        <Field.Root name="beta" validate={() => 'Beta required'}>
          <Field.Control aria-label="beta control" />
          <Field.Error />
        </Field.Root>
        <button type="submit">Submit</button>
      </Form>,
    );
    const beta = screen.getByLabelText('beta control');
    beta.focus();
    expect(document.activeElement).toBe(beta);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    // Both invalid; DOM order puts alpha first — focus lands there, not on beta
    // even though beta held focus before the submit attempt.
    expect(document.activeElement).toBe(screen.getByLabelText('alpha control'));
    expect(screen.getByText('Alpha required')).toBeInTheDocument();
    expect(screen.getByText('Beta required')).toBeInTheDocument();
  });

  it('Field.Error id lands in the control\'s aria-describedby; no alert/live (REQ-CMP-31)', async () => {
    const user = userEvent.setup();
    render(
      <Form>
        <Field.Root name="gamma" validate={() => 'Gamma required'}>
          <Field.Control aria-label="gamma control" />
          <Field.Error />
        </Field.Root>
        <button type="submit">Submit</button>
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    const err = await screen.findByText('Gamma required');
    const control = screen.getByLabelText('gamma control');
    expect(err.id).not.toBe('');
    expect(control.getAttribute('aria-describedby') ?? '').toContain(err.id);
    // The error is described by the control — it must not also be a live
    // region, or screen readers would announce it twice.
    expect(err).not.toHaveAttribute('role', 'alert');
    expect(err).not.toHaveAttribute('aria-live');
  });
});
