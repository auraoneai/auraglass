/* Contract double for ScrollArea (S-30) on @base-ui/react. CONTRACT-owned; see §5.2. */
import * as React from 'react';
import { ScrollArea as Base } from '@base-ui/react';
import { withPart, kebab } from './_part';

export const ScrollArea = {
  Root: withPart(Base.Root as React.ComponentType<Record<string, unknown>>, 'root'),
  Viewport: withPart(Base.Viewport as React.ComponentType<Record<string, unknown>>, 'viewport'),
  Scrollbar: withPart(Base.Scrollbar as React.ComponentType<Record<string, unknown>>, 'scrollbar'),
  Thumb: withPart(Base.Thumb as React.ComponentType<Record<string, unknown>>, 'thumb'),
};
