'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { isBrowser } from '../../utils/env';

export interface AuraGlassClientBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AuraGlassClientBoundary: React.FC<AuraGlassClientBoundaryProps> = ({
  children,
  fallback = null,
}) => {
  const [isClient, setIsClient] = useState(() => isBrowser());

  useEffect(() => {
    if (isClient) return;
    setIsClient(true);
  }, [isClient]);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AuraGlassClientBoundary;