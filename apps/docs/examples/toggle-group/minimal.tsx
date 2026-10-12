import { ToggleGroup } from 'aura-glass';

export default function ToggleGroupMinimal() {
  return (
    <ToggleGroup.Root defaultValue={['bold']} aria-label="Text style">
      <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
      <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
      <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}
