import React from 'react';
import { createGlassStyle } from '../core/mixins/glassMixins';
// Browser compatibility detection and fallbacks

export interface BrowserInfo {
  name: string;
  version: number;
  engine: 'webkit' | 'blink' | 'gecko' | 'edge' | 'unknown';
  mobile: boolean;
  touch: boolean;
  supports: BrowserCapabilities;
}

export interface BrowserCapabilities {
  backdropFilter: boolean;
  cssGrid: boolean;
  flexbox: boolean;
  cssVariables: boolean;
  es6: boolean;
  webgl: boolean;
  webgl2: boolean;
  webAnimations: boolean;
  intersectionObserver: boolean;
  resizeObserver: boolean;
  mutationObserver: boolean;
  requestIdleCallback: boolean;
  webWorkers: boolean;
  serviceWorkers: boolean;
  indexedDB: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  webRTC: boolean;
  webAudio: boolean;
  canvas: boolean;
  svg: boolean;
  video: boolean;
  audio: boolean;
}

// Browser detection
let __cachedBrowserInfo: BrowserInfo | null = null;
let __cachedBrowserCapabilities: BrowserCapabilities | null = null;
let __lastBrowserDetectTs = 0;
const BROWSER_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const probeGL = (): { webgl: boolean; webgl2: boolean } => {
  if (typeof document === 'undefined') return { webgl: false, webgl2: false };
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const attrs: WebGLContextAttributes & { powerPreference?: any } = {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    desynchronized: true as any,
    failIfMajorPerformanceCaveat: true,
    powerPreference: 'low-power',
  };
  let gl: WebGLRenderingContext | null = null;
  let gl2: WebGL2RenderingContext | null = null;
  try { gl2 = canvas.getContext('webgl2', attrs) as WebGL2RenderingContext | null; } catch { gl2 = null; }
  if (!gl2) {
    try {
      gl = (canvas.getContext('webgl', attrs) as WebGLRenderingContext | null) ||
           (canvas.getContext('experimental-webgl', attrs) as WebGLRenderingContext | null) || null;
    } catch { gl = null; }
  }
  const webgl2 = !!gl2;
  const webgl = webgl2 || !!gl;
  try {
    const ctx: any = gl2 || gl;
    const lose = ctx && typeof ctx.getExtension === 'function' && ctx.getExtension('WEBGL_lose_context');
    if (lose && typeof lose.loseContext === 'function') lose.loseContext();
  } catch {}
  try { canvas.width = canvas.height = 0; canvas.remove(); } catch {}
  return { webgl, webgl2 };
};

export const detectBrowser = (): BrowserInfo => {
  const now = Date.now();
  if (__cachedBrowserInfo && now - __lastBrowserDetectTs < BROWSER_CACHE_TTL_MS) {
    return __cachedBrowserInfo;
  }
  const ua = navigator.userAgent;
  const platform = navigator.platform;

  let name = 'unknown';
  let version = 0;
  let engine: BrowserInfo['engine'] = 'unknown';

  // Detect browser name and version
  if (ua.includes('Chrome') && !ua.includes('Edg/')) {
    name = 'Chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    version = match ? parseInt(match[1]) : 0;
    engine = 'blink';
  } else if (ua.includes('Firefox')) {
    name = 'Firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    version = match ? parseInt(match[1]) : 0;
    engine = 'gecko';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    name = 'Safari';
    const match = ua.match(/Version\/(\d+)/);
    version = match ? parseInt(match[1]) : 0;
    engine = 'webkit';
  } else if (ua.includes('Edg/')) {
    name = 'Edge';
    const match = ua.match(/Edg\/(\d+)/);
    version = match ? parseInt(match[1]) : 0;
    engine = 'blink';
  } else if (ua.includes('MSIE') || ua.includes('Trident')) {
    name = 'Internet Explorer';
    const match = ua.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
    version = match ? parseInt(match[1]) : 0;
    engine = 'edge';
  }

  // Detect mobile
  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  // Detect touch capability
  const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Detect capabilities
  const supports = detectCapabilities();

  const info: BrowserInfo = {
    name,
    version,
    engine,
    mobile,
    touch,
    supports,
  };
  __cachedBrowserInfo = info;
  __lastBrowserDetectTs = now;
  return info;
};

