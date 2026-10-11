/* REQ-QUAL-32 (QUAL, FIN-434) — ported 4.x measurement layer: in-page collectors (surfaces, layout, text, paint, presentation).
   Verbatim port of v4.1.0:tests/visual/design-system/token-purity-layout-audit.spec.ts (= legacy/tests/visual/design-system/token-purity-layout-audit.spec.ts at 21044a761)
   lines 852-2101. Read from the tag, never imported; only `export`, imports, type-only `!`/tuple assertions (strict tsconfig; erased at compile time) and this header were added. */
import type { Page } from '@playwright/test';
import type { LayoutIssue, PaintInspection, PresentationIssue, SurfaceInspection, TextInspection } from './types';

export const inspectSurface = (page: Page): Promise<SurfaceInspection[]> =>
  page.evaluate(() => {
    const webkitBackdropFilter = (style: CSSStyleDeclaration) => {
      const prefixed =
        style.getPropertyValue("-webkit-backdrop-filter") ||
        (style as unknown as { webkitBackdropFilter?: string })
          .webkitBackdropFilter;
      return prefixed && prefixed !== "none"
        ? prefixed
        : style.backdropFilter || "none";
    };
    const isGenuinelyHidden = (node: Element) => {
      let current: Element | null = node;
      while (current && current !== document.documentElement) {
        const style = window.getComputedStyle(current);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number(style.opacity || "1") <= 0.01 ||
          current.hasAttribute("hidden")
        ) {
          return true;
        }
        current = current.parentElement;
      }
      return false;
    };
    const hasAuthoredProperty = (node: Element, property: string) => {
      if (node instanceof HTMLElement && node.style.getPropertyValue(property))
        return true;
      for (const sheet of [...document.styleSheets]) {
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        const visit = (list: CSSRuleList): boolean => {
          for (const rule of [...list]) {
            if (rule instanceof CSSStyleRule) {
              if (!rule.style.getPropertyValue(property)) continue;
              try {
                if (node.matches(rule.selectorText)) return true;
              } catch {
                // Ignore selectors Chromium cannot query directly.
              }
            } else if (
              "cssRules" in rule &&
              visit((rule as CSSGroupingRule).cssRules)
            ) {
              return true;
            }
          }
          return false;
        };
        if (visit(rules)) return true;
      }
      return false;
    };
    const activeClassTokens = (cls: string) =>
      cls
        .split(/\s+/)
        .filter(Boolean)
        .filter((token) => !token.includes(":"));
    const isSurfaceRoleClass = (cls: string) =>
      activeClassTokens(cls).some(
        (token) =>
          token === "glass" ||
          token === "optimized-glass-surface" ||
          /^glass-foundation-(?:basic|complete)$/.test(token) ||
          /^glass-(?:surface(?:[-/].*)?|(?:neutral|primary|success|warning|danger|info)-level[1-5])$/.test(
            token
          ) ||
          token === "liquid-glass-material" ||
          /^liquid-glass-[a-z0-9-]+-surface$/.test(token)
      );
    const isStorybookChrome = (node: Element) => {
      const cls = String(node.className || "");
      // Storybook chrome wins over surface detection (see top-level comment).
      if (/\bag-story-\b/.test(cls)) return true;
      if (/\bglass-sr-only\b/.test(cls)) return true;
      const tag = node.tagName.toLowerCase();
      if (tag === "a" && /skip-link|sr-only/i.test(cls)) return true;
      const style = window.getComputedStyle(node);
      const backdrop =
        style.backdropFilter || webkitBackdropFilter(style) || "none";
      if (backdrop !== "none" || isSurfaceRoleClass(cls)) {
        return false;
      }
      if (/\bglass-on-light\b/.test(cls)) return true;
      if (/\bcontrast-guard\b|\bglass-contrast-guard\b/.test(cls)) return true;
      return false;
    };
    // Portalled components (sheets, dialogs, popovers, menus) render as body
    // siblings of #storybook-root. Restricting the walk to the story root
    // silently omitted precisely those top-level material surfaces.
    const all = [...document.body.querySelectorAll("*")];
    const surfaceCandidates = all.filter((node) => {
      if (isStorybookChrome(node)) return false;
      if (isGenuinelyHidden(node)) return false;
      const style = window.getComputedStyle(node);
      const box = node.getBoundingClientRect();
      if (box.width <= 1 || box.height <= 1) return false;
      if (
        box.right <= 0 ||
        box.bottom <= 0 ||
        box.left >= window.innerWidth ||
        box.top >= window.innerHeight
      ) {
        return false;
      }
      const cls = String(node.className || "");
      const backdrop =
        style.backdropFilter || webkitBackdropFilter(style) || "none";
      if (backdrop !== "none") return true;
      // Only glass surface roles are token-inspected. Generic layout/utility
      // wrappers (glass-flex, glass-grid, glass-p-*, glass-w-*, ...) that carry
      // no backdrop-filter and no surface fill are not glass surfaces.
      const isSurfaceRole = isSurfaceRoleClass(cls);
      return isSurfaceRole;
    });

    // Preserve every rendered surface. Earlier versions retained only the four
    // largest nodes, which could hide a bad nested control behind a good card.
    const ranked = [...surfaceCandidates].sort((a, b) => {
      const areaA =
        a.getBoundingClientRect().width * a.getBoundingClientRect().height;
      const areaB =
        b.getBoundingClientRect().width * b.getBoundingClientRect().height;
      return areaB - areaA;
    });

    return ranked.map((node) => {
      const style = window.getComputedStyle(node);
      const box = node.getBoundingClientRect();
      const backgroundImage = style.backgroundImage || "none";
      // Keep the computed image list intact. Splitting on `),` corrupts
      // nested rgba()/gradient functions and can hide failing later stops.
      const backgroundImages =
        backgroundImage === "none" ? [] : [backgroundImage];
      const backdrop =
        style.backdropFilter || webkitBackdropFilter(style) || "none";
      const cls = String(node.className || "");
      const explicitSurfaceRole = isSurfaceRoleClass(cls);
      const tokens = activeClassTokens(cls);
      const isKnownDecorativeBackdrop =
        !explicitSurfaceRole &&
        tokens.some((token) =>
          /^(?:liquid-glass-sheen|glass-(?:overlay|ripple|shimmer|reflection|refraction)(?:-|$))/.test(
            token
          )
        );
      const surfaceKind = isKnownDecorativeBackdrop
        ? "decorative"
        : backdrop !== "none"
          ? "backdrop"
          : tokens.some(
                (token) =>
                  token === "liquid-glass-material" ||
                  /^liquid-glass-[a-z0-9-]+-surface$/.test(token)
              )
            ? "liquid"
            : explicitSurfaceRole
              ? "glass-surface"
              : "decorative";
      const elevationMatch = tokens
        .join(" ")
        .match(
          /(?:^|\s)glass-(?:neutral|primary|success|warning|danger|info)-level([1-5])(?:\s|$)/
        );
      const noiseStyle = window.getComputedStyle(node, "::before");
      const specularStyle = window.getComputedStyle(node, "::after");
      const hasNoise = tokens.includes("glass-overlay-noise");
      const hasSpecular = tokens.includes("glass-overlay-specular");
      const sheenAlphas = [
        ...node.querySelectorAll(":scope > .liquid-glass-sheen"),
      ].flatMap((sheen) => {
        const sheenStyle = window.getComputedStyle(sheen);
        const opacity = Number.parseFloat(sheenStyle.opacity || "1");
        const colors = `${sheenStyle.backgroundColor} ${sheenStyle.backgroundImage}`;
        const values: number[] = [];
        const re =
          /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/g;
        let match: RegExpExecArray | null;
        while ((match = re.exec(colors))) {
          const channels = [
            Number(match[1]),
            Number(match[2]),
            Number(match[3]),
          ];
          if (
            Math.min(...channels) < 245 ||
            Math.max(...channels) - Math.min(...channels) > 6
          )
            continue;
          const alpha =
            match[4] === undefined
              ? 1
              : match[4].endsWith("%")
                ? Number.parseFloat(match[4]) / 100
                : Number.parseFloat(match[4]);
          if (alpha > 0) values.push(alpha * opacity);
        }
        return values;
      });
      const borders = (["Top", "Right", "Bottom", "Left"] as const).map(
        (side) => ({
          color: style[`border${side}Color`],
          width: style[`border${side}Width`],
        })
      );
      return {
        selector: node.tagName.toLowerCase(),
        className: String(node.className || "").slice(0, 220),
        inputType: node instanceof HTMLInputElement ? node.type : null,
        surfaceKind,
        x: Math.round(box.x),
        y: Math.round(box.y),
        width: Math.round(box.width),
        height: Math.round(box.height),
        backdropFilter: backdrop,
        webkitBackdropFilter: webkitBackdropFilter(style),
        backdropFilterAuthored: hasAuthoredProperty(node, "backdrop-filter"),
        webkitBackdropFilterAuthored: hasAuthoredProperty(
          node,
          "-webkit-backdrop-filter"
        ),
        backgroundColor: style.backgroundColor,
        backgroundImage,
        backgroundImages,
        borderTopColor: style.borderTopColor,
        borderWidth: style.borderWidth,
        boxShadow: style.boxShadow,
        color: style.color,
        overflowX: style.overflowX,
        overflowY: style.overflowY,
        scrollWidth: node.scrollWidth,
        clientWidth: node.clientWidth,
        scrollHeight: node.scrollHeight,
        clientHeight: node.clientHeight,
        borders,
        elevationLevel: elevationMatch ? Number(elevationMatch[1]) : null,
        noiseOpacity:
          hasNoise && noiseStyle.content !== "none"
            ? Number.parseFloat(noiseStyle.opacity || "0")
            : null,
        specularAlpha:
          hasSpecular && specularStyle.content !== "none"
            ? Number.parseFloat(specularStyle.opacity || "0")
            : null,
        sheenAlphas,
      };
    });
  });

