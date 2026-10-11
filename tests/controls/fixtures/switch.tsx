import * as React from 'react';
import { Switch } from '../../../src/components/switch';

export function SwitchFixture(props: Record<string, unknown>) {
  return <Switch aria-label="Enabled" {...props} />;
}
