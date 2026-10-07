import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { PNG } from "playwright-core/lib/utilsBundle";

const storybookUrl = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";

const viewports = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 720 },
];

const rgbChannels = (value: string) =>
  (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);

const expectNeutralRgb = (value: string, tolerance = 28) => {
  const channels = rgbChannels(value);
  expect(channels).toHaveLength(3);
  expect(Math.max(...channels) - Math.min(...channels)).toBeLessThanOrEqual(
    tolerance
  );
};

const expectNoHorizontalOverflow = async (page: Page) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
};

const neutralEvidenceRoot = path.join(
  process.cwd(),
  "reports/audit/accessibility-neutral"
);

const inspectViewportTint = async (page: Page, screenshotPath: string) => {
  const buffer = await page.screenshot({
    animations: "disabled",
    fullPage: false,
    path: screenshotPath,
  });
  const png = PNG.sync.read(buffer);
  const step = Math.max(2, Math.floor(Math.min(png.width, png.height) / 180));
  let sampledPixels = 0;
  let coloredPixels = 0;
  let tintedNeutralPixels = 0;
  let coolPixels = 0;
  let warmPixels = 0;
  let chromaSum = 0;
  let neutralChromaSum = 0;
  for (let y = 0; y < png.height; y += step) {
    for (let x = 0; x < png.width; x += step) {
      const offset = (y * png.width + x) * 4;
      const r = png.data[offset];
      const g = png.data[offset + 1];
      const b = png.data[offset + 2];
      const a = png.data[offset + 3] / 255;
      if (a < 0.1) continue;
      sampledPixels += 1;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const chroma = max - min;
      const light = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      chromaSum += chroma;
      if (chroma >= 14) coloredPixels += 1;
      if (light >= 148 && chroma >= 8) {
        tintedNeutralPixels += 1;
        neutralChromaSum += chroma;
      }
      const coolDelta = b - r + Math.max(0, g - r) * 0.45;
      const warmDelta = r - b + Math.max(0, r - g) * 0.35;
      if (chroma >= 8 && coolDelta >= 7) coolPixels += 1;
      if (chroma >= 8 && warmDelta >= 7) warmPixels += 1;
    }
  }
  const coloredAreaRatio = coloredPixels / Math.max(1, sampledPixels);
  const tintedNeutralRatio = tintedNeutralPixels / Math.max(1, sampledPixels);
  const coolRatio = coolPixels / Math.max(1, sampledPixels);
  const warmRatio = warmPixels / Math.max(1, sampledPixels);
  const dominantCast =
    coolRatio >= 0.12 && coolRatio > warmRatio * 1.35
      ? "cool"
      : warmRatio >= 0.12 && warmRatio > coolRatio * 1.35
        ? "warm"
        : coloredAreaRatio >= 0.16
          ? "mixed"
          : "neutral";
  return {
    sampledPixels,
    coloredAreaRatio,
    tintedNeutralRatio,
    dominantCast,
    meanChroma: chromaSum / Math.max(1, sampledPixels),
    meanNeutralChroma:
      neutralChromaSum / Math.max(1, tintedNeutralPixels),
  };
};

