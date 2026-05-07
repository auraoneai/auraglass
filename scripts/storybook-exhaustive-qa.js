#!/usr/bin/env node

const fs = require("node:fs");
const http = require("node:http");
const https = require("node:https");
const path = require("node:path");
const { chromium } = require("@playwright/test");

const repoRoot = process.cwd();
const positionalUrl = process.argv
  .slice(2)
  .find((arg) => /^https?:\/\//i.test(arg));
const storybookUrl =
  process.env.STORYBOOK_URL || positionalUrl || "http://localhost:6006";
const concurrency = Number(process.env.STORYBOOK_QA_CONCURRENCY || "6");
const renderTimeoutMs = Number(process.env.STORYBOOK_QA_TIMEOUT_MS || "12000");
const settleWaitMs = Number(process.env.STORYBOOK_QA_SETTLE_MS || "450");
const limitArgIndex = process.argv.indexOf("--limit");
const limit =
  limitArgIndex >= 0 ? Number(process.argv[limitArgIndex + 1] || "0") : 0;
const broadLimitArgIndex = process.argv.indexOf("--broad-limit");
const broadLimit =
  broadLimitArgIndex >= 0
    ? Number(process.argv[broadLimitArgIndex + 1] || "0")
    : 0;
const mobileAll = process.argv.includes("--mobile-all");
const failOnFindings = process.argv.includes("--fail-on-findings");

const reportDir = path.join(repoRoot, "reports");
const jsonReportPath = path.join(reportDir, "storybook-exhaustive-qa.json");
const markdownReportPath = path.join(reportDir, "storybook-exhaustive-qa.md");

const desktopChecks = [
  {
    name: "desktop-liquid",
    width: 1280,
    height: 800,
    previewMode: "liquid",
    colorScheme: "light",
  },
  {
    name: "desktop-dark",
    width: 1280,
    height: 800,
    previewMode: "dark",
    colorScheme: "dark",
  },
];

const mobileCheck = {
  name: "mobile-liquid",
  width: 390,
  height: 844,
  previewMode: "liquid",
  colorScheme: "light",
};

const storybookErrorTextPatterns = [
  /The component failed to render/i,
  /StorybookError/i,
  /Couldn't find story/i,
  /Cannot find module/i,
  /Failed to fetch dynamically imported module/i,
  /Minified React error/i,
  /No Preview/i,
  /Cannot read properties of/i,
  /ReferenceError/i,
  /TypeError/i,
];

const ignoredConsolePatterns = [
  /ResizeObserver loop completed with undelivered notifications/i,
  /Warning: .*a style property during rerender/i,
  /Download the React DevTools/i,
  /Error loading story index:/i,
  /getStoryIndexFromServer/i,
  /storybook_internal_preview_runtime/i,
  /Failed to load resource: the server responded with a status of 404.*favicon/i,
];

const flagWeights = {
  "storybook-error": 110,
  "page-error": 100,
  "severe-console-error": 90,
  "missing-story-root": 70,
  "body-horizontal-overflow": 65,
  "story-horizontal-overflow": 65,
  "mobile-horizontal-overflow": 65,
  "clipped-child": 58,
  "tiny-or-collapsed-content": 60,
  "control-overlap": 50,
  "low-contrast": 45,
  "dark-text-on-dark": 45,
  "visible-native-control": 40,
  "excessive-vertical-overflow": 35,
  "dark-opaque-surface": 35,
  "remote-media-failure": 30,
  "huge-blank-area": 30,
  "low-paint-density": 25,
};

const highRiskPattern =
  /(liquid|glass|modal|drawer|popover|dialog|nav|menu|tab|toolbar|sidebar|bottom|breadcrumb|input|select|checkbox|radio|switch|slider|step|form|date|file|upload|search|command|media|video|audio|player|carousel|gallery|table|grid|list|kanban|chart|dashboard|widget|card|surface|layout|shell|sheet|toast|tooltip)/i;

const fetchJson = (url) =>
  new Promise((resolve, reject) => {
    const client = url.startsWith("https:") ? https : http;
    client
      .get(url, (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`${url} returned ${response.statusCode}`));
            return;
          }
          resolve(JSON.parse(body));
        });
      })
      .on("error", reject);
  });

const normalizeImportPath = (value) =>
  String(value || "")
    .replace(/^\.\//, "")
    .replace(/\\/g, "/");

const titlePrefix = (title) => String(title || "Untitled").split("/")[0];

const storyFileGroup = (entry) =>
  normalizeImportPath(entry.importPath) || `${entry.title || "unknown"}`;

const isHighRiskStory = (entry) =>
  mobileAll ||
  highRiskPattern.test(
    `${entry.id || ""} ${entry.title || ""} ${entry.name || ""} ${
      entry.importPath || ""
    }`
  );

const selectBroadEntries = (entries, maxCount) => {
  if (!maxCount || entries.length <= maxCount) return entries;
  const byPrefix = new Map();
  for (const entry of entries) {
    const key = titlePrefix(entry.title);
    if (!byPrefix.has(key)) byPrefix.set(key, []);
    byPrefix.get(key).push(entry);
  }
  const groups = [...byPrefix.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, group]) => group);
  const selected = [];
  let index = 0;
  while (selected.length < maxCount) {
    let added = false;
    for (const group of groups) {
      if (group[index]) {
        selected.push(group[index]);
        added = true;
        if (selected.length >= maxCount) break;
      }
    }
    if (!added) break;
    index += 1;
  }
  return selected.sort((a, b) => String(a.id).localeCompare(String(b.id)));
};

const slug = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);

const storyUrl = (entry, check) => {
  const params = new URLSearchParams({
    id: entry.id,
    viewMode: "story",
    globals: `previewMode:${check.previewMode}`,
  });
  return `${storybookUrl}/iframe.html?${params.toString()}`;
};

