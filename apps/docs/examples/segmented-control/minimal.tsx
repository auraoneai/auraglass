import { SegmentedControl } from 'aura-glass';

export default function SegmentedControlMinimal() {
  return (
    <SegmentedControl.Root aria-label="View" name="view" defaultValue="grid">
      <SegmentedControl.Item value="list">List</SegmentedControl.Item>
      <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
