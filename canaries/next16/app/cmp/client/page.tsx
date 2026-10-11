/* REQ-CMP-17: cmp/client — client island boundary: a client component tree
   mounted inside a Server Component page. */
'use client';
import { Button } from 'aura-glass';

export default function CmpClientPage() {
  return (
    <main data-ag-canary="cmp-client">
      <h1>cmp/client</h1>
      <Button>island</Button>
    </main>
  );
}
