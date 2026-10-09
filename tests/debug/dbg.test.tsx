import { describe, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, act, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { Popover } from '/home/ubuntu/repos/AuraGlass.wt/fin-c-plat/src/components/popover/index';

describe('dbg', () => {
  it('focus opens', async () => {
    jest.useFakeTimers();
    render(
      <Popover.Root openOnHover delay={50}>
        <Popover.Trigger>anchor</Popover.Trigger>
        <Popover.Portal><Popover.Positioner><Popover.Popup aria-label="pop" /></Popover.Positioner></Popover.Portal>
      </Popover.Root>,
    );
    const trig = screen.getByText('anchor');
    fireEvent.focus(trig);
    act(() => { jest.advanceTimersByTime(80); });
    console.log('expanded:', trig.getAttribute('aria-expanded'), 'popup:', !!document.querySelector('[data-ag-part="popup"]'));
  });
});
