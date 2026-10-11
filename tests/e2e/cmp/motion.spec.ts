/* REQ-CMP-138 (lane L9). CMP motion contract: gated continuous motion honors
   prefers-reduced-motion and the data-ag-continuous flag — no un-gated loops. */
import { test, expect } from "@playwright/test";
import { gotoStory } from "../../helpers/index";

test.describe("cmp motion (L9)", () => {
  test("no continuous animation without data-ag-continuous opt-in", async ({
    page,
  }) => {
    await gotoStory(page, "flagships-controls-switch--default").catch(() =>
      gotoStory(page, "flagships-controls-button--default")
    );
    const ungated = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll("[data-ag-surface] *"));
      return els.filter((el) => {
        const cs = getComputedStyle(el);
        if (cs.animationName === "none" || cs.animationName === "")
          return false;
        if (cs.animationPlayState !== "running") return false;
        if (
          !Number.isFinite(parseFloat(cs.animationIterationCount)) ||
          cs.animationIterationCount === "infinite"
        ) {
          return !el.closest("[data-ag-continuous]");
        }
        return false;
      }).length;
    });
    expect(ungated).toBe(0);
  });

  test("reduced motion collapses transitions on interactive surfaces", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoStory(page, "flagships-controls-button--default").catch(() =>
      gotoStory(page, "flagships-controls-switch--default")
    );
    const leaking = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('button, [role="switch"], input')
      ).filter((el) => {
        const cs = getComputedStyle(el);
        return (
          cs.animationName !== "none" &&
          cs.animationPlayState === "running" &&
          (cs.animationIterationCount === "infinite" ||
            parseFloat(cs.animationDuration) > 0.2)
        );
      }).length;
    });
    expect(leaking).toBe(0);
  });
});
