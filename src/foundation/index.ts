/* @ag-contract-seed: S-31, S-32. Owner CMP replaces internals; exports frozen. */
import * as React from 'react';

export const defineMeta = <T>(m: T): T => m;

export const toChangeDetails = (e: unknown) => ({
  event: e instanceof Event ? e : undefined,
  reason: 'unknown' as const,
});

/** Clones `render` with merged props, or renders the fallback element. */
export function renderElement<Tag extends keyof React.JSX.IntrinsicElements>(
  fallbackTag: Tag,
  props: Record<string, unknown> & { render?: React.ReactElement; children?: React.ReactNode },
) {
  const { render, ...rest } = props;
  if (render && React.isValidElement(render)) {
    const rp = (render.props ?? {}) as Record<string, unknown>;
    return React.cloneElement(render, {
      ...rest,
      className: [rest.className, rp.className].filter(Boolean).join(' '),
      style: { ...(rest.style as React.CSSProperties | undefined), ...(rp.style as React.CSSProperties | undefined) },
    } as Record<string, unknown>);
  }
  return React.createElement(fallbackTag, rest, rest.children as React.ReactNode);
}
