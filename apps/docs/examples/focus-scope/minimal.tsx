import { FocusScope } from 'aura-glass/primitives';

export default function FocusScopeMinimal() {
  return (
    <FocusScope trapped loop>
      <button type="button">First</button>
      <button type="button">Second</button>
    </FocusScope>
  );
}
