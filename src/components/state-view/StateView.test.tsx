import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState, ErrorState, LoadingState } from './index';

describe('StateView components', () => {
  it('EmptyState renders parts and fires actions', () => {
    const calls: string[] = [];
    const { container } = render(
      <EmptyState
        title="No results"
        description="Try a different query"
        icon={<svg data-testid="i" />}
        actions={[
          { label: 'Clear filters', onPress: () => calls.push('clear') },
          { label: 'Docs', href: '/docs' },
        ]}
      />,
    );
    expect(container.querySelector('[data-ag-part="root"]')).toBeInTheDocument();
    expect(screen.getByText('No results').getAttribute('data-ag-part')).toBe('title');
    fireEvent.click(screen.getByText('Clear filters'));
    expect(calls).toEqual(['clear']);
    expect(screen.getByText('Docs').closest('a')).toHaveAttribute('href', '/docs');
    expect(container.querySelector('[data-ag-part="root"]')).toHaveAttribute('role', 'status');
  });
  it('ErrorState uses role=alert only when urgent', () => {
    const { container: neutral } = render(<ErrorState title="Saved offline" />);
    expect(neutral.querySelector('[data-ag-part="root"]')).not.toHaveAttribute('role', 'alert');
    const { container: urgent } = render(<ErrorState title="Deleted" urgent />);
    expect(urgent.querySelector('[data-ag-part="root"]')).toHaveAttribute('role', 'alert');
  });
  it('LoadingState is aria-busy with a visually hidden role=status label', () => {
    const { container } = render(<LoadingState description="Fetching" />);
    const root = container.querySelector('[data-ag-part="root"]')!;
    expect(root).toHaveAttribute('aria-busy', 'true');
    const status = root.querySelector('[data-ag-part="status"]')!;
    expect(status).toHaveAttribute('role', 'status');
    expect(status).toHaveTextContent('Loading');
    expect(status.parentElement).toHaveClass('ag-visually-hidden');
  });
});
