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
  it('the gauge is CMP Meter: Meter parts, values, and intent follow the thresholds', () => {
    const mk = (used: number) => ({ inputTokens: used, contextWindow: 1000 });
    const { container } = render(<><UsageMeter usage={mk(790)} /><UsageMeter usage={mk(800)} /><UsageMeter usage={mk(950)} /></>);
    const meters = screen.getAllByRole('meter');
    for (const m of meters) {
      expect(m).toHaveClass('ag-meter');
      expect(m).toHaveAttribute('aria-label', 'Context window used');
      expect(m).toHaveAttribute('aria-valuemin', '0');
      expect(m).toHaveAttribute('aria-valuemax', '1000');
      expect(m.querySelector('[data-ag-part="indicator"]')).not.toBeNull();
      expect(m.closest('[data-ag-part="usage-window"]')).not.toBeNull();
    }
    expect(meters.map((m) => m.getAttribute('aria-valuenow'))).toEqual(['790', '800', '950']);
    expect(meters.map((m) => m.getAttribute('data-ag-intent'))).toEqual(['success', 'warning', 'danger']);
    expect([...container.querySelectorAll('[data-ag-part="usage-window"]')].map((w) => w.getAttribute('data-level')))
      .toEqual(['normal', 'warning', 'critical']);
    expect(meters[2]!.querySelector('[data-ag-part="usage-window-text"]')!.textContent).toBe('950 / 1K — critical');
  });

  it("format='full' uses standard notation; 'compact' uses compact notation", () => {
    const usage = { inputTokens: 1_234_567, outputTokens: 0, contextWindow: 2_000_000 };
    const { container: full } = render(<UsageMeter usage={usage} format="full" />);
    const dd = (c: HTMLElement) => [...c.querySelectorAll('dd')].map((d) => d.textContent);
    // full shows zero rows too and never abbreviates
    expect(dd(full)).toEqual(['1,234,567', '0']);
    expect(full.querySelector('[data-ag-part="usage-window-text"]')!.textContent).toBe('1,234,567 / 2,000,000');
    const { container: compact } = render(<UsageMeter usage={usage} />);
    expect(dd(compact)).toEqual(['1.2M']);
    expect(compact.querySelector('[data-ag-part="usage-window-text"]')!.textContent).toBe('1.2M / 2M');
  });

  it('de-DE locale formats tokens and cost with German separators', () => {
    const usage = { inputTokens: 1_234_567, costUsd: 1234.5 };
    const { container: full } = render(<UsageMeter usage={usage} format="full" locale="de-DE" />);
    const dd = (c: HTMLElement) => [...c.querySelectorAll('dd')].map((d) => d.textContent!.replace(/\u00a0/g, ' '));
    expect(dd(full)).toEqual(['1.234.567', '1.234,50 $']);
    const { container: compact } = render(<UsageMeter usage={usage} locale="de-DE" />);
    expect(dd(compact)[0]).toBe('1,2 Mio.');
  });

  it('costUsd 0.12345 renders as $0.1235 (USD, at most 4 fraction digits)', () => {
    const { container } = render(<UsageMeter usage={{ costUsd: 0.12345 }} />);
    expect(container.querySelector('dd')!.textContent).toBe('$0.1235');
  });
});
