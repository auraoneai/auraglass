import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { EmptyState, ErrorState, LoadingState } from './index';

describe('StateView components', () => {
  it('EmptyState renders parts and consumer-supplied action nodes', () => {
    const calls: string[] = [];
    const { container } = render(
      <EmptyState
        title="No results"
        description="Try a different query"
        icon={<svg data-testid="i" />}
        actions={
          <>
            <button type="button" onClick={() => calls.push('clear')}>Clear filters</button>
            <a href="/docs">Docs</a>
          </>
        }
      />,
    );
    expect(container.querySelector('[data-ag-part="root"]')).toBeInTheDocument();
    expect(screen.getByText('No results').getAttribute('data-ag-part')).toBe('title');
    fireEvent.click(screen.getByText('Clear filters'));
    expect(calls).toEqual(['clear']);
    expect(screen.getByText('Docs').closest('a')).toHaveAttribute('href', '/docs');
    expect(container.querySelector('[data-ag-part="actions"]')).toBeInTheDocument();
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
  it('server-renders with 0 errors (RSC-safe: no hooks, actions are nodes)', () => {
    const html = renderToStaticMarkup(
      <EmptyState title="T" description="d" actions={<button type="button">Go</button>} />,
    );
    expect(html).toContain('data-ag-part="actions"');
    expect(html).toContain('Go');
    const html2 = renderToStaticMarkup(<ErrorState title="E" urgent />);
    expect(html2).toContain('role="alert"');
  });
});

describe('LoadingState variant (REQ-CMP-118)', () => {
  it('variant=skeleton renders a Skeleton part tree', () => {
    const { container } = render(<LoadingState variant="skeleton" />);
    expect(container.querySelector('.ag-skeleton')).not.toBeNull();
    expect(container.querySelector('[role="status"]')).not.toBeNull();
  });

  it('variant=progress renders an indeterminate progressbar', () => {
    const { container } = render(<LoadingState variant="progress" label="Working" />);
    const bar = container.querySelector('[role="progressbar"]')!;
    expect(bar).not.toBeNull();
    expect(bar.hasAttribute('aria-valuenow')).toBe(false);
  });
});
