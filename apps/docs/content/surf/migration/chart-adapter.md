# Chart adapter guide

`aura-glass/charts` renders a spec (`{ data, encodings, scales?, marks? }`)
through a renderer you supply. The default is the repo's 2-D renderer;
this guide shows how to write an adapter for another engine — the tests in
`tests/charts/adapters/` exercise the contract.

## The interface

```ts
/** The spec shape `aura-glass/charts` hands a renderer. */
export interface ChartSpec {
  data: readonly Record<string, unknown>[];
  encodings: Record<string, string>;
  scales?: Record<string, unknown>;
  marks?: readonly string[];
}

export interface RenderOptions {
  width?: number;
  height?: number;
}

export interface ChartRenderer<Spec = ChartSpec> {
  mount(el: HTMLElement, spec: Spec, opts?: RenderOptions): RenderHandle<Spec>;
}

export interface RenderHandle<Spec = ChartSpec> {
  update(spec: Spec): void;   // incremental spec apply
  resize(w: number, h: number): void;
  destroy(): void;           // release all engine resources
}
```

## Rules

1. **No module-scope work** — `mount` is the only entry that may touch the
   DOM; a spec change never re-mounts.
2. **Themes bridge, not fork** — map the AuraGlass theme tokens onto your
   engine's theme object in `mount`; never hard-code colors.
3. **Idle discipline** — renderers that animate must honor the idle rules
   (pause on `visibilitychange`, `IntersectionObserver`, reduced-motion) —
   same discipline the labs admission gate enforces.
4. **Destroy is total** — after `destroy()` the element must be
   DOM-clean and all listeners removed.

## Example (sketch)

```ts
// The renderer contract from "The interface" above, restated so this
// sketch stands alone (in your app these live in one module).
interface ChartSpec {
  data: readonly Record<string, unknown>[];
  encodings: Record<string, string>;
  scales?: Record<string, unknown>;
  marks?: readonly string[];
}
interface RenderHandle {
  update(spec: ChartSpec): void;
  resize(w: number, h: number): void;
  destroy(): void;
}
interface ChartRenderer {
  mount(el: HTMLElement, spec: ChartSpec, opts?: { width?: number; height?: number }): RenderHandle;
}

// Your engine and its AuraGlass-theme bridge (supplied by your app).
interface MyChart {
  setOption(option: unknown, opts?: { notMerge?: boolean }): void;
  resize(size: { width: number; height: number }): void;
  dispose(): void;
}
declare const MyEngine: { init(el: HTMLElement, theme: unknown): MyChart };
declare function toMyTheme(): unknown;
declare function toMyOption(spec: ChartSpec): unknown;

export const myEngineRenderer: ChartRenderer = {
  mount(el, spec) {
    const chart = MyEngine.init(el, toMyTheme());
    chart.setOption(toMyOption(spec));
    return {
      update: (s) => chart.setOption(toMyOption(s), { notMerge: true }),
      resize: (w, h) => chart.resize({ width: w, height: h }),
      destroy: () => chart.dispose(),
    };
  },
};
```

Register it by passing `renderer={myEngineRenderer}` to `<Chart>` or by
wrapping in your app-level provider. Ship the adapter in your app or under
`packages/` — not in `src/charts/**`, which stays engine-agnostic.