const isIgnoredConsole = (text) =>
  ignoredConsolePatterns.some((pattern) => pattern.test(text));

const scoreFlags = (findings) =>
  findings.reduce((total, finding) => {
    const base = flagWeights[finding.flag] || 20;
    const extra = Math.min(35, Math.max(0, Number(finding.count || 1) - 1) * 3);
    return total + base + extra;
  }, 0);

const summarizeMessages = (items, max = 5) =>
  items
    .slice(0, max)
    .map((item) => String(item).replace(/\s+/g, " ").trim().slice(0, 220));

const checkStorybookErrorText = (text) =>
  storybookErrorTextPatterns.some((pattern) => pattern.test(text || ""));

const analyzeMetrics = ({ entry, check, metrics, consoleErrors, pageErrors }) => {
  const findings = [];
  const add = (flag, message, data = {}) => {
    findings.push({
      flag,
      check: check.name,
      message,
      ...data,
    });
  };

  if (!metrics.hasStoryRoot) {
    add("missing-story-root", "No #storybook-root element was attached.");
  }

  if (metrics.storybookErrorElementCount > 0 || checkStorybookErrorText(metrics.bodyText)) {
    add("storybook-error", "Storybook error UI or fatal error text is visible.", {
      count: metrics.storybookErrorElementCount || 1,
      sample: metrics.bodyTextSample,
    });
  }

  if (pageErrors.length > 0) {
    add("page-error", "Uncaught page errors were reported.", {
      count: pageErrors.length,
      sample: summarizeMessages(pageErrors),
    });
  }

  if (consoleErrors.length > 0) {
    add("severe-console-error", "Severe console errors were reported.", {
      count: consoleErrors.length,
      sample: summarizeMessages(consoleErrors),
    });
  }

  if (metrics.bodyHorizontalOverflowPx > 4) {
    add("body-horizontal-overflow", `Document is ${metrics.bodyHorizontalOverflowPx}px wider than the viewport.`, {
      count: metrics.bodyHorizontalOverflowPx,
    });
  }

  if (metrics.rootHorizontalOverflowPx > 4) {
    const flag = check.name.startsWith("mobile")
      ? "mobile-horizontal-overflow"
      : "story-horizontal-overflow";
    add(flag, `Story root is ${metrics.rootHorizontalOverflowPx}px wider than the viewport.`, {
      count: metrics.rootHorizontalOverflowPx,
    });
  }

  if (metrics.verticalOverflowRatio > 3.5) {
    add("excessive-vertical-overflow", `Story height is ${metrics.verticalOverflowRatio.toFixed(1)}x the viewport.`, {
      count: Math.round(metrics.verticalOverflowRatio),
    });
  }

  if (metrics.visiblePaintedElementCount < 2 || metrics.contentAreaRatio < 0.015) {
    add("tiny-or-collapsed-content", "Visible content is tiny or collapsed.", {
      count: metrics.visiblePaintedElementCount,
      bounds: metrics.contentBounds,
    });
  }

  if (
    metrics.contentAreaRatio > 0 &&
    metrics.contentAreaRatio < 0.12 &&
    metrics.visiblePaintedElementCount < 14 &&
    metrics.visibleTextLength < 180
  ) {
    add("huge-blank-area", "Most of the viewport is blank around a very small rendered surface.", {
      count: Number(metrics.contentAreaRatio.toFixed(3)),
      bounds: metrics.contentBounds,
    });
  }

  if (metrics.paintDensity < 0.01 && metrics.visiblePaintedElementCount < 8) {
    add("low-paint-density", "Painted UI density is very low for a public story preview.", {
      count: metrics.visiblePaintedElementCount,
    });
  }

  if (metrics.controlOverlapCount > 0) {
    add("control-overlap", "Visible interactive controls overlap each other.", {
      count: metrics.controlOverlapCount,
      sample: metrics.controlOverlapSamples,
    });
  }

  if (metrics.clippedChildCount > 0) {
    add("clipped-child", "Visible children are clipped by parent containers.", {
      count: metrics.clippedChildCount,
      sample: metrics.clippedChildSamples,
    });
  }

  if (metrics.nativeControlCount > 0) {
    add("visible-native-control", "Native browser controls are visible instead of styled glass controls.", {
      count: metrics.nativeControlCount,
      sample: metrics.nativeControlSamples,
    });
  }

  if (metrics.lowContrastCount > 0) {
    add("low-contrast", "Approximate text/background contrast is below readable thresholds.", {
      count: metrics.lowContrastCount,
      sample: metrics.lowContrastSamples,
    });
  }

  if (metrics.darkTextOnDarkCount > 0) {
    add("dark-text-on-dark", "Dark text appears on a dark background.", {
      count: metrics.darkTextOnDarkCount,
      sample: metrics.darkTextOnDarkSamples,
    });
  }

  if (metrics.darkOpaqueSurfaceCount > 8 || metrics.darkOpaqueAreaRatio > 0.42) {
    add("dark-opaque-surface", "Dark opaque surfaces dominate the preview instead of clear/liquid layers.", {
      count: metrics.darkOpaqueSurfaceCount,
      areaRatio: Number(metrics.darkOpaqueAreaRatio.toFixed(3)),
      sample: metrics.darkOpaqueSamples,
    });
  }

  if (metrics.mediaFailureCount > 0) {
    add("remote-media-failure", "Images, video, audio, or visible media placeholders failed.", {
      count: metrics.mediaFailureCount,
      sample: metrics.mediaFailureSamples,
    });
  }

  return findings.map((finding) => ({
    ...finding,
    title: entry.title,
    storyId: entry.id,
    storyName: entry.name,
    importPath: storyFileGroup(entry),
    prefix: titlePrefix(entry.title),
  }));
};

