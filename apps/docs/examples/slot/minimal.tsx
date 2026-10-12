import { Slot } from 'aura-glass/primitives';

export default function SlotMinimal() {
  return (
    <Slot className="toolbar-action">
      <button type="button">Slotted button</button>
    </Slot>
  );
}
