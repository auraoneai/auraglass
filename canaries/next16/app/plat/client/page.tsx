'use client';
/* PLAT-288: client page — every flagship component present in the packed
   artifact that is already out of seed. Flagships that are still seed-pending
   are added by their streams (stream pages live under app/<stream>/). */
import { Button } from 'aura-glass';
import { Surface, Environment } from 'aura-glass/material';

export default function PlatClientPage() {
  return (
    <main data-ag-canary="plat-client">
      <Environment>
        <Surface>
          <Button variant="regular">canary</Button>
        </Surface>
      </Environment>
    </main>
  );
}
