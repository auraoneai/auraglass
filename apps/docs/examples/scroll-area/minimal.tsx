import { ScrollArea } from 'aura-glass';

export default function ScrollAreaMinimal() {
  return (
    <ScrollArea.Root style={{ height: 120, width: 240 }}>
      <ScrollArea.Viewport aria-label="Release notes">
        {Array.from({ length: 20 }, (_, i) => <p key={i}>Change {i + 1}</p>)}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar><ScrollArea.Thumb /></ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
