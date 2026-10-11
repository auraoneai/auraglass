import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { AppShell } from './AppShell';
import { TopBar } from './TopBar';
import { StatusBar } from './StatusBar';
import { Pagination } from '../components/pagination/Pagination';
import { TabBar } from '../components/tab-bar/TabBar';
import { Sidebar } from './Sidebar';
import { Inspector } from './Inspector';
import { axe } from 'jest-axe';

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
    expect(el).toHaveAttribute('data-persist-key', 'prefs');
    // SURF-20: density/backdrop/collapseTo are gone from the contract
    expect(el.hasAttribute('data-ag-density')).toBe(false);
    expect(el.hasAttribute('data-ag-backdrop')).toBe(false);
    expect(el.hasAttribute('data-ag-collapse-to')).toBe(false);
    expect(el.hasAttribute('data-collapse-to')).toBe(false);
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
  it('full-shell landmark inventory: 1 complementary, labelled navs only, axe landmark rules clean (SURF-26)', async () => {
    const { container } = render(
      <AppShell.Root>
        <AppShell.SkipLink />
        <TopBar.Root>
          <TopBar.Title>t</TopBar.Title>
        </TopBar.Root>
        <Sidebar.Root>
          <Sidebar.Nav aria-label="Primary">
            <Sidebar.Item href="/a" current>A</Sidebar.Item>
          </Sidebar.Nav>
        </Sidebar.Root>
        <AppShell.Main>body</AppShell.Main>
        <Inspector.Root aria-label="Properties">props</Inspector.Root>
        <StatusBar.Root>
          <StatusBar.Item>x</StatusBar.Item>
        </StatusBar.Root>
        <TabBar.Root aria-label="Sections">
          <TabBar.Item href="/a" current>A</TabBar.Item>
        </TabBar.Root>
      </AppShell.Root>,
    );
    expect({
      complementary: screen.getAllByRole('complementary').map((el) => el.getAttribute('aria-label')),
      navigation: screen.getAllByRole('navigation').map((el) => el.getAttribute('aria-label')).sort(),
      main: screen.getAllByRole('main').length,
      bannerAtMostOne: screen.queryAllByRole('banner').length <= 1,
      region: screen.queryAllByRole('region').length,
      contentinfo: screen.queryAllByRole('contentinfo').length,
      sidebarIsLandmark: document.querySelector('[data-ag-part="sidebar"]')!.tagName,
    }).toEqual({
      complementary: ['Properties'],
      navigation: ['Primary', 'Sections'],
      main: 1,
      bannerAtMostOne: true,
      region: 0,
      contentinfo: 0,
      sidebarIsLandmark: 'DIV',
    });
    const results = (await axe(container, {
      runOnly: {
        type: 'rule',
        values: ['landmark-unique', 'landmark-no-duplicate-banner', 'landmark-no-duplicate-main', 'landmark-complementary-is-top-level'],
      },
    })) as { violations: { id: string }[] };
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  it('two Sidebar.Nav aria-label="Primary" produce exactly one duplicate-landmark warning (SURF-26)', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <AppShell.Root>
        <Sidebar.Root>
          <Sidebar.Nav aria-label="Primary">
            <Sidebar.Item href="/a">A</Sidebar.Item>
          </Sidebar.Nav>
          <Sidebar.Nav aria-label="Primary">
            <Sidebar.Item href="/b">B</Sidebar.Item>
          </Sidebar.Nav>
        </Sidebar.Root>
        <AppShell.Main />
      </AppShell.Root>,
    );
    const hits = warn.mock.calls.filter((args) => String(args[0]).includes("duplicate landmark name 'Primary'"));
    expect(hits).toHaveLength(1);
    warn.mockRestore();
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

  // ---- REQ-SURF-18: per-shell main ids shared with SkipLink ----
  it('two shells get distinct useId main ids; each skip link targets its own main', () => {
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
    expect(a).toMatch(/^ag-main-[A-Za-z0-9_-]+$/);
    expect(b).toMatch(/^ag-main-[A-Za-z0-9_-]+$/);
    expect(a).not.toBe(b);
    expect(screen.getByTestId('skip-a').getAttribute('href')).toBe(`#${a}`);
    expect(screen.getByTestId('skip-b').getAttribute('href')).toBe(`#${b}`);
    expect(screen.getByTestId('main-a').tabIndex).toBe(-1);
  });

  it('explicit Main id and SkipLink href win', () => {
    render(
      <AppShell.Root>
        <AppShell.SkipLink data-testid="skip" />
        <AppShell.Main id="page-main" />
      </AppShell.Root>,
    );
    expect(screen.getByRole('main').id).toBe('page-main');
    expect(screen.getByTestId('skip').getAttribute('href')).toBe('#page-main');
  });

  it('dev-warns when SkipLink is not the first child of Root, and not when it is', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const skipWarnings = () =>
      warn.mock.calls.filter((args) => String(args[0]).includes('SkipLink should be the first child'));
    const { unmount } = render(
      <AppShell.Root>
        <AppShell.SkipLink />
        <AppShell.Main />
      </AppShell.Root>,
    );
    expect(skipWarnings()).toHaveLength(0);
    unmount();
    render(
      <AppShell.Root>
        <AppShell.Main />
        <AppShell.SkipLink />
      </AppShell.Root>,
    );
    expect(skipWarnings()).toHaveLength(1);
    warn.mockRestore();
  });

  // ---- REQ-SURF-21: no render-phase cookie read; effect-time hydrate ----
  it('reads document.cookie 0 times during render; persisted state hydrates in an effect', () => {
    // Render-phase detector: while a component body runs, React installs a
    // hooks dispatcher whose useState and useEffect differ; outside render
    // (commit, effects, idle) the installed dispatcher is null or throws for
    // every hook, so both slots are the same function. Calibrated below so a
    // React-internals change fails this test loudly instead of passing.
    const internals = (React as unknown as Record<string, { H?: { useState: unknown; useEffect: unknown } | null }>)
      .__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE!;
    const rendering = () => !!internals.H && internals.H.useState !== internals.H.useEffect;
    const calibration: boolean[] = [];
    const Calibrate = () => {
      calibration.push(rendering());
      React.useLayoutEffect(() => void calibration.push(rendering()), []);
      React.useEffect(() => void calibration.push(rendering()), []);
      return null;
    };
    render(<Calibrate />).unmount();
    expect(calibration).toEqual([true, false, false]);
    expect(rendering()).toBe(false);

    document.cookie = 'ag-shell-prefs=sidebar:rail,inspector:open; Path=/';
    const reads: boolean[] = [];
    const desc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')!;
    const get = jest.spyOn(Document.prototype, 'cookie', 'get').mockImplementation(function (this: Document) {
      reads.push(rendering());
      return desc.get!.call(this) as string;
    });
    try {
      render(
        <AppShell.Root persistKey="prefs" data-testid="shell">
          <AppShell.SidebarToggle />
          <AppShell.InspectorToggle />
          <AppShell.Main />
        </AppShell.Root>,
      );
    } finally {
      get.mockRestore();
    }
    // 0 reads in render; the effect-time hydrate did read (spy is live).
    expect({ renderReads: reads.filter(Boolean).length, effectReads: reads.filter((r) => !r).length > 0 }).toEqual({
      renderReads: 0,
      effectReads: true,
    });
    const el = screen.getByTestId('shell');
    expect({ sidebar: el.dataset['agSidebar'], inspector: el.dataset['agInspector'] }).toEqual({
      sidebar: 'rail',
      inspector: 'open',
    });
    document.cookie = 'ag-shell-prefs=; Path=/; Max-Age=0';
  });
});
