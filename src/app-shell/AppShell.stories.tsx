// AppShell.stories.tsx — SURF story contract (S-41).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AppShell } from './AppShell';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';
import { Inspector } from './Inspector';
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
