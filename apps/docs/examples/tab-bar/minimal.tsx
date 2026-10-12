import { TabBar } from 'aura-glass';

export default function TabBarMinimal() {
  return (
    <TabBar.Root aria-label="Sections">
      <TabBar.Item href="#home" current>Home</TabBar.Item>
      <TabBar.Item href="#search">Search</TabBar.Item>
      <TabBar.Item href="#profile">Profile</TabBar.Item>
    </TabBar.Root>
  );
}
