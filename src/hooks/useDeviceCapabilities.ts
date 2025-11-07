import { useEffect, useState, useCallback } from 'react';
import { detectDevice, refreshDeviceDetection, DeviceInfo } from '../utils/deviceCapabilities';

/**
 * Hook for accessing device capabilities and information.
 *
 * This hook wraps the device detection utility and provides React state management
 * for device information. It's SSR-safe and provides a reload function for
 * refreshing device detection when needed.
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
 *       <button onClick={reload}>Refresh Detection</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDeviceCapabilities() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    // SSR-safe initialization with defaults
    if (typeof window === 'undefined') {
      return {
        type: 'unknown',
        os: 'unknown',
        browser: 'Unknown',
        capabilities: {
          touch: false,
          multiTouch: false,
          hover: false,
          pointer: false,
          gpu: false,
          webgl: false,
          webgl2: false,
          hardwareAcceleration: false,
          highDPI: false,
          vibration: false,
          geolocation: false,
          camera: false,
          microphone: false,
          speakers: false,
          bluetooth: false,
          usb: false,
        },
        performance: {
          memory: 4,
          cores: 4,
          clockSpeed: 2000,
          battery: false,
          network: 'unknown',
          storage: 'medium',
          tier: 'medium',
        },
        screen: {
          width: 1920,
          height: 1080,
          pixelRatio: 1,
          orientation: 'landscape',
          colorDepth: 24,
          refreshRate: 60,
          touchScreen: false,
          ppi: 96,
        },
        input: {
          keyboard: true,
          mouse: true,
          touch: false,
          stylus: false,
          gamepad: false,
          microphone: false,
          camera: false,
        },
      } as DeviceInfo;
    }

    return detectDevice();
  });

  // Detect device on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const info = detectDevice();
    setDeviceInfo(info);
  }, []);

  // Provide a reload function to refresh device detection
  const reload = useCallback(() => {
    if (typeof window === 'undefined') return;

    const info = refreshDeviceDetection();
    setDeviceInfo(info);
  }, []);

  return {
    deviceInfo,
    reload,
  };
}
