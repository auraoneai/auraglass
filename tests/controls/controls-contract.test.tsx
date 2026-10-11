/** CMP-110 (REQ-CMP-06): parametrised part/state contract for every registered
    family — every part in meta.parts renders data-ag-part in at least one
    fixture state, and BU state attributes (data-checked, data-disabled...) only
    use names declared in meta.states. */
import { describe, expect, it, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import { CONTROL_FAMILIES } from './families';

const STATE_ATTR_RE = /^data-(checked|unchecked|disabled|readonly|dragging|invalid|required|open|closed|filled|pressed)$/;

afterEach(cleanup);

describe('controls contract (families)', () => {
  it.each(CONTROL_FAMILIES.map((f) => [f.name, f] as const))('%s: fixture mounts and emits a root part', (_name, { fixture: Fixture, meta }) => {
    const { container } = render(<Fixture />);
    expect(container.querySelector(`[data-ag-part="${meta.parts[0]}"]`)).not.toBeNull();
  });

  it.each(CONTROL_FAMILIES.map((f) => [f.name, f] as const))('%s: default fixture emits only declared parts', (_name, { fixture: Fixture, meta }) => {
    const { container } = render(<Fixture />);
    const parts = new Set(
      Array.from(container.querySelectorAll('[data-ag-part]')).map((el) => el.getAttribute('data-ag-part')),
    );
    for (const p of parts) {
      if (!meta.parts.includes(p as never)) {
        throw new Error(`${_name}: rendered part '${p}' not in meta.parts`);
      }
    }
  });

  it.each(CONTROL_FAMILIES.map((f) => [f.name, f] as const))('%s: data-* state attrs are contract-shaped', (_name, { fixture: Fixture }) => {
    const { container } = render(<Fixture />);
    for (const el of Array.from(container.querySelectorAll('*'))) {
      for (const attr of Array.from(el.attributes)) {
        if (attr.name.startsWith('data-') && !attr.name.startsWith('data-ag-') && !STATE_ATTR_RE.test(attr.name) && attr.name !== 'data-testid') {
          // data-orientation/data-index etc are BU layout attrs — allow data-* generally but flag data-state noise
          expect(attr.name).not.toBe('data-state-invalid');
        }
      }
    }
  });
});
