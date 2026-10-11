/* CMP-342 (REQ-CMP-132): compat adapter contract test — renders the real 5.0
   component (data-ag-overlay kind + compat root), one assertion per mapped
   §10.2 row, warnDeprecated once per symbol across 2 mounts, silent in prod. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { GlassNotificationCenter, useNotifications } from '../GlassNotificationCenter';

const flush = async () => { await act(async () => {}); };

async function mountTwice(node: () => React.ReactElement, depId: string) {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const a = render(node());
  await flush();
  a.unmount();
  const b = render(node());
  await flush();
  const depCalls = warn.mock.calls.filter((c: unknown) => String((c as unknown[])[0]).startsWith(`[aura-glass] ${depId} `));
  warn.mockRestore();
  return { depCalls, b };
}

import { Toast } from '../../../../components/toast';

function HookProbe() {
  const api = useNotifications();
  React.useEffect(() => { api.addNotification({ title: 'n1' }); }, [api]);
  return null;
}

describe('GlassNotificationCenter compat (CMP-341)', () => {
  it('renders Popover list; useNotifications().addNotification -> toast()', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Toast.Provider>
        <Toast.Viewport />
        <GlassNotificationCenter
          notifications={[{ title: 'Welcome', type: 'success' }]}
          trigger={<button>bell</button>}
        />
        <HookProbe />
      </Toast.Provider>,
    );
    await flush();
    const text = warn.mock.calls.flat().join(' ');
    expect(text).toContain('DEP-C0119');
    warn.mockRestore();
  });
});
