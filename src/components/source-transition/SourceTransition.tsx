'use client';
/* SourceTransition (SURF-090): view-transition-name migrates from the source
   element to the destination through the motion seam (startMorph — the MAT
   contract seam; no own engine). calm motion cross-fades via MAT, none runs
   synchronously. Focus moves to the destination's first focusable. */

import * as React from 'react';
import { flushSync } from 'react-dom';
import { startMorph } from '../../motion';
import { partElement } from '../../app-shell/_internal/partElement';
import type { PartProps } from '../../contracts/components';

type TransitionState = { active: string | null };

const Ctx = React.createContext<{
  active: string | null;
  begin: (id: string) => void;
  /** SURF-064: Root-level source registry (dev error on duplicate ids). */
  registerSource: (id: string) => () => void;
}>({ active: null, begin: () => {}, registerSource: () => () => {} });

const sanitize = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, '-');

export type SourceTransitionRootProps = PartProps<'div'> & {
  onTransition?: ((id: string) => void) | undefined;
};

function SourceTransitionRoot({ onTransition, children, render, ...rest }: SourceTransitionRootProps) {
  const [state, setState] = React.useState<TransitionState>({ active: null });
  const activeIds = React.useRef<Set<string>>(new Set());

  const begin = React.useCallback(
    (id: string) => {
      if (process.env['NODE_ENV'] === 'development' && activeIds.current.has(id)) {
        console.warn(`[auraglass] SourceTransition: duplicate active transition "${id}".`);
      }
      activeIds.current.add(id);
      flushSync(() => setState({ active: id }));
      void SourceTransitionStart(id, () => {
        setState({ active: null });
        activeIds.current.delete(id);
        onTransition?.(id);
      });
    },
    [onTransition],
  );

  const sources = React.useRef<Map<string, number>>(new Map());
  const registerSource = React.useCallback((id: string) => {
    const n = sources.current.get(id) ?? 0;
    if (n > 0 && process.env['NODE_ENV'] !== 'production') {
      console.error(
        `[auraglass] SourceTransition: duplicate Source id "${id}" — view-transition names must be unique per Root.`,
      );
    }
    sources.current.set(id, n + 1);
    return () => {
      const left = (sources.current.get(id) ?? 1) - 1;
      if (left <= 0) sources.current.delete(id);
      else sources.current.set(id, left);
    };
  }, []);

  const ctx = React.useMemo(
    () => ({ active: state.active, begin, registerSource }),
    [state.active, begin, registerSource],
  );
  return (
    <Ctx.Provider value={ctx}>
      {partElement('div', {
        render: render as React.ReactElement | undefined,
        'data-ag-part': 'source-transition',
        ...rest,
        children,
      })}
    </Ctx.Provider>
  );
}
SourceTransitionRoot.displayName = 'SourceTransition.Root';

export type TransitionSourceProps = PartProps<'div'> & { id: string };

function Source({ id, children, render, style, onClick, ...rest }: TransitionSourceProps) {
  const { begin, registerSource } = React.useContext(Ctx);
  React.useLayoutEffect(() => registerSource(id), [registerSource, id]);
  // The view-transition-name is written imperatively by SourceTransitionStart
  // (set for the old snapshot, removed inside the update) — never from render
  // state, which would re-apply it after the update moved it.
  return partElement('div', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'source',
    'data-ag-src': sanitize(id),
    'data-ag-vt-participant': '',
    style,
    ...rest,
    // Compose the consumer's onClick (runs first; preventDefault opts out).
    onClick: (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) begin(id);
    },
    children,
  });
}
Source.displayName = 'SourceTransition.Source';

export type TransitionDestinationProps = PartProps<'div'> & { id: string };

function Destination({ id, children, render, style, ...rest }: TransitionDestinationProps) {
  const { active } = React.useContext(Ctx);
  const settled = active === null;
  return partElement('div', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'destination',
    'data-ag-src-dest': sanitize(id),
    'data-ag-vt-participant': '',
    style: {
      ...style,
      opacity: settled ? 1 : undefined,
      transform: settled ? 'none' : undefined,
    },
    ...rest,
    children,
  });
}
Destination.displayName = 'SourceTransition.Destination';

/** Imperative entry point — one call per Root transition.
    SURF-064/065: flushSync the `ag-src-<id>` name onto the source, then
    startMorph over surfaces [source, dest]: inside the update the name
    leaves the source, update() runs, and the name lands on the destination
    (source->destination migration). Focus moves only when the source
    contained document.activeElement at begin time. */
export function SourceTransitionStart(id: string, update: () => void): Promise<void> {
  const sid = sanitize(id);
  const name = `ag-src-${sid}`;
  const source = document.querySelector<HTMLElement>(`[data-ag-src="${sid}"]`);
  const dest = document.querySelector<HTMLElement>(`[data-ag-src-dest="${sid}"]`);
  const hadFocus = source ? source.contains(document.activeElement) : false;
  if (source) {
    flushSync(() => {
      source.style.viewTransitionName = name;
    });
  }
  const clear = () => {
    if (source) source.style.viewTransitionName = '';
    if (dest) dest.style.viewTransitionName = '';
  };
  return startMorph(
    () =>
      flushSync(() => {
        if (source) source.style.viewTransitionName = '';
        update();
        if (dest) dest.style.viewTransitionName = name;
        if (hadFocus && dest) {
          const focusable =
            dest.querySelector<HTMLElement>(
              'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
            ) ?? dest;
          if (focusable) {
            if (focusable.tabIndex < 0) focusable.tabIndex = -1;
            focusable.focus();
          }
        }
      }),
    { surfaces: [source, dest].filter((e): e is HTMLElement => e !== null), name },
  ).finally(clear);
}

export function startSourceTransition(root: HTMLElement, id: string, update: () => void): void {
  void SourceTransitionStart(id, update);
}

export const SourceTransition = {
  Root: SourceTransitionRoot,
  Source,
  Destination,
  start: SourceTransitionStart,
};
