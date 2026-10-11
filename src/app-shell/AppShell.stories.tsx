// AppShell.stories.tsx — SURF story contract (S-41).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AppShell } from './AppShell';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';
import { Inspector } from './Inspector';
import { MobileShell } from './MobileShell';
import { Tabs } from '../components/tabs/Tabs';
import { TabBar } from '../components/tab-bar/TabBar';
import { createBrandTheme } from '../theme/createBrandTheme';
import type { Oklch } from '../theme/color';

const meta: Meta = {
  title: 'surf/app-shell',
  component: AppShell.Root,
  // fullscreen: the shell is 100dvh, so story padding would scroll the document (SURF-19).
  parameters: { layout: 'fullscreen', ag: { subject: 'AppShell', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => <AppShell.Root><TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root><Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home">Home</Sidebar.Item></Sidebar.Nav></Sidebar.Root><AppShell.Main><p>Content</p></AppShell.Main><StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item></StatusBar.Root></AppShell.Root> };
export const RTL: Story = { render: () => <AppShell.Root><TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root><Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home">Home</Sidebar.Item></Sidebar.Nav></Sidebar.Root><AppShell.Main><p>Content</p></AppShell.Main><StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item></StatusBar.Root></AppShell.Root>, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => <AppShell.Root><TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root><Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home">Home</Sidebar.Item></Sidebar.Nav></Sidebar.Root><AppShell.Main><p>Content</p></AppShell.Main><StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item></StatusBar.Root></AppShell.Root>, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => <AppShell.Root><TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root><Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home">Home</Sidebar.Item></Sidebar.Nav></Sidebar.Root><AppShell.Main><p>Content</p></AppShell.Main><StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item></StatusBar.Root></AppShell.Root>, parameters: { globals: { forcedColors: 'active' } } };

const rows = (n: number, label: string) =>
  Array.from({ length: n }, (_, i) => <p key={i}>{`${label} row ${i + 1}`}</p>);

/** SURF-18: SkipLink first, then a focusable top bar control before Main. */
export const SkipLink: Story = {
  render: () => (
    <AppShell.Root>
      <AppShell.SkipLink />
      <TopBar.Root><TopBar.Title>App</TopBar.Title><button type="button">Top action</button></TopBar.Root>
      <Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home">Home</Sidebar.Item></Sidebar.Nav></Sidebar.Root>
      <AppShell.Main><h1>Page</h1><p>Content</p></AppShell.Main>
    </AppShell.Root>
  ),
};

/** SURF-19: Main, Sidebar.Content and Inspector.Content all overflow; only they scroll. */
export const ScrollOwnership: Story = {
  render: () => (
    <AppShell.Root defaultInspector="open">
      <AppShell.SkipLink />
      <TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root>
      <Sidebar.Root><Sidebar.Content>{rows(80, 'Sidebar')}</Sidebar.Content></Sidebar.Root>
      <AppShell.Main>{rows(200, 'Main')}</AppShell.Main>
      <Inspector.Root aria-label="Details"><Inspector.Content>{rows(80, 'Inspector')}</Inspector.Content></Inspector.Root>
      <StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item></StatusBar.Root>
    </AppShell.Root>
  ),
};

/** SURF-24/25/26: every chrome part at once — the first focusable is the top
    bar action (theme.spec focuses it by keyboard), the sidebar has a current
    item, Main carries Tabs with an indicator, the bottom TabBar has a current
    item. Identical markup across the brand stories below: only the theme
    scope changes, never a prop. */
const Chrome = () => (
  <AppShell.Root defaultInspector="open">
    <TopBar.Root>
      <button type="button" data-testid="top-action">Top action</button>
      <TopBar.Title>App</TopBar.Title>
      <AppShell.SidebarToggle />
    </TopBar.Root>
    <Sidebar.Root>
      <Sidebar.Nav aria-label="Primary">
        <Sidebar.Item href="#home" current>Home</Sidebar.Item>
        <Sidebar.Item href="#reports">Reports</Sidebar.Item>
      </Sidebar.Nav>
    </Sidebar.Root>
    <AppShell.Main>
      <AppShell.PageHeader title="Overview" actions={<button type="button">Share</button>} headingLevel={1} />
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">Alpha</Tabs.Tab>
          <Tabs.Tab value="b">Beta</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Panel value="a">Alpha content</Tabs.Panel>
        <Tabs.Panel value="b">Beta content</Tabs.Panel>
      </Tabs.Root>
    </AppShell.Main>
    <Inspector.Root aria-label="Details">Details</Inspector.Root>
    <StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item></StatusBar.Root>
    <TabBar.Root aria-label="Sections">
      <TabBar.Item href="#home" current>Home</TabBar.Item>
      <TabBar.Item href="#search">Search</TabBar.Item>
    </TabBar.Root>
  </AppShell.Root>
);

/** Applies createBrandTheme(brand) to a scope: its cssText targets
    [data-ag-theme="<id>"], so the scope element carries that id. */
const BrandScope = ({ brand, children }: { brand: Oklch; children: React.ReactNode }) => {
  const theme = React.useMemo(() => createBrandTheme(brand), [brand]);
  return (
    <>
      <style data-ag-brand-story="">{theme.cssText}</style>
      <div data-ag-theme={theme.id} data-testid="brand-scope">{children}</div>
    </>
  );
};

/** Two brand inputs (OKLCH l/c/h) a hue-half-turn apart. */
const BRAND_A: Oklch = { l: 0.55, c: 0.2, h: 250 };
const BRAND_B: Oklch = { l: 0.6, c: 0.2, h: 30 };

export const FullChrome: Story = { render: () => <Chrome /> };
export const BrandChromeA: Story = { render: () => <BrandScope brand={BRAND_A}><Chrome /></BrandScope> };
export const BrandChromeB: Story = { render: () => <BrandScope brand={BRAND_B}><Chrome /></BrandScope> };

/** SURF-23: a long title and several actions — under a 600px shell the
    actions drop to their own full-width row below the title. */
export const PageHeaderWrap: Story = {
  render: () => (
    <AppShell.Root>
      <TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root>
      <AppShell.Main>
        <AppShell.PageHeader
          title="Quarterly revenue by region and channel"
          actions={<><button type="button">Export</button><button type="button">Share</button><button type="button">Edit</button></>}
        />
      </AppShell.Main>
    </AppShell.Root>
  ),
};

const NAV = ['Home', 'Reports', 'Customers', 'Settings'];

/** SURF-29: rail sidebar — labels clip-hidden, names kept, hit boxes >=40/44. */
export const Rail: Story = {
  render: () => (
    <AppShell.Root defaultSidebar="rail">
      <TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root>
      <Sidebar.Root>
        <Sidebar.Nav aria-label="Primary">
          {NAV.map((n, i) => (
            <Sidebar.Item key={n} href={`#${n.toLowerCase()}`} current={i === 0} icon={<span>{n[0]}</span>}>{n}</Sidebar.Item>
          ))}
        </Sidebar.Nav>
      </Sidebar.Root>
      <AppShell.Main><p>Content</p></AppShell.Main>
    </AppShell.Root>
  ),
};

/** SURF-30: server-rendered collapsed sidebar — display:none + inert, never
    aria-hidden; the toggle is the only way back. */
export const Collapsed: Story = {
  render: () => (
    <AppShell.Root defaultSidebar="collapsed">
      <TopBar.Root><TopBar.Title>App</TopBar.Title><AppShell.SidebarToggle /></TopBar.Root>
      <Sidebar.Root>
        <Sidebar.Nav aria-label="Primary">
          {NAV.map((n) => <Sidebar.Item key={n} href={`#${n.toLowerCase()}`}>{n}</Sidebar.Item>)}
        </Sidebar.Nav>
      </Sidebar.Root>
      <AppShell.Main><p>Content</p></AppShell.Main>
    </AppShell.Root>
  ),
};

/** SURF-36: overlay top bar over a long Main where every row is focusable —
    a focused row is never under the bar. Long title + center region for the
    320px no-overflow check. */
export const OverlayTopBar: Story = {
  render: () => (
    <AppShell.Root>
      <TopBar.Root placement="overlay">
        <TopBar.Title>Quarterly revenue by region, channel and product line</TopBar.Title>
        <TopBar.Center><span>Search across every workspace and document</span></TopBar.Center>
        <TopBar.Trailing><button type="button">Share</button></TopBar.Trailing>
      </TopBar.Root>
      <AppShell.Main>
        {Array.from({ length: 40 }, (_, i) => (
          <p key={i}><a href={`#row-${i + 1}`}>{`Row ${i + 1}`}</a></p>
        ))}
      </AppShell.Main>
    </AppShell.Root>
  ),
};

/** SURF-40: MobileShell — the tab bar overlays Main; the last item scrolls
    fully clear of it. */
export const Mobile: Story = {
  render: () => (
    <MobileShell
      topBar={<TopBar.Title>App</TopBar.Title>}
      tabBar={
        <TabBar.Root aria-label="Sections">
          <TabBar.Item href="#home" current>Home</TabBar.Item>
          <TabBar.Item href="#search">Search</TabBar.Item>
        </TabBar.Root>
      }
    >
      {Array.from({ length: 60 }, (_, i) => (
        <p key={i} {...(i === 59 ? { 'data-testid': 'last-item' } : {})}>{`Item ${i + 1}`}</p>
      ))}
    </MobileShell>
  ),
};

/** REQ-SURF-17: the shell inside a fixed 900px host. Layout follows the
    shell's own container width, so at any viewport (1920px in layout.spec)
    the shell resolves medium: an expanded sidebar renders at rail width. */
export const ContainerPlayground: Story = {
  render: () => (
    <div data-testid="container-host" style={{ inlineSize: '900px', blockSize: '100dvh' }}>
      <AppShell.Root>
        <TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root>
        <Sidebar.Root>
          <Sidebar.Nav aria-label="Primary">
            {NAV.map((n, i) => (
              <Sidebar.Item key={n} href={`#${n.toLowerCase()}`} current={i === 0} icon={<span>{n[0]}</span>}>{n}</Sidebar.Item>
            ))}
          </Sidebar.Nav>
        </Sidebar.Root>
        <AppShell.Main><p>Content</p></AppShell.Main>
        <StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item></StatusBar.Root>
      </AppShell.Root>
    </div>
  ),
};

/* Page chrome: skip link and a full PageHeader inside Main. */
export const Anatomy: Story = {
  render: () => (
    <AppShell.Root>
      <AppShell.SkipLink />
      <AppShell.Main>
        <AppShell.PageHeader
          eyebrow="Projects"
          title="Atlas"
          description="Release train for the 5.0 line."
          actions={<span>Share</span>}
          tabs={<span>Overview</span>}
        />
      </AppShell.Main>
    </AppShell.Root>
  ),
};
