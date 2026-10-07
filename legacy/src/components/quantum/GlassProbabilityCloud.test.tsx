'use client';
/**
 * GlassProbabilityCloud Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ⏭️  ARIA attributes (not applicable)
 * - ⏭️  Focus management (not applicable)
 * - ⏭️  Reduced motion (not applicable)
 */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import {
  GlassProbabilityCloud,
  GlassProbabilityCloudProps,
  ProbabilityPoint,
} from "@/components/quantum/GlassProbabilityCloud";

const createMockContext = () => {
  const gradient = {
    addColorStop: jest.fn(),
  };

  return {
    clearRect: jest.fn(),
    createImageData: jest.fn((width: number, height: number) => ({
      data: new Uint8ClampedArray(Math.max(1, width * height * 4)),
      width,
      height,
    })),
    putImageData: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    setLineDash: jest.fn(),
    createRadialGradient: jest.fn(() => gradient),
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    canvas: { width: 0, height: 0 },
    getExtension: jest.fn(() => ({ loseContext: jest.fn() })),
  } as CanvasRenderingContext2D & { getExtension: jest.Mock };
};

jest.mock("@/utils/deviceCapabilities", () => {
  const actual = jest.requireActual<
    typeof import("@/utils/deviceCapabilities")
  >("@/utils/deviceCapabilities");

  return {
    ...actual,
    detectDevice: jest.fn(() => ({
      ...actual.DEFAULT_DEVICE_INFO,
      capabilities: {
        ...actual.DEFAULT_DEVICE_INFO.capabilities,
        gpu: false,
        webgl: false,
        webgl2: false,
        hardwareAcceleration: false,
      },
    })),
  };
});

expect.extend(toHaveNoViolations);

type Overrides = Partial<GlassProbabilityCloudProps>;

const probabilityPoints: ProbabilityPoint[] = [
  {
    id: "particle-0",
    x: 150,
    y: 100,
    z: 0,
    probability: 0.8,
    uncertainty: 0.3,
    waveFunction: 0.5,
    phase: 0,
    observationCount: 0,
  },
];

const baseProps: GlassProbabilityCloudProps = {
  width: 300,
  height: 200,
  depth: 0,
  probabilityPoints,
  particleCount: 0,
  animationSpeed: 0,
  onMeasurement: jest.fn(),
  onUncertaintyChange: jest.fn(),
};

const renderCloud = (overrides: Overrides = {}) =>
  render(<GlassProbabilityCloud {...baseProps} {...overrides} />);

describe("GlassProbabilityCloud", () => {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  let setIntervalSpy: jest.SpyInstance;
  let clearIntervalSpy: jest.SpyInstance;

  beforeAll(() => {
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockImplementation(() => createMockContext());
    setIntervalSpy = jest
      .spyOn(global, "setInterval")
      .mockImplementation((() => 0) as any);
    clearIntervalSpy = jest
      .spyOn(global, "clearInterval")
      .mockImplementation((() => undefined) as any);
  });

  afterAll(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    setIntervalSpy.mockRestore();
    clearIntervalSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the probability cloud layout", () => {
    renderCloud();
    expect(screen.getByText(/probability cloud/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /observe/i })).toBeInTheDocument();
    expect(document.querySelector("canvas")).toBeInTheDocument();
  });

  it("toggles observation state when the observe button is pressed", () => {
    renderCloud();
    const observeButton = screen.getByRole("button", { name: /observe/i });

    fireEvent.click(observeButton);
    expect(observeButton).toHaveTextContent(/observing/i);
  });

  it("invokes onMeasurement when clicking near a particle", () => {
    const onMeasurement = jest.fn();
    renderCloud({ onMeasurement });

    const canvas = document.querySelector("canvas");
    expect(canvas).toBeTruthy();

    if (canvas) {
      const rectSpy = jest.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
          width: baseProps.width ?? 300,
          height: baseProps.height ?? 200,
          top: 0,
          left: 0,
          bottom: (baseProps.height ?? 200) as number,
          right: (baseProps.width ?? 300) as number,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect);

      fireEvent.click(canvas, { clientX: 150, clientY: 100 });
      rectSpy.mockRestore();
    }

    expect(onMeasurement).toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderCloud();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});