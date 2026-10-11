/* S-30 runtime assertions shared by components.test.tsx (real CMP modules) and
   doubles.test.tsx (tests/contract-doubles/cmp/*), so a double and the real component are held
   to the same contract (§6.3). */
import * as React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react';

type AnyComponent = React.ComponentType<Record<string, unknown>>;
export const isComponent = (v: unknown): v is AnyComponent =>
  typeof v === 'function' || (typeof v === 'object' && v !== null && '$$typeof' in (v as Record<string, unknown>));

/** Leaves that legally attach directly under a compound Root, in preference order. */
export const DIRECT_LEAVES = ['Trigger', 'Track', 'Item', 'Viewport', 'Input', 'Button', 'Image', 'Header', 'Label', 'Step', 'Title'] as const;

export function resetDom() {
  cleanup();
  document.body.innerHTML = '';
}

export interface MountResult { mounted: boolean; leaf: string | null; parts: string[]; rootPart: boolean; seed: boolean; errors: string[] }

const snapshot = (leaf: string | null): Omit<MountResult, 'errors'> => {
  const parts = [...new Set(Array.from(document.querySelectorAll('[data-ag-part]')).map((e) => e.getAttribute('data-ag-part')!))];
  return { mounted: true, leaf, parts, rootPart: parts.includes('root'), seed: document.querySelector('[data-ag-seed]') !== null };
};

/** Mounts Root (inside Provider when the compound has one) with `rootProps` and, in turn, each
    direct leaf the compound exports; returns the first mount that renders data-ag-part. Every
    attempt's error is kept so a compound that cannot mount at all reports why. */
export async function mountCompound(C: Record<string, unknown>, parts: readonly string[], rootProps: Record<string, unknown>): Promise<MountResult> {
  const errors: string[] = [];
  let firstOk: Omit<MountResult, 'errors'> | null = null;
  const hasProvider = parts.includes('Provider') && isComponent(C.Provider);
  const leaves: Array<string | null> = [...DIRECT_LEAVES.filter((l) => parts.includes(l) && isComponent(C[l])), null];
  for (const leaf of leaves) {
    resetDom();
    try {
      const child = leaf ? React.createElement(C[leaf] as AnyComponent, { key: leaf }, leaf === 'Item' ? 'item' : undefined) : undefined;
      // Toast: Root instances are created by the toast manager, so the Provider mounts its Viewport.
      const tree = hasProvider && leaf === 'Viewport'
        ? React.createElement(C.Provider as AnyComponent, null, child)
        : hasProvider
          ? React.createElement(C.Provider as AnyComponent, null, React.createElement(C.Root as AnyComponent, rootProps, child))
          : React.createElement(C.Root as AnyComponent, rootProps, child);
      render(tree);
      await act(async () => {});
      const s = snapshot(leaf);
      if (s.parts.length > 0) return { ...s, errors };
      firstOk ??= s;
    } catch (e) {
      errors.push(`${leaf ?? 'Root alone'}: ${(e as Error).message.split('\n')[0]}`);
    }
  }
  return firstOk ? { ...firstOk, errors } : { mounted: false, leaf: null, parts: [], rootPart: false, seed: false, errors };
}

export interface OpenBehaviour { expandedAfterClick: string | null; calls: Array<{ open: unknown; reason: unknown }> }
/** Uncontrolled Root + Trigger; click the trigger; observe aria-expanded and onOpenChange. */
export async function openBehaviour(C: Record<string, unknown>, extraRoot: Record<string, unknown> = {}): Promise<OpenBehaviour> {
  resetDom();
  const calls: OpenBehaviour['calls'] = [];
  const onOpenChange = (open: unknown, details: unknown) => { calls.push({ open, reason: (details as { reason?: unknown } | undefined)?.reason }); };
  render(React.createElement(C.Root as AnyComponent, { ...extraRoot, onOpenChange }, React.createElement(C.Trigger as AnyComponent, { key: 't' }, 'open')));
  await act(async () => {});
  const trigger = document.querySelector('[data-ag-part="trigger"]') ?? document.querySelector('[data-ag-part="context-trigger"]');
  if (!trigger) return { expandedAfterClick: null, calls };
  await act(async () => {
    fireEvent.pointerDown(trigger, { pointerType: 'mouse', button: 0 });
    fireEvent.mouseDown(trigger, { button: 0 });
    fireEvent.pointerUp(trigger, { pointerType: 'mouse', button: 0 });
    fireEvent.mouseUp(trigger, { button: 0 });
    fireEvent.click(trigger, { button: 0 });
  });
  return { expandedAfterClick: trigger.getAttribute('aria-expanded'), calls };
}
