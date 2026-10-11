/* Contract double for Slider (S-30) on @base-ui/react. CONTRACT-owned; see §5.2. */
import * as React from 'react';
import { Slider as Base } from '@base-ui/react';
import { withPart, kebab } from './_part';

export const Slider = {
  Root: withPart(Base.Root as React.ComponentType<Record<string, unknown>>, 'root'),
  Track: withPart(Base.Track as React.ComponentType<Record<string, unknown>>, 'track'),
  Range: withPart(Base.Indicator as React.ComponentType<Record<string, unknown>>, 'range'),
  Thumb: withPart(Base.Thumb as React.ComponentType<Record<string, unknown>>, 'thumb'),
  Value: withPart(Base.Value as React.ComponentType<Record<string, unknown>>, 'value'),
};
