#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");

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
};

const rootDir = process.cwd();
const args = process.argv.slice(2);
const skipBuild =
  args.includes("--skip-build") ||
  process.env.AURAGLASS_SKIP_BUILD === "1" ||
  process.env.SKIP_AURAGLASS_BUILD === "1" ||
  process.env.AURAGLASS_ASSUME_BUILT === "true";

console.log("📦 Running AuraGlass Vite integration smoke test...");

if (!skipBuild) {
  run("npm run build", { cwd: rootDir });
} else {
  console.log("Skipping AuraGlass rebuild (skip-build flag set).");
}

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "auraglass-vite-"));
const packOutput = runWithOutput(
  `npm pack --dry-run=false --json --pack-destination ${tmpRoot}`,
  { cwd: rootDir }
);
const packInfo = JSON.parse(packOutput)[0];

if (!packInfo || !packInfo.filename) {
  throw new Error("Failed to generate npm pack tarball for AuraGlass.");
}

const tarballPath = path.join(tmpRoot, packInfo.filename);
const appDir = path.join(tmpRoot, "vite-app");
fs.mkdirSync(appDir);

const relativeTarball = path.relative(appDir, tarballPath);

writeFile(
  appDir,
  "package.json",
  JSON.stringify(
    {
      name: "auraglass-vite-integration",
      version: "0.0.0",
      private: true,
      type: "module",
      scripts: {
        build: "vite build",
      },
      dependencies: {
        "@vitejs/plugin-react": "^5.0.2",
        "aura-glass": `file:${relativeTarball}`,
        react: "18.2.0",
        "react-dom": "18.2.0",
        typescript: "^5.3.3",
        vite: "^7.1.5",
      },
      devDependencies: {},
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
  "tsconfig.json",
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["DOM", "DOM.Iterable", "ES2020"],
        allowJs: false,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: "ESNext",
        moduleResolution: "Node",
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
      },
      include: ["src"],
      references: [],
    },
    null,
    2
  )
);

writeFile(
  appDir,
  "vite.config.ts",
  `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`
);

writeFile(
  appDir,
  "src/App.tsx",
  `import React from 'react';
import { createRoot } from 'react-dom/client';
import { GlassButton, GlassCard } from 'aura-glass';
import { GlassAppShell, GlassPageHeader, GlassTopBar } from 'aura-glass/app-shell';
import { GlassDataTable } from 'aura-glass/data';
import { GlassFormTemplate } from 'aura-glass/forms';
import { SearchIcon, SettingsIcon } from 'aura-glass/icons/navigation';
import { DisplayText } from 'aura-glass/marketing';
import { GlassPageTabs } from 'aura-glass/navigation';
import { LiquidGlassAdaptiveSheet } from 'aura-glass/overlays';
import { GlassSlot } from 'aura-glass/primitives/slot';
import { GlassThemeProvider } from 'aura-glass/theme';
import { GlassWorkflowShell } from 'aura-glass/workflows';
import 'aura-glass/styles';

function App() {
  return (
    <GlassThemeProvider theme={{ brandColor: '#7dd3fc', density: 'compact' }}>
      <GlassAppShell
        topBar={
          <GlassTopBar
            brand="AuraGlass Vite"
            actions={
              <GlassButton leftIcon={<SearchIcon aria-hidden="true" />}>
                Search
              </GlassButton>
            }
          />
        }
      >
        <GlassPageHeader
          title="Vite integration"
          actions={<SettingsIcon title="Settings" />}
        />
        <GlassCard>
          <GlassSlot className="slot-proof">
            <button type="button">AuraGlass OK</button>
          </GlassSlot>
          <DisplayText as="p" size="label">
            Subpath imports OK
          </DisplayText>
          <GlassFormTemplate title="Vite form" schema={[]} />
          <GlassDataTable columns={[]} data={[]} />
          <GlassPageTabs
            tabs={[{ value: 'one', label: 'One' }]}
            value="one"
          />
          <LiquidGlassAdaptiveSheet open={false} title="Vite sheet" />
          <GlassWorkflowShell title="Vite workflow">
            <GlassButton>Workflow OK</GlassButton>
          </GlassWorkflowShell>
        </GlassCard>
      </GlassAppShell>
    </GlassThemeProvider>
  );
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Missing root element');
}

createRoot(root).render(<App />);
`
);

console.log("📥 Installing Vite integration dependencies with npm...");
run("npm install --dry-run=false --prefer-offline --no-audit --no-fund", {
  cwd: appDir,
});

console.log("🏗️ Running Vite production build...");
run("npm run build", { cwd: appDir });

const distDir = path.join(appDir, "dist");
const files = fs.existsSync(distDir) ? fs.readdirSync(distDir) : [];
if (files.length === 0) {
  throw new Error("Vite build did not emit dist assets.");
}

const reportDir = path.join(rootDir, "reports", "3.2-release");
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(
  path.join(reportDir, "vite-integration.json"),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      package: packInfo.name,
      version: packInfo.version,
      filename: packInfo.filename,
      shasum: packInfo.shasum,
      integrity: packInfo.integrity,
      appDir,
      emittedFiles: files,
      passed: true,
    },
    null,
    2
  )}\n`,
  "utf8"
);

console.log("✅ AuraGlass Vite integration smoke test completed successfully.");
