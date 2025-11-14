"use client";

import React, { useEffect, useState } from "react";
import type { ARGlassEffectsProps as R3FProps } from "./ARGlassEffects.r3f";
import { cn } from "../../lib/utilsComprehensive";
import { assertReact19ForThree } from "../../utils/reactVersion";

export type ARGlassEffectsProps = R3FProps;

let LoadedImpl: React.ComponentType<R3FProps> | null = null;

export function ARGlassEffects(props: ARGlassEffectsProps) {
  const [Impl, setImpl] = useState<React.ComponentType<R3FProps> | null>(
    LoadedImpl
  );

  useEffect(() => {
    let cancelled = false;

    if (!assertReact19ForThree()) {
      return;
    }

    if (!Impl) {
      import("./ARGlassEffects.r3f")
        .then((mod) => {
          if (cancelled) return;
          const Component = (mod.ARGlassEffects ||
            mod.default) as React.ComponentType<R3FProps>;
          LoadedImpl = Component;
          setImpl(() => Component);
        })
        .catch((error) => {
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.error(
              "[AuraGlass] Failed to load ARGlassEffects R3F module",
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
    const { className, children } = props as R3FProps & {
      className?: string;
      children?: React.ReactNode;
    };

    return (
      <div
        className={cn(
          "ar-glass-effects glass-foundation-complete relative",
          className
        )}
      >
        {children}
      </div>
    );
  }

  return <Impl {...props} />;
}

export {
  ARGlassAnimations,
  ARGlassGeometryFactory,
  ARGlassInteractions,
  ARGlassMaterialFactory,
  ARGlassUtils,
} from "./ARGlassEffects.helpers";

export default ARGlassEffects;
