import { MobileShell, TopBar } from 'aura-glass/app-shell';
import { TabBar } from 'aura-glass';

export default function MobileShellMinimal() {
  return (
    <MobileShell
      topBar={<TopBar.Root><TopBar.Title>Inbox</TopBar.Title></TopBar.Root>}
      tabBar={
        <TabBar.Root aria-label="Sections">
          <TabBar.Item href="#inbox" current>Inbox</TabBar.Item>
          <TabBar.Item href="#search">Search</TabBar.Item>
        </TabBar.Root>
      }
    >
      <p>Messages</p>
    </MobileShell>
  );
}
