/** REQ-PLAT-96: generic AuraGlass doubles. Real component seams live in
 * ../cmp/*.tsx (contract-owned S-30 doubles); this factory covers every
 * other name the registry imports so blocks render on renderToString
 * without the built package. */
import * as React from 'react';
import { withPart, kebab } from '../cmp/_part';

type AnyProps = Record<string, unknown> & { children?: React.ReactNode };

const tagFor = (name: string): keyof JSX.IntrinsicElements =>
  /^(Button|IconButton|Toolbar)/.test(name) ? 'button'
  : /^(Link)/.test(name) ? 'a'
  : /^(Text|Badge|Stat|Sparkline|UsageMeter)/.test(name) ? 'span'
  : 'div';

export function comp<P extends AnyProps>(name: string) {
  const Tag = tagFor(name);
  return function Double(props: P) {
    return React.createElement(Tag as string, { 'data-ag-part': kebab(name), 'data-ag-double': '', ...props });
  };
}

const PARTS = ['root', 'trigger', 'content', 'header', 'body', 'footer', 'title', 'description', 'close', 'item', 'list', 'panel', 'popup', 'thumb', 'fallback', 'image', 'viewport', 'track', 'control', 'scrim', 'overlay', 'portal', 'group', 'indicator', 'label', 'separator', 'handle', 'column', 'row', 'cell', 'previous', 'next', 'icon', 'text', 'input', 'output', 'canvas', 'play-button', 'scrubber', 'time', 'spacer', 'volume', 'mute', 'fullscreen', 'main','page-header','workspace','nav','leading','trailing','section','artwork','progress','subtitle','actions','captions','play','rate','picture-in-picture','action','next','previous','empty','pip'] as const;

export function compound<P extends AnyProps>(name: string) {
  /* Any part key resolves to a stub — the registry's parts are open-ended. */
  const Root = comp<P>(name);
  const base = { Root } as { Root: typeof Root } & Record<string, unknown>;
  return new Proxy(base, {
    get(target, key) {
      if (typeof key === 'string' && !(key in target)) {
        target[key] = comp<P>(`${name}-${String(key).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`);
      }
      return target[key as string];
    },
  }) as { Root: typeof Root } & Record<string, typeof Root>;
}
