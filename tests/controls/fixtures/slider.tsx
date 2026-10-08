import * as React from 'react';
import { Slider } from '../../../src/components/slider';

export function SliderFixture(props: Record<string, unknown>) {
  return <Slider.Root aria-label="vol" defaultValue={30} {...props} />;
}
