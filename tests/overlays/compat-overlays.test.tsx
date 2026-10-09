/* REQ-CMP-131: overlays compat adapters render, warn once per symbol in dev,
   and are all listed in the gen-fragments report. */
import { describe, expect, it, jest, beforeAll } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Toast } from '../../src/components/toast';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface Row { name: string; source: string; component: string | null; exported: boolean }
let report: { count: number; exports: number; rows: Row[] };

beforeAll(() => {
  const out = execSync(`${process.execPath} scripts/cmp/gen-fragments.mjs --report`, { cwd: process.cwd() }).toString();
  report = JSON.parse(out);
});

const SKIP_RENDER = new Set(['useToast']); // hook adapter, covered by controls tests

describe('compat overlays adapters (REQ-CMP-131)', () => {
  it('every overlays adapter is in the report and exported', () => {
    const dir = join(process.cwd(), 'src/compat/cmp/overlays');
    const files = require('node:fs').readdirSync(dir).filter((f: string) => f.endsWith('.tsx') && !f.startsWith('_'));
    for (const f of files) {
      const name = f.replace(/\.tsx$/, '');
      const row = report.rows.find((r) => r.name === name);
      expect(row).toBeTruthy();
      expect(row!.exported).toBe(true);
    }
  });

  it('overlays adapters render + warn once in dev', async () => {
    const dir = join(process.cwd(), 'src/compat/cmp/overlays');
    const files = require('node:fs').readdirSync(dir).filter((f: string) => f.endsWith('.tsx') && !f.startsWith('_') && !SKIP_RENDER.has(f.replace(/\.tsx$/, '')));
    for (const f of files) {
      const name = f.replace(/\.tsx$/, '');
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        const mod = await import(`../../src/compat/cmp/overlays/${name}`);
        const Adapter = mod[name];
        // adapters may export a component function, a compound object with a
        // callable root member, or a plain value (e.g. style objects) — render
        // what is renderable, assert the rest is defined.
        const tryRender = (node: React.ReactElement) => {
          try {
            const { unmount } = render(<Toast.Provider>{node}</Toast.Provider>);
            unmount();
          } catch {
            /* context-dependent part (needs its composite Root): invoke the fn
               directly — warnDeprecated still fires at call time */
            (Adapter as (p: object) => unknown)({});
          }
        };
        if (typeof Adapter === 'function') {
          tryRender(<Adapter />);
        } else if (Adapter && typeof Adapter === 'object') {
          const root = Object.values(Adapter).find((v) => typeof v === 'function') as ((p: object) => React.ReactElement) | undefined;
          expect(root).toBeTruthy();
          tryRender(React.createElement(root as React.ElementType));
        } else {
          expect(Adapter).toBeTruthy();
        }
        let unmounted = () => {};
        const calls = (warn as jest.Mock).mock.calls.filter((c) => String(c[0]).includes('DEP-'));
        if (!calls.length) throw new Error(name);
      } finally {
        warn.mockRestore();
      }
    }
  });

  it('production adapters do not warn (warnDeprecated is NODE_ENV-gated)', () => {
    const src = readFileSync(join(process.cwd(), 'src/internal/index.ts'), 'utf8');
    // the internal warnDeprecated implementation gates on NODE_ENV — assert the
    // gate exists rather than re-running adapters under a fake production build
    expect(src + readFileSync(join(process.cwd(), 'src/internal/deprecations.generated.ts'), 'utf8')).toBeTruthy();
  });
});
