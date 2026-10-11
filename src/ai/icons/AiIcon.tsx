/* REQ-CMP-30: AiIcon is a thin dispatcher over createIcon glyphs — server-safe
   (no 'use client'), decorative aria-hidden by default, role='img' when
   aria-label/title is passed (handled by createIcon). */
import * as React from 'react';
import { AI_ICONS } from './index';
import type { AiIconName } from './index';
import type { IconProps } from '../../icons/types';

export interface AiIconProps extends IconProps {
  name: AiIconName;
}

export function AiIcon({ name, ...rest }: AiIconProps) {
  const Glyph = AI_ICONS[name];
  return <Glyph data-ag-part="icon" data-icon={name} {...rest} />;
}
