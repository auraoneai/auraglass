/* PLAT-293: compiler canary smoke — flagship imports through
   babel-plugin-react-compiler 'infer'; must compile and render clean.
   Button ships from the root entry (aura-glass/material is the material
   barrel and has no Button). */
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'aura-glass/styles.css';
import { Button } from 'aura-glass';
import { Surface } from 'aura-glass/material';

function App() {
  const [count, setCount] = useState(0);
  return (
    <Surface>
      <Button variant="regular" onClick={() => setCount((c) => c + 1)}>
        clicks {count}
      </Button>
    </Surface>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
