/* CMP-301/421: Badge — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as React from 'react';
import { tokens } from '../../tokens/generated/tokens';
import { Badge } from './index';

describe('Badge', () => {
  it('emits intent on the root', () => {
    const { container } = render(<Badge intent="success">ok</Badge>);
    expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-ag-intent')).toBe('success');
  });
  it('dot renders the indicator without a label', () => {
    const { container } = render(<Badge dot intent="danger" />);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.hasAttribute('data-dot')).toBe(true);
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
  it('max defaults to 99', () => {
    const { container } = render(<Badge count={120} />);
    expect(container.querySelector('[data-ag-part="label"]')!.textContent).toBe('99+');
  });

  it('max is still overridable', () => {
    const { container } = render(<Badge count={12} max={9} />);
    expect(container.querySelector('[data-ag-part="label"]')!.textContent).toBe('9+');
  });

  /* Ledger acceptance "token build exports the referenced vars": every custom
     property an intent rule reads must be emitted by scripts/tokens/build.mjs
     (src/tokens/generated/tokens.ts). The rendered background-vs-text check
     runs in tests/e2e/cmp/content/badge-intent-contrast.spec.ts (GitLab CI). */
  it('every custom property read by the intent rules is emitted by the token build', () => {
    const css: string = fs.readFileSync(path.join(__dirname, 'Badge.css'), 'utf8');
    const intentRules = css.match(/\.ag-badge\[data-ag-intent[^{]*\{[^}]*\}/g) ?? [];
    // 5 backgrounds + the on-accent fallback + 5 contrast-color() texts.
    expect(intentRules).toHaveLength(11);
    const referenced = new Set<string>();
    for (const rule of intentRules) {
      for (const m of rule.matchAll(/var\((--[\w-]+)/g)) referenced.add(m[1]!);
    }
    expect([...referenced].sort()).toEqual([
      '--ag-color-accent',
      '--ag-color-border',
      '--ag-color-danger',
      '--ag-color-info',
      '--ag-color-on-accent',
      '--ag-color-on-surface-muted',
      '--ag-color-success',
      '--ag-color-warning',
    ]);
    const undefinedVars = [...referenced].filter((name) => !(name in tokens));
    expect(undefinedVars).toEqual([]);
  });
});
