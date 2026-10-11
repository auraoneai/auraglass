// @ts-nocheck — fixture resident read and imported by the gate under test.
// Positive control: imports react and a local module, touches the DOM only
// inside a function body, and is side-effect free at import time.
import { tone } from './tone';
export function Quiet() {
  const label = typeof document === 'undefined' ? tone() : document.title;
  return <span aria-hidden="true">{label}</span>;
}
