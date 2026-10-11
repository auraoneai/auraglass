/* S-31/S-32 seam (CMP-owned). Exports frozen: defineMeta, toChangeDetails, renderElement.
   defineMeta validates meta shape in dev; toChangeDetails normalises Base UI event
   details; renderElement implements the render-prop pattern (element, function, or
   fallback) with className/style/ref merging. */
import * as React from 'react';
import type { ChangeDetails, ComponentMeta, RenderProp } from '../contracts/components';
import { PART_NAME_RE } from '../contracts/components';
import { toChangeDetails as toChangeDetailsImpl } from './types';

/** S-31. Identity at runtime; dev-validates the meta's part/state grammar once. */
const validated = new Set<string>();
export const defineMeta = <const M extends ComponentMeta>(meta: M): M => {
  if (process.env.NODE_ENV !== 'production' && !validated.has(meta.name)) {
    validated.add(meta.name);
    for (const part of meta.parts) {
      if (!PART_NAME_RE.test(part)) {
        // eslint-disable-next-line no-console
        console.error(`aura-glass: meta ${meta.name} has invalid part name ${JSON.stringify(part)} (S-33 kebab-case)`);
      }
    }
  }
  return meta;
};

/** S-32. Normalises a Base UI event-details object (or raw Event) into ChangeDetails. */
export const toChangeDetails = (eventDetails: unknown): ChangeDetails =>
  toChangeDetailsImpl(eventDetails, 'unknown');

const isRenderElement = (r: unknown): r is React.ReactElement =>
  React.isValidElement(r);

const getRef = (el: React.ReactElement): React.Ref<unknown> | undefined =>
  (el.props as { ref?: React.Ref<unknown> } | undefined)?.ref;

const composeRefs = (
  a: React.Ref<unknown> | undefined,
  b: React.Ref<unknown> | undefined,
): React.RefCallback<unknown> | undefined => {
  if (!a && !b) return undefined;
  return (node) => {
    for (const ref of [a, b]) {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<unknown>).current = node;
    }
  };
};

/**
 * S-32 render-prop. `render` may be a React element (cloned with merged props) or a
 * function `(props, state) => element`. The fallback element is used when render is
 * absent. props merge shallowly; className concatenates (render's own last wins on
 * conflicts), style merges, refs compose.
 */
export function renderElement<P extends object>(
  render: RenderProp<P> | undefined,
  fallback: React.ReactElement,
  props: P,
  state?: object,
): React.ReactElement {
  if (typeof render === 'function') {
    return render(props, (state ?? {}) as Record<string, unknown>);
  }

  const p = props as Record<string, unknown>;

  if (isRenderElement(render)) {
    const rp = (render.props ?? {}) as Record<string, unknown>;
    return React.cloneElement(render, {
      ...p,
      ...rp,
      className: [p.className, rp.className].filter(Boolean).join(' ') || undefined,
      style: { ...(p.style as React.CSSProperties | undefined), ...(rp.style as React.CSSProperties | undefined) },
      ref: composeRefs(getRef(render), p.ref as React.Ref<unknown> | undefined) ?? (getRef(render) as never),
    } as Record<string, unknown>);
  }

  const fallbackProps = (fallback.props ?? {}) as Record<string, unknown>;
  return React.cloneElement(fallback, {
    ...p,
    className: [fallbackProps.className, p.className].filter(Boolean).join(' ') || undefined,
    style: { ...(fallbackProps.style as React.CSSProperties | undefined), ...(p.style as React.CSSProperties | undefined) },
  } as Record<string, unknown>);
}
