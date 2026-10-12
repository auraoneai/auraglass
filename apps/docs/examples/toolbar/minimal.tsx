import { Toolbar } from 'aura-glass';

export default function ToolbarMinimal() {
  return (
    <Toolbar.Root aria-label="Formatting">
      <Toolbar.Button>Bold</Toolbar.Button>
      <Toolbar.Button>Italic</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Link href="/docs">Help</Toolbar.Link>
    </Toolbar.Root>
  );
}
