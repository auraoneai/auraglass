/**
 * Jest test setup file for AuraGlass
 * This file configures Jest globals and testing utilities
 */

import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";

// Extend Jest matchers with jest-axe
expect.extend(toHaveNoViolations);

// Mock window.matchMedia for reduced motion tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.scrollTo for modal tests
Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: jest.fn(),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

// Mock PerformanceObserver
global.PerformanceObserver = class PerformanceObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
} as any;

// Mock performance.memory for performance tests
Object.defineProperty(performance, "memory", {
  writable: true,
  value: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000,
    jsHeapSizeLimit: 4000000000,
  },
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn().mockImplementation((cb) => {
  return setTimeout(cb, 16);
}) as any;

global.cancelAnimationFrame = jest.fn().mockImplementation((id) => {
  clearTimeout(id);
});

// Provide resilient canvas contexts for jsdom
const createCanvasGradient = () => ({
  addColorStop: jest.fn(),
});

const createImageDataStub = (): ImageData => {
  if (typeof ImageData !== "undefined") {
    return new ImageData(0, 0);
  }
  return {
    data: new Uint8ClampedArray(0),
    width: 0,
    height: 0,
    colorSpace: "srgb",
  } as ImageData;
};

const createTextMetricsStub = (): TextMetrics => ({
  width: 0,
  actualBoundingBoxAscent: 0,
  actualBoundingBoxDescent: 0,
  actualBoundingBoxLeft: 0,
  actualBoundingBoxRight: 0,
  fontBoundingBoxAscent: 0,
  fontBoundingBoxDescent: 0,
  emHeightAscent: 0,
  emHeightDescent: 0,
  hangingBaseline: 0,
  alphabeticBaseline: 0,
  ideographicBaseline: 0,
});

const canvas2DContext = {
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => createImageDataStub()),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => createImageDataStub()),
  setTransform: jest.fn(),
  resetTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  closePath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  bezierCurveTo: jest.fn(),
  quadraticCurveTo: jest.fn(),
  arc: jest.fn(),
  stroke: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => createTextMetricsStub()),
  scale: jest.fn(),
  rotate: jest.fn(),
  translate: jest.fn(),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
  createLinearGradient: jest.fn(createCanvasGradient),
  createRadialGradient: jest.fn(createCanvasGradient),
  createPattern: jest.fn(),
  fillText: jest.fn(),
  strokeText: jest.fn(),
  shadowBlur: 0,
  shadowColor: "",
} as Partial<CanvasRenderingContext2D>;

const webglLoseContext = { loseContext: jest.fn() };

const createWebGLContext = (canvas: HTMLCanvasElement | null) =>
  ({
    canvas,
    getExtension: jest.fn((name: string) =>
      name === "WEBGL_lose_context" ? webglLoseContext : null
    ),
    clearColor: jest.fn(),
    clear: jest.fn(),
    createProgram: jest.fn(() => ({})),
    deleteProgram: jest.fn(),
    createShader: jest.fn(() => ({})),
    deleteShader: jest.fn(),
    shaderSource: jest.fn(),
    compileShader: jest.fn(),
    attachShader: jest.fn(),
    linkProgram: jest.fn(),
    useProgram: jest.fn(),
    getProgramParameter: jest.fn(() => true),
    getProgramInfoLog: jest.fn(() => ""),
    getShaderParameter: jest.fn(() => true),
    getShaderInfoLog: jest.fn(() => ""),
    getUniformLocation: jest.fn(() => ({})),
    uniform1f: jest.fn(),
    uniform2f: jest.fn(),
    uniform3f: jest.fn(),
    uniform4f: jest.fn(),
    uniformMatrix4fv: jest.fn(),
    viewport: jest.fn(),
    drawArrays: jest.fn(),
    drawElements: jest.fn(),
    enable: jest.fn(),
    disable: jest.fn(),
    scissor: jest.fn(),
    bindBuffer: jest.fn(),
    bufferData: jest.fn(),
    createBuffer: jest.fn(() => ({})),
    deleteBuffer: jest.fn(),
    bindTexture: jest.fn(),
    activeTexture: jest.fn(),
    createTexture: jest.fn(() => ({})),
    deleteTexture: jest.fn(),
    texParameteri: jest.fn(),
    texImage2D: jest.fn(),
    pixelStorei: jest.fn(),
    clearStencil: jest.fn(),
    stencilFunc: jest.fn(),
    stencilOp: jest.fn(),
    blendFunc: jest.fn(),
    depthFunc: jest.fn(),
    getAttribLocation: jest.fn(() => 0),
    enableVertexAttribArray: jest.fn(),
    vertexAttribPointer: jest.fn(),
    createVertexArray: jest.fn(() => ({})),
    bindVertexArray: jest.fn(),
    deleteVertexArray: jest.fn(),
    createFramebuffer: jest.fn(() => ({})),
    bindFramebuffer: jest.fn(),
    framebufferTexture2D: jest.fn(),
    createRenderbuffer: jest.fn(() => ({})),
    bindRenderbuffer: jest.fn(),
    renderbufferStorage: jest.fn(),
    framebufferRenderbuffer: jest.fn(),
    checkFramebufferStatus: jest.fn(() => 0x8cd5),
    getParameter: jest.fn(() => null),
    getActiveUniform: jest.fn(() => ({
      size: 1,
      type: 0x1406,
      name: "mockUniform",
    })),
    createUniformBuffer: jest.fn(() => ({})),
    bindBufferBase: jest.fn(),
    bufferSubData: jest.fn(),
    deleteFramebuffer: jest.fn(),
    deleteRenderbuffer: jest.fn(),
    ARRAY_BUFFER: 0x8892,
    STATIC_DRAW: 0x88e4,
    FLOAT: 0x1406,
    TRIANGLES: 0x0004,
    COLOR_BUFFER_BIT: 0x4000,
    DEPTH_BUFFER_BIT: 0x0100,
    FRAMEBUFFER_COMPLETE: 0x8cd5,
  }) as Partial<WebGLRenderingContext>;

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  configurable: true,
  writable: true,
  value: jest.fn(function getContext(type: string) {
    if (type === "2d") {
      return { ...canvas2DContext, canvas: this } as CanvasRenderingContext2D;
    }
    if (type && type.toLowerCase().includes("webgl")) {
      const ctx = createWebGLContext(this);
      return ctx as WebGLRenderingContext;
    }
    if (type === "bitmaprenderer") {
      return { transferFromImageBitmap: jest.fn() };
    }
    return null;
  }),
});

