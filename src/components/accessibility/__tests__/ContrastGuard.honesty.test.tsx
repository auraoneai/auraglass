/** REQ-PLAT-43: ContrastGuard never claims a WCAG result. It renders
    data-contrast-status="unverified" and no data-meets-wcag /
    data-contrast-ratio; onAdjustment gets meetsRequirement undefined and
    status 'unverified' even when the heuristic believes it passes. */
import React from "react";
import { render, waitFor } from "@testing-library/react";

import { ContrastGuard, TextWithContrast } from "../ContrastGuard";

const DISCLAIMER = "Does not measure rendered contrast. Do not use as a WCAG signal.";

describe("ContrastGuard honesty (REQ-PLAT-43)", () => {
  it('renders data-contrast-status="unverified" and no ratio / wcag attributes', () => {
    const { container } = render(<ContrastGuard showIndicator>text</ContrastGuard>);
    const el = container.querySelector(".contrast-guard")!;
    expect(el.getAttribute("data-contrast-status")).toBe("unverified");
    expect(el.hasAttribute("data-contrast-ratio")).toBe(false);
    expect(el.hasAttribute("data-meets-wcag")).toBe(false);
    expect(el.classList.contains("contrast-guard--compliant")).toBe(false);
    expect(container.querySelector(".contrast-guard__indicator")?.textContent).toBe("unverified");
  });

  it("onAdjustment receives meetsRequirement undefined and status 'unverified'", async () => {
    const onAdjustment = jest.fn();
    // black on white: the heuristic itself would call this a pass
    render(
      <ContrastGuard onAdjustment={onAdjustment} textColor="#000000" backgroundColor="#ffffff">
        text
      </ContrastGuard>
    );
    await waitFor(() => expect(onAdjustment).toHaveBeenCalled(), { timeout: 3000 });
    for (const call of onAdjustment.mock.calls) {
      expect(call[0]).toBeUndefined();
      expect(call[2]).toBe("unverified");
    }
  });

  it("TextWithContrast inherits the same unverified state", () => {
    const { container } = render(<TextWithContrast level="AAA">t</TextWithContrast>);
    const el = container.querySelector(".contrast-guard")!;
    expect(el.getAttribute("data-contrast-status")).toBe("unverified");
    expect(el.hasAttribute("data-contrast-ratio")).toBe(false);
  });

  it("the component and callback JSDoc carry the disclaimer", () => {
    const src: string = require("fs").readFileSync(
      require("path").join(__dirname, "../ContrastGuard.tsx"),
      "utf8"
    );
    expect(src.split(DISCLAIMER).length - 1).toBeGreaterThanOrEqual(3);
    expect(src).not.toMatch(/data-meets-wcag|data-contrast-ratio/);
  });

  it("every ContrastGuard story says it does not measure rendered contrast", () => {
    const { execFileSync } = require("child_process");
    const files: string[] = execFileSync("git", ["ls-files", "*.stories.tsx", "*.stories.ts", "*.mdx"], {
      encoding: "utf8",
    })
      .split("\n")
      .filter(Boolean);
    const fs = require("fs");
    let seen = 0;
    for (const f of files) {
      const text: string = fs.readFileSync(f, "utf8");
      // stories that render the component (not tables that merely name it)
      if (!/<ContrastGuard\b|import[^;]*\bContrastGuard\b[^;]*from/.test(text)) continue;
      seen++;
      expect([f, text.includes(DISCLAIMER)]).toEqual([f, true]);
    }
    expect(seen).toBeGreaterThan(0);
  });
});
