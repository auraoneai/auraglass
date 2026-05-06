"use client";

import React, { useEffect, useState } from "react";
import type { AuroraProProps as R3FProps } from "./AuroraPro.r3f";
import { cn } from "../../lib/utilsComprehensive";
import { assertReact19ForThree } from "../../utils/reactVersion";

export type AuroraProProps = R3FProps;

let LoadedImpl: React.ComponentType<R3FProps> | null = null;

export function AuroraPro(props: AuroraProProps) {
  const [Impl, setImpl] = useState<React.ComponentType<R3FProps> | null>(
    LoadedImpl
  );

  useEffect(() => {
    let cancelled = false;

    if (!assertReact19ForThree()) {
      return;
    }

    if (!Impl) {
      import("./AuroraPro.r3f")
        .then((mod) => {
          if (cancelled) return;
          const Component = (mod.AuroraPro ||
            mod.default) as React.ComponentType<R3FProps>;
          LoadedImpl = Component;
          setImpl(() => Component);
        })
        .catch(() => {
          // Keep the lightweight fallback when optional R3F loading fails.
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
          "aurora-pro glass-relative glass-overflow-hidden",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }

  return <Impl {...props} />;
}

export { auroraPresets, auroraThemes } from "./AuroraPro.presets";

export default AuroraPro;
