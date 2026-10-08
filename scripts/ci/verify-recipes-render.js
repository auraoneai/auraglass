#!/usr/bin/env node

const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { execFileSync, execSync, spawn } = require("child_process");
const { packToDir } = require("./lib/npm-pack");
const { evidenceDir } = require("./lib/evidence-dir");
const { chromium } = require("@playwright/test");

const projectRoot = path.resolve(__dirname, "..", "..");
const args = process.argv.slice(2);
const skipBuild =
  args.includes("--skip-build") ||
  process.env.AURAGLASS_SKIP_BUILD === "1" ||
  process.env.SKIP_AURAGLASS_BUILD === "1" ||
  process.env.AURAGLASS_ASSUME_BUILT === "true";

const run = (command, options = {}) => {
  execSync(command, { stdio: "inherit", ...options });
};

const runWithOutput = (command, options = {}) =>
  execSync(command, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
    ...options,
  });

const writeFile = (root, relativePath, contents) => {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, "utf8");
  return filePath;
};

const waitForUrl = async (url, timeoutMs = 120000) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const ok = await new Promise((resolve) => {
      const request = http.get(url, (response) => {
        response.resume();
        resolve(response.statusCode >= 200 && response.statusCode < 500);
      });
      request.on("error", () => resolve(false));
      request.setTimeout(2000, () => {
        request.destroy();
        resolve(false);
      });
    });

    if (ok) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
};

const reserveLoopbackPort = () =>
  new Promise((resolve, reject) => {
    const probe = http.createServer();
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      if (!address || typeof address === "string") {
        probe.close(() =>
          reject(new Error("Could not reserve a recipe harness port."))
        );
        return;
      }
      const port = address.port;
      probe.close((error) => (error ? reject(error) : resolve(port)));
    });
  });

const extractExportName = (content) => {
  const match = content.match(/export function ([A-Za-z0-9_]+)/);
  if (!match) {
    throw new Error("Could not find exported recipe component name.");
  }
  return match[1];
};

const safeId = (id) => id.replace(/[^a-z0-9-]/gi, "-").toLowerCase();

