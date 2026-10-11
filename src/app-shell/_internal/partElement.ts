/* Shared render-prop application (S-32 RenderElement contract): `render` may
   be an element (merged via foundation renderElement) or a function receiving
   (props, state). Internal to app-shell parts. */

import * as React from 'react';
import { renderElement } from '../../foundation';

type AnyTag = keyof React.JSX.IntrinsicElements;

export function partElement(
  fallbackTag: AnyTag,
  props: Record<string, unknown> & {
    render?:
      | React.ReactElement
      | ((p: Record<string, unknown>, s: Record<string, unknown>) => React.ReactElement)
      | undefined;
    children?: React.ReactNode | undefined;
  },
  state?: Record<string, unknown> | undefined,
): React.ReactElement {
  const { render, ...rest } = props;
  if (typeof render === 'function') {
    return render(rest, state ?? {});
  }
  return renderElement(render, React.createElement(fallbackTag), rest, state);
}
