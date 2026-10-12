"use client";
import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_DEVICE_INFO,
  DeviceInfo,
  detectDevice,
  refreshDeviceDetection,
} from "../utils/deviceCapabilities";
import { isBrowser, runClientEffect } from "../utils/env";

/**
 * Hook for accessing device capabilities and information.
 *
 * This hook wraps the device detection utility and provides React state management
 * for device information. The server render and the first client render both
 * return `DEFAULT_DEVICE_INFO`, so hydration matches; detection runs after
 * mount. A reload function refreshes detection when needed.
 *
 * @returns Object containing device information and reload function
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const { deviceInfo, reload } = useDeviceCapabilities();
 *
 *   return (
 *     <div>
 *       <p>Device Type: {deviceInfo.type}</p>
 *       <p>Performance Tier: {deviceInfo.performance.tier}</p>
 *       <button onClick={reload} className="glass-focus glass-touch-target glass-contrast-guard">Refresh Detection</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDeviceCapabilities() {
  // Constant initial value: the server and the first client render must
  // agree for hydration; real detection runs in the mount effect below.
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    ...DEFAULT_DEVICE_INFO,
  });

  // Detect device on mount (client-side only)
  useEffect(() => {
    return runClientEffect(() => {
      const info = detectDevice();
      setDeviceInfo(info);
    });
  }, []);

  // Provide a reload function to refresh device detection
  const reload = useCallback(() => {
    if (!isBrowser()) return;
    const info = refreshDeviceDetection();
    setDeviceInfo(info);
  }, []);

  return {
    deviceInfo,
    reload,
  };
}
