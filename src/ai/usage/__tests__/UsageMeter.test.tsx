import { describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { UsageMeter } from '../UsageMeter';

describe('UsageMeter', () => {
  it('role=meter with values; 79% normal, 80% warning, 95% critical text', () => {
    const mk = (used: number) => ({ inputTokens: used, contextWindow: 1000 });
    render(<><UsageMeter usage={mk(790)} /><UsageMeter usage={mk(800)} /><UsageMeter usage={mk(950)} /></>);
    const meters = screen.getAllByRole('meter');
    expect(meters.length).toBe(3);
    expect(meters[0]!.getAttribute('data-level')).toBe('normal');
    expect(meters[1]!.getAttribute('data-level')).toBe('warning');
    expect(meters[1]!.textContent).toContain('warning');
    expect(meters[2]!.getAttribute('data-level')).toBe('critical');
  });
  it('server render + currency formatting ($0.0184)', () => {
    const html = renderToString(<UsageMeter usage={{ inputTokens: 1200, outputTokens: 300, costUsd: 0.0184, contextWindow: 4000 }} />);
    expect(html).toContain('role="meter"');
    expect(html).toContain('$0.0184');
  });
});
