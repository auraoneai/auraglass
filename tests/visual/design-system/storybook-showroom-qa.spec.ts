import { expect, type Page, test } from "@playwright/test";

type StoryIndexEntry = {
  id: string;
  name: string;
  title: string;
  type: string;
};

type ShowroomSample = {
  family: string;
  id: string;
  title: string;
  globals?: string;
  minScreenshotBytes: number;
  minContentWidth: number;
  minContentHeight: number;
  minPaintedElements: number;
  minTextLength: number;
};

type CompositionMetrics = {
  bodyText: string;
  contentBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  debugElementCount: number;
  largestPaintedArea: number;
  rootBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  storybookErrorElementCount: number;
  stateCardOverflowCount: number;
  stateCardTooNarrowCount: number;
  visiblePaintedElementCount: number;
  visibleTextLength: number;
};

const showroomSamples: ShowroomSample[] = [
  {
    family: "Curated",
    id: "curated-start-here--guide",
    title: "Curated/Start Here",
    minScreenshotBytes: 100_000,
    minContentWidth: 900,
    minContentHeight: 520,
    minPaintedElements: 40,
    minTextLength: 1_000,
  },
  {
    family: "Showcase",
    id: "showcase-liquidglassshowcase--app-experience",
    title: "Showcase/LiquidGlassShowcase",
    globals: "previewMode:liquid",
    minScreenshotBytes: 120_000,
    minContentWidth: 900,
    minContentHeight: 520,
    minPaintedElements: 35,
    minTextLength: 1_000,
  },
  {
    family: "Showcase",
    id: "showcase-liquidglassstatematrix--light-dark-dense-media",
    title: "Showcase/LiquidGlassStateMatrix",
    globals: "previewMode:liquid",
    minScreenshotBytes: 120_000,
    minContentWidth: 900,
    minContentHeight: 520,
    minPaintedElements: 70,
    minTextLength: 800,
  },
  {
    family: "Liquid Glass",
    id: "primitives-liquidglassmaterial--quality-comparison",
    title: "Primitives/LiquidGlassMaterial",
    globals: "previewMode:liquid",
    minScreenshotBytes: 40_000,
    minContentWidth: 320,
    minContentHeight: 180,
    minPaintedElements: 8,
    minTextLength: 120,
  },
  {
    family: "Button",
    id: "button-liquidglassbuttonstyle--prominent",
    title: "Button/LiquidGlassButtonStyle",
    globals: "previewMode:liquid",
    minScreenshotBytes: 40_000,
    minContentWidth: 320,
    minContentHeight: 180,
    minPaintedElements: 6,
    minTextLength: 120,
  },
  {
    family: "Media",
    id: "media-liquidglassmediacontrols--clear-over-media",
    title: "Media/LiquidGlassMediaControls",
    globals: "previewMode:liquid",
    minScreenshotBytes: 40_000,
    minContentWidth: 320,
    minContentHeight: 180,
    minPaintedElements: 8,
    minTextLength: 120,
  },
  {
    family: "Media",
    id: "media-liquidglassnowplayingbar--default",
    title: "Media/LiquidGlassNowPlayingBar",
    globals: "previewMode:liquid",
    minScreenshotBytes: 40_000,
    minContentWidth: 320,
    minContentHeight: 180,
    minPaintedElements: 8,
    minTextLength: 120,
  },
  {
    family: "Navigation",
    id: "navigation-liquidglassinsetsidebar--default",
    title: "Navigation/LiquidGlassInsetSidebar",
    globals: "previewMode:liquid",
    minScreenshotBytes: 40_000,
    minContentWidth: 320,
    minContentHeight: 180,
    minPaintedElements: 8,
    minTextLength: 120,
  },
  {
    family: "Navigation",
    id: "navigation-liquidglasstabbar--with-search-tab",
    title: "Navigation/LiquidGlassTabBar",
    globals: "previewMode:liquid",
    minScreenshotBytes: 40_000,
    minContentWidth: 320,
    minContentHeight: 180,
    minPaintedElements: 8,
    minTextLength: 120,
  },
  {
    family: "Navigation",
    id: "navigation-liquidglasstoolbar--default",
    title: "Navigation/LiquidGlassToolbar",
    globals: "previewMode:liquid",
    minScreenshotBytes: 40_000,
    minContentWidth: 320,
    minContentHeight: 180,
    minPaintedElements: 8,
    minTextLength: 120,
  },
  {
    family: "Data Display",
    id: "data-display-liquidglassbadgecluster--collapsed",
    title: "Data Display/LiquidGlassBadgeCluster",
    globals: "previewMode:liquid",
    minScreenshotBytes: 40_000,
    minContentWidth: 320,
    minContentHeight: 180,
    minPaintedElements: 8,
    minTextLength: 120,
  },
  {
    family: "Data Display",
    id: "data-display-liquidglasscarouselrail--default",
    title: "Data Display/LiquidGlassCarouselRail",
    globals: "previewMode:liquid",
    minScreenshotBytes: 40_000,
    minContentWidth: 320,
    minContentHeight: 180,
    minPaintedElements: 8,
    minTextLength: 120,
  },
  {
    family: "Advanced",
    id: "components-advanced-liquidglassgpu--default",
    title: "Components/Advanced/LiquidGlassGPU",
    globals: "previewMode:liquid",
    minScreenshotBytes: 40_000,
    minContentWidth: 320,
    minContentHeight: 180,
    minPaintedElements: 6,
    minTextLength: 120,
  },
  {
    family: "Advanced",
    id: "components-advanced-glasswebglshader--default",
    title: "Components/Advanced/GlassWebGLShader",
    globals: "previewMode:liquid",
    minScreenshotBytes: 40_000,
    minContentWidth: 320,
    minContentHeight: 180,
    minPaintedElements: 4,
    minTextLength: 80,
  },
  {
    family: "Interactive",
    id: "components-interactive-glasscarousel--default",
    title: "Components/Interactive/GlassCarousel",
    globals: "previewMode:liquid",
    minScreenshotBytes: 40_000,
    minContentWidth: 320,
    minContentHeight: 180,
    minPaintedElements: 6,
    minTextLength: 120,
  },
  {
    family: "Interactive",
    id: "components-interactive-glasscommandpalette--default",
    title: "Components/Interactive/GlassCommandPalette",
    globals: "previewMode:liquid",
    minScreenshotBytes: 40_000,
    minContentWidth: 320,
    minContentHeight: 180,
    minPaintedElements: 20,
    minTextLength: 400,
  },
];

