import { NumberField } from 'aura-glass';

export default function NumberFieldMinimal() {
  return <NumberField label="Seats" defaultValue={5} min={1} max={50} description="Billed per seat each month." />;
}
