import { Fieldset, TextField } from 'aura-glass';

export default function FieldsetMinimal() {
  return (
    <Fieldset legend="Shipping address">
      <TextField label="Street" />
      <TextField label="City" />
    </Fieldset>
  );
}