// Ensure long-running timers/intervals don't leak between tests
type TimeoutId = ReturnType<typeof globalThis.setTimeout>;
type IntervalId = ReturnType<typeof globalThis.setInterval>;

const trackedTimeouts = new Set<TimeoutId>();
const trackedIntervals = new Set<IntervalId>();

const nativeSetTimeoutRaw = global.setTimeout;
const nativeClearTimeoutRaw = global.clearTimeout;
const nativeSetIntervalRaw = global.setInterval;
const nativeClearIntervalRaw = global.clearInterval;

const nativeSetTimeout = nativeSetTimeoutRaw as unknown as (
  handler: TimerHandler,
  timeout?: number,
  ...args: any[]
) => TimeoutId;
const nativeClearTimeout = nativeClearTimeoutRaw as unknown as (
  id?: TimeoutId
) => void;
const nativeSetInterval = nativeSetIntervalRaw as unknown as (
  handler: TimerHandler,
  timeout?: number,
  ...args: any[]
) => IntervalId;
const nativeClearInterval = nativeClearIntervalRaw as unknown as (
  id?: IntervalId
) => void;

global.setTimeout = ((
  handler: TimerHandler,
  timeout?: number,
  ...args: any[]
) => {
  const id = nativeSetTimeout(handler, timeout, ...args) as TimeoutId;
  trackedTimeouts.add(id);
  return id;
}) as unknown as typeof setTimeout;

global.clearTimeout = ((id?: TimeoutId) => {
  if (typeof id !== "undefined") {
    trackedTimeouts.delete(id);
  }
  return nativeClearTimeout(id);
}) as unknown as typeof clearTimeout;

global.setInterval = ((
  handler: TimerHandler,
  timeout?: number,
  ...args: any[]
) => {
  const id = nativeSetInterval(handler, timeout, ...args) as IntervalId;
  trackedIntervals.add(id);
  return id;
}) as unknown as typeof setInterval;

global.clearInterval = ((id?: IntervalId) => {
  if (typeof id !== "undefined") {
    trackedIntervals.delete(id);
  }
  return nativeClearInterval(id);
}) as unknown as typeof clearInterval;

afterEach(() => {
  trackedTimeouts.forEach((id) => nativeClearTimeout(id as any));
  trackedIntervals.forEach((id) => nativeClearInterval(id as any));
  trackedTimeouts.clear();
  trackedIntervals.clear();
  jest.clearAllMocks();
});

// Silence console errors in tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render") ||
        args[0].includes("Not implemented: HTMLFormElement.prototype.submit") ||
        args[0].includes("HTMLCanvasElement.prototype.getContext"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Export common testing utilities
export * from "./testingUtils";
