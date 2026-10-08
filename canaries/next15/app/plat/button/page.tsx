/* PLAT-288/289: the first-load numerator — one styled Button. */
import { Button } from 'aura-glass/material';

export default function PlatButtonPage() {
  return (
    <main data-ag-canary="plat-button">
      <Button variant="solid">Button</Button>
    </main>
  );
}
