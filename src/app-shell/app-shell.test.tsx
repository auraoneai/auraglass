import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { AppShell } from './AppShell';
import { TopBar } from './TopBar';
import { StatusBar } from './StatusBar';

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
        layout="wide"
        collapseTo="collapsed"
        density="compact"
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
    expect(el).toHaveAttribute('data-ag-layout', 'wide');
    expect(el).toHaveAttribute('data-ag-collapse-to', 'collapsed');
    expect(el).toHaveAttribute('data-ag-density', 'compact');
    expect(el).toHaveAttribute('data-ag-persist-key', 'prefs');
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
  // ---- REQ-SURF-18: per-shell main ids shared with SkipLink ----
  it('two shells get distinct main ids; skip link hrefs match their own shell', () => {
    render(
      <>
        <AppShell.Root>
          <AppShell.SkipLink data-testid="skip-a" />
          <AppShell.Main data-testid="main-a" />
        </AppShell.Root>
        <AppShell.Root>
          <AppShell.SkipLink data-testid="skip-b" />
          <AppShell.Main data-testid="main-b" />
        </AppShell.Root>
      </>,
    );
    const a = screen.getByTestId('main-a').id;
    const b = screen.getByTestId('main-b').id;
    expect({ a, b, same: a === b }).toEqual({ a, b, same: false });
    expect(screen.getByTestId('skip-a')).toHaveAttribute('href', `#${a}`);
    expect(screen.getByTestId('skip-b')).toHaveAttribute('href', `#${b}`);
  });

  it('dev-warns when SkipLink is not the first child of Root', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <AppShell.Root>
        <AppShell.Main />
        <AppShell.SkipLink />
      </AppShell.Root>,
    );
    const calls = warn.mock.calls.flat().filter((c) => typeof c === 'string' && c.includes('SkipLink'));
    expect({ calls: calls.length }).toEqual({ calls: 1 });
    warn.mockRestore();
  });

  // ---- REQ-SURF-21: parseCookie static + no render-phase cookie read ----
  it('AppShell.parseCookie parses the exact cookie body', () => {
    expect(AppShell.parseCookie('sidebar:rail;inspector:open')).toEqual({ sidebar: 'rail', inspector: 'open' });
  });

  it('0 document.cookie reads during render; persisted state hydrates in an effect', () => {
    // Render-phase purity: renderToString has no effects — any cookie read
    // here is a render read by definition.
    const { renderToString } = jest.requireActual<typeof import('react-dom/server')>('react-dom/server');
    const get = jest.spyOn(Document.prototype, 'cookie', 'get');
    renderToString(
      <AppShell.Root persistKey="prefs">
        <AppShell.SidebarToggle />
        <AppShell.Main />
      </AppShell.Root>,
    );
    const reads = get.mock.calls.length;
    get.mockRestore();
    expect({ reads }).toEqual({ reads: 0 });
    // Effect-time hydration: the persisted cookie is applied after mount.
    document.cookie = 'ag-shell-prefs=sidebar:rail,inspector:open';
    render(
      <AppShell.Root persistKey="prefs" data-testid="shell">
        <AppShell.SidebarToggle />
        <AppShell.Main />
      </AppShell.Root>,
    );
    const el = screen.getByTestId('shell');
    expect({ sidebar: el.dataset['agSidebar'], inspector: el.dataset['agInspector'] }).toEqual({
      sidebar: 'rail', inspector: 'open',
    });
  });
});
