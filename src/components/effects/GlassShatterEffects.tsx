"use client";

import React, { useEffect, useState } from "react";
import type { GlassShatterEffectsProps as R3FProps } from "./GlassShatterEffects.r3f";
import { cn } from "../../lib/utilsComprehensive";
import { assertReact19ForThree } from "../../utils/reactVersion";

export type GlassShatterEffectsProps = R3FProps;

let LoadedImpl: React.ComponentType<R3FProps> | null = null;

export function GlassShatterEffects(props: GlassShatterEffectsProps) {
  const [Impl, setImpl] = useState<React.ComponentType<R3FProps> | null>(
    LoadedImpl
  );

  useEffect(() => {
    let cancelled = false;

    if (!assertReact19ForThree()) {
      return;
    }

    if (!Impl) {
      import("./GlassShatterEffects.r3f")
        .then((mod) => {
          if (cancelled) return;
          const Component = (mod.GlassShatterEffectsR3F ||
            mod.default) as React.ComponentType<R3FProps>;
          LoadedImpl = Component;
          setImpl(() => Component);
        })
        .catch((error) => {
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.error(
              "[AuraGlass] Failed to load GlassShatterEffects R3F module",
              error
            );
          }
        });
    }

    return () => {
      cancelled = true;
    };
  }, [Impl]);

  if (!Impl) {
    const {
      className,
      children,
      trigger = "click",
      ...rest
    } = props as R3FProps & {
      className?: string;
      children?: React.ReactNode;
      trigger?: string;
    };

    return (
      <div
        className={cn(
          "glass-shatter-effects glass-relative glass-overflow-hidden",
          className
        )}
        style={{
          position: "relative",
          cursor: trigger === "click" ? "pointer" : "default",
        }}
        {...rest}
      >
        <div
          className={cn(
            "content glass-transition-opacity glass-duration-300",
            "glass-opacity-100"
          )}
        >
          {children}
        </div>
      </div>
    );
  }

  return <Impl {...props} />;
}

export { shatterPresets } from "./GlassShatterEffects.presets";

export default GlassShatterEffects;
