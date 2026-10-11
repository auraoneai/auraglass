/** REQ-PLAT-44: `enabled` on useOptionalInteractionRecorder must never change
    hook order — the hook calls the same hooks in the same order whether
    enabled flips or the provider is absent. */
import React from "react";
import { render } from "@testing-library/react";
import { useOptionalInteractionRecorder } from "../GlassPredictiveEngine";

const results: Array<unknown> = [];

function Probe({ enabled }: { enabled: boolean }) {
  const recorder = useOptionalInteractionRecorder("probe", enabled);
  results.push(recorder);
  return null;
}

describe("useOptionalInteractionRecorder enabled", () => {
  it("keeps hook order stable when enabled toggles (no provider)", () => {
    results.length = 0;
    const { rerender } = render(<Probe enabled={true} />);
    rerender(<Probe enabled={false} />);
    rerender(<Probe enabled={true} />);
    // the context default is truthy, so enabled=false is the null gate —
    // crucially, no "rendered fewer hooks than expected" was thrown.
    expect(results[0]).not.toBeNull();
    expect(results[1]).toBeNull();
    expect(results[2]).not.toBeNull();
  });

  it("source gates enabled inside the callbacks, after all hooks", () => {
    const src = require("fs").readFileSync(
      require("path").join(__dirname, "../GlassPredictiveEngine.tsx"),
      "utf8"
    );
    const start = src.indexOf("useOptionalInteractionRecorder");
    const end = src.indexOf("export function useInteractionRecorder");
    const body = src.slice(start, end);
    // enabled is a callback-input gate, not a hook-order gate.
    expect(body).toMatch(/if \(!enabled \|\| !recordInteraction\) return;/);
    expect(body).toMatch(/return engine && enabled/);
    expect(body).not.toMatch(/if \(!enabled\) return null;\s*const engine/);
  });
});
