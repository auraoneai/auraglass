/* REQ-CMP-111 compat legs: the Typography/DisplayText adapters warn their
   #313 deprecation ids (DEP-C0265 / DEP-C0266, fragments/deprecations/cmp.ts
   on release/4.x, synced to next by REQ-FIN-13) and render 5.0 Text/Heading
   output. The computed-style legs live in tests/e2e/cmp/content/type-roles.spec.ts. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render } from '@testing-library/react';
import { act } from 'react';
import * as React from 'react';
import { Typography } from '../Typography';
import { DisplayText } from '../DisplayText';
import * as CompatCmp from '../..';
import { Text } from '../../../../components/text/Text';
import { Heading } from '../../../../components/heading/Heading';

async function mountAndCollect(el: React.ReactElement, depId: string) {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  try {
    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(el));
    });
    const depCalls = warn.mock.calls.filter((c) => String(c[0]).includes(depId));
    return { container, depCalls };
  } finally {
    warn.mockRestore();
  }
}

describe('Typography / DisplayText compat (REQ-CMP-111)', () => {
  it('Typography warns DEP-C0265 once and renders Text with the mapped type role', async () => {
    const { container, depCalls } = await mountAndCollect(<Typography variant="caption">cap</Typography>, 'DEP-C0265');
    expect(depCalls).toHaveLength(1);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.tagName).toBe('P');
    expect(el.getAttribute('data-type')).toBe('caption');
    expect(el.className).toContain('ag-text-type-caption');
    expect(el.textContent).toBe('cap');
    // once per page load: a second mount does not warn again
    const again = await mountAndCollect(<Typography variant="body2">x</Typography>, 'DEP-C0265');
    expect(again.depCalls).toHaveLength(0);
    expect(again.container.querySelector('[data-ag-part="root"]')!.getAttribute('data-type')).toBe('callout');
  });

  it('Typography maps 4.x variants and falls back to body for unknown ones', async () => {
    const cases: Array<[string | undefined, string]> = [
      [undefined, 'body'], ['body1', 'body'], ['body2', 'callout'], ['overline', 'label'],
      ['code', 'mono'], ['h1', 'body'],
    ];
    for (const [variant, type] of cases) {
      const { container } = await mountAndCollect(<Typography variant={variant}>v</Typography>, 'DEP-C0265');
      expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-type')).toBe(type);
    }
  });

  it('DisplayText warns DEP-C0266 and renders Heading size=display as h1 by default', async () => {
    const { container, depCalls } = await mountAndCollect(<DisplayText>hero</DisplayText>, 'DEP-C0266');
    expect(depCalls).toHaveLength(1);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.tagName).toBe('H1');
    expect(el.getAttribute('data-ag-size')).toBe('display');
    expect(el.className).toContain('ag-heading-size-display');
    const lvl = await mountAndCollect(<DisplayText level={2}>sub</DisplayText>, 'DEP-C0266');
    expect(lvl.container.querySelector('[data-ag-part="root"]')!.tagName).toBe('H2');
  });

  it('both adapters are exported from src/compat/cmp', () => {
    expect(CompatCmp.Typography).toBe(Typography);
    expect(CompatCmp.DisplayText).toBe(DisplayText);
  });

  it('Text without size emits no size class/attr (role governs)', () => {
    const { container } = render(<Text type="caption">plain</Text>);
    const el = container.firstElementChild!;
    expect(el.getAttribute('data-ag-size')).toBeNull();
    expect(el.className).not.toMatch(/ag-text-size-/);
    expect(el.className).toContain('ag-text-type-caption');
  });

  it('Heading unset size derives from level', () => {
    const { container } = render(<Heading level={1}>t</Heading>);
    expect(container.firstElementChild!.getAttribute('data-ag-size')).toBe('title-1');
  });
});
