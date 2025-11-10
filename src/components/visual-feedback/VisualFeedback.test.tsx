import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import VisualFeedback from './VisualFeedback';

describe('VisualFeedback', () => {
  it('renders provided children', () => {
    const { getByText } = render(
      <VisualFeedback active>
        <span>feedback child</span>
      </VisualFeedback>
    );

    expect(getByText('feedback child')).toBeInTheDocument();
  });

  it('applies animation class when effect is active', () => {
    const { getByTestId } = render(
      <VisualFeedback effect="glow" active data-testid="feedback">
        glow content
      </VisualFeedback>
    );

    expect(getByTestId('feedback')).toHaveClass('glow');
  });

  it('spawns ripple feedback on click', () => {
    const mockRect = {
      width: 120,
      height: 60,
      top: 0,
      left: 0,
      right: 120,
      bottom: 60,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect;

    const rectSpy = jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(mockRect);

    const { getByTestId } = render(
      <VisualFeedback
        effect="ripple"
        active
        duration={800}
        data-testid="feedback"
      >
        ripple content
      </VisualFeedback>
    );

    fireEvent.click(getByTestId('feedback'), {
      clientX: 30,
      clientY: 20,
    });

    const ripples = getByTestId('feedback').querySelectorAll('.ripple');
    expect(ripples.length).toBeGreaterThan(0);

    rectSpy.mockRestore();
  });

  it('renders glass overlay when glass mode is enabled', () => {
    const { getByTestId } = render(
      <VisualFeedback glass active intensity={0.8} data-testid="feedback">
        glass content
      </VisualFeedback>
    );

    const overlay = getByTestId('feedback').querySelector('.glassOverlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveStyle({ opacity: '0.4' });
  });
});