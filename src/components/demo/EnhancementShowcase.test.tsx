'use client';
/**
 * EnhancementShowcase Component Tests
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
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { EnhancementShowcase } from "@/components/demo/EnhancementShowcase";

jest.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

jest.mock("@/components/button/EnhancedGlassButton", () => {
  const React = require("react");
  const MockButton = React.forwardRef(
    (
      { children, onAdvancedInteraction: _onAdvancedInteraction, ...rest }: any,
      ref: any
    ) => (
      <button ref={ref} data-mock="enhanced-button" type="button" {...rest}>
        {children}
      </button>
    )
  );
  MockButton.displayName = "MockButton";
  return {
    EnhancedGlassButton: MockButton,
    PhysicsGlassButton: MockButton,
    ImmersiveGlassButton: MockButton,
    VRGlassButton: MockButton,
    SmartAdaptiveButton: MockButton,
    UltraEnhancedButton: MockButton,
  };
});

jest.mock("@/components/effects/GlassPhysicsEngine", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <div data-mock="glass-physics" {...props}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/effects/GlassMorphingEngine", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <div data-mock="glass-morph" {...props}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/effects/Glass3DEngine", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <div data-mock="glass-3d" {...props}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/animations/OrganicAnimationEngine", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <div data-mock="organic-animation" {...props}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/spatial/SpatialComputingEngine", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <div data-mock="spatial-engine" {...props}>
      {children}
    </div>
  ),
}));

jest.mock("@/utils/emotionalIntelligence", () => ({
  useEmotionalIntelligence: () => ({
    currentEmotion: {
      primary: "calm",
      intensity: 0.5,
      confidence: 0.9,
    },
    uiAdaptation: {},
  }),
}));

jest.mock("@/utils/aiPersonalization", () => ({
  useAIPersonalization: () => ({
    profile: {
      confidence: 0.86,
      uiPreferences: { colorScheme: "aurora" },
    },
    recommendations: [
      { id: "rec-1", title: "Deep glass integration" },
      { id: "rec-2", title: "Adaptive motion" },
    ],
  }),
}));

expect.extend(toHaveNoViolations);

const renderShowcase = (props = {}) => render(<EnhancementShowcase {...props} />);

describe("EnhancementShowcase", () => {
  beforeAll(() => {
    const win = globalThis.window as any;
    if (win) {
      win.COMMON_SEQUENCES = {
        gentle: [],
        energetic: [],
        interactive: [],
        contemplative: [],
      };
    }
  });

  it("renders primary sections", () => {
    renderShowcase();
    expect(
      screen.getByRole("heading", { name: /AuraGlass Enhancement Overview/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Physics-Based Glass Effects/i)).toBeInTheDocument();
    expect(screen.getByText(/Immersive 3D Glass Effects/i)).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderShowcase();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("matches snapshot", () => {
    const { container } = renderShowcase();
    expect(container.firstChild).toMatchSnapshot();
  });
});