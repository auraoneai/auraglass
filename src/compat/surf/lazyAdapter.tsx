'use client';
/* REQ-PLAT-70 / REQ-SURF-04: the date and tree compat adapters bridge onto
   src/date and src/data/tree-view, which need the optional peers
   react-aria-components / @internationalized/date. Importing
   'aura-glass/compat' must not evaluate those peers — a cold import paid
   ~200 ms for react-aria-components alone, and a consumer without the
   optional peers could not import compat at all. Those adapters therefore
   render their implementation through lazyAdapter(): the implementation
   module (and with it the peers) loads on first render.

   The loader is a React.lazy whose init hands React an already-settled
   thenable once the module is in memory, so a preloaded adapter renders
   synchronously (no Suspense fallback frame); before that the adapter
   suspends once inside its own boundary (fallback null). Streaming SSR
   resolves the lazy on the server like any React.lazy. */
import * as React from 'react';

type Loaded<P> = { default: React.ComponentType<P> };

const preloads = new Set<() => Promise<unknown>>();

export interface LazyAdapter<P> {
  /** Renders the implementation inside its own Suspense boundary. */
  Render: (props: P) => React.JSX.Element;
  /** Loads the implementation module; resolves once it can render synchronously. */
  preload: () => Promise<void>;
}

export function lazyAdapter<P extends object>(load: () => Promise<React.ComponentType<P>>): LazyAdapter<P> {
  let loaded: Loaded<P> | null = null;
  let pending: Promise<void> | null = null;
  const preload = (): Promise<void> => {
    pending ??= load().then((C) => { loaded = { default: C }; });
    return pending;
  };
  preloads.add(preload);
  const Impl = React.lazy<React.ComponentType<P>>(() => {
    const ready = loaded;
    if (ready) {
      // settled thenable: React.lazy reads it synchronously (no suspension)
      return { then: (resolve: (m: Loaded<P>) => void) => resolve(ready) } as unknown as Promise<Loaded<P>>;
    }
    return preload().then(() => loaded!);
  });
  const Render = (props: P): React.JSX.Element => (
    <React.Suspense fallback={null}>
      <Impl {...(props as P & React.JSX.IntrinsicAttributes)} />
    </React.Suspense>
  );
  return { Render, preload };
}

/** Loads every lazy adapter implementation (and the optional peers they
    need). Internal: tests and SSR hosts that want synchronous first renders. */
export function preloadLazyAdapters(): Promise<void> {
  return Promise.all([...preloads].map((p) => p())).then(() => undefined);
}
