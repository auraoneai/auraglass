import * as React from 'react';
import { Button } from '../../../src/components/button';

/** Canonical Button family fixture — used by tests/controls/families.ts. */
export function ButtonFixture() {
  return (
    <div>
      <Button>Save</Button>
      <Button variant="identity">Discard</Button>
      <Button intent="danger">Delete project</Button>
    </div>
  );
}
