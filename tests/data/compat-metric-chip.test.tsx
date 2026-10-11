/** @jest-environment jsdom */
// REQ-SURF-88 (+ REQ-SURF-13 adapter rules): GlassMetricChip renders the 5.0
// Chip from its 4.x story args and warns exactly once with its DEP-S id.
import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { GlassMetricChip } from '../../src/compat/surf/data/GlassMetricChip';
import * as compatSurf from '../../src/compat/surf';

describe('GlassMetricChip compat adapter (REQ-SURF-88)', () => {
  it('is exported from src/compat/surf', () => {
    expect(compatSurf.GlassMetricChip).toBe(GlassMetricChip);
  });

  it('4.x Default story args render a content-material Chip and warn once with DEP-S0213', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      // 4.x GlassMetricChip.stories.tsx `Default` args.
      const args = { label: 'Revenue', value: '$12,345', delta: '+15%', intent: 'success' as const };
      const { container, rerender } = render(<GlassMetricChip {...args} />);
      rerender(<GlassMetricChip {...args} />);
      const chip = container.querySelector('[data-ag-part="chip"]')!;
      expect(chip).not.toBeNull();
      expect(chip.getAttribute('data-ag-intent')).toBe('success');
      expect(chip.getAttribute('data-ag-layer')).toBe('content');
      expect(chip.getAttribute('data-ag-content')).toBe('content-raised');
      expect(chip.textContent).toBe('Revenue$12,345+15%');
      expect(chip.querySelector('[aria-label="$12,345, success"]')).not.toBeNull();
      const depWarnings = warn.mock.calls.map((c) => String(c[0])).filter((m) => /DEP-S\d{4}/.test(m));
      expect(depWarnings).toHaveLength(1);
      expect(depWarnings[0]).toContain('DEP-S0213');
    } finally {
      warn.mockRestore();
    }
  });

  it('4.x Variants story args (intent default) map to the neutral intent', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const { container } = render(<GlassMetricChip label="Users" value={1234} />);
      const chip = container.querySelector('[data-ag-part="chip"]')!;
      expect(chip.getAttribute('data-ag-intent')).toBe('neutral');
      expect(chip.textContent).toBe('Users1234');
    } finally {
      warn.mockRestore();
    }
  });
});
