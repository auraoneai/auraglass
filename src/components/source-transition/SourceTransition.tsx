'use client';
/* SourceTransition (SURF-090): view-transition-name migrates from the source
   element to the destination through the motion seam (startMorph — the MAT
   contract seam; no own engine). calm motion cross-fades via MAT, none runs
   synchronously. Focus moves to the destination's first focusable. */

import * as React from 'react';
import { flushSync } from 'react-dom';
import { startMorph } from '../../motion';
import { viewTransitionParticipantAttributes } from '../../material/stateAttributes';
import { partElement } from '../../app-shell/_internal/partElement';
import type { PartProps } from '../../contracts/components';

type TransitionState = { active: string | null };

const Ctx = React.createContext<{
  active: string | null;
  begin: (id: string) => void;
}>({ active: null, begin: () => {} });

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

  const ctx = React.useMemo(() => ({ active: state.active, begin }), [state.active, begin]);
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

function Source({ id, children, render, style, ...rest }: TransitionSourceProps) {
  const { active, begin } = React.useContext(Ctx);
  const transitioning = active === id;
  return partElement('div', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'source',
    'data-src': sanitize(id),
    ...viewTransitionParticipantAttributes(),
    style: {
      ...style,
      viewTransitionName: transitioning ? `ag-src-${sanitize(id)}` : undefined,
    },
    onClick: () => begin(id),
    ...rest,
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
    'data-src-dest': sanitize(id),
    ...viewTransitionParticipantAttributes(),
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
  const source = document.querySelector<HTMLElement>(`[data-src="${sid}"]`);
  const dest = document.querySelector<HTMLElement>(`[data-src-dest="${sid}"]`);
  const hadFocus = source ? source.contains(document.activeElement) : false;
  if (source) {
    flushSync(() => {
      source.style.viewTransitionName = name;
    });
  }
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
  );
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
