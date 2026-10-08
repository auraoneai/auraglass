"use client";
import React, { useEffect } from "react";
import { setDeprecationMode } from "../utils/warnDeprecated";

export interface AuraGlassProviderProps {
  /** 'warn' (default) emits once-per-id deprecation warnings; 'silent' mutes them. */
  deprecations?: "warn" | "silent";
  children: React.ReactNode;
}

/** Canonical 4.x provider — accepts `deprecations` and hosts the wrapped
 *  legacy providers during the 4.2 bridge (DEP-P0050). */
export function AuraGlassProvider({
  deprecations = "warn",
  children,
}: AuraGlassProviderProps) {
  useEffect(() => {
    setDeprecationMode(deprecations);
    return () => setDeprecationMode("warn");
  }, [deprecations]);
  return <>{children}</>;
}
