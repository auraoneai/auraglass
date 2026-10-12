import { Command } from 'aura-glass';

export default function CommandMinimal() {
  return (
    <Command.Root>
      <Command.Input placeholder="Search…" />
      <Command.List>
        <Command.Item value="open">Open</Command.Item>
        <Command.Item value="rename">Rename</Command.Item>
        <Command.Item value="archive">Archive</Command.Item>
      </Command.List>
    </Command.Root>
  );
}
