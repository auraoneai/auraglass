import { DismissableLayer } from 'aura-glass/primitives';

export default function DismissableLayerMinimal() {
  return (
    <DismissableLayer onDismiss={() => console.log('dismissed')}>
      <div>Press Escape or click outside to dismiss.</div>
    </DismissableLayer>
  );
}
