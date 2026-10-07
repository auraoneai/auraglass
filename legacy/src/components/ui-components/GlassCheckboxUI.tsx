'use client';
import React from 'react';
import {
  GlassCheckbox as BaseGlassCheckbox,
  type GlassCheckboxProps,
} from '../input/GlassCheckbox';

export type { GlassCheckboxProps as CheckboxProps };
export { BaseGlassCheckbox as GlassCheckbox, BaseGlassCheckbox as Checkbox };

export const GlassCheckboxUI: React.FC<GlassCheckboxProps> = (props) => (
  <BaseGlassCheckbox {...props} />
);

export default GlassCheckboxUI;
