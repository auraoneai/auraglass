/** @jest-environment jsdom */
// REQ-SURF-07 — the function-child contract on server-rendered ChartFrame.
// ChartFrame is a SERVER module: its <figure>/<figcaption> ship in the RSC
// payload while the render-prop children are forwarded to ChartFrame.Inter-
// active (the client island) uninvoked. Across a real RSC boundary React
// Flight dev-errors on a function prop — "Functions cannot be passed to
// Client Components" — which is why the contract pins: the server root must
// never invoke children itself, and invocation happens only inside the
// island (proven dynamically here: the SSR pass renders the island's height
// placeholder without invoking children, the client mount invokes them).
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToString } from 'react-dom/server';
import { render } from '@testing-library/react';
import { ChartFrame } from '../../../src/data/chart-frame/ChartFrame';

const DATA = [{ m: 'Jan', a: 1 }];

describe('ChartFrame function child (REQ-SURF-07)', () => {
  it('the server root never invokes function children', () => {
    const src = readFileSync(join(process.cwd(), 'src/data/chart-frame/ChartFrame.tsx'), 'utf8');
    // children is forwarded to the island via props spread — any direct
    // invocation on the server path would be the RSC dev-error footgun.
    expect({ invokes: /children\s*\(/.test(src) }).toEqual({ invokes: false });
  });
  it('function children are invoked inside the island, never on the SSR pass', () => {
    // REQ-SURF-93: on the server `width` is undefined, so the island renders
    // the `height` placeholder without invoking the adapter (CLS 0); once the
    // island measures its plot on the client it invokes the function child.
    let invoked = 0;
    const tree = (
      <ChartFrame title="Revenue" data={DATA} x={{ key: 'm', label: 'Month' }} series={[{ key: 'a', label: 'Revenue' }]}>
        {(ctx) => { invoked++; return <span data-testid="plot">{String(ctx.width)}</span>; }}
      </ChartFrame>
    );
    const html = renderToString(tree);
    expect({ invoked, placeholder: html.includes('ag-chart-frame__placeholder') }).toEqual({ invoked: 0, placeholder: true });
    // jsdom has no ResizeObserver: the island measures the plot once
    // (getBoundingClientRect, 0 in jsdom) and invokes the child with it.
    const { getByTestId, unmount } = render(tree);
    expect({ invoked, width: getByTestId('plot').textContent }).toEqual({ invoked: 1, width: '0' });
    unmount();
  });
});
