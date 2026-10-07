'use client';
import React, { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { Motion } from "../../primitives";

interface GlassCardLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: React.ReactNode;
}

export const GlassCardLink: React.FC<GlassCardLinkProps> = ({
  href,
  children,
  className,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <Motion data-glass-component className='glass-inline-glass-block'>
      <a
        href={href}
        className={cn(
          "relative inline-block overflow-hidden glass-radius-xl",
          "transition-all duration-300 ease-in-out",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          "glass-focus glass-touch-target glass-contrast-guard",
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