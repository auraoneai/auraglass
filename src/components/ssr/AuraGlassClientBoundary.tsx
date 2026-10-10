"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { isBrowser } from "../../utils/env";

export interface AuraGlassClientBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AuraGlassClientBoundary: React.FC<
  AuraGlassClientBoundaryProps
> = ({ children, fallback = null }) => {
  // Always start false: the server render and the first client render must
  // agree for hydration, and the real client value is applied in the effect.
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (!isBrowser()) return;
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AuraGlassClientBoundary;
