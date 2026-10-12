import { AlertDialog } from 'aura-glass';

export default function AlertDialogMinimal() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>Discard draft</AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Discard draft?</AlertDialog.Title>
        <AlertDialog.Description>Your unsaved changes will be lost.</AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action>Discard</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
