/* CMP-301/421: Badge — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { Badge } from './index';

describe('Badge', () => {
  it('emits intent on the root', () => {
    const { container } = render(<Badge intent="success">ok</Badge>);
    expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-ag-intent')).toBe('success');
  });
  it('dot renders the indicator without a label', () => {
    const { container } = render(<Badge dot intent="danger" />);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.hasAttribute('data-ag-dot')).toBe(true);
  });
  it('count clamps at max as "<max>+"', () => {
    const { container } = render(<Badge count={120} max={99} />);
    expect(container.querySelector('[data-ag-part="root"]')!.textContent).toContain('99+');
  });
  it('count below max renders the number verbatim', () => {
    const { container } = render(<Badge count={4} max={99} />);
    expect(container.querySelector('[data-ag-part="root"]')!.textContent).toContain('4');
  });
  it('label goes through VisuallyHidden', () => {
    render(<Badge count={2} label="2 notifications" />);
    expect(screen.getByText('2 notifications')).toBeTruthy();
  });
});

describe('Badge REQ-CMP-114', () => {
  it('intent CSS references real --ag-color-* tokens, contrast-color guarded', () => {
    const css = require('node:fs').readFileSync(require('node:path').join(__dirname, 'Badge.css'), 'utf8');
    expect(css).not.toContain('--ag-tint-');
    expect(css).toContain('var(--ag-color-info');
    expect(css).toContain('var(--ag-color-success');
    expect(css).toContain('var(--ag-color-warning');
    expect(css).toContain('var(--ag-color-danger');
    expect(css).toContain('@supports (color: contrast-color(red))');
    expect(css).toContain('contrast-color(var(--ag-color-danger');
  });

  it('max defaults to 99', () => {
    const { container } = render(<Badge count={120} />);
    expect(container.querySelector('[data-ag-part="label"]')!.textContent).toBe('99+');
  });

  it('every referenced --ag-color token is defined in tokens/sys/color', () => {
    const tokens = require('node:fs').readFileSync(
      require('node:path').join(__dirname, '../../../tokens/sys/color.tokens.json'), 'utf8');
    for (const name of ['ag-color-info', 'ag-color-success', 'ag-color-warning', 'ag-color-danger', 'ag-color-on-accent', 'ag-color-on-surface-muted']) {
      expect(tokens).toContain(name);
    }
  });
});
