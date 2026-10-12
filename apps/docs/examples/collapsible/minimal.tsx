import { Collapsible } from 'aura-glass';

export default function CollapsibleMinimal() {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger>Show details</Collapsible.Trigger>
      <Collapsible.Content>Build 4127 finished in 3 minutes.</Collapsible.Content>
    </Collapsible.Root>
  );
}
