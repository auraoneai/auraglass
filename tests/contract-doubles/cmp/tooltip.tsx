/* Contract double for Tooltip (S-30) on @base-ui/react. CONTRACT-owned; see §5.2. */
import * as React from 'react';
import { Tooltip as Base } from '@base-ui/react';
import { withPart, kebab } from './_part';

export const Tooltip = {
  Root: withPart(Base.Root as React.ComponentType<Record<string, unknown>>, 'root'),
  Trigger: withPart(Base.Trigger as React.ComponentType<Record<string, unknown>>, 'trigger'),
  Content: withPart(Base.Popup as React.ComponentType<Record<string, unknown>>, 'content'),
  Arrow: withPart(Base.Arrow as React.ComponentType<Record<string, unknown>>, 'arrow'),
};