const inspectPage = async (page) =>
  page.evaluate(() => {
    const root = document.querySelector("#storybook-root") || document.body;
    const viewportArea = window.innerWidth * window.innerHeight;

    const parseRgb = (value) => {
      if (!value || value === "transparent") return null;
      const match = String(value).match(
        /rgba?\(\s*([0-9.]+)[,\s]+([0-9.]+)[,\s]+([0-9.]+)(?:[,\s/]+([0-9.]+))?\s*\)/i
      );
      if (!match) return null;
      return {
        r: Number(match[1]),
        g: Number(match[2]),
        b: Number(match[3]),
        a: match[4] === undefined ? 1 : Number(match[4]),
      };
    };

    const channel = (value) => {
      const normalized = value / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
    };

    const luminance = (rgb) =>
      0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);

    const contrastRatio = (a, b) => {
      const light = Math.max(a, b);
      const dark = Math.min(a, b);
      return (light + 0.05) / (dark + 0.05);
    };

    const rectFor = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      };
    };

    const isVisible = (element) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity || "1") > 0.02 &&
        rect.width > 1 &&
        rect.height > 1 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < window.innerHeight &&
        rect.left < window.innerWidth
      );
    };

    const isIgnoredOverlayElement = (element) =>
      Boolean(
        element.closest(
          "[hidden], [inert], [aria-hidden='true'], [data-state='closed'], [data-glass-overlay='true']"
        )
      );

    const textOf = (element) =>
      (element.textContent || "").replace(/\s+/g, " ").trim();

    const directTextOf = (element) =>
      Array.from(element.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent || "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

    const hasPaintSignal = (element) => {
      const style = window.getComputedStyle(element);
      const tag = element.tagName.toLowerCase();
      const bg = parseRgb(style.backgroundColor);
      const backgroundPainted = Boolean(bg && bg.a > 0.03);
      const borderPainted = ["top", "right", "bottom", "left"].some(
        (side) =>
          Number.parseFloat(style.getPropertyValue(`border-${side}-width`)) > 0
      );
      return (
        backgroundPainted ||
        borderPainted ||
        style.boxShadow !== "none" ||
        style.backgroundImage !== "none" ||
        ["canvas", "svg", "img", "video", "button", "input", "select", "textarea"].includes(tag) ||
        textOf(element).length > 0
      );
    };

    const elementLabel = (element) => {
      const tag = element.tagName.toLowerCase();
      const id = element.id ? `#${element.id}` : "";
      const cls = String(element.className || "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 3)
        .join(".");
      const classPart = cls ? `.${cls}` : "";
      const text = textOf(element).slice(0, 60);
      return `${tag}${id}${classPart}${text ? ` "${text}"` : ""}`;
    };

    const clippedRect = (element) => {
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
      };
    };

    const visibleElements = Array.from(root.querySelectorAll("*")).filter(isVisible);
    const painted = visibleElements
      .filter(hasPaintSignal)
      .map((element) => {
        const rect = clippedRect(element);
        if (!rect) return null;
        return {
          ...rect,
          area: rect.width * rect.height,
          textLength: textOf(element).length,
        };
      })
      .filter(Boolean);

    const contentBounds = painted.reduce((bounds, box) => {
      if (!bounds) return { ...box };
      const next = {
        x: Math.min(bounds.x, box.x),
        y: Math.min(bounds.y, box.y),
        right: Math.max(bounds.right, box.right),
        bottom: Math.max(bounds.bottom, box.bottom),
      };
      next.width = next.right - next.x;
      next.height = next.bottom - next.y;
      next.area = next.width * next.height;
      return next;
    }, null);

    const rootRect = rectFor(root);
    const documentWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body.scrollWidth,
      Math.ceil(root.scrollWidth || 0)
    );
    const rootWidth = Math.max(Math.ceil(root.scrollWidth || 0), Math.ceil(rootRect.width || 0));
    const rootHeight = Math.max(Math.ceil(root.scrollHeight || 0), Math.ceil(rootRect.height || 0));

    const nativeControlSelectors = [
      "select",
      "textarea",
      "video[controls]",
      "audio[controls]",
      "input[type='checkbox']",
      "input[type='radio']",
      "input[type='range']",
      "input[type='color']",
      "input[type='date']",
      "input[type='datetime-local']",
      "input[type='time']",
      "input[type='file']",
      "input[type='number']",
    ];
    const nativeControls = Array.from(
      root.querySelectorAll(nativeControlSelectors.join(","))
    ).filter((element) => {
      if (!isVisible(element)) return false;
      if (isIgnoredOverlayElement(element)) return false;
      const style = window.getComputedStyle(element);
      const appearance = `${style.appearance || ""} ${style.webkitAppearance || ""}`;
      const className = String(element.className || "");
      const customRole =
        className.includes("glass") ||
        className.includes("liquid") ||
        element.getAttribute("data-glass-component") !== null;
      return !customRole && !/none/i.test(appearance);
    });

    const interactiveSelector = [
      "button",
      "a[href]",
      "input:not([type='hidden'])",
      "select",
      "textarea",
      "[role='button']",
      "[role='tab']",
      "[role='switch']",
      "[role='checkbox']",
      "[role='radio']",
      "[role='menuitem']",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");
    const controls = Array.from(root.querySelectorAll(interactiveSelector))
      .filter((element) => {
        if (isIgnoredOverlayElement(element)) return false;
        if (!isVisible(element)) return false;
        const rect = element.getBoundingClientRect();
        return rect.width >= 8 && rect.height >= 8 && rect.width <= window.innerWidth;
      })
      .slice(0, 180);
    const overlapSamples = [];
    let overlapCount = 0;
    for (let i = 0; i < controls.length; i += 1) {
      const a = controls[i];
      const aRect = a.getBoundingClientRect();
      const aArea = aRect.width * aRect.height;
      for (let j = i + 1; j < controls.length; j += 1) {
        const b = controls[j];
        if (a.contains(b) || b.contains(a)) continue;
        const bRect = b.getBoundingClientRect();
        const width = Math.min(aRect.right, bRect.right) - Math.max(aRect.left, bRect.left);
        const height = Math.min(aRect.bottom, bRect.bottom) - Math.max(aRect.top, bRect.top);
        if (width <= 0 || height <= 0) continue;
        const overlapArea = width * height;
        const bArea = bRect.width * bRect.height;
        if (overlapArea >= Math.max(48, Math.min(aArea, bArea) * 0.18)) {
          overlapCount += 1;
          if (overlapSamples.length < 8) {
            overlapSamples.push({
              a: elementLabel(a),
              b: elementLabel(b),
              overlap: Math.round(overlapArea),
            });
          }
        }
      }
    }

    const clippedChildSamples = [];
    let clippedChildCount = 0;
    for (const element of visibleElements.slice(0, 700)) {
      if (isIgnoredOverlayElement(element)) continue;
      const parent = element.parentElement;
      if (!parent || parent === root || !isVisible(parent)) continue;
      const parentStyle = window.getComputedStyle(parent);
      const overflowText = `${parentStyle.overflow} ${parentStyle.overflowX} ${parentStyle.overflowY}`;
      if (!/(hidden|clip|auto|scroll)/i.test(overflowText)) continue;
      const rect = element.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const clippedLeft = rect.left < parentRect.left - 2;
      const clippedRight = rect.right > parentRect.right + 2;
      const clippedTop = rect.top < parentRect.top - 2;
      const clippedBottom = rect.bottom > parentRect.bottom + 2;
      if (!(clippedLeft || clippedRight || clippedTop || clippedBottom)) continue;
      const horizontalClipIsScrollable =
        !(clippedLeft || clippedRight) || /auto|scroll/i.test(parentStyle.overflowX);
      const verticalClipIsScrollable =
        !(clippedTop || clippedBottom) || /auto|scroll/i.test(parentStyle.overflowY);
      if (horizontalClipIsScrollable && verticalClipIsScrollable) continue;
      const visibleWidth =
        Math.min(rect.right, parentRect.right) - Math.max(rect.left, parentRect.left);
      const visibleHeight =
        Math.min(rect.bottom, parentRect.bottom) - Math.max(rect.top, parentRect.top);
      const visibleArea = Math.max(0, visibleWidth) * Math.max(0, visibleHeight);
      const totalArea = rect.width * rect.height;
      if (totalArea < 64 || visibleArea / totalArea > 0.92) continue;
      clippedChildCount += 1;
      if (clippedChildSamples.length < 10) {
        clippedChildSamples.push({
          child: elementLabel(element),
          parent: elementLabel(parent),
          visibleRatio: Number((visibleArea / totalArea).toFixed(2)),
          sides: [
            clippedLeft ? "left" : null,
            clippedRight ? "right" : null,
            clippedTop ? "top" : null,
            clippedBottom ? "bottom" : null,
          ].filter(Boolean),
        });
      }
    }

    const backgroundFor = (element) => {
      let node = element;
      while (node && node.nodeType === Node.ELEMENT_NODE) {
        const style = window.getComputedStyle(node);
        const bg = parseRgb(style.backgroundColor);
        if (bg && bg.a > 0.2) return bg;
        node = node.parentElement;
      }
      const bodyBg = parseRgb(window.getComputedStyle(document.body).backgroundColor);
      if (bodyBg && bodyBg.a > 0.2) return bodyBg;
      const rootBg = parseRgb(window.getComputedStyle(document.documentElement).backgroundColor);
      if (rootBg && rootBg.a > 0.2) return rootBg;
      return null;
    };

    const textElements = visibleElements.filter((element) => {
      if (isIgnoredOverlayElement(element)) return false;
      const style = window.getComputedStyle(element);
      if (style.fontSize === "0px") return false;
      const direct = directTextOf(element);
      if (direct.length >= 2) return true;
      const children = Array.from(element.children).filter(isVisible);
      return children.length === 0 && textOf(element).length >= 2;
    });
    const lowContrastSamples = [];
    const darkTextOnDarkSamples = [];
    let lowContrastCount = 0;
    let darkTextOnDarkCount = 0;
    for (const element of textElements.slice(0, 450)) {
      const style = window.getComputedStyle(element);
      const color = parseRgb(style.color);
      const bg = backgroundFor(element);
      if (!color || !bg || color.a < 0.2) continue;
      const fgLum = luminance(color);
      const bgLum = luminance(bg);
      const ratio = contrastRatio(fgLum, bgLum);
      const text = textOf(element).slice(0, 80);
      const fontSize = Number.parseFloat(style.fontSize || "14");
      const minRatio = fontSize >= 18 || Number.parseFloat(style.fontWeight || "400") >= 600 ? 3 : 4.5;
      if (ratio < Math.min(minRatio, 4.5)) {
        lowContrastCount += 1;
        if (lowContrastSamples.length < 10) {
          lowContrastSamples.push({
            element: elementLabel(element),
            text,
            ratio: Number(ratio.toFixed(2)),
            color: style.color,
            background: `rgba(${bg.r}, ${bg.g}, ${bg.b}, ${bg.a})`,
          });
        }
      }
      if (fgLum < 0.34 && bgLum < 0.28 && ratio < 3.5) {
        darkTextOnDarkCount += 1;
        if (darkTextOnDarkSamples.length < 10) {
          darkTextOnDarkSamples.push({
            element: elementLabel(element),
            text,
            ratio: Number(ratio.toFixed(2)),
          });
        }
      }
    }

    const darkOpaqueSamples = [];
    let darkOpaqueSurfaceCount = 0;
    let darkOpaqueArea = 0;
    for (const element of visibleElements) {
      if (isIgnoredOverlayElement(element)) continue;
      const style = window.getComputedStyle(element);
      const bg = parseRgb(style.backgroundColor);
      if (!bg || bg.a < 0.84 || luminance(bg) >= 0.18) continue;
      const rect = clippedRect(element);
      if (!rect) continue;
      const area = rect.width * rect.height;
      if (area < 2400) continue;
      const blur = `${style.backdropFilter || ""} ${style.webkitBackdropFilter || ""}`;
      darkOpaqueSurfaceCount += 1;
      darkOpaqueArea += area;
      if (darkOpaqueSamples.length < 8) {
        darkOpaqueSamples.push({
          element: elementLabel(element),
          area: Math.round(area),
          background: style.backgroundColor,
          backdropFilter: blur.trim() || "none",
        });
      }
    }

    const failedMedia = [];
    const mediaElements = Array.from(root.querySelectorAll("img, video, audio, source"));
    for (const element of mediaElements) {
      const tag = element.tagName.toLowerCase();
      if (!isVisible(element) && tag !== "source") continue;
      const src = element.currentSrc || element.src || element.getAttribute("src") || "";
      let failed = false;
      if (tag === "img") {
        failed = element.complete && element.naturalWidth === 0;
      } else if (tag === "video" || tag === "audio") {
        failed = Boolean(element.error) || element.networkState === HTMLMediaElement.NETWORK_NO_SOURCE;
      } else if (tag === "source") {
        failed = !src;
      }
      if (failed && src && !/^https?:\/\//i.test(src)) failed = false;
      if (failed && failedMedia.length < 10) {
        failedMedia.push({
          element: elementLabel(element),
          src: src.slice(0, 180),
          remote: /^https?:\/\//i.test(src),
        });
      }
    }

    const placeholderText = Array.from(root.querySelectorAll("*"))
      .filter(isVisible)
      .map(textOf)
      .filter((value) =>
        /(failed to load|image unavailable|media unavailable|placeholder image|missing image|video unavailable)/i.test(
          value
        )
      )
      .slice(0, 5);

    const rootText = textOf(root);
    const bodyText = document.body.innerText || "";

    return {
      hasStoryRoot: Boolean(document.querySelector("#storybook-root")),
      bodyText: bodyText.slice(0, 3000),
      bodyTextSample: bodyText.replace(/\s+/g, " ").trim().slice(0, 500),
      rootTextSample: rootText.slice(0, 500),
      rootBox: rootRect,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      bodyHorizontalOverflowPx: Math.max(0, documentWidth - window.innerWidth),
      rootHorizontalOverflowPx: Math.max(0, rootWidth - window.innerWidth),
      verticalOverflowRatio: rootHeight / Math.max(1, window.innerHeight),
      contentBounds,
      contentAreaRatio: contentBounds ? contentBounds.area / viewportArea : 0,
      paintDensity:
        painted.reduce((total, box) => total + Math.min(box.area, viewportArea), 0) /
        Math.max(1, viewportArea * Math.max(1, painted.length)),
      visiblePaintedElementCount: painted.length,
      visibleElementCount: visibleElements.length,
      visibleTextLength: painted.reduce((total, box) => total + box.textLength, 0),
      storybookErrorElementCount: Array.from(
        document.querySelectorAll(
          ".sb-errordisplay, [data-testid='storybook-error'], #error-message, .sb-show-errordisplay"
        )
      ).filter(isVisible).length,
      nativeControlCount: nativeControls.length,
      nativeControlSamples: nativeControls.slice(0, 10).map((element) => ({
        element: elementLabel(element),
        type: element.getAttribute("type") || element.tagName.toLowerCase(),
      })),
      controlOverlapCount: overlapCount,
      controlOverlapSamples: overlapSamples,
      clippedChildCount,
      clippedChildSamples,
      lowContrastCount,
      lowContrastSamples,
      darkTextOnDarkCount,
      darkTextOnDarkSamples,
      darkOpaqueSurfaceCount,
      darkOpaqueAreaRatio: darkOpaqueArea / Math.max(1, viewportArea),
      darkOpaqueSamples,
      mediaFailureCount: failedMedia.length + placeholderText.length,
      mediaFailureSamples: [...failedMedia, ...placeholderText.map((text) => ({ text }))],
    };
  });

