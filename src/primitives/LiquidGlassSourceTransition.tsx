"use client";

import React, { createContext, forwardRef, useCallback, useContext, useMemo, useRef, useState } from "react";
import { cn } from "../lib/utilsComprehensive";
import { useReducedMotion } from "../hooks/useReducedMotion";

export interface LiquidGlassTransitionRegistration {
  id: string;
  rect: DOMRect | null;
}

export interface LiquidGlassTransitionContextValue {
  activeId: string | null;
  registerSource: (id: string, element: HTMLElement | null) => void;
  registerDestination: (id: string, element: HTMLElement | null) => void;
  start: (id: string) => void;
  end: () => void;
  getSource: (id: string) => DOMRect | null;
  getDestination: (id: string) => DOMRect | null;
  reducedMotion: boolean;
}

const LiquidGlassTransitionContext = createContext<LiquidGlassTransitionContextValue | null>(null);

export interface LiquidGlassTransitionProviderProps {
  children: React.ReactNode;
  namespace?: string;
  disabled?: boolean;
  duration?: number;
}

export function LiquidGlassTransitionProvider({
  children,
  disabled = false,
}: LiquidGlassTransitionProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sources = useRef(new Map<string, HTMLElement>());
  const destinations = useRef(new Map<string, HTMLElement>());
  const reducedMotion = useReducedMotion();

  const registerSource = useCallback((id: string, element: HTMLElement | null) => {
    if (element) sources.current.set(id, element);
    else sources.current.delete(id);
  }, []);

  const registerDestination = useCallback((id: string, element: HTMLElement | null) => {
    if (element) destinations.current.set(id, element);
    else destinations.current.delete(id);
  }, []);

  const value = useMemo<LiquidGlassTransitionContextValue>(
    () => ({
      activeId,
      registerSource,
      registerDestination,
      start: (id) => !disabled && setActiveId(id),
      end: () => setActiveId(null),
      getSource: (id) => sources.current.get(id)?.getBoundingClientRect() ?? null,
      getDestination: (id) => destinations.current.get(id)?.getBoundingClientRect() ?? null,
      reducedMotion: reducedMotion || disabled,
    }),
    [activeId, disabled, reducedMotion, registerDestination, registerSource]
  );

  return (
    <LiquidGlassTransitionContext.Provider value={value}>
      {children}
    </LiquidGlassTransitionContext.Provider>
  );
}

export interface LiquidGlassSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  asChild?: boolean;
  children?: React.ReactNode;
}

export const LiquidGlassSource = forwardRef<HTMLDivElement, LiquidGlassSourceProps>(
  ({ id, asChild = false, children, className, onClick, ...props }, ref) => {
    const context = useLiquidGlassTransition();
    const localRef = useRef<HTMLElement | null>(null);
    const setRef = useCallback(
      (node: HTMLElement | null) => {
        localRef.current = node;
        context?.registerSource(id, node);
        if (typeof ref === "function") ref(node as HTMLDivElement | null);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node as HTMLDivElement | null;
      },
      [context, id, ref]
    );

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      context?.start(id);
      onClick?.(event);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ref: setRef,
        onClick: handleClick,
        "data-liquid-glass-transition-source": id,
      });
    }

    return (
      <div
        ref={setRef}
        className={cn("liquid-glass-transition-source", className)}
        onClick={handleClick}
        data-liquid-glass-transition-source={id}
        {...props}
      >
        {children}
      </div>
    );
  }
);

LiquidGlassSource.displayName = "LiquidGlassSource";

export interface LiquidGlassDestinationProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  open?: boolean;
  children?: React.ReactNode;
}

export const LiquidGlassDestination = forwardRef<HTMLDivElement, LiquidGlassDestinationProps>(
  ({ id, open = true, children, className, style, ...props }, ref) => {
    const context = useLiquidGlassTransition();
    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        context?.registerDestination(id, node);
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [context, id, ref]
    );

    const isActive = context?.activeId === id;
    const sourceRect = context?.getSource(id);
    const transformOrigin = sourceRect ? `${sourceRect.left + sourceRect.width / 2}px ${sourceRect.top + sourceRect.height / 2}px` : undefined;

    if (!open) return null;

    return (
      <div
        ref={setRef}
        className={cn(
          "liquid-glass-transition-destination",
          isActive && "liquid-glass-transition-active",
          context?.reducedMotion && "liquid-glass-transition-reduced-motion",
          className
        )}
        style={{
          transformOrigin,
          transition: context?.reducedMotion
            ? "opacity 1ms linear"
            : "transform var(--liquid-glass-source-transition-duration, 220ms) var(--liquid-glass-source-transition-easing, cubic-bezier(.2,.8,.2,1)), opacity 160ms ease",
          ...style,
        }}
        data-liquid-glass-transition-destination={id}
        data-liquid-glass-transition-active={isActive ? "true" : "false"}
        {...props}
      >
        {children}
      </div>
    );
  }
);

LiquidGlassDestination.displayName = "LiquidGlassDestination";

export function useLiquidGlassTransition() {
  return useContext(LiquidGlassTransitionContext);
}
