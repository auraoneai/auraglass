import { Tabs } from 'aura-glass';

export default function TabsMinimal() {
  return (
    <Tabs.Root defaultValue="general">
      <Tabs.List>
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab value="billing">Billing</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="general">General settings</Tabs.Panel>
      <Tabs.Panel value="billing">Billing settings</Tabs.Panel>
    </Tabs.Root>
  );
}
