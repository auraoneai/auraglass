import { SourceTransition } from 'aura-glass';

export default function SourceTransitionMinimal() {
  return (
    <SourceTransition.Root>
      <SourceTransition.Source id="card"><button type="button">Open card</button></SourceTransition.Source>
      <SourceTransition.Destination id="card"><a href="#card">Card detail</a></SourceTransition.Destination>
    </SourceTransition.Root>
  );
}
