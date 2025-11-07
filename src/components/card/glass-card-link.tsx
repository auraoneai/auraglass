'use client';

import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Motion } from '../../primitives';

interface GlassCardLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children: React.ReactNode;
}

export const GlassCardLink: React.FC<GlassCardLinkProps> = ({
  href,
  children,
  className,
  ...props
}) => {
  return (
    <Motion
      className="inline-block"
    >
      <a
        href={href}
        className={cn(
          'relative inline-block overflow-hidden glass-radius-xl',
          'transition-all duration-300 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          className
        )}
        {...props}
      >
        {children}
      </a>
    </Motion>
  );
};

export default GlassCardLink;