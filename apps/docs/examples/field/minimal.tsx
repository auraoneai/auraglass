import { Field } from 'aura-glass';

export default function FieldMinimal() {
  return (
    <Field.Root name="workspace">
      <Field.Label>Workspace name</Field.Label>
      <Field.Control defaultValue="Northwind Ops" />
      <Field.Description>Visible to everyone you invite.</Field.Description>
      <Field.Error />
    </Field.Root>
  );
}
