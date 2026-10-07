/** @jest-environment jsdom */
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { TopBar } from './TopBar';

describe('TopBar (SURF-028)', () => {
  it('renders chrome-surface header in the top slot', () => {
    render(
      <TopBar.Root>
        <TopBar.Title>Workspace</TopBar.Title>
        <TopBar.Trailing>
          <button type="button">act</button>
        </TopBar.Trailing>
      </TopBar.Root>,
    );
    const el = document.querySelector('[data-ag-part="top-bar"]')!;
    expect(el.tagName).toBe('HEADER');
    expect(el).toHaveAttribute('data-ag-slot', 'top');
    expect(el).toHaveAttribute('data-ag-layer', 'chrome');
    expect(screen.getByText('Workspace')).toHaveAttribute('data-ag-part', 'top-bar-title');
  });

  it('scrollEdge=none renders no edge element', () => {
    const { container } = render(
      <TopBar.Root scrollEdge="none">
        <TopBar.Title>t</TopBar.Title>
      </TopBar.Root>,
    );
    expect(container.querySelector('[data-ag-edge]')).toBeNull();
  });

  it('a second top edge ScrollEdge dev-warns once', () => {
    const prevEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <TopBar.Root>
        <TopBar.Title>t</TopBar.Title>
      </TopBar.Root>,
    );
    // module-level set dedupes: two mounted roots with top edge warn once
    render(
      <TopBar.Root scrollEdge="soft">
        <TopBar.Title>u</TopBar.Title>
      </TopBar.Root>,
    );
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
    process.env['NODE_ENV'] = prevEnv;
  });
});
