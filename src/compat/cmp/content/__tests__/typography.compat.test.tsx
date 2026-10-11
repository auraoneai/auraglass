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
      expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-type')).toBe(type);
