#!/usr/bin/env node

const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { execFileSync, execSync, spawn } = require("child_process");
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
  const packOutput = runWithOutput(
    `npm pack --dry-run=false --json --pack-destination ${tmpRoot}`,
    { cwd: projectRoot }
  );
  const packInfo = JSON.parse(packOutput)[0];
  if (!packInfo || !packInfo.filename) {
    throw new Error("Failed to generate npm pack tarball for AuraGlass.");
  }

  const appDir = path.join(tmpRoot, "recipe-app");
  fs.mkdirSync(appDir);
  const tarballPath = path.join(tmpRoot, packInfo.filename);
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
  writeFile(appDir, "index.html", `<div id="root"></div><script type="module" src="/src/App.tsx"></script>\n`);
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
  background: #07111f;
  color: #f8fafc;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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
  background: radial-gradient(circle at 20% 20%, rgba(125, 211, 252, 0.20), transparent 32%),
    radial-gradient(circle at 80% 30%, rgba(192, 132, 252, 0.22), transparent 34%),
    rgba(7, 17, 31, 0.78);
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
    .map((recipe, index) => `import { ${recipe.exportName} as Recipe${index} } from '${recipe.importPath}';`)
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
  return (
    <main className="recipe-page">
      {recipes.map(({ id, title, Component }) => (
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

  const port = 4687;
  const server = spawn("npm", ["run", "dev", "--", "--port", String(port)], {
    cwd: appDir,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, FORCE_COLOR: "0" },
  });
  let serverLog = "";
  server.stdout.on("data", (chunk) => {
    serverLog += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    serverLog += chunk.toString();
  });

  try {
    await waitForUrl(`http://127.0.0.1:${port}/`);

    const reportDir = path.join(projectRoot, "reports", "3.3-release");
    const screenshotDir = path.join(reportDir, "recipe-screenshots");
    fs.rmSync(screenshotDir, { recursive: true, force: true });
    fs.mkdirSync(screenshotDir, { recursive: true });

    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    const pageErrors = [];
    const consoleErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });

    const screenshots = [];
    for (const recipe of renderedRecipes) {
      const locator = page.locator(`[data-recipe-id="${recipe.id}"]`);
      await locator.waitFor({ state: "visible", timeout: 30000 });
      await locator.scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
      const box = await locator.boundingBox();
      if (!box) {
        throw new Error(`Could not resolve screenshot box for recipe ${recipe.id}`);
      }
      const screenshotPath = path.join(screenshotDir, `${safeId(recipe.id)}.png`);
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
    const reportDir = path.join(projectRoot, "reports", "3.3-release");
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(path.join(reportDir, "recipe-render-server.log"), serverLog, "utf8");
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
