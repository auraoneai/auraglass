'use client';
/**
 * GlassVoiceWaveform Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ⏭️  ARIA attributes (not applicable)
 * - ⏭️  Focus management (not applicable)
 * - ⏭️  Reduced motion (not applicable)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { GlassVoiceWaveform } from '@/components/social/GlassVoiceWaveform';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassVoiceWaveform', () => {
  const mockParticipants = [
    {
      id: '1',
      name: 'User 1',
      color: '#FF6B6B',
      isSpeaking: false,
      isMuted: false,
      audioLevel: 0.5,
      lastActivity: Date.now(),
      isConnected: true,
    },
    {
      id: '2',
      name: 'User 2',
      color: '#4ECDC4',
      isSpeaking: true,
      isMuted: false,
      audioLevel: 0.8,
      lastActivity: Date.now(),
      isConnected: true,
    },
  ];

  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassVoiceWaveform participants={mockParticipants} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassVoiceWaveform participants={mockParticipants} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassVoiceWaveform
        participants={mockParticipants}
        className="custom-class"
        data-testid="glassvoicewaveform"
      />
    );

    const element = container.querySelector('[data-testid="glassvoicewaveform"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassVoiceWaveform participants={mockParticipants} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});