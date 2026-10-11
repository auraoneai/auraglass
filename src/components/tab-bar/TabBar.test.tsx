/** @jest-environment jsdom */
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { TabBar } from './TabBar';

describe('TabBar (SURF-073)', () => {
  it('renders a labelled nav landmark with link items (no tab roles)', () => {
    render(
      <TabBar.Root aria-label="Primary">
        <TabBar.Item href="/a" current>Home</TabBar.Item>
        <TabBar.Item href="/b">Search</TabBar.Item>
        <TabBar.Item href="/c">Library</TabBar.Item>
      </TabBar.Root>,
    );
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeTruthy();
    expect(document.querySelector('[data-ag-slot="tabbar"]')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(document.querySelector('[data-ag-part="tab-bar"][role]')).toBeNull();
  });

  it('dev-warns on >5 items', () => {
    const prevEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <TabBar.Root aria-label="Many">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <TabBar.Item key={n} href={`/${n}`}>i{n}</TabBar.Item>
        ))}
      </TabBar.Root>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('2..5'));
    warn.mockRestore();
    process.env['NODE_ENV'] = prevEnv;
  });

  it('floating placement lands data-ag-placement=floating', () => {
    render(
      <TabBar.Root aria-label="P" placement="floating">
        <TabBar.Item href="/a">a</TabBar.Item>
      </TabBar.Root>,
    );
    expect(document.querySelector('[data-ag-part="tab-bar"]')).toHaveAttribute(
      'data-ag-placement',
      'floating',
    );
  });

  it('semantics=tabs renders tablist roles and links items to panels', () => {
    render(
      <TabBar.Root aria-label="P" semantics="tabs">
        <TabBar.Item value="x" href="/x">X</TabBar.Item>
      </TabBar.Root>,
    );
    expect(document.querySelector('[role="tablist"]')).not.toBeNull();
    expect(screen.getByRole('tab')).toHaveAttribute('data-value', 'x');
  });
});
