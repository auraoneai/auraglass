/* PLAT-291: styled Button page — the first-load numerator for the vite leg. */
import { Button } from 'aura-glass/material';

export default function PlatButtonPage() {
  return (
    <main data-ag-canary="plat-button">
      <Button variant="solid">Button</Button>
    </main>
  );
}