const requiredFamilies = [
  "Curated",
  "Showcase",
  "Liquid Glass",
  "Media",
  "Button",
  "Navigation",
  "Data Display",
  "Advanced",
  "Interactive",
];

const storybookBaseUrl = process.env.STORYBOOK_URL || "http://localhost:6006";

const storybookErrorTextPatterns = [
  /The component failed to render/i,
  /StorybookError/i,
  /Couldn't find story/i,
  /Cannot find module/i,
  /Failed to fetch dynamically imported module/i,
  /Minified React error/i,
  /No Preview/i,
  /Cannot read properties of/i,
];

const ignoredConsoleErrorPatterns = [
  /Warning: .*a style property during rerender/i,
  /Error loading story index:/i,
  /getStoryIndexFromServer/i,
  /Failed to fetch[\s\S]*storybook_internal_preview_runtime/i,
  /ResizeObserver loop completed with undelivered notifications/i,
];

const isIgnoredConsoleError = (message: string) =>
  ignoredConsoleErrorPatterns.some((pattern) => pattern.test(message));

const storyUrl = (sample: ShowroomSample) => {
  const params = new URLSearchParams({
    id: sample.id,
    viewMode: "story",
  });

  if (sample.globals) params.set("globals", sample.globals);

  return `${storybookBaseUrl}/iframe.html?${params.toString()}`;
};

