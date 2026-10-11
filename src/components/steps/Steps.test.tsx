import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Steps } from './index';

function Demo() {
  return (
    <Steps>
      <Steps.Item status="complete">Account</Steps.Item>
      <Steps.Item status="current" description="Pick a team">
        Profile
      </Steps.Item>
      <Steps.Item status="upcoming">Billing</Steps.Item>
      <Steps.Item status="error">Confirm</Steps.Item>
    </Steps>
  );
}

describe('Steps', () => {
  it('renders an ordered list with per-item status', () => {
    const { container } = render(<Demo />);
    expect(container.querySelector('ol[data-ag-part="list"]')).toBeInTheDocument();
    const items = container.querySelectorAll('[data-ag-part="item"]');
    expect(items).toHaveLength(4);
    expect(items[1]).toHaveAttribute('data-status', 'current');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).not.toHaveAttribute('aria-current');
  });
  it('complete and error items carry visually hidden status text', () => {
    render(<Demo />);
    expect(screen.getByText('complete')).toHaveClass('ag-visually-hidden');
    expect(screen.getByText('error')).toHaveClass('ag-visually-hidden');
  });
  it('renders indicator, label and description parts', () => {
    const { container } = render(<Demo />);
    expect(container.querySelectorAll('[data-ag-part="indicator"]')).toHaveLength(4);
    expect(screen.getByText('Pick a team').getAttribute('data-ag-part')).toBe('description');
  });
});
