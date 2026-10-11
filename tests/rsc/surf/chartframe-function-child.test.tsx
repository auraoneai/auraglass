/** @jest-environment jsdom */
// REQ-SURF-07 — the function-child contract on server-rendered ChartFrame.
// ChartFrame is a SERVER module: its <figure>/<figcaption> ship in the RSC
// payload while the render-prop children are forwarded to ChartFrame.Inter-
// active (the client island) uninvoked. Across a real RSC boundary React
// Flight dev-errors on a function prop — "Functions cannot be passed to
// Client Components" — which is why the contract pins: the server root must
// never invoke children itself, and invocation happens only inside the
// island (proven dynamically here under renderToString, where the island's
// SSR pass runs the same code path).
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToString } from 'react-dom/server';
import { ChartFrame } from '../../../src/data/chart-frame/ChartFrame';

const DATA = [{ m: 'Jan', a: 1 }];

describe('ChartFrame function child (REQ-SURF-07)', () => {
  it('the server root never invokes function children', () => {
    const src = readFileSync(join(process.cwd(), 'src/data/chart-frame/ChartFrame.tsx'), 'utf8');
    // children is forwarded to the island via props spread — any direct
    // invocation on the server path would be the RSC dev-error footgun.
    expect({ invokes: /children\s*\(/.test(src) }).toEqual({ invokes: false });
  });
  it('function children are invoked inside the island (SSR path)', () => {
    let invoked = 0;
    renderToString(
      <ChartFrame title="Revenue" data={DATA} x={{ key: 'm', label: 'Month' }} series={[{ key: 'a', label: 'Revenue' }]}>
        {() => { invoked++; return null; }}
      </ChartFrame>,
    );
    expect({ invoked }).toEqual({ invoked: 1 });
  });
});
