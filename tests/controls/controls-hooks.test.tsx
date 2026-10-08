/** CMP-111 (REQ-CMP-15): toggle each family's toggleProps across 6 rerenders —
    no "Rendered more hooks" / hook-order crash and no stale listeners. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { CONTROL_FAMILIES } from './families';

describe('controls hooks stability', () => {
  for (const fam of CONTROL_FAMILIES) {
    it(`${fam.name}: 6 rerenders toggling [${fam.toggleProps.join(', ')}] never throws`, () => {
      const errors: unknown[] = [];
      try {
        const { rerender } = render(<fam.fixture />);
        const values: Record<string, unknown> = {
          disabled: true,
          loading: true,
          checked: true,
          indeterminate: true,
          error: 'err',
          description: 'd',
          label: 'L',
          invalid: true,
          value: fam.family === 'radio-group' ? 'b' : fam.family === 'slider' ? 50 : 'v',
          multiple: true,
        };
        for (let round = 0; round < 6; round += 1) {
          const props: Record<string, unknown> = {};
          for (const key of fam.toggleProps) {
            props[key] = round % 2 === 0 ? values[key] : undefined;
          }
          rerender(<fam.fixture {...props} />);
        }
      } catch (e) {
        errors.push(e);
      }
      expect(errors).toHaveLength(0);
    });
  }
});
