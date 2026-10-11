/* Contract double for Menu (S-30) on @base-ui/react. CONTRACT-owned; see §5.2. */
import * as React from 'react';
import { Menu as Base } from '@base-ui/react';
import { withPart, kebab } from './_part';

export const Menu = {
  Root: withPart(Base.Root as React.ComponentType<Record<string, unknown>>, 'root'),
  Trigger: withPart(Base.Trigger as React.ComponentType<Record<string, unknown>>, 'trigger'),
  Content: withPart(Base.Popup as React.ComponentType<Record<string, unknown>>, 'content'),
  Item: withPart(Base.Item as React.ComponentType<Record<string, unknown>>, 'item'),
  CheckboxItem: withPart(Base.CheckboxItem as React.ComponentType<Record<string, unknown>>, 'checkbox-item'),
  RadioGroup: withPart(Base.RadioGroup as React.ComponentType<Record<string, unknown>>, 'radio-group'),
  RadioItem: withPart(Base.RadioItem as unknown as React.ComponentType<Record<string, unknown>>, 'radio-item'),
  Group: withPart(Base.Group as React.ComponentType<Record<string, unknown>>, 'group'),
  GroupLabel: withPart(Base.GroupLabel as React.ComponentType<Record<string, unknown>>, 'group-label'),
  Separator: withPart(Base.Separator as React.ComponentType<Record<string, unknown>>, 'separator'),
  Submenu: withPart(Base.SubmenuRoot as React.ComponentType<Record<string, unknown>>, 'submenu'),
  SubmenuTrigger: withPart(Base.SubmenuTrigger as React.ComponentType<Record<string, unknown>>, 'submenu-trigger'),
};