export const collectLayoutIssues = (page: Page): Promise<LayoutIssue[]> =>
  page.evaluate(() => {
    const isGenuinelyHidden = (node: Element) => {
      let current: Element | null = node;
      while (current && current !== document.documentElement) {
        const style = window.getComputedStyle(current);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number(style.opacity || "1") <= 0.01 ||
          current.hasAttribute("hidden")
        ) {
          return true;
        }
        current = current.parentElement;
      }
      return false;
    };
    const activeClassTokens = (cls: string) =>
      cls
        .split(/\s+/)
        .filter(Boolean)
        .filter((token) => !token.includes(":"));
    const isSurfaceRoleClass = (cls: string) =>
      activeClassTokens(cls).some(
        (token) =>
          token === "glass" ||
          token === "optimized-glass-surface" ||
          /^glass-foundation-(?:basic|complete)$/.test(token) ||
          /^glass-(?:surface(?:[-/].*)?|(?:neutral|primary|success|warning|danger|info)-level[1-5])$/.test(
            token
          ) ||
          token === "liquid-glass-material" ||
          /^liquid-glass-[a-z0-9-]+-surface$/.test(token)
      );
    const isStorybookChrome = (node: Element) => {
      const cls = String(node.className || "");
      // Storybook chrome wins over surface detection (see top-level comment).
      if (/\bag-story-\b/.test(cls)) return true;
      if (/\bglass-sr-only\b/.test(cls)) return true;
      const tag = node.tagName.toLowerCase();
      if (tag === "a" && /skip-link|sr-only/i.test(cls)) return true;
      const style = window.getComputedStyle(node);
      const backdrop =
        style.backdropFilter || webkitBackdropFilter(style) || "none";
      if (backdrop !== "none" || isSurfaceRoleClass(cls)) {
        return false;
      }
      if (/\bglass-on-light\b/.test(cls)) return true;
      if (/\bcontrast-guard\b|\bglass-contrast-guard\b/.test(cls)) return true;
      return false;
    };
    const webkitBackdropFilter = (style: CSSStyleDeclaration) => {
      const prefixed =
        style.getPropertyValue("-webkit-backdrop-filter") ||
        (style as unknown as { webkitBackdropFilter?: string })
          .webkitBackdropFilter;
      return prefixed && prefixed !== "none"
        ? prefixed
        : style.backdropFilter || "none";
    };
    const issues: LayoutIssue[] = [];
    const documentElement = document.documentElement;
    if (documentElement.scrollWidth > documentElement.clientWidth + 2) {
      issues.push({
        type: "horizontal-overflow",
        detail: `documentElement scrollWidth=${documentElement.scrollWidth} clientWidth=${documentElement.clientWidth}`,
      });
    }

    const root = document.body;
    const isVisuallyHiddenA11yText = (node: Element) => {
      let current: Element | null = node;
      while (current && current !== root.parentElement) {
        const tokens = activeClassTokens(String(current.className || ""));
        if (tokens.includes("sr-only") || tokens.includes("glass-sr-only")) {
          return true;
        }
        const style = window.getComputedStyle(current);
        const box = current.getBoundingClientRect();
        const onePixelClip =
          box.width <= 1 &&
          box.height <= 1 &&
          ["absolute", "fixed"].includes(style.position) &&
          ["hidden", "clip"].includes(style.overflowX) &&
          ["hidden", "clip"].includes(style.overflowY) &&
          (style.clip !== "auto" ||
            style.clipPath !== "none" ||
            style.whiteSpace === "nowrap");
        if (onePixelClip) return true;
        current = current.parentElement;
      }
      return false;
    };
    const glassLike = [...root.querySelectorAll("*")].filter((node) => {
      if (isStorybookChrome(node)) return false;
      if (isGenuinelyHidden(node)) return false;
      const style = window.getComputedStyle(node);
      const box = node.getBoundingClientRect();
      if (
        box.right <= 0 ||
        box.bottom <= 0 ||
        box.left >= window.innerWidth ||
        box.top >= window.innerHeight
      ) {
        return false;
      }
      const cls = String(node.className || "");
      const backdrop =
        style.backdropFilter || webkitBackdropFilter(style) || "none";
      const isSurfaceRole = backdrop !== "none" || isSurfaceRoleClass(cls);
      if (!isSurfaceRole) return false;
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity || "1") > 0.01
      );
    });
    for (const node of glassLike) {
      const box = node.getBoundingClientRect();
      const tag = node.tagName.toLowerCase();
      const cls = String(node.className || "");
      const overflowStyle = window.getComputedStyle(node);
      const isSvgDescendant = node.closest("svg") !== null;
      // Native range controls expose the painted thumb/track through scroll
      // metrics that are a few pixels taller than the CSS content box. That
      // is UA-control geometry, not clipped recipe content; the range remains
      // in the surface/token and interactive-overlap audits.
      const isNativeRangeControl =
        node instanceof HTMLInputElement && node.type === "range";
      const isDivider =
        (tag === "div" || tag === "span") &&
        (box.width <= 2 || box.height <= 2);
      if (
        (box.width === 0 || box.height === 0) &&
        !isSvgDescendant &&
        !isDivider
      ) {
        issues.push({
          type: "zero-size-glass-surface",
          detail: `${node.tagName}.${String(node.className || "")}`.slice(
            0,
            160
          ),
        });
      }
      if (
        node.scrollWidth > node.clientWidth + 2 &&
        overflowStyle.overflowX !== "auto" &&
        overflowStyle.overflowX !== "scroll" &&
        !isSvgDescendant &&
        !/glass-sr-only/.test(cls)
      ) {
        issues.push({
          type: "glass-surface-overflow",
          detail: `${node.tagName}.${String(node.className || "")}`.slice(
            0,
            160
          ),
        });
      }
      if (
        node.scrollHeight > node.clientHeight + 2 &&
        overflowStyle.overflowY !== "auto" &&
        overflowStyle.overflowY !== "scroll" &&
        !isSvgDescendant &&
        !isNativeRangeControl &&
        !/glass-sr-only/.test(cls)
      ) {
        issues.push({
          type: "glass-surface-vertical-clipping",
          detail: `${node.tagName}.${String(node.className || "")}`.slice(
            0,
            160
          ),
        });
      }
    }

    const textBearing = [...root.querySelectorAll("*")].filter((node) => {
      if (isStorybookChrome(node) || isGenuinelyHidden(node)) return false;
      if (isVisuallyHiddenA11yText(node)) return false;
      const hasDirectText = [...node.childNodes].some(
        (child) =>
          child.nodeType === Node.TEXT_NODE &&
          Boolean(child.textContent?.trim())
      );
      return (
        hasDirectText ||
        (node instanceof HTMLInputElement && node.type !== "range") ||
        node instanceof HTMLTextAreaElement
      );
    });
    for (const node of textBearing) {
      const box = node.getBoundingClientRect();
      if (box.width <= 0 || box.height <= 0) continue;
      const style = window.getComputedStyle(node);
      const clippedX = node.scrollWidth > node.clientWidth + 2;
      const clippedY = node.scrollHeight > node.clientHeight + 2;
      const parsedLineClamp = Number.parseInt(
        style.getPropertyValue("-webkit-line-clamp").trim(),
        10
      );
      // Chromium returns the keyword `none` for ordinary text. parseInt(none)
      // is NaN; treating NaN as a positive clamp made every text node fail.
      const lineClamp =
        Number.isFinite(parsedLineClamp) && parsedLineClamp > 0
          ? parsedLineClamp
          : 0;
      let lineClampTruncated = false;
      if (lineClamp > 0 && node instanceof HTMLElement) {
        const clone = node.cloneNode(true) as HTMLElement;
        clone.style.cssText += [
          "position:fixed!important",
          "left:-10000px!important",
          "top:0!important",
          "visibility:hidden!important",
          "pointer-events:none!important",
          `width:${box.width}px!important`,
          "height:auto!important",
          "max-height:none!important",
          "overflow:visible!important",
          "-webkit-line-clamp:unset!important",
        ].join(";");
        document.body.appendChild(clone);
        lineClampTruncated =
          clone.scrollHeight > node.clientHeight + 2 ||
          clone.scrollWidth > node.clientWidth + 2;
        clone.remove();
      }
      let ancestor: Element | null = node;
      let insideIntendedScrollViewport = false;
      let clippedByAncestor = false;
      while (ancestor && ancestor !== root.parentElement) {
        const ancestorStyle = window.getComputedStyle(ancestor);
        if (
          ["auto", "scroll"].includes(ancestorStyle.overflowX) ||
          ["auto", "scroll"].includes(ancestorStyle.overflowY)
        ) {
          insideIntendedScrollViewport = true;
          break;
        }
        if (ancestor !== node) {
          const ancestorBox = ancestor.getBoundingClientRect();
          const clipsX = ["hidden", "clip"].includes(ancestorStyle.overflowX);
          const clipsY = ["hidden", "clip"].includes(ancestorStyle.overflowY);
          if (
            (clipsX &&
              (box.left < ancestorBox.left - 2 ||
                box.right > ancestorBox.right + 2)) ||
            (clipsY &&
              (box.top < ancestorBox.top - 2 ||
                box.bottom > ancestorBox.bottom + 2))
          ) {
            clippedByAncestor = true;
          }
        }
        ancestor = ancestor.parentElement;
      }
      // A line-clamp declaration alone is not evidence of truncation. Require
      // measured scroll overflow beyond the 2px tolerance, or geometry that
      // actually crosses a clipping ancestor.
      if (
        !insideIntendedScrollViewport &&
        (clippedX || clippedY || clippedByAncestor || lineClampTruncated)
      ) {
        issues.push({
          type: "text-truncation",
          detail: `${node.tagName}.${String(node.className || "").slice(0, 120)} scroll=${node.scrollWidth}x${node.scrollHeight} client=${node.clientWidth}x${node.clientHeight} lineClamp=${lineClamp} lineClampTruncated=${lineClampTruncated} clippedByAncestor=${clippedByAncestor}`,
        });
      }
    }

    const interactive = [
      ...root.querySelectorAll(
        'button, [href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])'
      ),
    ]
      .map((node) => {
        const box = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        return { node, box, style };
      })
      .filter(({ node, box, style }) => {
        if (box.width <= 0 || box.height <= 0) return false;
        if (isGenuinelyHidden(node)) return false;
        if (style.pointerEvents === "none") return false;
        if (node instanceof HTMLInputElement && node.type === "hidden")
          return false;
        if (
          node.matches(":disabled") ||
          node.getAttribute("aria-disabled") === "true"
        ) {
          return false;
        }
        // Responsive/off-canvas controls are intentionally outside the active
        // viewport and must not create phantom overlap findings.
        return !(
          box.right <= 0 ||
          box.bottom <= 0 ||
          box.left >= window.innerWidth ||
          box.top >= window.innerHeight
        );
      });
    const describeNode = (node: Element) => {
      const id = node.id ? `#${node.id}` : "";
      const cls = String(node.className || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 4)
        .join(".");
      const role = node.getAttribute("role");
      const name = node.getAttribute("aria-label") || node.getAttribute("name");
      return `${node.tagName.toLowerCase()}${id}${cls ? `.${cls}` : ""}${role ? `[role=${role}]` : ""}${name ? `[name=${name}]` : ""}`.slice(
        0,
        180
      );
    };
    for (let i = 0; i < interactive.length; i += 1) {
      for (let j = i + 1; j < interactive.length; j += 1) {
        const nodeA = interactive[i]!.node;
        const nodeB = interactive[j]!.node;
        // Composite controls often contain a focusable implementation detail.
        // Only independent hit targets can constitute a literal collision.
        if (nodeA.contains(nodeB) || nodeB.contains(nodeA)) continue;
        const a = interactive[i]!.box;
        const b = interactive[j]!.box;
        const overlapX = Math.max(
          0,
          Math.min(a.right, b.right) - Math.max(a.left, b.left)
        );
        const overlapY = Math.max(
          0,
          Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
        );
        if (overlapX > 2 && overlapY > 2) {
          issues.push({
            type: "interactive-overlap",
            detail:
              `${nodeA.tagName}.${String(nodeA.className || "")}`.slice(0, 90) +
              ` <-> ${nodeB.tagName}.${String(nodeB.className || "")}`.slice(
                0,
                90
              ) +
              ` overlap=${overlapX.toFixed(1)}x${overlapY.toFixed(1)}px`,
          });
        }
      }
    }

    // Literal overlap is too weak for visual QA: controls can be separated by
    // a fraction of a pixel and still read as colliding. Resolve the painted
    // hit area around each focus target (for example a switch's full settings
    // row), then require an 8px breathing-space floor between independent,
    // vertically adjacent control regions that substantially align.
    const paintedControlBox = ({
      node,
      box,
    }: {
      node: Element;
      box: DOMRect;
    }) => {
      let current: Element | null = node;
      let chosen = { node, box };
      for (
        let depth = 0;
        current && depth < 4;
        depth += 1, current = current.parentElement
      ) {
        const candidateBox = current.getBoundingClientRect();
        const candidateStyle = window.getComputedStyle(current);
        const painted =
          candidateStyle.backgroundColor !== "rgba(0, 0, 0, 0)" ||
          candidateStyle.backgroundImage !== "none" ||
          Number.parseFloat(candidateStyle.borderTopWidth || "0") > 0;
        if (
          painted &&
          candidateBox.width <= Math.max(box.width * 8, 560) &&
          candidateBox.height <= Math.max(box.height * 3, 96)
        ) {
          chosen = { node: current, box: candidateBox };
        }
      }
      return chosen;
    };
    const controlRegions = interactive.map(paintedControlBox);
    const proximityKeys = new Set<string>();
    for (let i = 0; i < controlRegions.length; i += 1) {
      for (let j = i + 1; j < controlRegions.length; j += 1) {
        const a = controlRegions[i]!;
        const b = controlRegions[j]!;
        if (
          a.node === b.node ||
          a.node.contains(b.node) ||
          b.node.contains(a.node)
        )
          continue;
        const horizontalIntersection = Math.max(
          0,
          Math.min(a.box.right, b.box.right) - Math.max(a.box.left, b.box.left)
        );
        const alignment =
          horizontalIntersection /
          Math.max(1, Math.min(a.box.width, b.box.width));
        const verticalGap = Math.max(
          0,
          Math.max(a.box.top, b.box.top) - Math.min(a.box.bottom, b.box.bottom)
        );
        if (alignment < 0.25 || verticalGap >= 8) continue;
        const key = [describeNode(a.node), describeNode(b.node)]
          .sort()
          .join(" <-> ");
        if (proximityKeys.has(key)) continue;
        proximityKeys.add(key);
        issues.push({
          type:
            verticalGap === 0 ? "visual-control-collision" : "control-spacing",
          detail: `${key} verticalGap=${verticalGap.toFixed(1)}px required>=8px horizontalAlignment=${(alignment * 100).toFixed(0)}% geometryA=${a.box.x.toFixed(1)},${a.box.y.toFixed(1)},${a.box.width.toFixed(1)}x${a.box.height.toFixed(1)} geometryB=${b.box.x.toFixed(1)},${b.box.y.toFixed(1)},${b.box.width.toFixed(1)}x${b.box.height.toFixed(1)}`,
        });
      }
    }
    return issues;
  });

