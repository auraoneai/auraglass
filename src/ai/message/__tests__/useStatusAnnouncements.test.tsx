import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render } from '@testing-library/react';
import type { AgChatStatus } from '../../types';

const mockAnnounce = jest.fn<(message: string, opts?: { politeness?: 'polite' | 'assertive' }) => void>();
jest.mock('../../../theme', () => {
  const actual = jest.requireActual<Record<string, unknown>>('../../../theme');
  return { ...actual, useAnnouncer: () => ({ announce: mockAnnounce, clear: () => undefined }) };
});

import { useStatusAnnouncements } from '../useStatusAnnouncements';
import { Composer } from '../../composer/Composer';

function Probe({ status, labels }: { status: AgChatStatus; labels?: { sending?: string; error?: string } }) {
  useStatusAnnouncements(status, labels);
  return null;
}

beforeEach(() => { mockAnnounce.mockClear(); });

describe('useStatusAnnouncements (REQ-SURF-113, AI §4.5)', () => {
  it('announces submitted politely and error assertively, once per transition', () => {
    const { rerender } = render(<Probe status="ready" />);
    expect(mockAnnounce).not.toHaveBeenCalled(); // initial status is not announced
    rerender(<Probe status="submitted" />);
    rerender(<Probe status="submitted" />);
    rerender(<Probe status="streaming" />);
    rerender(<Probe status="error" />);
    rerender(<Probe status="error" />);
    rerender(<Probe status="ready" />);
    expect(mockAnnounce.mock.calls).toEqual([
      ['Sending'],
      ['Response failed', { politeness: 'assertive' }],
    ]);
  });

  it('uses the provided labels', () => {
    const { rerender } = render(<Probe status="ready" labels={{ sending: 'Envoi', error: 'Échec' }} />);
    rerender(<Probe status="submitted" labels={{ sending: 'Envoi', error: 'Échec' }} />);
    rerender(<Probe status="error" labels={{ sending: 'Envoi', error: 'Échec' }} />);
    expect(mockAnnounce.mock.calls).toEqual([['Envoi'], ['Échec', { politeness: 'assertive' }]]);
  });

  it('Composer announces its status transitions', () => {
    const { rerender } = render(<Composer status="ready" />);
    rerender(<Composer status="submitted" />);
    rerender(<Composer status="streaming" />);
    rerender(<Composer status="error" labels={{ statusError: 'The reply failed' }} />);
    expect(mockAnnounce.mock.calls).toEqual([
      ['Sending'],
      ['The reply failed', { politeness: 'assertive' }],
    ]);
  });
});
