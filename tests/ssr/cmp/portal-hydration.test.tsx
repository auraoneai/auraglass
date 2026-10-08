/* CMP-028: Portal SSR contract — renderToString emits no portal content; hydrateRoot
   produces 0 hydration warnings; after flush the content sits under the provider's
   [data-ag-portal-root]. */
import * as React from 'react';
import { describe, expect, it, jest, afterEach } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { act } from 'react';
import { Portal } from '../../../src/primitives/Portal';
import { AuraGlassProvider } from '../../../src/theme/index';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const App = () => (
  <AuraGlassProvider>
    <div data-testid="app-root">app</div>
    <Portal><div data-testid="portal-content">portalled</div></Portal>
  </AuraGlassProvider>
);

afterEach(() => {
  jest.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('Portal server render', () => {
  it('renderToString emits no portal content', () => {
    const html = renderToString(<App />);
    expect(html).not.toContain('portal-content');
    expect(html).toContain('app-root');
  });
});

describe('Portal hydration', () => {
  it('hydrates with 0 warnings and mounts under the provider portal root', async () => {
    const html = renderToString(<App />);
    const host = document.createElement('div');
    host.innerHTML = html;
    document.body.appendChild(host);

    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await act(async () => {
      hydrateRoot(host, <App />);
    });
    const hydrationWarnings = errSpy.mock.calls.filter((c) => /hydrat|did not match|mismatch/i.test(String(c[0])));
    expect(hydrationWarnings).toEqual([]);

    // after the flush, portal content sits under [data-ag-portal-root]
    const portalRoot = document.querySelector('[data-ag-portal-root]');
    expect(portalRoot).not.toBeNull();
    const content = portalRoot!.querySelector('[data-testid="portal-content"]');
    expect(content).not.toBeNull();
    // exactly one portal root exists
    expect(document.querySelectorAll('[data-ag-portal-root]')).toHaveLength(1);
  });
});
