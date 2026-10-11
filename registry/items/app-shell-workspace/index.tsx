/* app-shell-workspace (SURF-060, REQ-SURF-41, SC-32): the archived
   'workspace' block as a registry item — AppShell frame + PageHeader with
   Tabs in its `tabs` slot (one Tabs.Panel per tab) + ResizablePanels whose
   document pane flows CMP Cards on .ag-app-shell__auto-grid and whose second
   pane holds an activity Timeline + an Inspector open by default.
   Public `aura-glass` imports only. No !important, no hex — tokens only. */
import * as React from 'react';
import { AppShell, Sidebar, TopBar, Inspector, ResizablePanels } from 'aura-glass/app-shell';
import { Card, Tabs, Timeline } from 'aura-glass';
import { WORKSPACE_ACTIVITY, WORKSPACE_CARDS, WORKSPACE_TABS, WORKSPACE_TITLE } from './fixtures';

function EditorPanel() {
  return (
    <ResizablePanels.Root orientation="horizontal">
      <ResizablePanels.Panel id="document" defaultSize={70} minSize={40}>
        <div className="ag-app-shell__auto-grid">
          {WORKSPACE_CARDS.map((card) => (
            <Card.Root key={card.id}>
              <Card.Header>
                <Card.Title>{card.title}</Card.Title>
              </Card.Header>
              <Card.Body>{card.body}</Card.Body>
            </Card.Root>
          ))}
        </div>
      </ResizablePanels.Panel>
      <ResizablePanels.Handle label="Resize document and activity" />
      <ResizablePanels.Panel id="activity" defaultSize={30} minSize={20}>
        <Timeline items={WORKSPACE_ACTIVITY} aria-label="Document activity" />
      </ResizablePanels.Panel>
    </ResizablePanels.Root>
  );
}

export function AppShellWorkspace() {
  return (
    <AppShell.Root defaultInspector="open">
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
        {/* Tabs.Root spans the header and the panels so the tablist in the
            PageHeader `tabs` slot controls the panels below it. */}
        <Tabs.Root defaultValue="editor" aria-label="Workspace views">
          <AppShell.PageHeader
            title={WORKSPACE_TITLE}
            tabs={
              <Tabs.List>
                {WORKSPACE_TABS.map((tab) => (
                  <Tabs.Tab key={tab.id} value={tab.id}>
                    {tab.label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            }
          />
          <Tabs.Panel value="editor">
            <EditorPanel />
          </Tabs.Panel>
          <Tabs.Panel value="preview">
            <p>Preview of {WORKSPACE_TITLE}</p>
          </Tabs.Panel>
          <Tabs.Panel value="history">
            <p>Version history</p>
          </Tabs.Panel>
        </Tabs.Root>
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
