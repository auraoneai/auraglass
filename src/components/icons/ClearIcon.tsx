'use client';
import React from 'react';
import { cn } from '@/lib/utils';

export interface ClearIconProps {
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export const ClearIcon: React.FC<ClearIconProps> = ({
  size = 16,
  color = 'currentColor',
  className,
  onClick
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default ClearIcon;
