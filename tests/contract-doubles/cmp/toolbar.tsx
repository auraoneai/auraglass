/* Contract double for Toolbar (S-30) on @base-ui/react. CONTRACT-owned; see §5.2. */
import * as React from 'react';
import { Toolbar as Base } from '@base-ui/react';
import { withPart, kebab } from './_part';

export const Toolbar = {
  Root: withPart(Base.Root as React.ComponentType<Record<string, unknown>>, 'root'),
  Button: withPart(Base.Button as React.ComponentType<Record<string, unknown>>, 'button'),
  Group: withPart(Base.Group as React.ComponentType<Record<string, unknown>>, 'group'),
  Separator: withPart(Base.Separator as React.ComponentType<Record<string, unknown>>, 'separator'),
  Link: withPart(Base.Link as React.ComponentType<Record<string, unknown>>, 'link'),
};
