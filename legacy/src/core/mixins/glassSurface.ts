import React from 'react';
import { createGlassStyle, GlassOptions } from './glassMixins';
/**
 * @deprecated Use createGlassStyle() instead
 * This file contains hardcoded glass values that bypass our token system.
 */





/**

 * @example createGlassStyle({ intent: 'neutral', elevation: 'level2' })
 */
export const glassSurface = (() => {

  return createGlassStyle;
})();

/**


 */
export const glassSurfaceHover = (() => {
  return (options: GlassOptions = {}) => createGlassStyle({ ...options, hoverLift: true });
})();

/**


 */
export const glassSurfaceActive = (() => {
  return (options: GlassOptions = {}) => createGlassStyle({ ...options, press: true } as GlassOptions);
})();

/**


 */
export const glassSurfaceFn = (options: {
  elevation?: string | number;
  backgroundOpacity?: number;
  blurStrength?: string;
  borderOpacity?: number;
  themeContext?: any;
} = {}) => {

  
  // Map old options to new GlassOptions
  const glassOptions: GlassOptions = {
    intent: 'neutral',
    elevation: 'level2',
    tier: 'high',
  };
  
  // Basic elevation mapping
  if (typeof options.elevation === 'number') {
    if (options.elevation <= 1) glassOptions.elevation = 'level1';
    else if (options.elevation <= 2) glassOptions.elevation = 'level2';
    else if (options.elevation <= 3) glassOptions.elevation = 'level3';
    else glassOptions.elevation = 'level4';
  }

  return createGlassStyle(glassOptions);
};

/**


 */
export const glassSurfaceFunction = glassSurfaceFn;
