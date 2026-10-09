/* CMP-327 compat: GlassSlider (4.x) -> Slider (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Slider } from '../../../components/slider';
import type { ChangeDetails } from '../../../contracts/components';

const DEP = 'DEP-C0022';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassSliderProps {
  value?: number | number[];
  defaultValue?: number | number[];
  onChange?: (value: number | number[]) => void;
  onAfterChange?: (value: number | number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  range?: boolean;
  animation?: string;
  glassVariant?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

/** @deprecated GlassSlider DEP-C0022 since 4.3.0, removed in 5.0.0. {@link Slider} */
export function GlassSlider({ onChange, onAfterChange, animation, glassVariant, range, value, defaultValue, ...rest }: GlassSliderProps) {
  warnDeprecated(DEP);
  if (animation !== undefined) drop('animation');
  if (glassVariant !== undefined) drop('glassVariant');
  const v = range && typeof value === 'number' ? [value, value] : value;
  const dv = range && typeof defaultValue === 'number' ? [defaultValue, defaultValue] : defaultValue;
  return (
    <Slider.Root
      {...rest}
      {...(v !== undefined ? { value: v } : {})}
      {...(dv !== undefined ? { defaultValue: dv } : {})}
      {...(onChange !== undefined ? { onValueChange: (val: number | number[], _d: ChangeDetails) => onChange(val) } : {})}
      {...(onAfterChange !== undefined ? { onValueCommitted: (val: number | number[], _d: ChangeDetails) => onAfterChange(val) } : {})}
    />
  );
}
