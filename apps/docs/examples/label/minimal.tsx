import { Label } from 'aura-glass/primitives';

export default function LabelMinimal() {
  return (
    <>
      <Label htmlFor="display-name">Display name</Label>
      <input id="display-name" />
    </>
  );
}