// Capability detection
export const detectCapabilities = (): BrowserCapabilities => {
  const now = Date.now();
  if (__cachedBrowserCapabilities && now - __lastBrowserDetectTs < BROWSER_CACHE_TTL_MS) {
    return __cachedBrowserCapabilities;
  }
  const testElement = document.createElement('div');
  const canvas = document.createElement('canvas');
  const video = document.createElement('video');
  const audio = document.createElement('audio');

  const { webgl, webgl2 } = probeGL();

  const caps: BrowserCapabilities = {
    backdropFilter: 'backdropFilter' in (testElement.style as any) || 'webkitBackdropFilter' in (testElement.style as any),
    cssGrid: 'grid' in testElement.style,
    flexbox: 'flex' in testElement.style,
    cssVariables: 'CSS' in window && 'supports' in window.CSS && window.CSS.supports('--test', 'value'),
    es6: (() => {
      try {
        new Function('const a = 1; return a;')();
        return true;
      } catch {
        return false;
      }
    })(),
    webgl,
    webgl2,
    webAnimations: 'animate' in testElement,
    intersectionObserver: 'IntersectionObserver' in window,
    resizeObserver: 'ResizeObserver' in window,
    mutationObserver: 'MutationObserver' in window,
    requestIdleCallback: 'requestIdleCallback' in window,
    webWorkers: 'Worker' in window,
    serviceWorkers: 'serviceWorker' in navigator,
    indexedDB: 'indexedDB' in window,
    localStorage: (() => {
      try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    })(),
    sessionStorage: (() => {
      try {
        const test = 'test';
        sessionStorage.setItem(test, test);
        sessionStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    })(),
    webRTC: 'RTCPeerConnection' in window || 'webkitRTCPeerConnection' in window,
    webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
    canvas: !!canvas.getContext('2d'),
    svg: document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1'),
    video: !!video.canPlayType,
    audio: !!audio.canPlayType,
  };

  __cachedBrowserCapabilities = caps;
  __lastBrowserDetectTs = now;
  return caps;
};

// Compatibility helpers
export const compatibilityHelpers = {
  // Get fallback styles for unsupported features
  getFallbackStyles: (feature: keyof BrowserCapabilities): Record<string, any> => {
    const browser = detectBrowser();

    switch (feature) {
      case 'backdropFilter':
        if (!browser.supports.backdropFilter) {
          return {
            background: '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          };
        }
        break;

      case 'cssGrid':
        if (!browser.supports.cssGrid) {
          return {
            display: 'flex',
            flexWrap: 'wrap',
          };
        }
        break;

      case 'flexbox':
        if (!browser.supports.flexbox) {
          return {
            display: 'block',
          };
        }
        break;

      case 'webAnimations':
        if (!browser.supports.webAnimations) {
          return {
            transition: 'all 0.3s ease',
          };
        }
        break;
    }

    return {};
  },

  // Check if browser supports glassmorphism
  supportsGlassmorphism: (): boolean => {
    const browser = detectBrowser();
    return browser.supports.backdropFilter && browser.supports.cssVariables;
  },

  // Get appropriate animation library
  getAnimationLibrary: (): 'web-animations' | 'css-transitions' | 'none' => {
    const browser = detectBrowser();

    if (browser.supports.webAnimations) {
      return 'web-animations';
    } else if (browser.version >= 10) {
      return 'css-transitions';
    } else {
      return 'none';
    }
  },

  // Check WebGL support level
  getWebGLSupport: (): 'webgl2' | 'webgl' | 'none' => {
    const browser = detectBrowser();

    if (browser.supports.webgl2) {
      return 'webgl2';
    } else if (browser.supports.webgl) {
      return 'webgl';
    } else {
      return 'none';
    }
  },

  // Get appropriate storage mechanism
  getStorageMechanism: (): 'indexeddb' | 'localstorage' | 'memory' => {
    const browser = detectBrowser();

    if (browser.supports.indexedDB) {
      return 'indexeddb';
    } else if (browser.supports.localStorage) {
      return 'localstorage';
    } else {
      return 'memory';
    }
  },
};

// Polyfill management
export class PolyfillManager {
  private static loadedPolyfills = new Set<string>();

  static async loadPolyfill(name: string, url: string): Promise<void> {
    if (this.loadedPolyfills.has(name)) {
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => {
        this.loadedPolyfills.add(name);
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  static async loadRequiredPolyfills(): Promise<void> {
    const browser = detectBrowser();
    const polyfills: Array<{ name: string; url: string; condition: boolean }> = [
      {
        name: 'intersection-observer',
        url: 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver',
        condition: !browser.supports.intersectionObserver,
      },
      {
        name: 'resize-observer',
        url: 'https://polyfill.io/v3/polyfill.min.js?features=ResizeObserver',
        condition: !browser.supports.resizeObserver,
      },
      {
        name: 'request-idle-callback',
        url: 'https://polyfill.io/v3/polyfill.min.js?features=requestIdleCallback',
        condition: !browser.supports.requestIdleCallback,
      },
      {
        name: 'web-animations',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/web-animations/2.3.2/web-animations.min.js',
        condition: !browser.supports.webAnimations,
      },
    ];

    const promises = polyfills
      .filter((polyfill: any) => polyfill.condition)
      .map((polyfill: any) => this.loadPolyfill(polyfill.name, polyfill.url));

    await Promise.all(promises);
  }

  static isPolyfillLoaded(name: string): boolean {
    return this.loadedPolyfills.has(name);
  }
}

// Feature detection utilities
export const featureDetection = {
  // Check CSS feature support
  supportsCSS: (property: string, value?: string): boolean => {
    const testElement = document.createElement('div');
    if (value) {
      testElement.style.setProperty(property, value);
      return testElement.style.getPropertyValue(property) === value;
    } else {
      return property in testElement.style;
    }
  },

  // Check JavaScript feature support
  supportsJS: (feature: string): boolean => {
    try {
      switch (feature) {
        case 'es6':
          new Function('const a = 1; return a;')();
          return true;
        case 'async-await':
          new Function('async function test() { await Promise.resolve(); }')();
          return true;
        case 'promises':
          return 'Promise' in window;
        case 'fetch':
          return 'fetch' in window;
        case 'proxy':
          return 'Proxy' in window;
        case 'map':
          return 'Map' in window;
        case 'set':
          return 'Set' in window;
        case 'weakmap':
          return 'WeakMap' in window;
        case 'weakset':
          return 'WeakSet' in window;
        default:
          return false;
      }
    } catch {
      return false;
    }
  },

  // Check API support
  supportsAPI: (api: string): boolean => {
    switch (api) {
      case 'geolocation':
        return 'geolocation' in navigator;
      case 'notifications':
        return 'Notification' in window;
      case 'service-worker':
        return 'serviceWorker' in navigator;
      case 'web-share':
        return 'share' in navigator;
      case 'vibration':
        return 'vibrate' in navigator;
      case 'battery':
        return 'getBattery' in navigator;
      case 'device-orientation':
        return 'DeviceOrientationEvent' in window;
      case 'device-motion':
        return 'DeviceMotionEvent' in window;
      default:
        return false;
    }
  },

  // Get device pixel ratio
  getDevicePixelRatio: (): number => {
    return window.devicePixelRatio || 1;
  },

  // Check if running in iframe
  isInIframe: (): boolean => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  },

  // Check if running in WebView
  isInWebView: (): boolean => {
    const ua = navigator.userAgent;
    return /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua) ||
           /\bwv\b/.test(ua) ||
           /Android.*Version\/\d+\.\d+/i.test(ua);
  },

  // Check connection quality
  getConnectionQuality: (): 'slow' | 'fast' | 'unknown' => {
    const connection = (navigator as any).connection;
    if (!connection) return 'unknown';

    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return 'slow';
    } else {
      return 'fast';
    }
  },
};

// Browser-specific optimizations
export const browserOptimizations = {
  // Safari-specific optimizations
  safari: {
    // Fix backdrop-filter performance
    optimizeBackdropFilter: () => {
      const browser = detectBrowser();
      if (browser.name === 'Safari' && browser.version < 15) {
        return {
          willChange: 'transform',
          transform: 'translateZ(0)',
        };
      }
      return {};
    },

    // Fix flexbox bugs
    fixFlexbox: () => {
      return {
        minWidth: 0,
        minHeight: 0,
      };
    },
  },

  // Firefox-specific optimizations
  firefox: {
    // Fix backdrop-filter support
    optimizeBackdropFilter: () => {
      const browser = detectBrowser();
      if (browser.name === 'Firefox' && browser.version < 70) {
        return createGlassStyle({ intent: "neutral", elevation: "level2" });
      }
      return {};
    },
  },

  // Mobile-specific optimizations
  mobile: {
    // Optimize for touch interactions
    optimizeForTouch: () => {
      const browser = detectBrowser();
      if (browser.mobile) {
        return {
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'manipulation',
        };
      }
      return {};
    },

    // Optimize animations for mobile
    optimizeAnimations: () => {
      const browser = detectBrowser();
      if (browser.mobile) {
        return {
          willChange: 'transform',
          transform: 'translateZ(0)',
        };
      }
      return {};
    },
  },
};