test.describe("Accessibility story liquid-glass quality", () => {
  for (const viewport of viewports) {
    test(`settings retain reset spacing and neutral controls at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(
        `${storybookUrl}/iframe.html?id=foundations-accessibility-accessibility-provider--default&viewMode=story`
      );

      const reset = page.getByRole("button", { name: "Reset to Defaults" });
      await expect(reset).toBeVisible();
      const resetBox = await reset.boundingBox();
      const nearestPrecedingSwitchBox = await page.locator("label").evaluateAll(
        (labels, resetTop) =>
          labels
            .map((label) => label.getBoundingClientRect())
            .filter((box) => box.bottom <= resetTop)
            .sort((a, b) => b.bottom - a.bottom)
            .map((box) => ({ bottom: box.bottom }))[0] ?? null,
        resetBox?.y ?? 0
      );

      expect(resetBox).toBeTruthy();
      expect(nearestPrecedingSwitchBox).toBeTruthy();
      if (resetBox && nearestPrecedingSwitchBox) {
        expect(resetBox.y - nearestPrecedingSwitchBox.bottom).toBeGreaterThanOrEqual(
          16
        );
      }

      const trackFills = await page
        .locator("label span[aria-hidden='true']")
        .evaluateAll((tracks) =>
          tracks.map((track) => {
            const style = getComputedStyle(track);
            return `${style.backgroundColor} ${style.backgroundImage}`;
          })
        );
      for (const fill of trackFills) {
        for (const rgb of fill.match(/rgba?\([^)]+\)/g) ?? []) {
          expectNeutralRgb(rgb);
        }
      }
      await expectNoHorizontalOverflow(page);
    });

    test(`focus demo buttons remain light neutral glass at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(
        `${storybookUrl}/iframe.html?id=foundations-accessibility-glass-focus-indicators--default&viewMode=story`
      );

      const buttons = page.getByRole("button").filter({
        hasText: /^(Primary|Secondary|Ghost) Button$/,
      });
      await expect(buttons).toHaveCount(3);
      for (const button of await buttons.all()) {
        await expect(button).toBeVisible();
        const style = await button.evaluate((node) => {
          const computed = getComputedStyle(node);
          return {
            backgroundColor: computed.backgroundColor,
            color: computed.color,
            backgroundImage: computed.backgroundImage,
          };
        });
        expectNeutralRgb(style.backgroundColor);
        expectNeutralRgb(style.color);
        for (const rgb of style.backgroundImage.match(/rgba?\([^)]+\)/g) ?? []) {
          expectNeutralRgb(rgb);
        }
        const backgroundChannels = rgbChannels(style.backgroundColor);
        expect(backgroundChannels.reduce((sum, channel) => sum + channel, 0) / 3).toBeGreaterThanOrEqual(245);
      }
      await expectNoHorizontalOverflow(page);
    });
  }

  for (const viewport of viewports) {
    test(`GlassA11y Default keeps its complete open panel in the initial ${viewport.width}px viewport`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize(viewport);
      await page.goto(
        `${storybookUrl}/iframe.html?id=foundations-accessibility-glass-a11y--default&viewMode=story`
      );

      const controller = page.locator(".glass-a11y-controller");
      const panel = page.locator("[data-glass-a11y-panel]");
      await expect(controller).toBeVisible({ timeout: 15_000 });
      await expect(panel).toBeVisible({ timeout: 15_000 });
      await expect(panel).toHaveAttribute("data-glass-a11y-placement", "flow");

      const geometry = await page.evaluate(() => {
        const controller = document.querySelector(".glass-a11y-controller");
        const panel = document.querySelector("[data-glass-a11y-panel]");
        const story = document.querySelector(".ag-a11y-story");
        const controllerBox = controller?.getBoundingClientRect();
        const panelBox = panel?.getBoundingClientRect();
        return {
          controller: controllerBox && {
            top: controllerBox.top,
            bottom: controllerBox.bottom,
            height: controllerBox.height,
          },
          panel: panelBox && {
            top: panelBox.top,
            bottom: panelBox.bottom,
            height: panelBox.height,
          },
          viewportHeight: window.innerHeight,
          storyOverflowY: story ? getComputedStyle(story).overflowY : null,
        };
      });

      expect(geometry.controller).toBeTruthy();
      expect(geometry.panel).toBeTruthy();
      if (geometry.controller && geometry.panel) {
        expect(geometry.panel.top).toBeGreaterThanOrEqual(0);
        expect(geometry.panel.bottom).toBeLessThanOrEqual(
          geometry.viewportHeight - 8
        );
        expect(geometry.controller.bottom).toBeGreaterThanOrEqual(
          geometry.panel.bottom - 1
        );
        expect(geometry.controller.height).toBeGreaterThan(
          geometry.panel.height + 28
        );
      }
      expect(geometry.storyOverflowY).toBe("auto");
      await expectNoHorizontalOverflow(page);
    });
  }
});

const neutralStoryTargets = [
  {
    slug: "accessibility-provider-docs",
    id: "foundations-accessibility-accessibility-provider--docs",
    viewMode: "docs",
  },
  {
    slug: "accessibility-provider-default",
    id: "foundations-accessibility-accessibility-provider--default",
    viewMode: "story",
  },
  {
    slug: "contrast-guard-default",
    id: "foundations-accessibility-contrast-guard--default",
    viewMode: "story",
  },
  {
    slug: "glass-focus-indicators-default",
    id: "foundations-accessibility-glass-focus-indicators--default",
    viewMode: "story",
  },
  {
    slug: "glass-a11y-default",
    id: "foundations-accessibility-glass-a11y--default",
    viewMode: "story",
  },
  {
    slug: "glass-a11y-testing-mode",
    id: "foundations-accessibility-glass-a11y--testing-mode",
    viewMode: "story",
  },
  {
    slug: "glass-a11y-minimal",
    id: "foundations-accessibility-glass-a11y--minimal",
    viewMode: "story",
  },
] as const;

test.describe("Accessibility whole-viewport neutral-material census", () => {
  for (const target of neutralStoryTargets) {
    for (const viewport of viewports) {
      test(`${target.slug} has no broad tint at ${viewport.width}px`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.goto(
          `${storybookUrl}/iframe.html?id=${target.id}&viewMode=${target.viewMode}`
        );
        await page.locator("body").waitFor({ state: "visible" });
        if (target.slug.startsWith("glass-a11y-")) {
          await expect(page.locator("[data-glass-a11y-panel]")).toBeVisible();
          await page.waitForTimeout(400);
        }
        fs.mkdirSync(neutralEvidenceRoot, { recursive: true });
        const screenshotPath = path.join(
          neutralEvidenceRoot,
          `${target.slug}-${viewport.width}x${viewport.height}.png`
        );
        const census = await inspectViewportTint(page, screenshotPath);
        console.log(
          `TINT_CENSUS ${target.slug} ${viewport.width}x${viewport.height} ${JSON.stringify(census)}`
        );
        expect(census.coloredAreaRatio).toBeLessThanOrEqual(0.18);
        expect(census.tintedNeutralRatio).toBeLessThanOrEqual(0.28);
        expect(
          census.dominantCast === "neutral" || census.meanChroma <= 9
        ).toBe(true);
        if (target.viewMode === "story") {
          await expectNoHorizontalOverflow(page);
        }
      });
    }
  }
});
