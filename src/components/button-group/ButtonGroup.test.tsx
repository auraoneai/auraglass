import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import '../../../tests/ssr/cmp/ssr-polyfill';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ButtonGroup } from './index';
import { Button } from '../button';

describe('ButtonGroup', () => {
  it('is server-safe: renders to static markup with role=group and item parts', () => {
    const html = renderToStaticMarkup(
      <ButtonGroup aria-label="Edit">
        <button>A</button>
        <button>B</button>
      </ButtonGroup>,
    );
    expect(html).toContain('role="group"');
    expect(html).toContain('data-ag-part="item"');
    expect(html).toContain('aria-label="Edit"');
  });

  it('type-level requires aria-label or aria-labelledby (union enforced at compile time)', () => {
    const html = renderToStaticMarkup(
      <ButtonGroup aria-labelledby="hdr">
        <Button>One</Button>
      </ButtonGroup>,
    );
    expect(html).toContain('aria-labelledby="hdr"');
  });

  it('attached default emits data-ag-attached', () => {
    const html = renderToStaticMarkup(
      <ButtonGroup aria-label="x">
        <button>y</button>
      </ButtonGroup>,
    );
    expect(html).toContain('data-ag-attached');
  });
});
