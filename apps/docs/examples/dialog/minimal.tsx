import { Button, Dialog } from 'aura-glass';

export default function DialogMinimal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Rename project</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header><Dialog.Title>Rename project</Dialog.Title></Dialog.Header>
        <Dialog.Body><Dialog.Description>The new name is shown to everyone in the workspace.</Dialog.Description></Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close>Cancel</Dialog.Close>
          <Button prominent>Save</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
