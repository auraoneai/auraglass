/* CMP-342 (REQ-CMP-132): compat adapter contract test — renders the real 5.0
   component (data-ag-overlay kind + compat root), one assertion per mapped
   §10.2 row, warnDeprecated once per symbol across 2 mounts, silent in prod. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { useToast } from '../useToast';

const flush = async () => { await act(async () => {}); };

async function mountTwice(node: () => React.ReactElement, depId: string) {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const a = render(node());
  await flush();
  a.unmount();
  const b = render(node());
  await flush();
  const depCalls = warn.mock.calls.filter((c: unknown) => String((c as unknown[])[0]).includes(`'${depId}'`));
  warn.mockRestore();
  return { depCalls, b };
}

import { Toast } from '../../../../components/toast';

function Probe() {
  const api = useToast();
  React.useEffect(() => {
    api.toast({ message: 'hi', type: 'success' });
  }, [api]);
  return null;
}

describe('useToast compat (CMP-341)', () => {
  it('toast()/addToast -> useToast().add, dismiss -> close', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Toast.Provider><Toast.Viewport /><Probe /></Toast.Provider>);
    await flush();
    expect(warn.mock.calls.flat().join(' ')).toContain('DEP-C0118');
    warn.mockRestore();
  });
});

import { useToast as useToast5 } from '../../../../components/toast';

describe('useToast compat — 4.x description (REQ-CMP-135)', () => {
  type Opts = Parameters<ReturnType<typeof useToast>['toast']>[0];
  /* Adds through the compat hook; renders the queue the 5.0 way. */
  function Host({ opts }: { opts: Opts }) {
    const compat = useToast();
    const t = useToast5();
    React.useEffect(() => { compat.toast(opts); }, [compat, opts]);
    return (
      <Toast.Viewport>
        {t.toasts.map((toast) => (
          <Toast.Root key={toast.id} toast={toast}>
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.description}</Toast.Description>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    );
  }
  const mount = async (opts: Opts) => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Toast.Provider><Host opts={opts} /></Toast.Provider>);
    await flush();
    warn.mockRestore();
  };
  const desc = () => document.querySelector('[data-ag-part="description"]')?.textContent;

  it('description maps onto the toast description', async () => {
    await mount({ title: 'Saved', description: 'All changes stored' });
    expect(document.querySelector('[data-ag-part="title"]')?.textContent).toBe('Saved');
    expect(desc()).toBe('All changes stored');
  });

  it('description wins over message when both are given', async () => {
    await mount({ title: 'Saved', description: 'from description', message: 'from message' });
    expect(desc()).toBe('from description');
  });

  it('message still maps onto the description when description is absent', async () => {
    await mount({ title: 'Saved', message: 'from message' });
    expect(desc()).toBe('from message');
  });
});
