/* Contract double for Dialog (S-30) on @base-ui/react. CONTRACT-owned; see §5.2. */
import * as React from 'react';
import { Dialog as Base } from '@base-ui/react';
import { withPart, kebab } from './_part';

export const Dialog = {
  Root: withPart(Base.Root as React.ComponentType<Record<string, unknown>>, 'root'),
  Trigger: withPart(Base.Trigger as React.ComponentType<Record<string, unknown>>, 'trigger'),
  Content: withPart(Base.Popup as React.ComponentType<Record<string, unknown>>, 'content'),
  Title: withPart(Base.Title as React.ComponentType<Record<string, unknown>>, 'title'),
  Description: withPart(Base.Description as React.ComponentType<Record<string, unknown>>, 'description'),
  Close: withPart(Base.Close as React.ComponentType<Record<string, unknown>>, 'close'),
};
