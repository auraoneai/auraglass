/* Dialog double (W4 local): the contract double's Content is the bare Popup
   which requires <Dialog.Portal>; the real CMP Dialog.Content composes the
   portal itself, so this lane double matches the public part contract —
   same shape as tests/app-shell/doubles/dialog.tsx (W1). */
import * as React from 'react';
import { Dialog as Base } from '@base-ui/react';
import { withPart } from '../../contract-doubles/cmp/_part';

const Content = (props: Record<string, unknown>) => (
  <Base.Portal>
    <Base.Popup {...props} />
  </Base.Portal>
);

export const Dialog = {
  Root: withPart(Base.Root as React.ComponentType<Record<string, unknown>>, 'root'),
  Trigger: withPart(Base.Trigger as React.ComponentType<Record<string, unknown>>, 'trigger'),
  Content: withPart(Content as React.ComponentType<Record<string, unknown>>, 'content'),
  Title: withPart(Base.Title as React.ComponentType<Record<string, unknown>>, 'title'),
  Description: withPart(Base.Description as React.ComponentType<Record<string, unknown>>, 'description'),
  Close: withPart(Base.Close as React.ComponentType<Record<string, unknown>>, 'close'),
};
