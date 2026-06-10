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
        .catch(() => {
          // Keep the lightweight fallback when optional R3F loading fails.
        });
    }

    return () => {
      cancelled = true;
    };
  }, [Impl]);

  if (!Impl) {
    const { className, children, content, mode } = props as R3FProps & {
      className?: string;
      children?: React.ReactNode;
    };
    const values = content?.data?.length ? content.data : [0.8, 0.6, 0.9];

    return (
      <div
        className={cn(
          "ar-glass-effects glass-foundation-complete glass-relative glass-flex glass-min-h-[480px] glass-items-center glass-justify-center glass-overflow-hidden glass-rounded-2xl glass-border glass-border-white/20 glass-bg-slate-950 glass-p-6 glass-text-white",
          className
        )}
      >
        <div className="glass-absolute glass-inset-0 glass-bg-[radial-gradient(circle_at_25%_20%,rgba(56,189,248,0.35),transparent_34%),linear-gradient(135deg,rgba(30,41,59,0.95),rgba(14,116,144,0.72))]" />
        <section className="glass-relative glass-z-10 glass-w-full glass-max-w-3xl glass-rounded-2xl glass-border glass-border-white/25 glass-bg-white/12 glass-p-6 glass-shadow-2xl glass-backdrop-blur-xl">
          <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-cyan-100">
            AR preview fallback
          </p>
          <h2 className="glass-mt-2 glass-text-3xl glass-font-semibold glass-text-white">
            {content?.title || "AR Glass Experience"}
          </h2>
          <p className="glass-mt-3 glass-max-w-2xl glass-text-sm glass-leading-6 glass-text-cyan-50/85">
            {content?.text ||
              "Preview mode is showing a non-3D fallback while optional React Three Fiber support is unavailable."}
          </p>
          <div className="glass-mt-6 glass-grid glass-gap-3 sm:glass-grid-cols-3">
            {values.slice(0, 3).map((value, index) => (
              <div
                key={index}
                className="glass-rounded-xl glass-border glass-border-white/20 glass-bg-white/8 glass-p-4"
              >
                <span className="glass-text-xs glass-text-cyan-100/75">
                  Signal {index + 1}
                </span>
                <div className="glass-mt-3 glass-h-2 glass-rounded-full glass-bg-white/15">
                  <span
                    className="glass-block glass-h-full glass-rounded-full glass-bg-cyan-300"
                    style={{
                      width: `${Math.max(12, Math.round(value * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="glass-mt-5 glass-inline-flex glass-rounded-full glass-border glass-border-white/20 glass-bg-white/8 glass-px-3 glass-py-1 glass-text-xs glass-text-cyan-50">
            Mode: {mode || "preview"}
          </div>
        </section>
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
