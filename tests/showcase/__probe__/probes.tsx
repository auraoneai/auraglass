/* Trap self-test components for tests/showcase/showcase-determinism.test.ts (REQ-QUAL-59). Each one makes exactly
   the non-deterministic call the determinism test must catch while a showcase renders. Not a showcase. */
import * as React from 'react';

export function RandomProbe() {
  return <p>{Math.random() > 2 ? 'never' : 'probe'}</p>;
}

export function ClockProbe() {
  return <p>{Date.now() > 0 ? 'probe' : 'never'}</p>;
}

export function FetchProbe() {
  try {
    void (globalThis as { fetch?: (u: string) => unknown }).fetch?.('https://example.invalid/');
  } catch {
    // the trap records the call before it throws
  }
  return <p>probe</p>;
}
