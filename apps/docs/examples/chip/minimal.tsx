import { Chip } from 'aura-glass/data';

export default function ChipMinimal() {
  return (
    <>
      <Chip>Static</Chip>
      <Chip selectable defaultSelected>Selectable</Chip>
      <Chip intent="success" onRemove={() => {}}>Removable</Chip>
    </>
  );
}
