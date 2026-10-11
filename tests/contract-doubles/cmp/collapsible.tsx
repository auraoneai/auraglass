/* Contract double for Collapsible (S-30) on @base-ui/react. CONTRACT-owned; see §5.2. */
import * as React from 'react';
import { Collapsible as Base } from '@base-ui/react';
import { withPart, kebab } from './_part';

export const Collapsible = {
  Root: withPart(Base.Root as React.ComponentType<Record<string, unknown>>, 'root'),
  Trigger: withPart(Base.Trigger as React.ComponentType<Record<string, unknown>>, 'trigger'),
  Content: withPart(Base.Panel as React.ComponentType<Record<string, unknown>>, 'content'),
};
