"use client";

import React from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  children?: React.ReactNode;
  container?: HTMLElement | null;
  forceMount?: boolean;
}

export function Portal({
  children,
  container,
  forceMount = false,
}: PortalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted && !forceMount) {
    return null;
  }

  const target =
    container ?? (typeof document !== "undefined" ? document.body : null);

  if (!target) {
    return null;
  }

  return createPortal(children, target);
}

Portal.displayName = "Portal";

export const GlassPortal = Portal;

export default Portal;
