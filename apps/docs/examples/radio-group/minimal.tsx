import { RadioGroup } from 'aura-glass';

export default function RadioGroupMinimal() {
  return (
    <RadioGroup.Root defaultValue="standard" aria-label="Delivery speed">
      <RadioGroup.Item value="standard">Standard (3–5 days)</RadioGroup.Item>
      <RadioGroup.Item value="express">Express (next day)</RadioGroup.Item>
    </RadioGroup.Root>
  );
}