const readCompositionMetrics = async (page: Page) =>
  page.evaluate<CompositionMetrics>(() => {
    const isElementVisible = (element: Element) => {
      const style = window.getComputedStyle(element);
      const box = element.getBoundingClientRect();

      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) > 0.01 &&
        box.width > 1 &&
        box.height > 1
      );
    };

    const hasPaintSignal = (element: Element) => {
      const style = window.getComputedStyle(element);
      const tag = element.tagName.toLowerCase();
      const backgroundPainted =
        style.backgroundColor !== "rgba(0, 0, 0, 0)" &&
        style.backgroundColor !== "transparent";
      const borderPainted = ["top", "right", "bottom", "left"].some(
        (side) =>
          Number.parseFloat(style.getPropertyValue(`border-${side}-width`)) > 0
      );
      const mediaPainted = ["canvas", "svg", "img", "video"].includes(tag);
      const controlPainted = ["button", "input", "select", "textarea"].includes(
        tag
      );
      const textPainted = (element.textContent || "").trim().length > 0;

      return (
        backgroundPainted ||
        borderPainted ||
        style.boxShadow !== "none" ||
        style.backgroundImage !== "none" ||
        mediaPainted ||
        controlPainted ||
        textPainted
      );
    };

    const root = document.querySelector("#storybook-root") || document.body;
    const rootRect = root.getBoundingClientRect();
    const paintedElements = Array.from(document.body.querySelectorAll("*"))
      .filter((element) => isElementVisible(element) && hasPaintSignal(element))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const x = Math.max(0, rect.x);
        const y = Math.max(0, rect.y);
        const right = Math.min(window.innerWidth, rect.right);
        const bottom = Math.min(window.innerHeight, rect.bottom);

        if (right <= x || bottom <= y) return null;

        return {
          x,
          y,
          right,
          bottom,
          width: right - x,
          height: bottom - y,
          textLength: (element.textContent || "").trim().length,
        };
      })
      .filter(Boolean) as Array<{
        x: number;
        y: number;
        right: number;
        bottom: number;
        width: number;
        height: number;
        textLength: number;
      }>;

    const contentBounds = paintedElements.reduce<{
      x: number;
      y: number;
      right: number;
      bottom: number;
      width: number;
      height: number;
    } | null>((bounds, box) => {
      if (!bounds) return { ...box };

      const next = {
        x: Math.min(bounds.x, box.x),
        y: Math.min(bounds.y, box.y),
        right: Math.max(bounds.right, box.right),
        bottom: Math.max(bounds.bottom, box.bottom),
        width: 0,
        height: 0,
      };
      next.width = next.right - next.x;
      next.height = next.bottom - next.y;

      return next;
    }, null);
    const stateCards = Array.from(
      document.querySelectorAll("[data-liquid-glass-state]")
    ).filter(isElementVisible);
    const stateCardMetrics = stateCards.map((card) => {
      const cardRect = card.getBoundingClientRect();
      const visibleChildren = Array.from(card.querySelectorAll("*")).filter(
        (child) => {
          const childRect = child.getBoundingClientRect();
          const childStyle = window.getComputedStyle(child);

          return (
            childStyle.display !== "none" &&
            childStyle.visibility !== "hidden" &&
            childRect.width > 8 &&
            childRect.height > 8
          );
        }
      );
      const overflowingChildren = visibleChildren.filter((child) => {
        const childRect = child.getBoundingClientRect();

        return (
          childRect.left < cardRect.left - 1 ||
          childRect.right > cardRect.right + 1 ||
          childRect.top < cardRect.top - 1 ||
          childRect.bottom > cardRect.bottom + 1
        );
      });

      return {
        width: cardRect.width,
        overflowingChildren: overflowingChildren.length,
      };
    });

    return {
      bodyText: document.body.innerText || "",
      contentBounds,
      debugElementCount: document.querySelectorAll(".liquid-glass-debug").length,
      largestPaintedArea: Math.max(
        0,
        ...paintedElements.map((box) => box.width * box.height)
      ),
      rootBox: {
        x: rootRect.x,
        y: rootRect.y,
        width: rootRect.width,
        height: rootRect.height,
      },
      storybookErrorElementCount: Array.from(
        document.querySelectorAll(
          ".sb-errordisplay, [data-testid='storybook-error'], #error-message"
        )
      ).filter(isElementVisible).length,
      stateCardOverflowCount: stateCardMetrics.reduce(
        (total, card) => total + card.overflowingChildren,
        0
      ),
      stateCardTooNarrowCount: stateCardMetrics.filter((card) => card.width < 560)
        .length,
      visiblePaintedElementCount: paintedElements.length,
      visibleTextLength: paintedElements.reduce(
        (total, box) => total + box.textLength,
        0
      ),
    };
  });

