import { Select } from 'aura-glass';

export default function SelectMinimal() {
  return (
    <Select.Root name="region" aria-label="Region">
      <Select.Trigger placeholder="Choose a region" />
      <Select.Content>
        <Select.Item value="eu" label="Europe" />
        <Select.Item value="us" label="United States" />
      </Select.Content>
    </Select.Root>
  );
}
