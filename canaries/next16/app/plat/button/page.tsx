/* PLAT-288/289: the first-load numerator — one styled Button (root entry;
   ./material carries only the 7 frozen material values, MAT-142). */
import { Button } from 'aura-glass';

export default function PlatButtonPage() {
  return (
    <main data-ag-canary="plat-button">
      <Button variant="regular">Button</Button>
    </main>
  );
}
