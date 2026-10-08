/* app-shell-workspace (SURF-060, SC-32): the archived 'workspace' block as a
   registry item — AppShell frame + page-header Tabs + ResizablePanels +
   docked Inspector; content lands in .ag-app-shell__auto-grid. Asserts
   sidebar-beside-main and docked inspector at 1440px in its capability test.
   No !important, no hex — tokens only. */
import * as React from 'react';
import { AppShell, Sidebar, TopBar, Inspector, ResizablePanels } from 'aura-glass/app-shell';
import { Tabs } from 'aura-glass';
import { WORKSPACE_TABS, WORKSPACE_TITLE } from './fixtures';

export function AppShellWorkspace() {
  return (
    <AppShell.Root>
      <TopBar.Root>
        <TopBar.Leading>
          <strong>{WORKSPACE_TITLE}</strong>
        </TopBar.Leading>
      </TopBar.Root>
      <Sidebar.Root labels={{ navigation: 'Workspace' }}>
        <Sidebar.Nav aria-label="Workspace">
          <Sidebar.Item href="#files" current>Files</Sidebar.Item>
          <Sidebar.Item href="#search">Search</Sidebar.Item>
        </Sidebar.Nav>
      </Sidebar.Root>
      <AppShell.Main>
        <AppShell.PageHeader
          title={WORKSPACE_TITLE}
          actions={
            <Tabs.Root defaultValue="editor" aria-label="Workspace views">
              <Tabs.List>
                {WORKSPACE_TABS.map((tab) => (
                  <Tabs.Tab key={tab.id} value={tab.id}>
                    {tab.label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs.Root>
          }
        />
        <ResizablePanels.Root direction="horizontal">
          <ResizablePanels.Panel id="document" defaultSize={70} minSize={40}>
            <div className="ag-app-shell__auto-grid">
              <p>Document content</p>
            </div>
          </ResizablePanels.Panel>
          <ResizablePanels.Handle label="Resize document and outline" />
          <ResizablePanels.Panel id="outline" defaultSize={30} minSize={20}>
            <p>Outline</p>
          </ResizablePanels.Panel>
        </ResizablePanels.Root>
      </AppShell.Main>
      <Inspector.Root aria-label="Inspector">
        <Inspector.Header title="Properties" />
        <Inspector.Content>
          <Inspector.Section title="Document" defaultOpen>
            <p>No selection.</p>
          </Inspector.Section>
        </Inspector.Content>
      </Inspector.Root>
    </AppShell.Root>
  );
}
