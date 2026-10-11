/* Contract seed (QUAL): §6.3 material assertions that hold against the seed —
   materialProps output equals MaterialAttributes for a table of roles; Surface passes
   style through untouched and emits only registered attributes. */
import * as React from 'react';
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { materialProps, Surface } from '../../src/material/index';
import { AG_ATTRIBUTES } from '../../src/contracts/material';

const CASES: Array<[Parameters<typeof materialProps>[0], Record<string, string>]> = [
  [{}, { 'data-ag-surface': '', 'data-ag-layer': 'content', 'data-ag-content': 'content-raised' }],
  [{ layer: 'overlay' }, { 'data-ag-surface': '', 'data-ag-layer': 'overlay', 'data-ag-variant': 'regular' }],
  [{ layer: 'overlay', variant: 'clear' }, { 'data-ag-surface': '', 'data-ag-layer': 'overlay', 'data-ag-variant': 'clear' }],
  [{ layer: 'content', variant: 'identity' },
    { 'data-ag-surface': '', 'data-ag-layer': 'content', 'data-ag-variant': 'identity', 'data-ag-content': 'content-raised' }],
  [{ layer: 'transient', content: 'content-raised' },
    { 'data-ag-surface': '', 'data-ag-layer': 'transient', 'data-ag-variant': 'regular' }],
  [{ thickness: 'thick', shape: 'concentric', interactive: true, prominent: true },
    { 'data-ag-surface': '', 'data-ag-layer': 'content', 'data-ag-content': 'content-raised',
      'data-ag-thickness': 'thick', 'data-ag-shape': 'concentric',
      'data-ag-interactive': '', 'data-ag-prominent': '' }],
];

describe('materialProps emission rules (final, S-05)', () => {
  it.each(CASES)('role %j -> %j', (role, expected) => {
    expect(materialProps(role)).toEqual(expected);
  });
});

describe('Surface seed (S-06)', () => {
  it('passes style through untouched', () => {
    const style = { color: 'rebeccapurple', padding: 7 };
    const { container } = render(<Surface style={style} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.color).toBe('rebeccapurple');
    expect(el.style.padding).toBe('7px');
  });

  it('emits only registered attributes', () => {
    const { container } = render(<Surface layer="overlay" variant="clear" interactive />);
    const el = container.firstElementChild as HTMLElement;
    // REQ-QUAL-31: assert the set is non-empty before checking membership, so an empty set cannot pass.
    const agAttributes = el.getAttributeNames().filter((name) => name.startsWith('data-ag-'));
    expect(agAttributes.length).toBeGreaterThan(0);
    for (const name of agAttributes) expect(Object.keys(AG_ATTRIBUTES)).toContain(name);
  });

  it('renders the render prop element instead of the div fallback', () => {
    const { container } = render(<Surface render={<section data-x="1" />} className="x" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe('SECTION');
    expect(el.hasAttribute('data-ag-surface')).toBe(true);
    expect(el.className).toContain('x');
  });
});
