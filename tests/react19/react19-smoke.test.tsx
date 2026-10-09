/**
 * REQ-PLAT-47 react19-smoke leg — runs under whichever React the job
 * installed (`npm i react@19 react-dom@19 --no-save` in plat:test:react19).
 * Asserts the runtime major, a basic client render, and that the SSR
 * boundary semantics still hold.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import AuraGlassClientBoundary from '../../src/components/ssr/AuraGlassClientBoundary';
import { Slot } from '../../src/primitives/Slot';

describe('react19-smoke leg', () => {
  it('reports the installed React major (18 or 19)', () => {
    const major = parseInt(React.version, 10);
    expect([18, 19]).toContain(major);
    // eslint-disable-next-line no-console -- leg evidence: which runtime ran
    console.log(`react19-smoke ran on React ${React.version}`);
  });

  it('renders a basic component tree on this runtime', () => {
    render(
      <div data-testid="probe">
        <span>hello-19</span>
      </div>
    );
    expect(screen.getByText('hello-19')).toBeInTheDocument();
  });

  it('ClientBoundary mounts children after the effect on this runtime', () => {
    render(
      <AuraGlassClientBoundary fallback={<span>pending</span>}>
        <button>hydrated</button>
      </AuraGlassClientBoundary>
    );
    expect(screen.getByText('hydrated')).toBeInTheDocument();
  });

  it('Slot renders and merges props on this runtime', () => {
    render(
      <Slot className="from-slot">
        <div data-testid="slot-19" className="from-child" />
      </Slot>
    );
    const node = screen.getByTestId('slot-19');
    expect(node.className).toContain('from-slot');
    expect(node.className).toContain('from-child');
  });
});
