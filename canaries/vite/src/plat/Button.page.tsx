/* PLAT-291: styled Button page — the first-load numerator for the vite leg.
   Button ships from the root entry (aura-glass/material is the 7-value
   material barrel and has no Button). */
import { Button } from 'aura-glass';

export default function PlatButtonPage() {
  return (
    <main data-ag-canary="plat-button">
      <Button variant="regular">Button</Button>
    </main>
  );
}