const runCheck = async (context, entry, check) => {
  let page;
  const consoleErrors = [];
  const consoleWarnings = [];
  const ignoredConsole = [];
  const pageErrors = [];
  const resourceFailures = [];

  try {
    page = await context.newPage();
    page.setDefaultTimeout(renderTimeoutMs);
    page.setDefaultNavigationTimeout(renderTimeoutMs);

    page.on("console", (message) => {
      const text = message.text();
      if (isIgnoredConsole(text)) {
        ignoredConsole.push({
          type: message.type(),
          text: text.replace(/\s+/g, " ").trim().slice(0, 220),
        });
        return;
      }
      if (message.type() === "error") consoleErrors.push(text);
      if (message.type() === "warning") consoleWarnings.push(text);
    });
    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });
    page.on("requestfailed", (request) => {
      const type = request.resourceType();
      if (!["image", "media", "font", "script", "stylesheet"].includes(type)) return;
      resourceFailures.push({
        type,
        url: request.url().slice(0, 220),
        error: request.failure()?.errorText || "request failed",
      });
    });
    page.on("response", (response) => {
      const request = response.request();
      const type = request.resourceType();
      if (!["image", "media", "font", "script", "stylesheet"].includes(type)) return;
      if (response.status() < 400) return;
      resourceFailures.push({
        type,
        url: response.url().slice(0, 220),
        status: response.status(),
      });
    });

    await page.setViewportSize({ width: check.width, height: check.height });
    await page.emulateMedia({ colorScheme: check.colorScheme });
    await page.goto(storyUrl(entry, check), {
      waitUntil: "domcontentloaded",
      timeout: renderTimeoutMs,
    });
    let rootWaitError = null;
    await page
      .waitForSelector("#storybook-root", {
        state: "attached",
        timeout: Math.min(renderTimeoutMs, 8000),
      })
      .catch((error) => {
        rootWaitError = error;
      });
    await page.waitForLoadState("networkidle", {
      timeout: Math.min(renderTimeoutMs, 8000),
    }).catch(() => {});
    await page
      .waitForFunction(
        () => {
          const root = document.querySelector("#storybook-root");
          if (!root) return false;
          const style = window.getComputedStyle(root);
          const rect = root.getBoundingClientRect();
          const visibleRoot =
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            rect.width > 0 &&
            rect.height > 0;
          const hasVisibleChild = Array.from(root.querySelectorAll("*")).some(
            (element) => {
              const childStyle = window.getComputedStyle(element);
              const childRect = element.getBoundingClientRect();
              return (
                childStyle.display !== "none" &&
                childStyle.visibility !== "hidden" &&
                Number(childStyle.opacity || "1") > 0.02 &&
                childRect.width > 1 &&
                childRect.height > 1
              );
            }
          );

          return visibleRoot && hasVisibleChild;
        },
        { timeout: Math.min(renderTimeoutMs, 8000) }
      )
      .catch(() => {});
    await page.waitForTimeout(settleWaitMs);
    const metrics = await inspectPage(page);
    const findings = analyzeMetrics({
      entry,
      check,
      metrics,
      consoleErrors,
      pageErrors,
    });
    const runErrors = [];
    if (rootWaitError && !metrics.hasStoryRoot && !checkStorybookErrorText(metrics.bodyText)) {
      runErrors.push({
        kind: "missing-story-root",
        check: check.name,
        message: rootWaitError.message,
      });
    }
    const noise = [];
    if (ignoredConsole.length > 0) {
      noise.push({
        kind: "ignored-console",
        check: check.name,
        count: ignoredConsole.length,
        sample: ignoredConsole.slice(0, 5),
      });
    }
    if (consoleWarnings.length > 0) {
      noise.push({
        kind: "console-warning",
        check: check.name,
        count: consoleWarnings.length,
        sample: summarizeMessages(consoleWarnings, 5),
      });
    }
    const noisyResourceFailures = resourceFailures.filter((failure) => {
      if (failure.type === "font") return true;
      if (/favicon|fonts\.gstatic|fonts\.googleapis/i.test(failure.url || "")) return true;
      return false;
    });
    const severeResourceFailures = resourceFailures.filter(
      (failure) => !noisyResourceFailures.includes(failure)
    );
    if (noisyResourceFailures.length > 0) {
      noise.push({
        kind: "resource-noise",
        check: check.name,
        count: noisyResourceFailures.length,
        sample: noisyResourceFailures.slice(0, 5),
      });
    }
    if (severeResourceFailures.length > 0) {
      noise.push({
        kind: "resource-failure-review",
        check: check.name,
        count: severeResourceFailures.length,
        sample: severeResourceFailures.slice(0, 5),
      });
    }
    return {
      check: check.name,
      ok: findings.length === 0,
      findings,
      runErrors,
      noise,
      metrics: {
        bodyHorizontalOverflowPx: metrics.bodyHorizontalOverflowPx,
        rootHorizontalOverflowPx: metrics.rootHorizontalOverflowPx,
        verticalOverflowRatio: Number(metrics.verticalOverflowRatio.toFixed(2)),
        contentAreaRatio: Number(metrics.contentAreaRatio.toFixed(3)),
        visiblePaintedElementCount: metrics.visiblePaintedElementCount,
        visibleTextLength: metrics.visibleTextLength,
        nativeControlCount: metrics.nativeControlCount,
        controlOverlapCount: metrics.controlOverlapCount,
        clippedChildCount: metrics.clippedChildCount,
        lowContrastCount: metrics.lowContrastCount,
        darkTextOnDarkCount: metrics.darkTextOnDarkCount,
        darkOpaqueSurfaceCount: metrics.darkOpaqueSurfaceCount,
        darkOpaqueAreaRatio: Number(metrics.darkOpaqueAreaRatio.toFixed(3)),
        mediaFailureCount: metrics.mediaFailureCount,
        storybookErrorElementCount: metrics.storybookErrorElementCount,
      },
    };
  } catch (error) {
    const timedOut = /Timeout/i.test(error.message || "");
    const targetClosed = /Target page, context or browser has been closed/i.test(
      error.message || ""
    );
    const kind = targetClosed
      ? "target-closed-artifact"
      : timedOut
        ? "render-timeout"
        : "probe-exception";
    return {
      check: check.name,
      ok: false,
      findings: [],
      runErrors: [
        {
          kind,
          check: check.name,
          message: error.message,
          title: entry.title,
          storyId: entry.id,
          storyName: entry.name,
          importPath: storyFileGroup(entry),
          prefix: titlePrefix(entry.title),
        },
      ],
      noise: targetClosed
        ? [
            {
              kind: "known-crawler-artifact",
              check: check.name,
              count: 1,
              sample: ["page.goto target closed artifact; not counted as story failure"],
            },
          ]
        : [],
      metrics: null,
    };
  } finally {
    if (page) await page.close().catch(() => {});
  }
};

