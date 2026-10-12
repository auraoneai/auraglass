import { Command, CommandPalette } from 'aura-glass';

export default function CommandPaletteMinimal() {
  return (
    <CommandPalette>
      <Command.Input placeholder="Type a command…" />
      <Command.List>
        <Command.Item value="new">New document</Command.Item>
        <Command.Item value="settings">Open settings</Command.Item>
      </Command.List>
    </CommandPalette>
  );
}
