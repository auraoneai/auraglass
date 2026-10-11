/* Shared harness for the SURF compat-adapter tests (REQ-SURF-13):
   tests/{app-shell,data,ai,media}/compat.test.tsx. Each row renders one
   aura-glass/compat adapter from its frozen 4.x story props
   (tests/fixtures/consumer-4x/cases/surf/<area>/story-args.tsx) and asserts:
     - the 5.0 successor renders (its data-ag-part / landmark selector exists),
     - the mapped 4.x content is in the output (expectText),
     - exactly one console.warn fires and it names the adapter's DEP-S id,
     - a second render of the same adapter adds no warning (once per id),
     - React logs no console.error (no leaked 4.x props, no invalid nesting). */
import { expect, jest } from '@jest/globals';
import { cleanup, render } from '@testing-library/react';
import * as React from 'react';
import { AuraGlassProvider } from '../../src/theme';
import { PORTAL_ROOT_MARKUP } from '../../src/contracts/preferences';
import type { StoryArgs } from '../fixtures/consumer-4x/cases/surf/app-shell/story-args';

export const DEP_S = /\bDEP-S\d{4}\b/;

export interface CompatRow {
  /** aura-glass/compat export name. */
  name: string;
  /** The DEP-S id the adapter must warn with. */
  id: string;
  C: React.ComponentType<Record<string, unknown>>;
  /** Selector of the 5.0 successor's root part, queried in document.body. */
  part: string;
  args: StoryArgs;
  /** Extra props the test injects (spies for 4.x callbacks). */
  extra?: Record<string, unknown>;
}

function ensurePortal() {
  if (!document.body.querySelector('[data-ag-portal-root]')) {
    document.body.insertAdjacentHTML('beforeend', PORTAL_ROOT_MARKUP);
  }
}

export function expectAdapter(row: CompatRow): void {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  try {
    ensurePortal();
    const props = { ...row.args.props, ...row.extra };
    render(
      <AuraGlassProvider>
        <row.C {...props} />
      </AuraGlassProvider>,
    );
    expect(document.body.querySelector(row.part)).not.toBeNull();
    const text = document.body.textContent ?? '';
    for (const t of row.args.expectText ?? []) expect(text).toContain(t);

    const warnings = warn.mock.calls.map((c) => String(c[0]));
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatch(DEP_S);
    expect(warnings[0]!.match(DEP_S)![0]).toBe(row.id);

    render(
      <AuraGlassProvider>
        <row.C {...props} />
      </AuraGlassProvider>,
    );
    expect(warn).toHaveBeenCalledTimes(1);
    expect(error.mock.calls.map((c) => String(c[0]))).toEqual([]);
  } finally {
    cleanup();
    document.body.querySelector('[data-ag-portal-root]')?.remove();
    warn.mockRestore();
    error.mockRestore();
  }
}
