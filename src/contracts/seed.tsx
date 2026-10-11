/* @ag-contract-seed: S-30 seed helper. CONTRACT-owned. Excluded from the package build (tsconfig.build.json
   exclude). Used only by C0 seeds; seeds use React + this module only. */
import * as React from 'react';

const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
/** Parts that are buttons by default (§4.10). Everything else renders a div. */
const BUTTON_PARTS = new Set(['Trigger', 'Close', 'Item', 'SubmenuTrigger', 'ItemIndicator', 'ChipRemove']);
/** Overlay parts render only while the compound root is open. */
const GATED_PARTS = new Set(['Content', 'Popup']);

interface SeedCtx { open: boolean; value: unknown }

export function createSeedComponent<Tag extends keyof React.JSX.IntrinsicElements>(name: string, tag: Tag) {
  const Seed = ({ children, render, ...rest }: { children?: React.ReactNode; render?: React.ReactElement } & Record<string, unknown>) => {
    const el = React.createElement(tag, {
      'data-ag-seed': '', 'data-ag-part': 'root', className: `ag-${name}`, ...rest,
    }, children as React.ReactNode);
    if (render && React.isValidElement(render)) {
      const rp = (render.props ?? {}) as Record<string, unknown>;
      return React.cloneElement(render, {
        'data-ag-seed': '', 'data-ag-part': 'root',
        className: ['ag-' + name, rp.className].filter(Boolean).join(' '),
      } as Record<string, unknown>, children as React.ReactNode);
    }
    return el;
  };
  Seed.displayName = `Seed(${name})`;
  return Seed;
}

type SeedFC = React.FC<Record<string, unknown> & { children?: React.ReactNode }>;

export function createSeedCompound(name: string, parts: readonly string[]) {
  const ctx = React.createContext<SeedCtx>({ open: true, value: undefined });

  function SeedRoot({ children, open, defaultOpen, value, defaultValue, ...rest }: Record<string, unknown> & {
    children?: React.ReactNode; open?: boolean; defaultOpen?: boolean; value?: unknown; defaultValue?: unknown;
  }) {
    const [o] = React.useState<boolean>(() => Boolean(open ?? defaultOpen ?? false));
    const [v] = React.useState<unknown>(() => value ?? defaultValue);
    const isOpen = typeof open === 'boolean' ? open : o;
    return (
      <ctx.Provider value={{ open: isOpen, value: v }}>
        <div data-ag-seed="" data-ag-part="root" className={`ag-${name}__root`} {...rest}>{children}</div>
      </ctx.Provider>
    );
  }
  function SeedProvider({ children }: { children?: React.ReactNode }) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  function makePart(p: string): SeedFC {
    function SeedPart({ children, ...rest }: Record<string, unknown> & { children?: React.ReactNode }) {
      const { open } = React.useContext(ctx);
      if (GATED_PARTS.has(p) && !open) return null;
      const tag = BUTTON_PARTS.has(p) ? 'button' : 'div';
      return React.createElement(tag, {
        'data-ag-seed': '', 'data-ag-part': kebab(p), className: `ag-${name}__${kebab(p)}`, ...rest,
      }, children as React.ReactNode);
    }
    return SeedPart;
  }

  const out: Record<string, SeedFC> = {};
  for (const part of parts) {
    if (part === 'Root') { out.Root = SeedRoot as SeedFC; continue; }
    if (part === 'Provider') { out.Provider = SeedProvider as SeedFC; continue; }
    out[part] = makePart(part);
  }
  for (const p of parts) out[p]!.displayName = `${name}.${p}`;
  return out;
}
