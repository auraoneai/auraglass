import { Sheet } from 'aura-glass';

export default function SheetMinimal() {
  return (
    <Sheet.Root>
      <Sheet.Trigger>Filters</Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Handle />
        <Sheet.Header><Sheet.Title>Filters</Sheet.Title></Sheet.Header>
        <Sheet.Body><Sheet.Description>Narrow the results.</Sheet.Description></Sheet.Body>
        <Sheet.Footer><Sheet.Close>Done</Sheet.Close></Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>
  );
}
