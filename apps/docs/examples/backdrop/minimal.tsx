import { Backdrop } from 'aura-glass/backdrops';
import { Surface } from 'aura-glass';

export default function BackdropMinimal() {
  return (
    <Backdrop preset="aurora" scheme="dark">
      <Surface layer="chrome">Content over the backdrop</Surface>
    </Backdrop>
  );
}
