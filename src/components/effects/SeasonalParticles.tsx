"use client";

import React, { useEffect, useState } from "react";
import type { SeasonalParticlesProps as R3FProps } from "./SeasonalParticles.r3f";
import { cn } from "../../lib/utilsComprehensive";
import { assertReact19ForThree } from "../../utils/reactVersion";

export type SeasonalParticlesProps = R3FProps;

let LoadedImpl: React.ComponentType<R3FProps> | null = null;

export function SeasonalParticles(props: SeasonalParticlesProps) {
  const [Impl, setImpl] = useState<React.ComponentType<R3FProps> | null>(
    LoadedImpl
  );

  useEffect(() => {
    let cancelled = false;

    if (!assertReact19ForThree()) {
      return;
    }

    if (!Impl) {
      import("./SeasonalParticles.r3f")
        .then((mod) => {
          if (cancelled) return;
          const Component = (mod.SeasonalParticlesR3F ||
            mod.default) as React.ComponentType<R3FProps>;
          LoadedImpl = Component;
          setImpl(() => Component);
        })
        .catch((error) => {
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.error(
              "[AuraGlass] Failed to load SeasonalParticles R3F module",
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
    const { className, children, ...rest } = props as R3FProps & {
      className?: string;
      children?: React.ReactNode;
    };

    return (
      <div
        className={cn(
          "seasonal-particles glass-relative glass-overflow-hidden",
          className
        )}
        {...rest}
      >
        <div className={cn("glass-relative glass-z-10")}>{children}</div>
      </div>
    );
  }

  return <Impl {...props} />;
}

export { seasonalPresets, seasonalThemes } from "./SeasonalParticles.presets";

export default SeasonalParticles;