export const collectTextInspections = (page: Page): Promise<TextInspection[]> =>
  page.evaluate(() => {
    const root = document.body;
    const texts: TextInspection[] = [];
    const alphaFromColor = (color: string): number | null => {
      const rgba = color.match(
        /rgba?\(\s*[\d.]+[,\s]+[\d.]+[,\s]+[\d.]+(?:[,\s/]+([\d.]+%?))?\s*\)/
      );
      if (rgba) {
        if (rgba[1] === undefined) return 1;
        return rgba[1].endsWith("%")
          ? Number.parseFloat(rgba[1]) / 100
          : Number.parseFloat(rgba[1]);
      }
      const modern = color.match(
        /color\(\s*(?:srgb|display-p3|srgb-linear)\s+[\d.]+%?\s+[\d.]+%?\s+[\d.]+%?(?:\s*\/\s*([\d.]+%?))?\s*\)/
      );
      if (!modern) return null;
      if (modern[1] === undefined) return 1;
      return modern[1].endsWith("%")
        ? Number.parseFloat(modern[1]) / 100
        : Number.parseFloat(modern[1]);
    };
    const effectiveOpacity = (element: Element): number => {
      let opacity = 1;
      let current: Element | null = element;
      while (current && current !== document.documentElement) {
        const parsed = Number.parseFloat(
          window.getComputedStyle(current).opacity || "1"
        );
        if (Number.isFinite(parsed)) opacity *= parsed;
        current = current.parentElement;
      }
      return opacity;
    };
    type Rgba = { r: number; g: number; b: number; a: number };
    const rgba = (value: string): Rgba | null => {
      const match = value.match(
        /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/
      );
      if (!match) return null;
      const alpha =
        match[4] === undefined
          ? 1
          : match[4].endsWith("%")
            ? Number.parseFloat(match[4]) / 100
            : Number.parseFloat(match[4]);
      return {
        r: Number(match[1]),
        g: Number(match[2]),
        b: Number(match[3]),
        a: alpha,
      };
    };
    const composite = (front: Rgba, back: Rgba): Rgba => {
      const a = front.a + back.a * (1 - front.a);
      if (a <= 0) return { r: 255, g: 255, b: 255, a: 1 };
      return {
        r: (front.r * front.a + back.r * back.a * (1 - front.a)) / a,
        g: (front.g * front.a + back.g * back.a * (1 - front.a)) / a,
        b: (front.b * front.a + back.b * back.a * (1 - front.a)) / a,
        a,
      };
    };
    const localBackdrop = (element: Element): Rgba => {
      const layers: Rgba[] = [];
      let current: Element | null = element.parentElement;
      while (current) {
        const parsed = rgba(window.getComputedStyle(current).backgroundColor);
        if (parsed && parsed.a > 0) layers.push(parsed);
        current = current.parentElement;
      }
      let result: Rgba = { r: 255, g: 255, b: 255, a: 1 };
      for (let index = layers.length - 1; index >= 0; index -= 1) {
        result = composite(layers[index]!, result);
      }
      return result;
    };
    const channelLuminance = (channel: number) => {
      const normalized = channel / 255;
      return normalized <= 0.04045
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    };
    const luminance = (color: Rgba) =>
      0.2126 * channelLuminance(color.r) +
      0.7152 * channelLuminance(color.g) +
      0.0722 * channelLuminance(color.b);
    const contrastRatio = (a: Rgba, b: Rgba) => {
      const light = Math.max(luminance(a), luminance(b));
      const dark = Math.min(luminance(a), luminance(b));
      return (light + 0.05) / (dark + 0.05);
    };
    const colorString = (color: Rgba) =>
      `rgba(${color.r.toFixed(1)},${color.g.toFixed(1)},${color.b.toFixed(1)},${color.a.toFixed(3)})`;
    const textRole = (element: Element): TextInspection["role"] => {
      const declared = element
        .closest("[data-glass-text-role]")
        ?.getAttribute("data-glass-text-role");
      if (
        declared === "primary" ||
        declared === "secondary" ||
        declared === "tertiary"
      ) {
        return declared;
      }
      let current: Element | null = element;
      while (current && current !== document.body.parentElement) {
        const tokens = String(current.className || "")
          .split(/\s+/)
          .filter((token) => token && !token.includes(":"));
        if (tokens.some((token) => /(?:^|-)text-primary(?:-|\/|$)/.test(token)))
          return "primary";
        if (
          tokens.some((token) =>
            /(?:^|-)text-(?:secondary|muted)(?:-|\/|$)/.test(token)
          )
        )
          return "secondary";
        if (
          tokens.some((token) =>
            /(?:^|-)text-(?:tertiary|disabled|subtle)(?:-|\/|$)/.test(token)
          )
        )
          return "tertiary";
        current = current.parentElement;
      }
      return "unclassified";
    };
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node: Node | null = walker.nextNode();
    while (node) {
      const text = node.textContent?.trim() || "";
      if (text.length === 0) {
        node = walker.nextNode();
        continue;
      }
      const parent = node.parentElement;
      if (!parent) {
        node = walker.nextNode();
        continue;
      }
      const style = window.getComputedStyle(parent);
      const box = parent.getBoundingClientRect();
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        parent.closest("[hidden]")
      ) {
        node = walker.nextNode();
        continue;
      }
      if (box.width === 0 || box.height === 0) {
        node = walker.nextNode();
        continue;
      }
      if (
        box.right <= 0 ||
        box.bottom <= 0 ||
        box.left >= window.innerWidth ||
        box.top >= window.innerHeight
      ) {
        node = walker.nextNode();
        continue;
      }
      const alpha = alphaFromColor(style.color);
      if (alpha !== null) {
        const effectiveAlpha = alpha * effectiveOpacity(parent);
        if (effectiveAlpha < 0.5) {
          // Overlay editor pattern (e.g. GlassCodeEditor): the textarea text is
          // intentionally transparent and a syntactically highlighted <pre><code>
          // painted directly underneath is the visible text layer. Only treat the
          // transparent node as covered when a visible text element overlaps it.
          const parentBox = parent.getBoundingClientRect();
          // The textarea cannot contain the <pre>; search the whole audit root so
          // a sibling/ancestor layer is found, then require a real box overlap.
          const replacement = [...root.querySelectorAll("pre, pre code")].some(
            (candidate) => {
              if (!(candidate instanceof HTMLElement)) return false;
              const candidateStyle = window.getComputedStyle(candidate);
              const candidateAlpha = alphaFromColor(candidateStyle.color);
              if (
                candidateAlpha === null ||
                candidateAlpha * effectiveOpacity(candidate) < 0.9
              )
                return false;
              if (
                candidateStyle.display === "none" ||
                candidateStyle.visibility === "hidden"
              )
                return false;
              const candidateBox = candidate.getBoundingClientRect();
              const overlapX = Math.max(
                0,
                Math.min(parentBox.right, candidateBox.right) -
                  Math.max(parentBox.left, candidateBox.left)
              );
              const overlapY = Math.max(
                0,
                Math.min(parentBox.bottom, candidateBox.bottom) -
                  Math.max(parentBox.top, candidateBox.top)
              );
              return overlapX > 4 && overlapY > 4;
            }
          );
          if (replacement) {
            node = walker.nextNode();
            continue;
          }
        }
        const foreground = rgba(style.color);
        const backdrop = localBackdrop(parent);
        const effectiveForeground = foreground
          ? composite(
              { ...foreground, a: foreground.a * effectiveOpacity(parent) },
              backdrop
            )
          : null;
        texts.push({
          selector: parent.tagName.toLowerCase(),
          className: String(parent.className || "").slice(0, 220),
          role: textRole(parent),
          colorAlpha: alpha,
          effectiveAlpha,
          foregroundColor: style.color,
          localBackdropColor: colorString(backdrop),
          contrastRatio: effectiveForeground
            ? contrastRatio(effectiveForeground, backdrop)
            : null,
          fontSize: Number.parseFloat(style.fontSize || "0"),
          fontWeight: Number.parseInt(style.fontWeight || "400", 10) || 400,
          text: text.slice(0, 120),
        });
      }
      node = walker.nextNode();
    }
    return texts;
  });

