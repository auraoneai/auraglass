/* REQ-CMP-28: `FocusScope` serves owned focus management only (Sheet detents, Tour); `Label` renders
   <label data-ag-part="label"> and absorbs GlassLabel; neither has a Glass* alias on ./primitives. */
import * as React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import * as primitives from '../../src/primitives';
import { FocusScope, Label } from '../../src/primitives';

const ROOT = join(__dirname, '..', '..');

describe('Label', () => {
  it('renders label[data-ag-part=label] with htmlFor passthrough and no required/disabled output by default', () => {
    const { container } = render(<Label htmlFor="email">Email</Label>);
    const label = container.querySelector('label')!;
    expect(label.getAttribute('data-ag-part')).toBe('label');
    expect(label.getAttribute('for')).toBe('email');
    expect(label.classList.contains('ag-label')).toBe(true);
    expect(label.hasAttribute('data-disabled')).toBe(false);
    expect(label.textContent).toBe('Email');
  });

  it('required renders an aria-hidden "*" and a visually hidden " (required)"', () => {
    const { container, getByRole } = render(<><Label htmlFor="n" required>Name</Label><input id="n" /></>);
    const star = container.querySelector('label > span[aria-hidden="true"]');
    expect(star?.textContent).toBe('*');
    const hidden = container.querySelector('label > .ag-visually-hidden');
    expect(hidden?.textContent).toBe(' (required)');
    // the accessible name carries the hidden text, not the aria-hidden asterisk
    expect(getByRole('textbox', { name: 'Name (required)' })).toBe(container.querySelector('input'));
  });

  it('disabled sets data-disabled', () => {
    const { container } = render(<Label disabled>Off</Label>);
    expect(container.querySelector('label')!.getAttribute('data-disabled')).toBe('');
  });

  it('GlassLabel compat renders the same Label output', async () => {
    const { GlassLabel } = await import('../../src/compat/cmp/controls/GlassLabel');
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const { container } = render(<GlassLabel required disabled htmlFor="x">X</GlassLabel>);
      const label = container.querySelector('label[data-ag-part="label"]')!;
      expect(label.getAttribute('for')).toBe('x');
      expect(label.getAttribute('data-disabled')).toBe('');
      expect(label.querySelector('span[aria-hidden="true"]')?.textContent).toBe('*');
    } finally { warn.mockRestore(); }
  });
});

describe('FocusScope', () => {
  function Trap({ trapped = true, loop = true, restoreFocus = true }: { trapped?: boolean; loop?: boolean; restoreFocus?: boolean }) {
    return (
      <FocusScope trapped={trapped} loop={loop} restoreFocus={restoreFocus}>
        <button type="button">first</button>
        <button type="button" disabled>disabled</button>
        <button type="button">last</button>
      </FocusScope>
    );
  }

  it('trapped + loop keeps Tab and Shift+Tab inside the scope', async () => {
    const user = userEvent.setup();
    const { getByText } = render(<><button type="button">before</button><Trap /><button type="button">after</button></>);
    getByText('first').focus();
    await user.tab();
    expect(document.activeElement).toBe(getByText('last'));
    await user.tab(); // wraps instead of leaving to "after"
    expect(document.activeElement).toBe(getByText('first'));
    await user.tab({ shift: true }); // wraps instead of leaving to "before"
    expect(document.activeElement).toBe(getByText('last'));
  });

  it('without trapped/loop, Tab leaves the scope', async () => {
    const user = userEvent.setup();
    const { getByText } = render(<><Trap trapped={false} loop={false} /><button type="button">after</button></>);
    getByText('last').focus();
    await user.tab();
    expect(document.activeElement).toBe(getByText('after'));
  });

  it('restoreFocus returns focus to the previously focused element on unmount', () => {
    function Host() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen((o) => !o)}>opener</button>
          {open ? <Trap /> : null}
        </>
      );
    }
    const { getByText } = render(<Host />);
    const opener = getByText('opener');
    opener.focus();
    act(() => { opener.click(); });
    act(() => { getByText('first').focus(); });
    expect(document.activeElement).toBe(getByText('first'));
    act(() => { opener.click(); }); // unmounts the scope while focus is inside it
    expect(document.activeElement).toBe(opener);
  });

  it('renders a div[data-ag-part=root][data-focus-scope] and adds no document listeners', () => {
    const add = jest.spyOn(document, 'addEventListener');
    try {
      const { container } = render(<Trap />);
      const root = container.querySelector('[data-focus-scope]')!;
      expect(root.tagName).toBe('DIV');
      expect(root.getAttribute('data-ag-part')).toBe('root');
      expect(add.mock.calls.filter(([type]) => type === 'keydown' || type === 'focusin')).toEqual([]);
    } finally { add.mockRestore(); }
  });

  it('is used for owned focus management only: Sheet and Tour', () => {
    const out = execFileSync('git', ['grep', '-l', '-E', "from '[./]+/primitives(/FocusScope)?'", '--', 'src/components'], { cwd: ROOT, encoding: 'utf8' });
    const users = out.split('\n').filter(Boolean).filter((f) => /\bFocusScope\b/.test(execFileSync('git', ['show', `:${f}`], { cwd: ROOT, encoding: 'utf8' })));
    expect(users.sort()).toEqual(['src/components/sheet/Sheet.client.tsx', 'src/components/tour/Tour.client.tsx']);
  });
});

describe('./primitives has no Glass* alias', () => {
  it('exports exactly the six KEEP primitives', () => {
    expect(Object.keys(primitives).sort()).toEqual(['DismissableLayer', 'FocusScope', 'Label', 'Portal', 'Slot', 'VisuallyHidden']);
    expect(Object.keys(primitives).filter((k) => k.startsWith('Glass'))).toEqual([]);
  });
});
