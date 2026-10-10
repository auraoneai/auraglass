import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { AppShell } from './AppShell';
import { TopBar } from './TopBar';
import { StatusBar } from './StatusBar';
import { Pagination } from '../components/pagination/Pagination';

describe('5.0 AppShell (SURF-024)', () => {
  it('renders slots wrapped in memo/HOC in the right grid areas', () => {
    const MemoTop = React.memo(() => <TopBar.Root>tb</TopBar.Root>);
    const Hoc = () => <MemoTop />;
    render(
      <AppShell.Root>
        <AppShell.SkipLink />
        <Hoc />
        <AppShell.Main>body</AppShell.Main>
        <StatusBar.Root>
          <StatusBar.Item>st</StatusBar.Item>
        </StatusBar.Root>
      </AppShell.Root>,
    );
    const rootEl = document.querySelector('.ag-app-shell')!;
    expect(rootEl.querySelector('[data-ag-slot="top"]')).not.toBeNull();
    expect(rootEl.querySelector('[data-ag-slot="main"]')).not.toBeNull();
    expect(rootEl.querySelector('[data-ag-slot="status"]')).not.toBeNull();
    expect(rootEl.querySelector('[data-ag-slot="skip"]')).not.toBeNull();
  });

  it('renders a single main landmark', () => {
    render(
      <AppShell.Root>
        <AppShell.Main>body</AppShell.Main>
      </AppShell.Root>,
    );
    expect(screen.getAllByRole('main')).toHaveLength(1);
  });

  it('props render as data attributes', () => {
    render(
      <AppShell.Root
        data-testid="shell"
        defaultSidebar="rail"
        defaultInspector="open"
        sidebarSide="end"
        layout="desktop"
        persistKey="prefs"
      >
        <AppShell.Main />
      </AppShell.Root>,
    );
    const el = screen.getByTestId('shell');
    expect(el).toHaveAttribute('data-ag-part', 'root');
    expect(el).toHaveAttribute('data-ag-sidebar', 'rail');
    expect(el).toHaveAttribute('data-ag-inspector', 'open');
    expect(el).toHaveAttribute('data-ag-sidebar-side', 'end');
    expect(el).toHaveAttribute('data-ag-layout', 'desktop');
    expect(el).toHaveAttribute('data-ag-persist-key', 'prefs');
    // SURF-20: density/backdrop/collapseTo are gone from the contract
    expect(el.hasAttribute('data-ag-density')).toBe(false);
    expect(el.hasAttribute('data-ag-backdrop')).toBe(false);
    expect(el.hasAttribute('data-ag-collapse-to')).toBe(false);
  });

  it('page header uses the requested heading level', () => {
    render(
      <AppShell.PageHeader title="Settings" headingLevel={3} eyebrow="Area" description="Desc" actions={<button>a</button>} />,
    );
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Settings');
    expect(heading).toHaveAttribute('data-ag-part', 'title');
  });

  it('landmark inventory: banner<=1, main=1, labelled navs only', () => {
    render(
      <AppShell.Root>
        <TopBar.Root>
          <TopBar.Title>t</TopBar.Title>
        </TopBar.Root>
        <AppShell.Main>body</AppShell.Main>
        <StatusBar.Root>
          <StatusBar.Item>x</StatusBar.Item>
        </StatusBar.Root>
      </AppShell.Root>,
    );
    expect(screen.getAllByRole('main')).toHaveLength(1);
    // at most one banner landmark in a full shell
    expect(screen.queryAllByRole('banner').length).toBeLessThanOrEqual(1);
    // status bar has no landmark role
    expect(document.querySelector('[data-ag-part="status-bar"]')).not.toBeNull();
    expect(screen.queryAllByRole('status')).toHaveLength(0);
  });
  it('duplicate landmark names warn once (SURF-26)', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <>
        <Pagination.Root page={1} pageCount={3} getHref={(p: number) => `?p=${p}`} aria-label="Seiten" />
        <Pagination.Root page={1} pageCount={3} getHref={(p: number) => `?q=${p}`} aria-label="Seiten" />
      </>,
    );
    await Promise.resolve();
    const hits = warn.mock.calls.flat().filter((c) => typeof c === 'string' && c.includes('duplicate landmark'));
    expect({ hits: hits.length }).toEqual({ hits: 1 });
    warn.mockRestore();
  });
});
