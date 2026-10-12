import { VisuallyHidden } from 'aura-glass/primitives';

export default function VisuallyHiddenMinimal() {
  return (
    <button type="button">
      Save<VisuallyHidden> document</VisuallyHidden>
    </button>
  );
}
