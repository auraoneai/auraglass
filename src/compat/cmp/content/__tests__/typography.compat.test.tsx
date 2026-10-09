/* REQ-CMP-111 compat legs: Typography/DisplayText adapters warn the right
   deprecation ids and render 5.0 Text/Heading output. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render } from '@testing-library/react';
import { act } from 'react';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Typography } from '../Typography';
import { DisplayText } from '../DisplayText';
import { Text } from '../../../../components/text/Text';
import { Heading } from '../../../../components/heading/Heading';

async function mountOnce(el: React.ReactElement, depId: string) {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  await act(async () => {
    render(el);
  });
  const depCalls = warn.mock.calls.filter((c: unknown) => String((c as unknown[])[0]).includes(depId));
  warn.mockRestore();
  return depCalls;
}

describe('Typography / DisplayText compat (REQ-CMP-111)', () => {
  it('Typography warns DEP-C0222 and renders Text with the mapped type role', async () => {
    const depCalls = await mountOnce(<Typography variant="caption">cap</Typography>, 'DEP-C0222');
    expect(depCalls.length).toBeGreaterThan(0);
    const el = document.querySelector('[data-ag-type]')!;
    expect(el.getAttribute('data-ag-type')).toBe('caption');
  });

  it('DisplayText warns DEP-C0223 and renders Heading size=display h1', async () => {
    const depCalls = await mountOnce(<DisplayText>hero</DisplayText>, 'DEP-C0223');
    expect(depCalls.length).toBeGreaterThan(0);
    const el = document.querySelector('[data-ag-size]')!;
    expect(el.tagName).toBe('H1');
    expect(el.getAttribute('data-ag-size')).toBe('display');
  });

  it('caption role CSS differs from body and consumes the role quartet', () => {
    const css = readFileSync(
      join(__dirname, '../../../..', 'components/text/Text.css'), 'utf8');
    expect(css).toContain('var(--ag-type-caption-size');
    expect(css).toContain('var(--ag-type-caption-leading');
    expect(css).toContain('var(--ag-type-caption-weight');
    expect(css).toContain('var(--ag-type-caption-tracking');
    // role sizes must differ
    expect(css).toMatch(/caption-size, 0\.8125rem/);
    expect(css).not.toMatch(/body-size, 0\.8125rem/);
  });

  it('Text without size emits no size class/attr (role governs)', () => {
    const { container } = render(<Text>plain</Text>);
    const el = container.firstElementChild!;
    expect(el.getAttribute('data-ag-size')).toBeNull();
    expect(el.className).not.toMatch(/ag-text-size-/);
  });

  it('Heading unset size derives from level', () => {
    const { container } = render(<Heading level={1}>t</Heading>);
    expect(container.firstElementChild!.getAttribute('data-ag-size')).toBe('title-1');
  });
});