test.describe("Storybook public showroom visual QA", () => {
  test("matrix is backed by public index entries in high-risk families", async () => {
    const response = await fetch(`${storybookBaseUrl}/index.json`);
    expect(
      response.ok,
      `index request returned ${response.status} ${response.statusText}`
    ).toBe(true);

    const index = (await response.json()) as {
      entries: Record<string, StoryIndexEntry>;
    };
    const entries = Object.values(index.entries).filter(
      (entry) => entry.type === "story"
    );
    const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
    const sampledFamilies = new Set(showroomSamples.map((sample) => sample.family));

    expect(entries.length).toBeGreaterThan(1_000);
    expect([...sampledFamilies].sort()).toEqual([...requiredFamilies].sort());

    for (const sample of showroomSamples) {
      const entry = entriesById.get(sample.id);

      expect(entry, `${sample.id} should exist in Storybook index`).toBeTruthy();
      expect(entry?.title).toBe(sample.title);
    }
  });

  test("sampled public showroom stories render composed previews", async ({
    page,
  }, testInfo) => {
    test.setTimeout(90_000);

    const findings: Array<{
      id: string;
      family: string;
      failures: string[];
    }> = [];

    await page.setViewportSize({ width: 1280, height: 800 });

    for (const sample of showroomSamples) {
      const consoleErrors: string[] = [];
      const uncaughtErrors: string[] = [];
      const failures: string[] = [];
      const onConsole = (message: Parameters<typeof page.on>[1]) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      };
      const onPageError = (error: Error) => uncaughtErrors.push(error.message);

      page.on("console", onConsole);
      page.on("pageerror", onPageError);

      try {
        await page.goto(storyUrl(sample), { waitUntil: "domcontentloaded" });
        await page.waitForSelector("#storybook-root", {
          state: "attached",
          timeout: 10_000,
        });
        await page.waitForTimeout(750);

        const screenshot = await page.screenshot({ fullPage: true });
        const metrics = await readCompositionMetrics(page);
        const severeConsoleErrors = consoleErrors.filter(
          (message) => !isIgnoredConsoleError(message)
        );
        const hasStorybookErrorText = storybookErrorTextPatterns.some((pattern) =>
          pattern.test(metrics.bodyText)
        );

        if (screenshot.length <= sample.minScreenshotBytes) {
          failures.push(
            `low screenshot bytes ${screenshot.length} <= ${sample.minScreenshotBytes}`
          );
        }
        if (metrics.debugElementCount > 0) {
          failures.push(`debug overlays visible: ${metrics.debugElementCount}`);
        }
        if (metrics.storybookErrorElementCount > 0 || hasStorybookErrorText) {
          failures.push("storybook error screen/text detected");
        }
        if (metrics.stateCardOverflowCount > 0) {
          failures.push(
            `state card child overflow detected: ${metrics.stateCardOverflowCount}`
          );
        }
        if (metrics.stateCardTooNarrowCount > 0) {
          failures.push(
            `state cards below visual minimum width: ${metrics.stateCardTooNarrowCount}`
          );
        }
        if (metrics.rootBox.width <= 0 || metrics.rootBox.height <= 0) {
          failures.push(
            `collapsed root ${metrics.rootBox.width}x${metrics.rootBox.height}`
          );
        }
        if (!metrics.contentBounds) {
          failures.push("missing painted content bounds");
        } else {
          if (metrics.contentBounds.width < sample.minContentWidth) {
            failures.push(
              `tiny content width ${metrics.contentBounds.width} < ${sample.minContentWidth}`
            );
          }
          if (metrics.contentBounds.height < sample.minContentHeight) {
            failures.push(
              `tiny content height ${metrics.contentBounds.height} < ${sample.minContentHeight}`
            );
          }
        }
        if (metrics.visiblePaintedElementCount < sample.minPaintedElements) {
          failures.push(
            `low painted element count ${metrics.visiblePaintedElementCount} < ${sample.minPaintedElements}`
          );
        }
        if (metrics.visibleTextLength < sample.minTextLength) {
          failures.push(
            `low visible text length ${metrics.visibleTextLength} < ${sample.minTextLength}`
          );
        }
        if (metrics.largestPaintedArea <= 2_000) {
          failures.push(`collapsed primary painted area ${metrics.largestPaintedArea}`);
        }
        if (uncaughtErrors.length > 0) {
          failures.push(`uncaught errors: ${uncaughtErrors.join(" | ")}`);
        }
        if (severeConsoleErrors.length > 0) {
          failures.push(
            `severe console errors: ${severeConsoleErrors.join(" | ")}`
          );
        }

        await testInfo.attach(`${sample.id}-composition.json`, {
          body: JSON.stringify(
            {
              sample,
              screenshotBytes: screenshot.length,
              metrics: {
                ...metrics,
                bodyText: metrics.bodyText.slice(0, 500),
              },
              consoleErrors,
              severeConsoleErrors,
              uncaughtErrors,
              failures,
            },
            null,
            2
          ),
          contentType: "application/json",
        });
      } catch (error) {
        failures.push(error instanceof Error ? error.message : String(error));
      } finally {
        page.off("console", onConsole);
        page.off("pageerror", onPageError);
      }

      findings.push({
        id: sample.id,
        family: sample.family,
        failures,
      });
    }

    const failedFindings = findings.filter((finding) => finding.failures.length);

    await testInfo.attach("storybook-showroom-findings.json", {
      body: JSON.stringify(findings, null, 2),
      contentType: "application/json",
    });

    expect(
      failedFindings.map(
        (finding) =>
          `${finding.family}/${finding.id}: ${finding.failures.join("; ")}`
      )
    ).toEqual([]);
  });
});
