import { ResizablePanels } from 'aura-glass/app-shell';

export default function ResizablePanelsMinimal() {
  return (
    <ResizablePanels.Root defaultLayout={[30, 70]}>
      <ResizablePanels.Panel id="list"><div>List</div></ResizablePanels.Panel>
      <ResizablePanels.Handle />
      <ResizablePanels.Panel id="detail"><div>Detail</div></ResizablePanels.Panel>
    </ResizablePanels.Root>
  );
}
