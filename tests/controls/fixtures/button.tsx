import * as React from 'react';
import { Button } from '../../../src/components/button';

/** Canonical Button family fixture — used by tests/controls/families.ts. */
export function ButtonFixture(props: Record<string, unknown>) {
  return (
    <div>
      <Button {...props}>Save</Button>
      <Button variant="identity">Discard</Button>
      <Button intent="danger">Delete project</Button>
    </div>
  );
}
