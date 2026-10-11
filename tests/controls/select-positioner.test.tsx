/* REQ-CMP-65: Positioner gets sideOffset=8 + collisionPadding=8; alignItem
   WithTrigger computed from a live pointer:fine media query. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render } from '@testing-library/react';
import { readFileSync } from 'fs';
import { join } from 'path';

let posProps: Record<string, unknown> = {};
jest.mock('@base-ui/react/select', () => {
  const R = require('react');
  const actual = jest.requireActual('@base-ui/react/select');
  return {
    ...actual,
    Select: {
      ...actual.Select,
      Positioner: (p: Record<string, unknown>) => {
        posProps = p;
        return null;
      },
      Portal: (p: Record<string, unknown>) => R.createElement(R.Fragment, {}, p.children),
      Popup: (p: Record<string, unknown>) => R.createElement('div', {}, p.children),
    },
  };
});

import { Select } from '../../src/components/select';
import { defaultPositionerProps } from '../../src/components/overlays/_shared/positioning';

describe('Select positioner (REQ-CMP-65)', () => {
  it('items map provides the label in the trigger before open', () => {
    const { getByRole } = render(
      <Select.Root defaultValue="b" items={[{ value: 'b', label: 'Beta' }]}>
        <Select.Trigger aria-label="s" />
      </Select.Root>,
    );
    expect(getByRole('combobox').textContent).toContain('Beta');
  });

  it('sideOffset=8 + collisionPadding=8 on Positioner', () => {
    const src = readFileSync(join(process.cwd(), 'src/components/select/Select.client.tsx'), 'utf8');
    // The 8/8 contract now comes from the shared overlay positioner defaults.
    expect(src).toMatch(/\{\.\.\.defaultPositionerProps\}/);
    expect(defaultPositionerProps.sideOffset).toBe(8);
    expect(defaultPositionerProps.collisionPadding).toBe(8);
    expect(src).toMatch(/useSyncExternalStore\(subscribeFinePointer/);
  });
});
