'use client';
/* SourceTransition (SURF-090): view-transition-name migrates from the source
   element to the destination through the motion seam (startMorph — the MAT
   contract seam; no own engine). calm motion cross-fades via MAT, none runs
   synchronously. Focus moves to the destination's first focusable. */

import * as React from 'react';
import { flushSync } from 'react-dom';
import { startMorph, useMorphName } from '../../motion';
import { viewTransitionParticipantAttributes } from '../../material/stateAttributes';
import { partElement } from '../../app-shell/_internal/partElement';
import type { PartProps } from '../../contracts/components';

const Ctx = /*#__PURE__*/ React.createContext<{
  active: string | null;
  begin: (id: string, from: Element) => void;
  /** SURF-064: Root-level source registry (dev error on duplicate ids). */
  registerSource: (id: string) => () => void;
}>({ active: null, begin: () => {}, registerSource: () => () => {} });

const sanitize = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, '-');

export type SourceTransitionRootProps = PartProps<'div'> & {
  onTransition?: ((id: string) => void) | undefined;
};

function SourceTransitionRoot({ onTransition, children, render, ...rest }: SourceTransitionRootProps) {
  /* REQ-MAT-48: per-Root morph scope from useId(), sanitised to [a-z0-9-];
     each pair's view-transition-name is `<scope>-<id>`. */
  const scope = useMorphName('src');
  const rootRef = React.useRef<HTMLElement | null>(null);
  const [active, setActive] = React.useState<string | null>(null);
  const activeIds = React.useRef<Set<string>>(new Set());

  const begin = React.useCallback(
    (id: string, from: Element) => {
      // Dev-only bookkeeping for the duplicate-active warning.
      if (process.env['NODE_ENV'] === 'development') {
        if (activeIds.current.has(id)) console.warn(`[auraglass] SourceTransition: duplicate active transition "${id}".`);
        activeIds.current.add(id);
      }
      flushSync(() => setActive(id));
      void startScoped(
        id,
        () => {
          setActive(null);
          if (process.env['NODE_ENV'] === 'development') activeIds.current.delete(id);
          onTransition?.(id);
        },
        scope,
        /* REQ-SURF-64: lookups stay inside this Root */
        rootRef.current ?? from.closest('[data-ag-part="source-transition"]'),
      );
    },
    [onTransition, scope],
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
    () => ({ active, begin, registerSource }),
    [active, begin, registerSource],
  );
  return (
    <Ctx.Provider value={ctx}>
      {partElement('div', {
        render: render as React.ReactElement | undefined,
        'data-ag-part': 'source-transition',
        ref: rootRef,
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
    'data-src': sanitize(id),
    ...viewTransitionParticipantAttributes(),
    style,
    ...rest,
    // Compose the consumer's onClick (runs first; preventDefault opts out).
    onClick: (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) begin(id, e.currentTarget);
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
    startMorph: inside the update the name leaves the source, update() is
    flushed, and only then is the destination resolved and named — so a
    Destination that mounts as a result of the update (list -> detail) gets
    the name for the new snapshot and receives focus. Lookups are scoped to
    `scope` (a Source click passes its SourceTransition.Root, so equal ids
    under another Root never collide; the static defaults to document). Focus
    moves only when the source contained document.activeElement at begin
    time. Both names are cleared when the morph settles. */
export function SourceTransitionStart(id: string, update: () => void, scope?: ParentNode | null): Promise<void> {
  return startScoped(id, update, undefined, scope ?? null);
}

/* REQ-MAT-48: names stay within [a-z0-9-]; a Root passes its useMorphName
   scope and its element, so two Roots reusing an id never collide. */
function startScoped(id: string, update: () => void, nameScope: string | undefined, root: ParentNode | null): Promise<void> {
  const sid = sanitize(id);
  const name = `${nameScope ?? 'ag-src'}-${sid.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`.replace(/-+/g, '-');
  const within: ParentNode = root ?? document;
  const q = (attr: string) => within.querySelector<HTMLElement>(`[${attr}="${sid}"]`);
  const setName = (el: HTMLElement | null, v: string) => {
    if (el) el.style.viewTransitionName = v;
  };
  const source = q('data-src');
  let dest = q('data-src-dest');
  const surfaces = [source, dest].filter(Boolean) as HTMLElement[];
  const hadFocus = !!source?.contains(document.activeElement);
  flushSync(() => setName(source, name));
  return startMorph(
    () => {
      flushSync(() => {
        setName(source, '');
        update();
      });
      // The update has committed: resolve the destination now (it may have
      // just mounted, or been replaced), then name and focus it.
      dest = q('data-src-dest');
      setName(dest, name);
      if (hadFocus && dest) {
        const focusable =
          dest.querySelector<HTMLElement>('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? dest;
        if (focusable.tabIndex < 0) focusable.tabIndex = -1;
        focusable.focus();
      }
    },
    { surfaces, name },
  ).finally(() => {
    setName(source, '');
    setName(dest, '');
  });
}

export function startSourceTransition(root: HTMLElement, id: string, update: () => void): void {
  void SourceTransitionStart(id, update, root);
}

export const SourceTransition = {
  Root: SourceTransitionRoot,
  Source,
  Destination,
  start: SourceTransitionStart,
};
