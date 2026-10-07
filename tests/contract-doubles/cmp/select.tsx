/* Contract double for Select (S-30) on @base-ui/react. CONTRACT-owned; see §5.2. */
import * as React from 'react';
import { Select as Base } from '@base-ui/react';
import { withPart, kebab } from './_part';

export const Select = {
  Root: withPart(Base.Root as React.ComponentType<Record<string, unknown>>, 'root'),
  Trigger: withPart(Base.Trigger as React.ComponentType<Record<string, unknown>>, 'trigger'),
  Value: withPart(Base.Value as React.ComponentType<Record<string, unknown>>, 'value'),
  Content: withPart(Base.Popup as React.ComponentType<Record<string, unknown>>, 'content'),
  Item: withPart(Base.Item as React.ComponentType<Record<string, unknown>>, 'item'),
  ItemIndicator: withPart(Base.ItemIndicator as React.ComponentType<Record<string, unknown>>, 'item-indicator'),
  Group: withPart(Base.Group as React.ComponentType<Record<string, unknown>>, 'group'),
  GroupLabel: withPart(Base.GroupLabel as React.ComponentType<Record<string, unknown>>, 'group-label'),
  Separator: function DoubleSeparator(props: React.ComponentProps<'div'>) {
    return <div data-ag-part="separator" data-ag-double="" {...props} />;
  },
};
