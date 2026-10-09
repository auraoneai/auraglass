/* PLAT-292: tailwind4 consumer entry — imports the bridge (tailwind.css), not
   styles.css; layered Tailwind utilities + the ag layer must coexist. The
   bg-red-500 utility must beat the Button's ag component styles without
   !important (REQ-PLAT-75 bridge.spec.ts). */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'aura-glass/tailwind.css';
import { Button } from 'aura-glass/material';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main data-ag-canary="plat-tailwind">
      <Button variant="solid" className="bg-red-500">
        tailwind4
      </Button>
    </main>
  </StrictMode>,
);
