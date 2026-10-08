'use client';
import * as React from 'react';
import { AI_ICONS } from './index';
import type { AiIconName } from './index';

export interface AiIconProps extends React.SVGAttributes<SVGSVGElement> {
  name: AiIconName;
  size?: number;
}

export function AiIcon({ name, size = 16, ...rest }: AiIconProps) {
  return (
    <svg
      aria-hidden="true"
      data-ag-part="icon"
      data-ag-icon={name}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      focusable="false"
      {...rest}
    >
      <path d={AI_ICONS[name]} />
    </svg>
  );
}
