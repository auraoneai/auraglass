/**
 * REQ-PLAT-47 react19-smoke leg — runs under whichever React the job
 * installed (`npm i --no-save react@19 react-dom@19` in plat:test:react19).
 * Asserts the runtime major, a basic client render, and that SSR markup for
 * the REQ-PLAT-46 surfaces (ClientBoundary, Slot) hydrates with 0
 * recoverable errors and 0 mismatch messages on this runtime.
 */
import './jsdom-ssr-env';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot, type Root } from 'react-dom/client';
import { act, render, screen } from '@testing-library/react';
import AuraGlassClientBoundary from '../../src/components/ssr/AuraGlassClientBoundary';
import { Slot } from '../../src/primitives/Slot';
import './element-ref-spy';
import { expectedReactMajor } from './runtime';

const MISMATCH = /did not match|hydrat/i;

/** Server-render `tree`, then hydrate the same tree on the client. */
async function hydrateTree(tree: React.ReactElement) {
  const html = renderToString(tree);
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);

  const recoverable: unknown[] = [];
  const mismatch: string[] = [];
  const original = console.error;
  console.error = (...args: unknown[]) => {
    const msg = args.map(String).join(' ');
    if (MISMATCH.test(msg)) mismatch.push(msg);
    original.apply(console, args as []);
  };

  let root: Root | undefined;
  try {
    await act(async () => {
      root = hydrateRoot(container, tree, {
        onRecoverableError: (error) => recoverable.push(error),
      });
    });
  } finally {
    console.error = original;
  }
  return {
    html,
    container,
    recoverable,
    mismatch,
    cleanup: () => {
      act(() => root?.unmount());
      container.remove();
    },
  };
}

describe('react19-smoke leg', () => {
  it(`runs on the React major this leg installed (React ${React.version})`, () => {
    // Leg evidence in the job log: which runtime ran.
    // eslint-disable-next-line no-console
    console.log(`react19-smoke ran on React ${React.version}`);
    expect(parseInt(React.version, 10)).toBe(expectedReactMajor());
  });

  it('renders a basic component tree on this runtime', () => {
    render(
      <div data-testid="probe">
        <span>hello-19</span>
      </div>
    );
    expect(screen.getByText('hello-19')).toBeInTheDocument();
  });

  it('ClientBoundary: server markup is the fallback and hydrates cleanly', async () => {
    const tree = (
      <AuraGlassClientBoundary fallback={<span>pending</span>}>
        <button>hydrated</button>
      </AuraGlassClientBoundary>
    );
    const h = await hydrateTree(tree);
    try {
      expect(h.html).toContain('pending');
      expect(h.html).not.toContain('hydrated');
      expect(h.recoverable).toEqual([]);
      expect(h.mismatch).toEqual([]);
      // After the mount effect the real children replace the fallback.
      expect(h.container.querySelector('button')?.textContent).toBe('hydrated');
    } finally {
      h.cleanup();
    }
  });

  it('Slot: merged props and composed refs survive SSR + hydration', async () => {
    const forwarded = jest.fn();
    const childRef = jest.fn();
    const tree = (
      <Slot className="from-slot" ref={forwarded}>
        <div data-testid="slot-19" className="from-child" ref={childRef} />
      </Slot>
    );
    const h = await hydrateTree(tree);
    try {
      expect(h.recoverable).toEqual([]);
      expect(h.mismatch).toEqual([]);
      const node = h.container.querySelector('[data-testid="slot-19"]') as HTMLElement;
      expect(node.className).toContain('from-slot');
      expect(node.className).toContain('from-child');
      expect(forwarded).toHaveBeenCalledWith(node);
      expect(childRef).toHaveBeenCalledWith(node);
    } finally {
      h.cleanup();
    }
  });
});
