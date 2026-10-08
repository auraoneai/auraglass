/* Fixture 1 (MAT-224): consumer WITHOUT the optional `motion` peer, using only
 * components that must not need it: Sheet and TabBar render, open, and change
 * detent by keyboard and handle buttons (CSS snap owns the motion). */
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Sheet } from 'aura-glass/sheet';
import { TabBar } from 'aura-glass/tab-bar';

const App = () => {
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState(0);
  return (
    <div>
      <button data-testid="open-sheet" onClick={() => setOpen(true)}>Open</button>
      {open ? (
        <Sheet open={open} onOpenChange={setOpen} data-testid="sheet">
          <button data-testid="detent-up">Detent up</button>
          <button data-testid="detent-down">Detent down</button>
          <div data-ag-part="handle" aria-label="sheet handle" />
        </Sheet>
      ) : null}
      <TabBar value={tab} onChange={setTab} data-testid="tabbar">
        <button role="tab" aria-selected={tab === 0}>One</button>
        <button role="tab" aria-selected={tab === 1}>Two</button>
      </TabBar>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
