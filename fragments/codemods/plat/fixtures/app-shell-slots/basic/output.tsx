import { AppShell } from 'aura-glass';
import { Sidebar } from 'aura-glass';
import { TopBar } from 'aura-glass';
const navItems = [{ id: 'home', label: 'Home', onClick: () => go() }];
export const p = <AppShell.Root>
      <TopBar />
      <Sidebar>
        <Sidebar.Nav>
          <Sidebar.Item value="home" onSelect={() => go()}>
            Home
          </Sidebar.Item>
        </Sidebar.Nav>
      </Sidebar>
      <AppShell.Main>
        <h1>T</h1>
      </AppShell.Main>
    </AppShell.Root>;
