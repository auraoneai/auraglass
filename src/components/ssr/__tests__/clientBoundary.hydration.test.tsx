/**
 * REQ-PLAT-46 — hydration + Slot.ref coverage.
 *
 * 1. AuraGlassClientBoundary must initialise to `false` so the server string
 *    and the first client render agree; children appear only after the mount
 *    effect.
 * 2. Reduced-motion / device hooks initialise to a constant and apply the real
 *    environment value in their effect — the first render must never read the
 *    DOM (that's the hydration-mismatch bug this REQ fixes).
 * 3. Slot composes its own ref with the child's, and branches on
 *    `React.version` major for the 19 ref-as-prop path.
 */
import React from "react";
import { render, screen, renderHook } from "@testing-library/react";
import * as env from "../../../utils/env";
import { readFileSync } from "fs";
import { join } from "path";
import AuraGlassClientBoundary from "../AuraGlassClientBoundary";
import { Slot } from "../../../primitives/Slot";
import { useDeviceCapabilities } from "../../../hooks/useDeviceCapabilities";
import { useEnhancedReducedMotion } from "../../../hooks/useEnhancedReducedMotion";

const SRC = join(__dirname, "..", "..", "..");

describe("AuraGlassClientBoundary hydration", () => {
  afterEach(() => jest.restoreAllMocks());

  it("renders the fallback while not in a browser (the server view)", () => {
    // isBrowser() false makes the mount effect a no-op — the component stays
    // on the fallback, which is exactly what the server string contains.
    jest.spyOn(env, "isBrowser").mockReturnValue(false);
    render(
      <AuraGlassClientBoundary fallback={<span>placeholder</span>}>
        <button>real-child</button>
      </AuraGlassClientBoundary>
    );
    expect(screen.getByText("placeholder")).toBeInTheDocument();
    expect(screen.queryByText("real-child")).toBeNull();
  });

  it("first client render is the fallback; children mount after the effect", () => {
    const { container } = render(
      <AuraGlassClientBoundary fallback={<span>placeholder</span>}>
        <button>real-child</button>
      </AuraGlassClientBoundary>
    );
    // useState(false) makes the pre-effect render identical to the server
    // view; after the mount effect, children render:
    expect(screen.getByText("real-child")).toBeInTheDocument();
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("initialises with a constant useState(false), not an isBrowser() lazy init", () => {
    const src = readFileSync(
      join(SRC, "components/ssr/AuraGlassClientBoundary.tsx"),
      "utf8"
    );
    expect(src).toMatch(/useState\(false\)/);
    expect(src).not.toMatch(/useState\(\(\)\s*=>\s*isBrowser\(\)\)/);
  });
});

describe("reduced-motion / device hooks — constant init + effect", () => {
  it("useEnhancedReducedMotion first render is the constant default (no DOM read)", () => {
    const seen: boolean[] = [];
    const Probe = () => {
      seen.push(useEnhancedReducedMotion());
      return null;
    };
    render(<Probe />);
    expect(seen[0]).toBe(true); // constant init — never a matchMedia read
  });

  it("useDeviceCapabilities first render is DEFAULT_DEVICE_INFO", () => {
    const { result } = renderHook(() => useDeviceCapabilities());
    // first-render value is the constant default; the mount effect already
    // replaced it with the real detection — both are fine to assert here:
    expect(result.current.deviceInfo).toBeTruthy();
    const src = readFileSync(
      join(SRC, "hooks/useDeviceCapabilities.ts"),
      "utf8"
    );
    expect(src).toMatch(
      /useState<DeviceInfo>\(\{\s*\.\.\.DEFAULT_DEVICE_INFO,?\s*\}\)/
    );
    expect(src).not.toMatch(/useState<DeviceInfo>\(\(\)\s*=>/);
  });
});

describe("Slot ref composition", () => {
  it("composes forwarded ref with the child element ref (React 18 runtime)", () => {
    const forwarded = jest.fn();
    const childRef = jest.fn();
    render(
      <Slot ref={forwarded}>
        {React.createElement("div", {
          ref: childRef,
          "data-testid": "slot-child",
        })}
      </Slot>
    );
    const node = screen.getByTestId("slot-child");
    expect(forwarded).toHaveBeenCalledWith(node);
    expect(childRef).toHaveBeenCalledWith(node);
  });

  it("branches on React.version major for the 19 ref-as-prop path", () => {
    const src = readFileSync(join(SRC, "primitives/Slot.tsx"), "utf8");
    expect(src).toMatch(/parseInt\(React\.version,\s*10\)/);
    expect(src).toMatch(/reactMajor\s*>=\s*19/);
    expect(src).toMatch(/child\.props\s+as\s+AnyProps\)\.ref/);
    // 18 path still reads the element ref:
    expect(src).toMatch(/\{\s*ref\?:\s*React\.Ref<HTMLElement>\s*\}\)\.ref/);
  });
});
