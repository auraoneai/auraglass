/* CMP-032: LayerStack semantics — two nested open layers; the first Escape closes
   only the inner layer (focus lands on the inner trigger), the second closes the
   outer (focus lands on the outer trigger). */
import * as React from 'react';
import { describe, expect, it, jest, afterEach } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import { DismissableLayer } from './DismissableLayer';
import { AuraGlassProvider } from '../theme/index';

afterEach(() => {
  jest.restoreAllMocks();
});

function Nested() {
  const [outerOpen, setOuterOpen] = React.useState(false);
  const [innerOpen, setInnerOpen] = React.useState(false);
  return (
    <AuraGlassProvider>
      <button data-testid="outer-trigger" onClick={() => setOuterOpen(true)}>outer trigger</button>
      {outerOpen && (
        <DismissableLayer onDismiss={() => setOuterOpen(false)}>
          <div data-testid="outer-layer">
            <button data-testid="inner-trigger" onClick={() => setInnerOpen(true)}>inner trigger</button>
            {innerOpen && (
              <DismissableLayer onDismiss={() => setInnerOpen(false)}>
                <div data-testid="inner-layer"><button>inside</button></div>
              </DismissableLayer>
            )}
          </div>
        </DismissableLayer>
      )}
    </AuraGlassProvider>
  );
}

describe('DismissableLayer over the LayerStack', () => {
  it('Escape reaches only the top open layer and restores focus to its trigger', () => {
    const { getByTestId, queryByTestId } = render(<Nested />);

    // open outer: capture + focus its trigger first so focus restore has a target
    const outerTrigger = getByTestId('outer-trigger');
    outerTrigger.focus();
    fireEvent.click(outerTrigger);
    expect(queryByTestId('outer-layer')).not.toBeNull();

    // open inner from a focused trigger
    const innerTrigger = getByTestId('inner-trigger');
    innerTrigger.focus();
    fireEvent.click(innerTrigger);
    expect(queryByTestId('inner-layer')).not.toBeNull();

    // first Escape closes only the inner layer and focus lands on its trigger
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(queryByTestId('inner-layer')).toBeNull();
    expect(queryByTestId('outer-layer')).not.toBeNull();
    expect(document.activeElement).toBe(innerTrigger);

    // second Escape closes the outer layer and focus lands on its trigger
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(queryByTestId('outer-layer')).toBeNull();
    expect(document.activeElement).toBe(outerTrigger);
  });

  it('onEscapeKeyDown preventDefault keeps the layer open', () => {
    const onDismiss = jest.fn();
    render(
      <DismissableLayer onDismiss={onDismiss} onEscapeKeyDown={(e) => e.preventDefault()}>
        <div>layer</div>
      </DismissableLayer>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