const main = async () => {
  console.log("Running AuraGlass recipe render and screenshot gate...");

  if (!skipBuild) {
    run("npm run build", { cwd: projectRoot });
  } else {
    console.log("Skipping AuraGlass rebuild (skip-build flag set).");
  }

  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "auraglass-recipes-"));
  const packInfo = packToDir(projectRoot, tmpRoot);
  const tarballPath = packInfo.tarballPath;

  const appDir = path.join(tmpRoot, "recipe-app");
  fs.mkdirSync(appDir);
  const relativeTarball = path.relative(appDir, tarballPath);

  writeFile(
    appDir,
    "package.json",
    JSON.stringify(
      {
        name: "auraglass-recipe-render-smoke",
        version: "0.0.0",
        private: true,
        type: "module",
        scripts: {
          build: "vite build",
          dev: "vite --host 127.0.0.1",
        },
        dependencies: {
          "@vitejs/plugin-react": "^5.0.2",
          "aura-glass": `file:${relativeTarball}`,
          "chart.js": "^4.5.0",
          "date-fns": "^4.1.0",
          "framer-motion": "^11.18.2",
          react: "18.2.0",
          "react-chartjs-2": "^5.3.0",
          "react-dom": "18.2.0",
          "react-hook-form": "^7.54.0",
          "socket.io-client": "^4.8.3",
          typescript: "^5.3.3",
          vite: "^7.1.5",
        },
      },
      null,
      2
    )
  );
  writeFile(appDir, ".npmrc", "fund=false\naudit=false\n");
  writeFile(
    appDir,
    "index.html",
    `<div id="root"></div><script type="module" src="/src/App.tsx"></script>\n`
  );
  writeFile(
    appDir,
    "vite.config.ts",
    `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': {},
  },
});
`
  );
  writeFile(
    appDir,
    "src/styles.css",
    `body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 8%, rgba(255, 255, 255, 0.92), transparent 34%),
    radial-gradient(circle at 88% 16%, rgba(226, 228, 232, 0.32), transparent 36%),
    linear-gradient(145deg, #f5f5f3, #e9eaec);
  color: rgba(15, 23, 42, 0.92);
  font-family: Aeonik, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.recipe-page {
  display: grid;
  gap: 32px;
  padding: 32px;
}

.recipe-frame {
  min-height: 420px;
  padding: 24px;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 24px;
  box-sizing: border-box;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.42), transparent 32%),
    radial-gradient(circle at 80% 30%, rgba(218, 220, 224, 0.18), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.30), rgba(242, 242, 240, 0.18)),
    rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(24px) saturate(1.12) brightness(1.03) contrast(1.03);
  -webkit-backdrop-filter: blur(24px) saturate(1.12) brightness(1.03) contrast(1.03);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.58), 0 18px 48px rgba(71, 71, 76, 0.13);
  overflow: hidden;
}

.recipe-frame > h2 {
  margin: 0 0 16px;
  font-size: 18px;
}
`
  );

  console.log("Installing recipe smoke dependencies...");
  run("npm install --dry-run=false --prefer-offline --no-audit --no-fund", {
    cwd: appDir,
  });

  console.log("Scaffolding all recipes through the AuraGlass CLI...");
  const cliOutput = execFileSync(
    process.execPath,
    [
      path.join(projectRoot, "bin", "aura-glass.cjs"),
      "add",
      "all",
      "--cwd",
      appDir,
      "--out",
      "src/recipes",
      "--force",
      "--json",
    ],
    { cwd: projectRoot, encoding: "utf8" }
  );
  const scaffoldResults = JSON.parse(cliOutput);

  const renderedRecipes = scaffoldResults.map((result) => {
    const written = result.written[0];
    const absolutePath = path.join(appDir, written.path);
    const content = fs.readFileSync(absolutePath, "utf8");
    const exportName = extractExportName(content);
    const importPath = `./recipes/${path.basename(written.path, ".tsx")}`;
    return {
      id: result.recipe,
      file: written.path,
      exportName,
      importPath,
    };
  });

  const imports = renderedRecipes
    .map(
      (recipe, index) =>
        `import { ${recipe.exportName} as Recipe${index} } from '${recipe.importPath}';`
    )
    .join("\n");
  const entries = renderedRecipes
    .map(
      (recipe, index) =>
        `{ id: ${JSON.stringify(recipe.id)}, title: ${JSON.stringify(recipe.exportName)}, Component: Recipe${index} }`
    )
    .join(",\n  ");

  writeFile(
    appDir,
    "src/App.tsx",
    `import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
${imports}

const recipes = [
  ${entries}
];

function App() {
  const selectedId = new URLSearchParams(window.location.search).get('recipe');
  const selectedRecipes = selectedId
    ? recipes.filter(({ id }) => id === selectedId)
    : recipes;
  return (
    <main className="recipe-page">
      {selectedRecipes.map(({ id, title, Component }) => (
        <section className="recipe-frame" data-recipe-id={id} key={id}>
          <h2>{title}</h2>
          <Component />
        </section>
      ))}
    </main>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Missing root element');
createRoot(root).render(<App />);
`
  );

  console.log("Building generated recipe app...");
  run("npm run build", { cwd: appDir });

  // Use a fresh port for every packaged-app run. A fixed port can connect a
  // new verifier to an orphaned Vite process from an earlier interrupted run,
  // silently recapturing stale DOM/CSS instead of the package built above.
  const port = await reserveLoopbackPort();
  const server = spawn(
    "npm",
    ["run", "dev", "--", "--port", String(port), "--strictPort"],
    {
      cwd: appDir,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, FORCE_COLOR: "0" },
    }
  );
  let serverLog = "";
  server.stdout.on("data", (chunk) => {
    serverLog += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    serverLog += chunk.toString();
  });

  try {
    await waitForUrl(`http://127.0.0.1:${port}/`);

    const reportDir = evidenceDir("3.3-release");
    const screenshotDir = path.join(reportDir, "recipe-screenshots");
    fs.rmSync(screenshotDir, { recursive: true, force: true });
    fs.mkdirSync(screenshotDir, { recursive: true });

    const browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1100 },
    });
    let pageErrors = [];
    let consoleErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });

    const screenshots = [];
    const visualEvidenceRoot = evidenceDir("audit/visual-all");
    const visualViewports = [
      { name: "desktop", width: 1440, height: 900 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "mobile", width: 390, height: 844 },
    ];
    for (const recipe of renderedRecipes) {
      pageErrors = [];
      consoleErrors = [];
      await page.goto(
        `http://127.0.0.1:${port}/?recipe=${encodeURIComponent(recipe.id)}`,
        { waitUntil: "networkidle" }
      );
      const locator = page.locator(`[data-recipe-id="${recipe.id}"]`);
      const screenshotPath = path.join(
        screenshotDir,
        `${safeId(recipe.id)}.png`
      );
      await page.setViewportSize({ width: 1440, height: 1100 });
      await locator.waitFor({ state: "visible", timeout: 30000 });
      await locator.scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
      const box = await locator.boundingBox();
      if (!box)
        throw new Error(
          `Could not resolve screenshot box for recipe ${recipe.id}`
        );
      await page.screenshot({
        path: screenshotPath,
        animations: "disabled",
        clip: {
          x: Math.max(0, box.x),
          y: Math.max(0, box.y),
          width: Math.max(1, box.width),
          height: Math.max(1, box.height),
        },
      });
      screenshots.push({
        id: recipe.id,
        file: path.relative(projectRoot, screenshotPath),
      });

      // Capture a viewport-sized visual proof at all three certification sizes.
      // Each recipe is isolated in the generated app so the evidence is an
      // actual render, not a resized copy of the historical desktop image.
      const evidenceDir = path.join(
        visualEvidenceRoot,
        `recipe-${safeId(recipe.id)}`
      );
      fs.mkdirSync(evidenceDir, { recursive: true });
      for (const viewport of visualViewports) {
        pageErrors = [];
        consoleErrors = [];
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await locator.scrollIntoViewIfNeeded();
        await page.waitForTimeout(120);
        await page.screenshot({
          path: path.join(evidenceDir, `${viewport.name}.png`),
          animations: "disabled",
          fullPage: false,
        });
        const computed = await locator.evaluate((root, viewportInfo) => {
          const activeClassTokens = (className) =>
            String(className || "")
              .split(/\s+/)
              .filter(Boolean)
              .filter((token) => !token.includes(":"));
          const isSurfaceRoleClass = (className) =>
            activeClassTokens(className).some(
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
          const webkitFilter = (style) => {
            const prefixed =
              style.getPropertyValue("-webkit-backdrop-filter") ||
              style.webkitBackdropFilter;
            return prefixed && prefixed !== "none"
              ? prefixed
              : style.backdropFilter || "none";
          };
          const hasAuthoredProperty = (node, property) => {
            if (
              node instanceof HTMLElement &&
              node.style.getPropertyValue(property)
            )
              return true;
            for (const sheet of [...document.styleSheets]) {
              let rules;
              try {
                rules = sheet.cssRules;
              } catch {
                continue;
              }
              const visit = (list) => {
                for (const rule of [...list]) {
                  if (rule instanceof CSSStyleRule) {
                    if (!rule.style.getPropertyValue(property)) continue;
                    try {
                      if (node.matches(rule.selectorText)) return true;
                    } catch {
                      // Ignore selectors Chromium cannot query directly.
                    }
                  } else if ("cssRules" in rule && visit(rule.cssRules)) {
                    return true;
                  }
                }
                return false;
              };
              if (visit(rules)) return true;
            }
            return false;
          };
          const isGenuinelyHidden = (node) => {
            let current = node;
            while (current && current !== document.documentElement) {
              const style = window.getComputedStyle(current);
              if (
                style.display === "none" ||
                style.visibility === "hidden" ||
                Number(style.opacity || "1") <= 0.01
              ) {
                return true;
              }
              if (current.hidden) return true;
              current = current.parentElement;
            }
            return false;
          };
          const alphaFromColor = (color) => {
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
          const effectiveOpacity = (element) => {
            let opacity = 1;
            let current = element;
            while (current && current !== document.documentElement) {
              const parsed = Number.parseFloat(
                window.getComputedStyle(current).opacity || "1"
              );
              if (Number.isFinite(parsed)) opacity *= parsed;
              current = current.parentElement;
            }
            return opacity;
          };
          const rgba = (value) => {
            const match = value.match(
              /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/
            );
            if (!match) return null;
            return {
              r: Number(match[1]),
              g: Number(match[2]),
              b: Number(match[3]),
              a:
                match[4] === undefined
                  ? 1
                  : match[4].endsWith("%")
                    ? Number.parseFloat(match[4]) / 100
                    : Number.parseFloat(match[4]),
            };
          };
          const composite = (front, back) => {
            const a = front.a + back.a * (1 - front.a);
            if (a <= 0) return { r: 255, g: 255, b: 255, a: 1 };
            return {
              r: (front.r * front.a + back.r * back.a * (1 - front.a)) / a,
              g: (front.g * front.a + back.g * back.a * (1 - front.a)) / a,
              b: (front.b * front.a + back.b * back.a * (1 - front.a)) / a,
              a,
            };
          };
          const localBackdrop = (element) => {
            const layers = [];
            for (
              let current = element.parentElement;
              current;
              current = current.parentElement
            ) {
              const parsed = rgba(
                window.getComputedStyle(current).backgroundColor
              );
              if (parsed && parsed.a > 0) layers.push(parsed);
            }
            let result = { r: 255, g: 255, b: 255, a: 1 };
            for (let index = layers.length - 1; index >= 0; index -= 1)
              result = composite(layers[index], result);
            return result;
          };
          const channelLuminance = (channel) => {
            const normalized = channel / 255;
            return normalized <= 0.04045
              ? normalized / 12.92
              : ((normalized + 0.055) / 1.055) ** 2.4;
          };
          const luminance = (color) =>
            0.2126 * channelLuminance(color.r) +
            0.7152 * channelLuminance(color.g) +
            0.0722 * channelLuminance(color.b);
          const contrastRatio = (first, second) =>
            (Math.max(luminance(first), luminance(second)) + 0.05) /
            (Math.min(luminance(first), luminance(second)) + 0.05);
          const colorString = (color) =>
            `rgba(${color.r.toFixed(1)},${color.g.toFixed(1)},${color.b.toFixed(1)},${color.a.toFixed(3)})`;
          const textRole = (element) => {
            const declared = element
              .closest("[data-glass-text-role]")
              ?.getAttribute("data-glass-text-role");
            if (["primary", "secondary", "tertiary"].includes(declared))
              return declared;
            let current = element;
            while (current && current !== document.body.parentElement) {
              const tokens = activeClassTokens(current.className);
              if (
                tokens.some((token) =>
                  /(?:^|-)text-primary(?:-|\/|$)/.test(token)
                )
              )
                return "primary";
              if (
                tokens.some((token) =>
                  /(?:^|-)text-(?:secondary|muted)(?:-|\/|$)/.test(token)
                )
              )
                return "secondary";
              if (
                tokens.some((token) =>
                  /(?:^|-)text-(?:tertiary|disabled|subtle)(?:-|\/|$)/.test(
                    token
                  )
                )
              )
                return "tertiary";
              current = current.parentElement;
            }
            return "unclassified";
          };

          // Scan the body, not just the recipe frame: dialogs, menus, action
          // sheets, and popovers may be portalled outside the React root.
          const nodes = [...document.body.querySelectorAll("*")];
          const candidateSurfaces = nodes.filter((node) => {
            // The harness provides neutral scenery only; it is deliberately
            // excluded so a recipe with no real material surface fails.
            if (
              node.classList.contains("recipe-frame") ||
              node.classList.contains("recipe-page")
            )
              return false;
            if (isGenuinelyHidden(node)) return false;
            const style = window.getComputedStyle(node);
            const rect = node.getBoundingClientRect();
            if (
              rect.right <= 0 ||
              rect.bottom <= 0 ||
              rect.left >= window.innerWidth ||
              rect.top >= window.innerHeight
            )
              return false;
            const backdropFilter = style.backdropFilter || "none";
            return (
              backdropFilter !== "none" ||
              webkitFilter(style) !== "none" ||
              isSurfaceRoleClass(node.className)
            );
          });
          const styles = [];
          const layoutIssues = [];
          for (const node of candidateSurfaces) {
            if (isGenuinelyHidden(node)) continue;
            const style = window.getComputedStyle(node);
            const rect = node.getBoundingClientRect();
            if (rect.width <= 1 || rect.height <= 1) continue;
            const className = String(node.className || "");
            const tokens = activeClassTokens(className);
            const backdropFilter = style.backdropFilter || "none";
            const webkitBackdropFilter = webkitFilter(style);
            const hasGlassFilter =
              backdropFilter !== "none" || webkitBackdropFilter !== "none";
            const liquidSurface = tokens.some(
              (token) =>
                token === "liquid-glass-material" ||
                /^liquid-glass-[a-z0-9-]+-surface$/.test(token)
            );
            const elevationMatch = tokens
              .join(" ")
              .match(
                /(?:^|\s)glass-(?:neutral|primary|success|warning|danger|info)-level([1-5])(?:\s|$)/
              );
            const noiseStyle = window.getComputedStyle(node, "::before");
            const specularStyle = window.getComputedStyle(node, "::after");
            const sheenAlphas = [
              ...node.querySelectorAll(":scope > .liquid-glass-sheen"),
            ].flatMap((sheen) => {
              const sheenStyle = window.getComputedStyle(sheen);
              const opacity = Number.parseFloat(sheenStyle.opacity || "1");
              const values = [];
              const re =
                /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/g;
              let match;
              const colors = `${sheenStyle.backgroundColor} ${sheenStyle.backgroundImage}`;
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
            const backgroundImage = style.backgroundImage || "none";
            styles.push({
              selector: node.tagName.toLowerCase(),
              className,
              inputType: node instanceof HTMLInputElement ? node.type : null,
              surfaceKind:
                liquidSurface && !hasGlassFilter
                  ? "liquid"
                  : hasGlassFilter
                    ? "backdrop"
                    : "glass-surface",
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
              backdropFilter,
              webkitBackdropFilter,
              backdropFilterAuthored: hasAuthoredProperty(
                node,
                "backdrop-filter"
              ),
              webkitBackdropFilterAuthored: hasAuthoredProperty(
                node,
                "-webkit-backdrop-filter"
              ),
              backgroundColor: style.backgroundColor,
              backgroundImage,
              backgroundImages:
                backgroundImage === "none" ? [] : [backgroundImage],
              borderTopColor: style.borderTopColor,
              borderWidth: style.borderTopWidth,
              borders: ["Top", "Right", "Bottom", "Left"].map((side) => ({
                color: style[`border${side}Color`],
                width: style[`border${side}Width`],
              })),
              boxShadow: style.boxShadow,
              color: style.color,
              overflowX: style.overflowX,
              overflowY: style.overflowY,
              scrollWidth: node.scrollWidth,
              clientWidth: node.clientWidth,
              scrollHeight: node.scrollHeight,
              clientHeight: node.clientHeight,
              elevationLevel: elevationMatch ? Number(elevationMatch[1]) : null,
              noiseOpacity:
                tokens.includes("glass-overlay-noise") &&
                noiseStyle.content !== "none"
                  ? Number.parseFloat(noiseStyle.opacity || "0")
                  : null,
              specularAlpha:
                tokens.includes("glass-overlay-specular") &&
                specularStyle.content !== "none"
                  ? Number.parseFloat(specularStyle.opacity || "0")
                  : null,
              sheenAlphas,
            });
          }

          if (
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth + 2
          ) {
            layoutIssues.push({
              type: "horizontal-overflow",
              detail: `documentElement scrollWidth=${document.documentElement.scrollWidth} clientWidth=${document.documentElement.clientWidth}`,
            });
          }
          for (const node of candidateSurfaces) {
            if (isGenuinelyHidden(node)) continue;
            const rect = node.getBoundingClientRect();
            const style = window.getComputedStyle(node);
            const isSvgDescendant = node.closest("svg") !== null;
            // Chromium's native range thumb/track contributes intrinsic
            // scroll height beyond the styled track box. Keep the range in
            // material and interaction checks, but do not call those native
            // control pixels clipped recipe content.
            const isNativeRangeControl =
              node instanceof HTMLInputElement && node.type === "range";
            const isDivider =
              ["DIV", "SPAN"].includes(node.tagName) &&
              (rect.width <= 2 || rect.height <= 2);
            if (
              (rect.width <= 0 || rect.height <= 0) &&
              !isSvgDescendant &&
              !isDivider
            ) {
              layoutIssues.push({
                type: "recipe-surface-zero-size",
                detail: `${node.tagName}.${String(node.className || "").slice(0, 160)}`,
              });
            }
            if (
              node.scrollWidth > node.clientWidth + 2 &&
              !["auto", "scroll"].includes(style.overflowX) &&
              !isSvgDescendant
            ) {
              layoutIssues.push({
                type: "recipe-surface-overflow",
                detail: `${node.tagName}.${String(node.className || "").slice(0, 160)} scrollWidth=${node.scrollWidth} clientWidth=${node.clientWidth}`,
              });
            }
            if (
              node.scrollHeight > node.clientHeight + 2 &&
              !["auto", "scroll"].includes(style.overflowY) &&
              !isSvgDescendant &&
              !isNativeRangeControl
            ) {
              layoutIssues.push({
                type: "recipe-surface-vertical-clipping",
                detail: `${node.tagName}.${String(node.className || "").slice(0, 160)} scrollHeight=${node.scrollHeight} clientHeight=${node.clientHeight}`,
              });
            }
          }

          const isVisuallyHiddenA11yText = (node) => {
            let current = node;
            while (current && current !== document.body.parentElement) {
              const tokens = activeClassTokens(current.className);
              if (
                tokens.includes("sr-only") ||
                tokens.includes("glass-sr-only")
              )
                return true;
              const style = window.getComputedStyle(current);
              const rect = current.getBoundingClientRect();
              const onePixelClip =
                rect.width <= 1 &&
                rect.height <= 1 &&
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
          const textBearing = nodes.filter((node) => {
            if (isGenuinelyHidden(node)) return false;
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
            const rect = node.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) continue;
            const style = window.getComputedStyle(node);
            const clippedX = node.scrollWidth > node.clientWidth + 2;
            const clippedY = node.scrollHeight > node.clientHeight + 2;
            const parsedLineClamp = Number.parseInt(
              style.getPropertyValue("-webkit-line-clamp").trim(),
              10
            );
            const lineClamp =
              Number.isFinite(parsedLineClamp) && parsedLineClamp > 0
                ? parsedLineClamp
                : 0;
            let lineClampTruncated = false;
            if (lineClamp > 0 && node instanceof HTMLElement) {
              const clone = node.cloneNode(true);
              clone.style.cssText += [
                "position:fixed!important",
                "left:-10000px!important",
                "top:0!important",
                "visibility:hidden!important",
                "pointer-events:none!important",
                `width:${rect.width}px!important`,
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
            let ancestor = node;
            let insideIntendedScrollViewport = false;
            let clippedByAncestor = false;
            while (ancestor && ancestor !== document.body.parentElement) {
              const ancestorStyle = window.getComputedStyle(ancestor);
              if (
                ["auto", "scroll"].includes(ancestorStyle.overflowX) ||
                ["auto", "scroll"].includes(ancestorStyle.overflowY)
              ) {
                insideIntendedScrollViewport = true;
                break;
              }
              if (ancestor !== node) {
                const ancestorRect = ancestor.getBoundingClientRect();
                const clipsX = ["hidden", "clip"].includes(
                  ancestorStyle.overflowX
                );
                const clipsY = ["hidden", "clip"].includes(
                  ancestorStyle.overflowY
                );
                if (
                  (clipsX &&
                    (rect.left < ancestorRect.left - 2 ||
                      rect.right > ancestorRect.right + 2)) ||
                  (clipsY &&
                    (rect.top < ancestorRect.top - 2 ||
                      rect.bottom > ancestorRect.bottom + 2))
                ) {
                  clippedByAncestor = true;
                }
              }
              ancestor = ancestor.parentElement;
            }
            if (
              !insideIntendedScrollViewport &&
              (clippedX || clippedY || clippedByAncestor || lineClampTruncated)
            ) {
              layoutIssues.push({
                type: "text-truncation",
                detail: `${node.tagName}.${String(node.className || "").slice(0, 120)} scroll=${node.scrollWidth}x${node.scrollHeight} client=${node.clientWidth}x${node.clientHeight} lineClamp=${lineClamp} lineClampTruncated=${lineClampTruncated} clippedByAncestor=${clippedByAncestor}`,
              });
            }
          }

          const interactive = [
            ...document.body.querySelectorAll(
              'button, [href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])'
            ),
          ]
            .map((node) => ({
              node,
              box: node.getBoundingClientRect(),
              style: window.getComputedStyle(node),
            }))
            .filter(
              ({ node, box, style }) =>
                !isGenuinelyHidden(node) &&
                style.pointerEvents !== "none" &&
                !(node instanceof HTMLInputElement && node.type === "hidden") &&
                !node.matches(":disabled") &&
                node.getAttribute("aria-disabled") !== "true" &&
                box.width > 0 &&
                box.height > 0 &&
                box.right > 0 &&
                box.bottom > 0 &&
                box.left < window.innerWidth &&
                box.top < window.innerHeight
            );
          for (let first = 0; first < interactive.length; first += 1) {
            for (
              let second = first + 1;
              second < interactive.length;
              second += 1
            ) {
              const nodeA = interactive[first].node;
              const nodeB = interactive[second].node;
              if (nodeA.contains(nodeB) || nodeB.contains(nodeA)) continue;
              const a = interactive[first].box;
              const b = interactive[second].box;
              const overlapX = Math.max(
                0,
                Math.min(a.right, b.right) - Math.max(a.left, b.left)
              );
              const overlapY = Math.max(
                0,
                Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
              );
              if (overlapX > 2 && overlapY > 2) {
                layoutIssues.push({
                  type: "interactive-overlap",
                  detail: `${nodeA.tagName}.${String(nodeA.className || "").slice(0, 80)} <-> ${nodeB.tagName}.${String(nodeB.className || "").slice(0, 80)} overlap=${overlapX.toFixed(1)}x${overlapY.toFixed(1)}px`,
                });
              }
            }
          }

          const describeNode = (node) =>
            `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ""}.${String(
              node.className || ""
            )
              .trim()
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 4)
              .join(".")}`.slice(0, 180);
          const controlRegions = interactive.map(({ node, box }) => {
            let chosen = { node, box };
            let current = node;
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
              )
                chosen = { node: current, box: candidateBox };
            }
            return chosen;
          });
          const proximityKeys = new Set();
          for (let first = 0; first < controlRegions.length; first += 1) {
            for (
              let second = first + 1;
              second < controlRegions.length;
              second += 1
            ) {
              const a = controlRegions[first];
              const b = controlRegions[second];
              if (
                a.node === b.node ||
                a.node.contains(b.node) ||
                b.node.contains(a.node)
              )
                continue;
              const overlapX = Math.max(
                0,
                Math.min(a.box.right, b.box.right) -
                  Math.max(a.box.left, b.box.left)
              );
              const alignment =
                overlapX / Math.max(1, Math.min(a.box.width, b.box.width));
              const gap = Math.max(
                0,
                Math.max(a.box.top, b.box.top) -
                  Math.min(a.box.bottom, b.box.bottom)
              );
              if (alignment < 0.25 || gap >= 8) continue;
              const key = [describeNode(a.node), describeNode(b.node)]
                .sort()
                .join(" <-> ");
              if (proximityKeys.has(key)) continue;
              proximityKeys.add(key);
              layoutIssues.push({
                type:
                  gap === 0 ? "visual-control-collision" : "control-spacing",
                detail: `${key} verticalGap=${gap.toFixed(1)}px required>=8px horizontalAlignment=${(alignment * 100).toFixed(0)}% geometryA=${a.box.x.toFixed(1)},${a.box.y.toFixed(1)},${a.box.width.toFixed(1)}x${a.box.height.toFixed(1)} geometryB=${b.box.x.toFixed(1)},${b.box.y.toFixed(1)},${b.box.width.toFixed(1)}x${b.box.height.toFixed(1)}`,
              });
            }
          }

          const texts = [];
          const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT
          );
          let textNode = walker.nextNode();
          while (textNode) {
            const text = textNode.textContent?.trim() || "";
            const parent = textNode.parentElement;
            if (text && parent && !isGenuinelyHidden(parent)) {
              const rect = parent.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                const colorAlpha = alphaFromColor(
                  window.getComputedStyle(parent).color
                );
                if (colorAlpha !== null) {
                  const style = window.getComputedStyle(parent);
                  const foreground = rgba(style.color);
                  const backdrop = localBackdrop(parent);
                  const opacity = effectiveOpacity(parent);
                  const effectiveForeground = foreground
                    ? composite(
                        { ...foreground, a: foreground.a * opacity },
                        backdrop
                      )
                    : null;
                  texts.push({
                    selector: parent.tagName.toLowerCase(),
                    className: String(parent.className || "").slice(0, 220),
                    role: textRole(parent),
                    colorAlpha,
                    effectiveAlpha: colorAlpha * opacity,
                    foregroundColor: style.color,
                    localBackdropColor: colorString(backdrop),
                    contrastRatio: effectiveForeground
                      ? contrastRatio(effectiveForeground, backdrop)
                      : null,
                    fontSize: Number.parseFloat(style.fontSize || "0"),
                    fontWeight:
                      Number.parseInt(style.fontWeight || "400", 10) || 400,
                    text: text.slice(0, 120),
                  });
                }
              }
            }
            textNode = walker.nextNode();
          }
          const viewportArea = window.innerWidth * window.innerHeight;
          const colorValues = (value) => {
            const colors = [];
            const re =
              /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/g;
            let match;
            while ((match = re.exec(value)))
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
            return colors;
          };
          const interactiveSelector =
            'button, [href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])';
          const paints = [document.body, ...nodes].flatMap((node) => {
            const style = window.getComputedStyle(node);
            const box = node.getBoundingClientRect();
            if (
              isGenuinelyHidden(node) ||
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
            const isCanvas =
              node === document.body ||
              node.classList.contains("recipe-page") ||
              node.classList.contains("recipe-frame");
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
              },
            ];
          });
          const visibleNodes = nodes.filter(
            (node) =>
              !isGenuinelyHidden(node) &&
              node.getBoundingClientRect().width > 1 &&
              node.getBoundingClientRect().height > 1
          );
          const bounds = visibleNodes.reduce(
            (value, node) => {
              const box = node.getBoundingClientRect();
              return {
                left: Math.min(value.left, box.left),
                top: Math.min(value.top, box.top),
                right: Math.max(value.right, box.right),
                bottom: Math.max(value.bottom, box.bottom),
              };
            },
            {
              left: Infinity,
              top: Infinity,
              right: -Infinity,
              bottom: -Infinity,
            }
          );
          const outputArea = Number.isFinite(bounds.left)
            ? Math.max(0, bounds.right - bounds.left) *
              Math.max(0, bounds.bottom - bounds.top)
            : 0;
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
              'button,input,select,textarea,canvas,svg,img,[role],[class*="glass"]'
            )
          ).length;
          if (
            outputArea < window.innerWidth * window.innerHeight * 0.006 ||
            (visibleText.length < 3 && meaningfulElements < 1)
          )
            layoutIssues.push({
              type: "blank-or-minuscule-primary-output",
              detail: `recipe=${root.getAttribute("data-recipe-id")} areaRatio=${(outputArea / (window.innerWidth * window.innerHeight)).toFixed(4)} visibleTextChars=${visibleText.length} meaningfulElements=${meaningfulElements}`,
            });
          for (const node of [
            root,
            ...visibleNodes.filter((candidate) =>
              candidate.matches(
                'main,article,section,[data-primary-output],[class*="showcase"],[class*="demo"]'
              )
            ),
          ]) {
            const box = node.getBoundingClientRect();
            const total = box.width * box.height;
            if (total <= 400) continue;
            const width = Math.max(
              0,
              Math.min(box.right, window.innerWidth) - Math.max(box.left, 0)
            );
            const height = Math.max(
              0,
              Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 0)
            );
            const ratio = (width * height) / total;
            const displaced =
              box.left < -window.innerWidth * 0.2 ||
              box.right > window.innerWidth * 1.2 ||
              box.top < -window.innerHeight * 0.2;
            if (ratio < 0.7 || displaced)
              layoutIssues.push({
                type: displaced
                  ? "major-responsive-offscreen-displacement"
                  : "primary-output-viewport-cutoff",
                detail: `${node.tagName}.${String(node.className || "").slice(0, 120)} geometry=${box.x.toFixed(1)},${box.y.toFixed(1)},${box.width.toFixed(1)}x${box.height.toFixed(1)} visibleRatio=${ratio.toFixed(3)} viewport=${window.innerWidth}x${window.innerHeight}`,
              });
          }
          for (const node of visibleNodes.filter(
            (candidate) => candidate instanceof HTMLCanvasElement
          )) {
            let context = null;
            try {
              context = node.getContext("2d", { willReadFrequently: true });
            } catch {}
            if (!context || !node.width || !node.height) continue;
            let painted = 0,
              chromatic = 0,
              darkChromatic = 0,
              luminanceSum = 0,
              chromaSum = 0;
            const stepX = Math.max(1, Math.floor(node.width / 24));
            const stepY = Math.max(1, Math.floor(node.height / 24));
            try {
              for (let y = 0; y < node.height; y += stepY)
                for (let x = 0; x < node.width; x += stepX) {
                  const [r, g, b, a] = context.getImageData(x, y, 1, 1).data;
                  if (a < 26) continue;
                  painted++;
                  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
                  const light = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                  chromaSum += chroma;
                  luminanceSum += light;
                  if (chroma > 48) chromatic++;
                  if (chroma > 28 && light < 95) darkChromatic++;
                }
            } catch (error) {
              layoutIssues.push({
                type: "uninspectable-canvas-output",
                detail: `canvas bitmap=${node.width}x${node.height} error=${String(error)}`,
              });
              continue;
            }
            if (!painted)
              layoutIssues.push({
                type: "blank-canvas-output",
                detail: `canvas bitmap=${node.width}x${node.height} sampledPixels=0`,
              });
            else if (
              chromatic / painted > 0.45 ||
              darkChromatic / painted > 0.55
            )
              layoutIssues.push({
                type: "dominant-canvas-chroma-darkness",
                detail: `canvas bitmap=${node.width}x${node.height} sampledPixels=${painted} chromaticRatio=${(chromatic / painted).toFixed(3)} darkChromaticRatio=${(darkChromatic / painted).toFixed(3)} meanChroma=${(chromaSum / painted).toFixed(1)} meanLuminance=${(luminanceSum / painted).toFixed(1)}`,
              });
          }
          return {
            id: root.getAttribute("data-recipe-id"),
            name: root.getAttribute("data-recipe-id"),
            viewport: viewportInfo,
            surfaces: styles,
            layoutIssues,
            textAlphas: texts.map((text) => text.effectiveAlpha),
            texts,
            paints,
            consoleErrors: [],
            pageErrors: [],
          };
        }, viewport);
        computed.consoleErrors = consoleErrors.slice();
        computed.pageErrors = pageErrors.slice();
        fs.writeFileSync(
          path.join(evidenceDir, `${viewport.name}.computed-styles.json`),
          `${JSON.stringify(computed, null, 2)}\n`,
          "utf8"
        );
      }
    }

    await browser.close();

    if (pageErrors.length > 0 || consoleErrors.length > 0) {
      throw new Error(
        `Recipe render page emitted errors.\npageErrors=${JSON.stringify(pageErrors)}\nconsoleErrors=${JSON.stringify(consoleErrors)}`
      );
    }

    const report = {
      generatedAt: new Date().toISOString(),
      package: packInfo.name,
      version: packInfo.version,
      filename: packInfo.filename,
      shasum: packInfo.shasum,
      integrity: packInfo.integrity,
      recipeCount: renderedRecipes.length,
      appDir,
      screenshots,
      passed: screenshots.length === renderedRecipes.length,
    };

    fs.writeFileSync(
      path.join(reportDir, "recipe-render-evidence.json"),
      `${JSON.stringify(report, null, 2)}\n`,
      "utf8"
    );
    fs.writeFileSync(
      path.join(reportDir, "recipe-render-evidence.md"),
      `# 3.3 Recipe Render Evidence

Generated at: ${report.generatedAt}

Command:

\`\`\`bash
node scripts/ci/verify-recipes-render.js
\`\`\`

Result: pass. The script packed \`${packInfo.name}@${packInfo.version}\`, scaffolded every recipe with \`aura-glass add all\`, built a temporary Vite app, loaded it in Chromium, and captured one screenshot per recipe.

| Recipe | Screenshot |
| --- | --- |
${screenshots.map((screenshot) => `| \`${screenshot.id}\` | [${path.basename(screenshot.file)}](./recipe-screenshots/${path.basename(screenshot.file)}) |`).join("\n")}
`,
      "utf8"
    );

    console.log(`Recipe render gate passed for ${screenshots.length} recipes.`);
  } finally {
    server.kill("SIGTERM");
    const reportDir = evidenceDir("3.3-release");
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(
      path.join(reportDir, "recipe-render-server.log"),
      serverLog,
      "utf8"
    );
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