export const collectPaintInspections = (page: Page): Promise<PaintInspection[]> =>
  page.evaluate(() => {
    const colorValues = (value: string) => {
      const colors: Array<{ r: number; g: number; b: number; a: number }> = [];
      const re =
        /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/g;
      let match: RegExpExecArray | null;
      while ((match = re.exec(value))) {
        colors.push({
          r: Number(match[1]),
          g: Number(match[2]),
          b: Number(match[3]),
          a:
            match[4] === undefined
              ? 1
              : match[4].endsWith("%")
                ? Number.parseFloat(match[4]) / 100
                : Number.parseFloat(match[4]),
        });
      }
      return colors;
    };
    const interactiveSelector =
      'button, [href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])';
    const viewportArea = window.innerWidth * window.innerHeight;
    return [document.body, ...document.body.querySelectorAll("*")].flatMap(
      (node) => {
        const style = window.getComputedStyle(node);
        const box = node.getBoundingClientRect();
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number(style.opacity || "1") <= 0.01 ||
          box.width <= 1 ||
          box.height <= 1 ||
          box.right <= 0 ||
          box.bottom <= 0 ||
          box.left >= window.innerWidth ||
          box.top >= window.innerHeight
        )
          return [];
        const area =
          Math.min(box.width, window.innerWidth) *
          Math.min(box.height, window.innerHeight);
        const isCanvas = node === document.body || node.id === "storybook-root";
        const isInteractive = node.matches(interactiveSelector);
        const isLarge = !isCanvas && area >= viewportArea * 0.12;
        if (!isCanvas && !isInteractive && !isLarge) return [];
        const backgroundColor = style.backgroundColor || "rgba(0, 0, 0, 0)";
        const backgroundImage = style.backgroundImage || "none";
        const boxShadow = style.boxShadow || "none";
        const colors = colorValues(
          `${backgroundColor} ${backgroundImage} ${boxShadow}`
        ).filter((color) => color.a > 0.05);
        if (colors.length === 0) return [];
        return [
          {
            selector: node.tagName.toLowerCase(),
            className: String(node.className || "").slice(0, 220),
            paintRole: isCanvas
              ? "canvas"
              : isInteractive
                ? "interactive"
                : "large-surface",
            x: Math.round(box.x),
            y: Math.round(box.y),
            width: Math.round(box.width),
            height: Math.round(box.height),
            backgroundColor,
            backgroundImage,
            boxShadow,
            colors,
          } satisfies PaintInspection,
        ];
      }
    );
  });

