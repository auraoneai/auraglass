/** REQ-FIN-08 (QUAL-69): the S-40 helper contract — S-01 attributes on the
    document root, awaited hydration, banned-attribute scan. */
import { describe, it, expect } from '@jest/globals';
import * as React from 'react';
import { renderAg, renderAgServer, expectParts, expectNoBannedAttributes } from '../index';

describe('renderAg', () => {
  it('stamps the S-01 environment attribute set on document.documentElement', () => {
    const r = renderAg(React.createElement('div'), {
      scheme: 'dark', contrast: 'more', transparency: 'solid', motion: 'calm', tier: 'enhanced',
    });
    const html = document.documentElement;
    expect(html.getAttribute('data-ag-root')).toBe('');
    expect(html.getAttribute('data-ag-scheme')).toBe('dark');
    expect(html.getAttribute('data-ag-contrast')).toBe('more');
    expect(html.getAttribute('data-ag-transparency')).toBe('solid');
    expect(html.getAttribute('data-ag-motion')).toBe('calm');
    expect(html.getAttribute('data-ag-tier')).toBe('enhanced');
    r.unmount();
    expect(html.hasAttribute('data-ag-root')).toBe(false);
    expect(html.hasAttribute('data-ag-scheme')).toBe(false);
  });

  it('maps backdrop env onto the S-01 data-ag-backdrop attribute', () => {
    const r = renderAg(React.createElement('div'), { backdrop: 'photo' as never, provider: false });
    expect(document.documentElement.getAttribute('data-ag-backdrop')).toBe('photo');
    r.unmount();
  });

  it('provider=false renders without AuraGlassProvider', () => {
    const r = renderAg(React.createElement('div', { 'data-x': '1' }), { provider: false });
    expect(r.container.querySelector('[data-ag-provider]')).toBeNull();
  });
});

describe('renderAgServer', () => {
  it('returns html and a hydrate() that resolves after hydration ran', async () => {
    const ui = React.createElement('div', { 'data-x': 'y' }, 'hello');
    const { html, hydrate } = renderAgServer(ui);
    expect(html).toContain('hello');
    const { warnings } = await hydrate();
    expect(Array.isArray(warnings)).toBe(true);
  });
});

describe('expectParts / expectNoBannedAttributes', () => {
  it('expectParts matches the declared part set exactly', () => {
    const r = renderAg(
      React.createElement('div', null,
        React.createElement('span', { 'data-ag-part': 'root' }),
        React.createElement('span', { 'data-ag-part': 'icon' })),
      { provider: false },
    );
    expectParts(r.container, { parts: ['root', 'icon'] });
    expect(() => expectParts(r.container, { parts: ['root'] })).toThrow();
  });

  it('expectNoBannedAttributes fails on a banned attribute', () => {
    const r = renderAg(React.createElement('div', { 'data-ag-seed': 'x' }), { provider: false });
    expect(() => expectNoBannedAttributes(r.container)).toThrow();
    const ok = renderAg(React.createElement('div'), { provider: false });
    expectNoBannedAttributes(ok.container);
  });
});

describe('listSubjects', () => {
  it('throws when no subject index is reachable', async () => {
    const prev = process.env.AG_STORYBOOK_URL;
    process.env.AG_STORYBOOK_URL = 'http://127.0.0.1:1'; // nothing listens
    try {
      const { listSubjects } = await import('../index');
      await expect(listSubjects()).rejects.toThrow(/no subject index reachable/);
    } finally {
      if (prev === undefined) delete process.env.AG_STORYBOOK_URL; else process.env.AG_STORYBOOK_URL = prev;
    }
  });
});
