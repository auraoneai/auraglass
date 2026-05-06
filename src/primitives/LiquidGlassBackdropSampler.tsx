"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {
  useLiquidGlassBackdrop,
  type LiquidGlassBackdropOptions,
  type LiquidGlassBackdropSample,
} from "../hooks/useLiquidGlassBackdrop";

export interface LiquidGlassBackdropSamplerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    LiquidGlassBackdropOptions {
  children?:
    | React.ReactNode
    | ((sample: LiquidGlassBackdropSample) => React.ReactNode);
  onSample?: (sample: LiquidGlassBackdropSample) => void;
}

export const LiquidGlassBackdropSampler = forwardRef<HTMLDivElement, LiquidGlassBackdropSamplerProps>(
  ({ children, onSample, ...options }, ref) => {
    const localRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => localRef.current as HTMLDivElement);
    const sample = useLiquidGlassBackdrop(localRef, options);

    React.useEffect(() => {
      onSample?.(sample);
    }, [onSample, sample]);

    const renderedChildren = typeof children === "function" ? children(sample) : children;

    return (
      <div
        ref={localRef}
        data-liquid-glass-backdrop-sampler="true"
        data-contrast-hint={sample.contrastHint}
        data-requires-dimming={sample.requiresDimming ? "true" : "false"}
      >
        {renderedChildren}
      </div>
    );
  }
);

LiquidGlassBackdropSampler.displayName = "LiquidGlassBackdropSampler";
