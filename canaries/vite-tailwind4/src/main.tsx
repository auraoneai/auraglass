/* PLAT-292: tailwind4 consumer entry — imports the bridge (via app.css), not
   styles.css; layered Tailwind utilities + the ag layer must coexist. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';
import { Button } from 'aura-glass';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main data-ag-canary="plat-tailwind">
      <Button variant="regular">tailwind4</Button>
      <div data-ag-canary="bridge-accent" className="bg-accent text-on-accent p-2">accent</div>
      <div data-ag-canary="bridge-glass" className="glass-regular">glass</div>
    </main>
  </StrictMode>,
);