const inspectStory = async (browser, entry) => {
  const checks = [...desktopChecks];
  if (isHighRiskStory(entry)) checks.push(mobileCheck);

  const context = await browser.newContext({
    colorScheme: "light",
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
  });

  try {
    const runs = [];
    for (const check of checks) {
      runs.push(await runCheck(context, entry, check));
    }
    const findings = runs.flatMap((run) => run.findings);
    const runErrors = runs.flatMap((run) => run.runErrors || []);
    const noise = runs.flatMap((run) => run.noise || []);
    return {
      id: entry.id,
      title: entry.title,
      name: entry.name,
      importPath: storyFileGroup(entry),
      componentPath: normalizeImportPath(entry.componentPath),
      prefix: titlePrefix(entry.title),
      highRisk: isHighRiskStory(entry),
      status:
        findings.length === 0 ? "pass" : scoreFlags(findings) >= 100 ? "fail" : "risk",
      score: scoreFlags(findings),
      flags: [...new Set(findings.map((finding) => finding.flag))],
      findings,
      runErrors,
      noise,
      checks: runs,
    };
  } finally {
    await context.close().catch(() => {});
  }
};

const runQueue = async (items, workerCount, worker) => {
  let next = 0;
  let complete = 0;
  const results = new Array(items.length);
  const workers = Array.from({ length: workerCount }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      try {
        results[index] = await worker(items[index], index);
      } catch (error) {
        const entry = items[index];
        results[index] = {
          id: entry.id,
          title: entry.title,
          name: entry.name,
          importPath: storyFileGroup(entry),
          componentPath: normalizeImportPath(entry.componentPath),
          prefix: titlePrefix(entry.title),
          highRisk: isHighRiskStory(entry),
          status: "pass",
          score: 0,
          flags: [],
          findings: [],
          runErrors: [
            {
              kind: /Target page, context or browser has been closed/i.test(
                error.message || ""
              )
                ? "target-closed-artifact"
                : "worker-exception",
              check: "worker",
              message: error.message,
              title: entry.title,
              storyId: entry.id,
              storyName: entry.name,
              importPath: storyFileGroup(entry),
              prefix: titlePrefix(entry.title),
            },
          ],
          noise: [
            {
              kind: "worker-error-excluded",
              check: "worker",
              count: 1,
              sample: [String(error.message || error).slice(0, 220)],
            },
          ],
          checks: [],
        };
      }
      complete += 1;
      if (complete % 50 === 0 || complete === items.length) {
        console.log(`Inspected ${complete}/${items.length} stories`);
      }
    }
  });
  await Promise.all(workers);
  return results;
};

