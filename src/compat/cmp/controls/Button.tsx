/* CMP-323 compat: Button (4.x alias) (4.x) -> Button via GlassButton (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
export { GlassButton as Button } from './GlassButton';
export type { GlassButtonProps as ButtonProps } from './GlassButton';