export const collectPresentationIssues = (page: Page): Promise<PresentationIssue[]> =>
  page.evaluate(() => {
    const issues: PresentationIssue[] = [];
    const root = document.querySelector("#storybook-root") || document.body;
    const describe = (node: Element) => {
      const id = node.id ? `#${node.id}` : "";
      const cls = String(node.className || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 5)
        .join(".");
      return `${node.tagName.toLowerCase()}${id}${cls ? `.${cls}` : ""}`.slice(
        0,
        200
      );
    };
    const visible = (node: Element) => {
      let current: Element | null = node;
      while (current) {
        const style = window.getComputedStyle(current);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number(style.opacity || "1") <= 0.01 ||
          current.hasAttribute("hidden")
        )
          return false;
        current = current.parentElement;
      }
      const box = node.getBoundingClientRect();
      return box.width > 1 && box.height > 1;
    };
    const all = [...root.querySelectorAll("*")];
    const visibleNodes = all.filter(visible);
    const visibleBounds = visibleNodes.reduce(
      (bounds, node) => {
        const box = node.getBoundingClientRect();
        return {
          left: Math.min(bounds.left, box.left),
          top: Math.min(bounds.top, box.top),
          right: Math.max(bounds.right, box.right),
          bottom: Math.max(bounds.bottom, box.bottom),
        };
      },
      { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
    );
    const area = Number.isFinite(visibleBounds.left)
      ? Math.max(0, visibleBounds.right - visibleBounds.left) *
        Math.max(0, visibleBounds.bottom - visibleBounds.top)
      : 0;
    const viewportArea = window.innerWidth * window.innerHeight;
    const visibleText = visibleNodes
      .map((node) =>
        [...node.childNodes]
          .filter((child) => child.nodeType === Node.TEXT_NODE)
          .map((child) => child.textContent?.trim() || "")
          .join(" ")
      )
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    const meaningfulElements = visibleNodes.filter((node) =>
      node.matches(
        'button, input, select, textarea, canvas, svg, img, [role], [data-glass-surface], [class*="glass"]'
      )
    ).length;
    if (
      area < viewportArea * 0.006 ||
      (visibleText.length < 3 && meaningfulElements < 1)
    ) {
      issues.push({
        type: "blank-or-minuscule-primary-output",
        detail: `root=${describe(root)} visibleBounds=${Number.isFinite(visibleBounds.left) ? `${visibleBounds.left.toFixed(1)},${visibleBounds.top.toFixed(1)},${(visibleBounds.right - visibleBounds.left).toFixed(1)}x${(visibleBounds.bottom - visibleBounds.top).toFixed(1)}` : "none"} areaRatio=${(area / Math.max(1, viewportArea)).toFixed(4)} visibleTextChars=${visibleText.length} meaningfulElements=${meaningfulElements}`,
      });
    }

    // A primary region may be inside an intentional scroller, but its initial
    // presentation still cannot be mostly cropped or displaced offscreen.
    const primaryCandidates = [
      root,
      ...all.filter((node) =>
        node.matches(
          'main, article, section, [data-primary-output], [data-certification-component], [class*="showcase"], [class*="demo"]'
        )
      ),
    ].filter(visible);
    for (const node of primaryCandidates) {
      const box = node.getBoundingClientRect();
      const totalArea = box.width * box.height;
      if (totalArea <= 400) continue;
      const visibleWidth = Math.max(
        0,
        Math.min(box.right, window.innerWidth) - Math.max(box.left, 0)
      );
      const visibleHeight = Math.max(
        0,
        Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 0)
      );
      const visibleRatio = (visibleWidth * visibleHeight) / totalArea;
      const majorDisplacement =
        box.left < -window.innerWidth * 0.2 ||
        box.right > window.innerWidth * 1.2 ||
        box.top < -window.innerHeight * 0.2;
      const candidateStyle = window.getComputedStyle(node);
      const participatesInNormalFlow =
        candidateStyle.position !== "fixed" &&
        candidateStyle.position !== "absolute";
      const documentFlowsVertically =
        participatesInNormalFlow &&
        box.top >= -window.innerHeight * 0.05 &&
        box.left >= -1 &&
        box.right <= window.innerWidth + 1 &&
        box.bottom > window.innerHeight;
      if (
        (visibleRatio < 0.7 && !documentFlowsVertically) ||
        majorDisplacement
      ) {
        issues.push({
          type: majorDisplacement
            ? "major-responsive-offscreen-displacement"
            : "primary-output-viewport-cutoff",
          detail: `${describe(node)} geometry=${box.x.toFixed(1)},${box.y.toFixed(1)},${box.width.toFixed(1)}x${box.height.toFixed(1)} visibleRatio=${visibleRatio.toFixed(3)} viewport=${window.innerWidth}x${window.innerHeight}`,
        });
      }
    }

    const nativeControls = visibleNodes.filter((node) =>
      node.matches("button, select, input, textarea")
    );
    for (const node of nativeControls) {
      const style = window.getComputedStyle(node);
      const cls = String(node.className || "");
      const backdrop = style.backdropFilter || "none";
      const webkitBackdrop =
        style.getPropertyValue("-webkit-backdrop-filter") || "none";
      const explicitGlass =
        /glass|liquid|frost/i.test(cls) ||
        backdrop !== "none" ||
        webkitBackdrop !== "none";
      const untouchedAppearance =
        style.appearance === "auto" || node instanceof HTMLSelectElement;
      const defaultFont =
        style.fontFamily.includes("Arial") ||
        style.fontFamily.includes("Times New Roman");
      const plainOutlined =
        Number.parseFloat(style.borderTopWidth || "0") >= 1 &&
        style.boxShadow === "none" &&
        style.backgroundImage === "none" &&
        style.backdropFilter === "none";
      if (
        !explicitGlass &&
        (untouchedAppearance || (plainOutlined && defaultFont))
      ) {
        issues.push({
          type: "unfinished-native-control-presentation",
          detail: `${describe(node)} appearance=${style.appearance} fontFamily="${style.fontFamily}" background="${style.backgroundColor} ${style.backgroundImage}" border="${style.borderTopWidth} ${style.borderTopStyle} ${style.borderTopColor}" boxShadow="${style.boxShadow}"`,
        });
      }
    }

    for (const node of visibleNodes.filter(
      (candidate) => candidate instanceof HTMLCanvasElement
    )) {
      const canvas = node as HTMLCanvasElement;
      let context: CanvasRenderingContext2D | null = null;
      try {
        context = canvas.getContext("2d", { willReadFrequently: true });
      } catch {
        context = null;
      }
      if (!context || canvas.width === 0 || canvas.height === 0) continue;
      try {
        const stepX = Math.max(1, Math.floor(canvas.width / 24));
        const stepY = Math.max(1, Math.floor(canvas.height / 24));
        let painted = 0;
        let chromatic = 0;
        let darkChromatic = 0;
        let luminanceSum = 0;
        let chromaSum = 0;
        for (let y = 0; y < canvas.height; y += stepY) {
          for (let x = 0; x < canvas.width; x += stepX) {
            const [r, g, b, alphaByte] = context.getImageData(x, y, 1, 1).data as unknown as [number, number, number, number];
            if (alphaByte < 26) continue;
            painted += 1;
            const chroma = Math.max(r, g, b) - Math.min(r, g, b);
            const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            luminanceSum += luminance;
            chromaSum += chroma;
            if (chroma > 48) chromatic += 1;
            if (chroma > 28 && luminance < 95) darkChromatic += 1;
          }
        }
        const estimatedSamples =
          Math.ceil(canvas.width / stepX) * Math.ceil(canvas.height / stepY);
        const isDecorativeOverlay =
          window.getComputedStyle(canvas).pointerEvents === "none" ||
          canvas.getAttribute("aria-hidden") === "true";
        if (painted === 0 && !isDecorativeOverlay) {
          issues.push({
            type: "blank-canvas-output",
            detail: `${describe(canvas)} bitmap=${canvas.width}x${canvas.height} sampledPixels=0`,
          });
          continue;
        }
        const chromaticRatio = chromatic / painted;
        const darkRatio = darkChromatic / painted;
        const paintedCoverage = painted / Math.max(1, estimatedSamples);
        if (
          paintedCoverage > 0.15 &&
          (chromaticRatio > 0.45 || darkRatio > 0.55)
        ) {
          issues.push({
            type: "dominant-canvas-chroma-darkness",
            detail: `${describe(canvas)} bitmap=${canvas.width}x${canvas.height} sampledPixels=${painted} chromaticRatio=${chromaticRatio.toFixed(3)} darkChromaticRatio=${darkRatio.toFixed(3)} meanChroma=${(chromaSum / painted).toFixed(1)} meanLuminance=${(luminanceSum / painted).toFixed(1)}`,
          });
        }
      } catch (error) {
        issues.push({
          type: "uninspectable-canvas-output",
          detail: `${describe(canvas)} bitmap=${canvas.width}x${canvas.height} error=${error instanceof Error ? error.message : String(error)}`,
        });
      }
    }

    // If a story presents a compound dropdown/menu/select export, it must show
    // more than a closed trigger or native select. A closed constituent cannot
    // be used as evidence for the panel/list/menu surface it claims to cover.
    // Scope compound-control certification to the actual target identity. Page
    // copy frequently contains words such as "select" or "menu" without the
    // exported component itself being a compound control.
    const compoundMarker = `${document.title} ${root.getAttribute("data-certification-component") || ""} ${new URL(window.location.href).searchParams.get("id") || ""}`;
    if (/dropdown|menu|combobox|select|popover/i.test(compoundMarker)) {
      const triggerCount = visibleNodes.filter((node) =>
        node.matches('select, [role="combobox"], [aria-haspopup], button')
      ).length;
      const expanded = visibleNodes.some(
        (node) => node.getAttribute("aria-expanded") === "true"
      );
      const panel = visibleNodes.some((node) =>
        node.matches(
          '[role="menu"], [role="listbox"], [role="option"], [data-radix-popper-content-wrapper], [class*="menu-content"], [class*="dropdown-content"]'
        )
      );
      if (triggerCount > 0 && !expanded && !panel) {
        issues.push({
          type: "hidden-constituent-evidence",
          detail: `compound control is only shown closed: triggers=${triggerCount} expanded=${expanded} visiblePanel=${panel}; marker="${compoundMarker.replace(/\s+/g, " ").trim().slice(0, 180)}"`,
        });
      }
    }
    return issues;
  });