const buildGroups = (stories) => {
  const groups = new Map();
  for (const story of stories.filter((item) => item.findings.length > 0)) {
    const key = story.importPath || story.title;
    if (!groups.has(key)) {
      groups.set(key, {
        importPath: key,
        titlePrefixes: new Set(),
        storyCount: 0,
        findingCount: 0,
        score: 0,
        flags: new Map(),
        stories: [],
      });
    }
    const group = groups.get(key);
    group.titlePrefixes.add(story.prefix);
    group.storyCount += 1;
    group.findingCount += story.findings.length;
    group.score += story.score;
    for (const flag of story.flags) {
      group.flags.set(flag, (group.flags.get(flag) || 0) + 1);
    }
    group.stories.push({
      id: story.id,
      title: story.title,
      name: story.name,
      score: story.score,
      status: story.status,
      flags: story.flags,
    });
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      titlePrefixes: [...group.titlePrefixes].sort(),
      flags: Object.fromEntries(
        [...group.flags.entries()].sort((a, b) => b[1] - a[1])
      ),
      stories: group.stories.sort((a, b) => b.score - a.score),
    }))
    .sort((a, b) => b.score - a.score);
};

const writeReports = (report) => {
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(jsonReportPath, `${JSON.stringify(report, null, 2)}\n`);

  const topStories = report.stories
    .filter((story) => story.findings.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 80);

  const flagRows = Object.entries(report.summary.flagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([flag, count]) => `| ${flag} | ${count} |`)
    .join("\n");

  const runErrorRows = report.runErrors
    .slice(0, 80)
    .map(
      (error) =>
        `| ${error.kind} | ${error.check} | ${error.title} / ${error.storyName} | ${error.importPath} | ${String(error.message || "").replace(/\s+/g, " ").slice(0, 220)} |`
    )
    .join("\n");

  const noiseRows = report.noiseSummary
    .map(
      (item) =>
        `| ${item.kind} | ${item.count} | ${item.sample
          .map((sample) =>
            typeof sample === "string"
              ? sample
              : sample.text || sample.url || JSON.stringify(sample)
          )
          .join(" ; ")
          .replace(/\s+/g, " ")
          .slice(0, 260)} |`
    )
    .join("\n");

  const topRows = topStories
    .map(
      (story) =>
        `| ${story.score} | ${story.status} | ${story.prefix} | ${story.title} / ${story.name} | ${story.importPath} | ${story.flags.join(", ")} |`
    )
    .join("\n");

  const groupSections = report.groups
    .slice(0, 80)
    .map((group, index) => {
      const storyRows = group.stories
        .slice(0, 12)
        .map(
          (story) =>
            `| ${story.score} | ${story.status} | ${story.id} | ${story.name} | ${story.flags.join(", ")} |`
        )
        .join("\n");
      return [
        `### ${index + 1}. ${group.importPath}`,
        "",
        `Prefixes: ${group.titlePrefixes.join(", ")}`,
        `Grouped score: ${group.score}; affected stories: ${group.storyCount}; findings: ${group.findingCount}`,
        `Flags: ${Object.entries(group.flags)
          .map(([flag, count]) => `${flag} (${count})`)
          .join(", ")}`,
        "",
        "| Score | Status | Story ID | Story | Flags |",
        "| ---: | --- | --- | --- | --- |",
        storyRows || "| - | - | - | - | - |",
      ].join("\n");
    })
    .join("\n\n");

  const markdown = [
    "# Storybook Exhaustive QA",
    "",
    `Generated: ${report.generatedAt}`,
    `Storybook: ${report.storybookUrl}`,
    `Public stories inspected: ${report.summary.storyCount}`,
    `High-risk mobile stories inspected: ${report.summary.highRiskStoryCount}`,
    `Checks: ${report.config.desktopChecks
      .map((check) => check.name)
      .concat(report.config.mobileCheck.name)
      .join(", ")}`,
    "",
    "## Summary",
    "",
    `- Pass: ${report.summary.passCount}`,
    `- Risk: ${report.summary.riskCount}`,
    `- Fail: ${report.summary.failCount}`,
    `- Total audit findings: ${report.summary.findingCount}`,
    `- Audit-run errors, excluded from ranking: ${report.summary.runErrorCount}`,
    `- False-positive/noise events: ${report.summary.noiseCount}`,
    `- Affected files/groups: ${report.groups.length}`,
    "",
    "## Flag Counts",
    "",
    "| Flag | Count |",
    "| --- | ---: |",
    flagRows || "| - | 0 |",
    "",
    "## Top Ranked Failures",
    "",
    "| Score | Status | Prefix | Story | File | Flags |",
    "| ---: | --- | --- | --- | --- | --- |",
    topRows || "| - | pass | - | - | - | - |",
    "",
    "## Audit-Run Errors",
    "",
    "These are crawler or infrastructure failures. They are excluded from story ranking.",
    "",
    "| Kind | Check | Story | File | Message |",
    "| --- | --- | --- | --- | --- |",
    runErrorRows || "| - | - | - | - | - |",
    "",
    "## False-Positive/Noise",
    "",
    "Ignored console messages, benign warnings, font/favicon misses, and known crawler artifacts are summarized here instead of being counted as story failures.",
    "",
    "| Kind | Count | Sample |",
    "| --- | ---: | --- |",
    noiseRows || "| - | 0 | - |",
    "",
    "## Ranked Groups By File/Title Prefix",
    "",
    groupSections || "No findings.",
    "",
    "## Rerun",
    "",
    "```bash",
    `STORYBOOK_URL=${report.storybookUrl} STORYBOOK_QA_CONCURRENCY=${report.config.concurrency} node scripts/storybook-exhaustive-qa.js`,
    "```",
    "",
    "Useful options: `--broad-limit N`, `--limit N`, `--mobile-all`, `--fail-on-findings`.",
    "",
  ].join("\n");

  fs.writeFileSync(markdownReportPath, markdown);
};

