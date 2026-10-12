import { ColorPicker } from 'aura-glass';

export default function ColorPickerMinimal() {
  return (
    <ColorPicker.Root defaultValue="#3b82f6">
      <ColorPicker.Trigger />
      <ColorPicker.Content>
        <ColorPicker.Area />
        <ColorPicker.Hue />
      </ColorPicker.Content>
    </ColorPicker.Root>
  );
}
