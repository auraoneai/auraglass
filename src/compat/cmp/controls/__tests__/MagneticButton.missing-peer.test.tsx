/* REQ-CMP-35 (missing-peer leg): when the optional `motion` peer does not
   resolve, the magnetic props drop with exactly one peer warning and the
   button still renders — never throws. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

jest.mock('../../../../motion', () => {
  throw new Error('ERR_MODULE_NOT_FOUND: motion');
});

import { MagneticButton } from '../MagneticButton';

const flush = async () => { await act(async () => {}); };

describe('MagneticButton compat — motion peer absent (REQ-CMP-35)', () => {
  it('drops magnetic props with one peer warning, still renders', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      render(<MagneticButton magnetic magneticStrength={0.2}>hover</MagneticButton>);
      await flush(); await flush(); await flush();
      expect(screen.getByRole('button')).toBeTruthy();
      const peerWarns = warn.mock.calls.filter((c) => String(c[0]).includes('peer.motion'));
      expect(peerWarns).toHaveLength(1);
    } finally {
      warn.mockRestore();
    }
  });
});
