/* Contract double for Combobox (S-30) on @base-ui/react. CONTRACT-owned; see §5.2. */
import * as React from 'react';
import { Combobox as Base } from '@base-ui/react';
import { withPart, kebab } from './_part';

export const Combobox = {
  Root: withPart(Base.Root as React.ComponentType<Record<string, unknown>>, 'root'),
  Input: withPart(Base.Input as React.ComponentType<Record<string, unknown>>, 'input'),
  Trigger: withPart(Base.Trigger as React.ComponentType<Record<string, unknown>>, 'trigger'),
  Content: withPart(Base.Popup as React.ComponentType<Record<string, unknown>>, 'content'),
  Item: withPart(Base.Item as React.ComponentType<Record<string, unknown>>, 'item'),
  Empty: withPart(Base.Empty as React.ComponentType<Record<string, unknown>>, 'empty'),
  Chips: withPart(Base.Chips as React.ComponentType<Record<string, unknown>>, 'chips'),
  Chip: withPart(Base.Chip as React.ComponentType<Record<string, unknown>>, 'chip'),
  ChipRemove: withPart(Base.ChipRemove as React.ComponentType<Record<string, unknown>>, 'chip-remove'),
  Clear: withPart(Base.Clear as React.ComponentType<Record<string, unknown>>, 'clear'),
};
