import { Button, Toast, useToast } from 'aura-glass';

function SaveButton() {
  const toast = useToast();
  return (
    <>
      <Button onClick={() => toast.success({ title: 'Changes saved' })}>Save</Button>
      <Toast.Viewport>
        {toast.toasts.map((t) => (
          <Toast.Root key={t.id} toast={t}>
            <Toast.Title>{t.title}</Toast.Title>
            <Toast.Close>Dismiss</Toast.Close>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </>
  );
}

export default function ToastMinimal() {
  return (
    <Toast.Provider>
      <SaveButton />
    </Toast.Provider>
  );
}
