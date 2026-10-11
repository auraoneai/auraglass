/* PLAT-292: tailwind4 consumer entry — imports the bridge (via app.css);
   layered Tailwind utilities + the ag layer must coexist. The bg-red-500
   utility on the Button must beat the Button's ag component styles without
   !important (REQ-PLAT-75 tests/bridge.spec.ts); the control Button carries
   no utility. The bridge-rules element makes Tailwind emit the REQ-PLAT-77
   utilities the built-css assertions look for. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';
import { Button } from 'aura-glass';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main data-ag-canary="plat-tailwind">
      <Button variant="regular" className="bg-red-500" data-ag-canary="bridge-red-button">
        tailwind4
      </Button>
      <Button variant="regular" data-ag-canary="bridge-control-button">
        control
      </Button>
      <div data-ag-canary="bridge-accent" className="bg-accent text-on-accent p-2">accent</div>
      <div data-ag-canary="bridge-glass" className="glass-regular">glass</div>
      <div
        data-ag-canary="bridge-rules"
        className="bg-canvas text-on-surface rounded-md shadow-glass ag-dark:bg-canvas"
      >
        rules
      </div>
    </main>
  </StrictMode>,
);
