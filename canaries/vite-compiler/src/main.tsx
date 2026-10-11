/* PLAT-293 / REQ-PLAT-72: compiler canary smoke — flagship imports through
   babel-plugin-react-compiler 'infer'; must compile and render clean. The
   Button ref is passed as a plain prop (React 19 ref-as-prop, no forwardRef);
   the page reports whether it resolved to the rendered <button>. */
import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'aura-glass/styles.css';
import { Button } from 'aura-glass';
import { Surface } from 'aura-glass/material';

function App() {
  const [count, setCount] = useState(0);
  const [refTag, setRefTag] = useState('pending');
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    setRefTag(buttonRef.current?.tagName.toLowerCase() ?? 'null');
  }, []);
  return (
    <Surface>
      <Button ref={buttonRef} onClick={() => setCount((c) => c + 1)}>
        clicks {count}
      </Button>
      <output data-testid="button-ref">{refTag}</output>
    </Surface>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