(async () => {
  const index = await fetchJson(`${storybookUrl}/index.json`);
  let entries = Object.values(index.entries || {})
    .filter((entry) => entry.type === "story" && entry.id)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));

  if (broadLimit > 0) entries = selectBroadEntries(entries, broadLimit);
  if (limit > 0) entries = entries.slice(0, limit);

  console.log(
    `Storybook exhaustive QA: ${entries.length} stories from ${storybookUrl}/index.json`
  );
  console.log(
    `Checks: ${desktopChecks.map((check) => check.name).join(", ")} plus ${
      mobileAll ? "all-story" : "high-risk"
    } ${mobileCheck.name}; concurrency ${concurrency}`
  );

  const browser = await chromium.launch();
  let stories;
  try {
    stories = await runQueue(entries, concurrency, (entry) =>
      inspectStory(browser, entry)
    );
  } finally {
    await browser.close().catch(() => {});
  }

  const flagCounts = {};
  for (const story of stories) {
    for (const finding of story.findings) {
      flagCounts[finding.flag] = (flagCounts[finding.flag] || 0) + 1;
    }
  }
  const runErrors = stories.flatMap((story) =>
    (story.runErrors || []).map((error) => ({
      ...error,
      title: error.title || story.title,
      storyId: error.storyId || story.id,
      storyName: error.storyName || story.name,
      importPath: error.importPath || story.importPath,
      prefix: error.prefix || story.prefix,
    }))
  );
  const noiseEvents = stories.flatMap((story) =>
    (story.noise || []).map((noise) => ({
      ...noise,
      title: story.title,
      storyId: story.id,
      storyName: story.name,
      importPath: story.importPath,
      prefix: story.prefix,
    }))
  );
  const noiseByKind = new Map();
  for (const noise of noiseEvents) {
    const existing = noiseByKind.get(noise.kind) || {
      kind: noise.kind,
      count: 0,
      sample: [],
    };
    existing.count += Number(noise.count || 1);
    if (existing.sample.length < 6) {
      existing.sample.push(...(noise.sample || []).slice(0, 6 - existing.sample.length));
    }
    noiseByKind.set(noise.kind, existing);
  }
  const noiseSummary = [...noiseByKind.values()].sort((a, b) => b.count - a.count);

  const report = {
    generatedAt: new Date().toISOString(),
    storybookUrl,
    config: {
      concurrency,
      renderTimeoutMs,
      settleWaitMs,
      desktopChecks,
      mobileCheck,
      mobileAll,
      limit,
      broadLimit,
    },
    summary: {
      storyCount: stories.length,
      highRiskStoryCount: stories.filter((story) => story.highRisk).length,
      passCount: stories.filter((story) => story.status === "pass").length,
      riskCount: stories.filter((story) => story.status === "risk").length,
      failCount: stories.filter((story) => story.status === "fail").length,
      findingCount: stories.reduce(
        (total, story) => total + story.findings.length,
        0
      ),
      runErrorCount: runErrors.length,
      storiesWithRunErrors: new Set(runErrors.map((error) => error.storyId)).size,
      noiseCount: noiseEvents.reduce(
        (total, noise) => total + Number(noise.count || 1),
        0
      ),
      flagCounts,
    },
    runErrors,
    noiseSummary,
    noiseEvents,
    groups: buildGroups(stories),
    stories: stories.sort((a, b) => b.score - a.score),
  };

  writeReports(report);
  console.log(`Wrote ${path.relative(repoRoot, jsonReportPath)}`);
  console.log(`Wrote ${path.relative(repoRoot, markdownReportPath)}`);
  console.log(
    `Pass ${report.summary.passCount}; risk ${report.summary.riskCount}; fail ${report.summary.failCount}; audit findings ${report.summary.findingCount}; run errors ${report.summary.runErrorCount}; noise ${report.summary.noiseCount}`
  );

  if (failOnFindings && report.summary.findingCount > 0) {
    process.exitCode = 1;
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
