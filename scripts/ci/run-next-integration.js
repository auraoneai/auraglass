#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const run = (command, options = {}) => {
  execSync(command, { stdio: 'inherit', ...options });
};

const runWithOutput = (command, options = {}) => {
  return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], ...options });
};

const writeFile = (root, relativePath, contents) => {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
};

const rootDir = process.cwd();
const BUILD_COMMAND = 'npm run build';
const args = process.argv.slice(2);
const SKIP_BUILD =
  args.includes('--skip-build') ||
  process.env.AURAGLASS_SKIP_BUILD === '1' ||
  process.env.SKIP_AURAGLASS_BUILD === '1' ||
  process.env.AURAGLASS_ASSUME_BUILT === 'true';

const failurePatterns = [
  /Invalid hook call/i,
  /StyledComponentsRegistry was not detected/i,
  /Cannot read properties of null \(reading 'useState'\)/i,
];

console.log('📦 Running AuraGlass Next.js integration smoke test...');

// Ensure latest build artifacts before packing
if (!SKIP_BUILD) {
  run(BUILD_COMMAND, { cwd: rootDir });
} else {
  console.log('Skipping AuraGlass rebuild (AURAGLASS_SKIP_BUILD set).');
}

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'auraglass-next-'));
const packOutput = runWithOutput('npm pack --dry-run=false --json --pack-destination ' + tmpRoot, { cwd: rootDir });
const packInfo = JSON.parse(packOutput)[0];

if (!packInfo || !packInfo.filename) {
  throw new Error('Failed to generate npm pack tarball for AuraGlass.');
}

const tarballPath = path.join(tmpRoot, packInfo.filename);
const appDir = path.join(tmpRoot, 'next-app');
fs.mkdirSync(appDir);

const relativeTarball = path.relative(appDir, tarballPath);

const dependencies = {
  next: '14.2.35',
  react: '18.2.0',
  'react-dom': '18.2.0',
  'styled-components': '6.1.19',
  'aura-glass': `file:${relativeTarball}`,
  '@sentry/react': '7.120.4',
  'framer-motion': '11.11.17',
  'react-chartjs-2': '5.3.1',
  'chart.js': '4.4.4',
  'react-hook-form': '7.54.0',
};

const devDependencies = {
  '@playwright/test': '1.55.0',
  '@types/node': '18.19.34',
  '@types/react': '18.2.57',
  '@types/react-dom': '18.2.19',
  typescript: '5.3.3',
};

writeFile(
  appDir,
  'package.json',
  JSON.stringify(
    {
      name: 'auraglass-next-integration',
      version: '0.0.0',
      private: true,
      scripts: {
        dev: 'next dev --hostname 127.0.0.1 --port 4310',
        build: 'next build',
        test: 'node ./node_modules/@playwright/test/cli.js test --config=playwright.config.ts',
      },
      dependencies,
      devDependencies,
    },
    null,
    2,
  ),
);

writeFile(appDir, '.npmrc', 'fund=false\naudit=false\n');

writeFile(
  appDir,
  'tsconfig.json',
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES5',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: false,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
      exclude: ['node_modules'],
    },
    null,
    2,
  ),
);

writeFile(
  appDir,
  'next-env.d.ts',
  `/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n\n// NOTE: This file should not be edited\n`,
);

writeFile(
  appDir,
  'next.config.js',
  `/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  experimental: {\n    typedRoutes: true,\n  },\n};\n\nmodule.exports = nextConfig;\n`,
);

writeFile(
  appDir,
  'app/layout.tsx',
  `import type { ReactNode } from 'react';
import './globals.css';
import { StyledComponentsRegistry } from 'aura-glass/registry';
import { Providers } from './providers';

export const metadata = {
  title: 'AuraGlass Next Integration',
  description: 'Smoke test to ensure AuraGlass mounts in Next.js App Router.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
`,
);

writeFile(
  appDir,
  'app/providers.tsx',
  `'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from 'aura-glass';

export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
`,
);

writeFile(
  appDir,
  'app/page.tsx',
  `'use client';

import { GlassButton } from 'aura-glass';
import { GlassDataTable } from 'aura-glass/data';
import { GlassFormTemplate } from 'aura-glass/forms';
import { DisplayText } from 'aura-glass/marketing';
import { GlassPageTabs } from 'aura-glass/navigation';
import { LiquidGlassAdaptiveSheet } from 'aura-glass/overlays';
import { GlassWorkflowShell } from 'aura-glass/workflows';

export default function Page() {
  return (
    <main className="app">
      <h1>AuraGlass Integration</h1>
      <GlassButton variant="primary">AuraGlass OK</GlassButton>
      <DisplayText as="p" size="label">Subpath imports OK</DisplayText>
      <GlassFormTemplate title="Next form" schema={[]} />
      <GlassDataTable columns={[]} data={[]} />
      <GlassPageTabs tabs={[{ value: 'one', label: 'One' }]} value="one" />
      <LiquidGlassAdaptiveSheet open={false} title="Next sheet" />
      <GlassWorkflowShell title="Next workflow">
        <GlassButton>Workflow OK</GlassButton>
      </GlassWorkflowShell>
    </main>
  );
}
`,
);

writeFile(
  appDir,
  'app/globals.css',
  `html, body {\n  padding: 0;\n  margin: 0;\n  font-family: system-ui, sans-serif;\n  min-height: 100%;\n  background: radial-gradient(circle at top left, rgba(59,130,246,0.15), transparent),\n              radial-gradient(circle at bottom right, rgba(236,72,153,0.15), transparent);\n}\n\nbody {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\nmain.app {\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n}\n`,
);

writeFile(
  appDir,
  'playwright.config.ts',
  `import { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './tests',\n  retries: 0,\n  use: {\n    baseURL: 'http://127.0.0.1:4310',\n    trace: 'on-first-retry',\n  },\n  projects: [\n    {\n      name: 'chromium',\n      use: { ...devices['Desktop Chrome'] },\n    },\n  ],\n  webServer: {\n    command: 'sh -c "npm run dev | tee integration.log"',\n    url: 'http://127.0.0.1:4310',\n    reuseExistingServer: false,\n    timeout: 120_000,\n  },\n});\n`,
);

writeFile(
  appDir,
  'tests/smoke.spec.ts',
  `import { test, expect } from '@playwright/test';\n\ntest('renders AuraGlass button without duplicate React runtime', async ({ page }) => {\n  await page.goto('/');\n  await expect(page.getByRole('heading', { name: 'AuraGlass Integration' })).toBeVisible();\n  await expect(page.getByRole('button', { name: 'AuraGlass OK' })).toBeVisible();\n});\n`,
);

console.log('📥 Installing Next.js integration dependencies with npm...');
run('npm install --dry-run=false --prefer-offline --no-audit --no-fund', { cwd: appDir });

console.log('🎭 Installing Playwright browsers (chromium only)...');
run('node ./node_modules/@playwright/test/cli.js install --with-deps chromium', { cwd: appDir });

console.log('🚀 Running Playwright smoke test against npm dev');
run('npm test', { cwd: appDir });

const integrationLogPath = path.join(appDir, 'integration.log');
if (fs.existsSync(integrationLogPath)) {
  const logContent = fs.readFileSync(integrationLogPath, 'utf8');
  const reportsDir = path.join(rootDir, 'reports');
  fs.mkdirSync(reportsDir, { recursive: true });
  const destLogPath = path.join(reportsDir, 'next-integration.log');
  fs.copyFileSync(integrationLogPath, destLogPath);

  if (failurePatterns.some((pattern) => pattern.test(logContent))) {
    throw new Error(
      'Next.js integration log contains registry or hook warnings. See reports/next-integration.log for details.'
    );
  }
}

console.log('✅ AuraGlass Next.js integration smoke test completed successfully. Logs available in reports/next-integration.log');

// React 19 / Next 15 integration scenario (3D entrypoint)
console.log('\n📦 Running AuraGlass Next.js React 19 + Next 15 integration smoke test...');

const appDirReact19 = path.join(tmpRoot, 'next-app-react19');
fs.mkdirSync(appDirReact19);

const dependenciesReact19 = {
  ...dependencies,
  next: '15.5.15',
  react: '19.0.0',
  'react-dom': '19.0.0',
  'framer-motion': '12.38.0',
  '@react-three/drei': '^10.7.7',
  '@react-three/fiber': '^9.6.1',
  three: '^0.170.0',
};
delete dependenciesReact19['@sentry/react'];

const devDependenciesReact19 = {
  ...devDependencies,
  // React 19 uses the same type surface as 18 for our purposes
  '@types/react': devDependencies['@types/react'],
  '@types/react-dom': devDependencies['@types/react-dom'],
};

writeFile(
  appDirReact19,
  'package.json',
  JSON.stringify(
    {
      name: 'auraglass-next-integration-react19',
      version: '0.0.0',
      private: true,
      scripts: {
        dev: 'next dev --hostname 127.0.0.1 --port 4311',
        build: 'next build',
        test: 'node ./node_modules/@playwright/test/cli.js test --config=playwright.config.ts',
      },
      dependencies: dependenciesReact19,
      devDependencies: devDependenciesReact19,
    },
    null,
    2,
  ),
);

writeFile(appDirReact19, '.npmrc', 'fund=false\naudit=false\n');

writeFile(
  appDirReact19,
  'tsconfig.json',
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES5',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: false,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
      exclude: ['node_modules'],
    },
    null,
    2,
  ),
);

writeFile(
  appDirReact19,
  'next-env.d.ts',
  `/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n\n// NOTE: This file should not be edited\n`,
);

writeFile(
  appDirReact19,
  'next.config.js',
  `/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  typedRoutes: true,\n};\n\nmodule.exports = nextConfig;\n`,
);

writeFile(
  appDirReact19,
  'app/layout.tsx',
  `import type { ReactNode } from 'react';
import './globals.css';
import { StyledComponentsRegistry } from 'aura-glass/registry';
import { Providers } from './providers';

export const metadata = {
  title: 'AuraGlass Next React 19 Integration',
  description: 'Smoke test to ensure AuraGlass mounts in Next.js App Router with React 19 and 3D entrypoint.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
`,
);

writeFile(
  appDirReact19,
  'app/providers.tsx',
  `'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from 'aura-glass';

export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
`,
);

writeFile(
  appDirReact19,
  'app/page.tsx',
  `'use client';

import { GlassButton } from 'aura-glass';
import { GlassShatterEffects } from 'aura-glass/three';

export default function Page() {
  return (
    <main className="app">
      <h1>AuraGlass React 19 Integration</h1>
      <GlassShatterEffects>
        <GlassButton variant="primary">AuraGlass 3D OK</GlassButton>
      </GlassShatterEffects>
    </main>
  );
}
`,
);

writeFile(
  appDirReact19,
  'app/globals.css',
  `html, body {\n  padding: 0;\n  margin: 0;\n  font-family: system-ui, sans-serif;\n  min-height: 100%;\n  background: radial-gradient(circle at top left, rgba(59,130,246,0.15), transparent),\n              radial-gradient(circle at bottom right, rgba(236,72,153,0.15), transparent);\n}\n\nbody {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\nmain.app {\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n}\n`,
);

writeFile(
  appDirReact19,
  'playwright.config.ts',
  `import { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './tests',\n  retries: 0,\n  use: {\n    baseURL: 'http://127.0.0.1:4311',\n    trace: 'on-first-retry',\n  },\n  projects: [\n    {\n      name: 'chromium',\n      use: { ...devices['Desktop Chrome'] },\n    },\n  ],\n  webServer: {\n    command: 'sh -c "npm run dev | tee integration-react19.log"',\n    url: 'http://127.0.0.1:4311',\n    reuseExistingServer: false,\n    timeout: 120_000,\n  },\n});\n`,
);

writeFile(
  appDirReact19,
  'tests/smoke.spec.ts',
  `import { test, expect } from '@playwright/test';\n\n\ntest('renders AuraGlass 3D button without registry or hook warnings', async ({ page }) => {\n  await page.goto('/');\n  await expect(page.getByRole('heading', { name: 'AuraGlass React 19 Integration' })).toBeVisible();\n  await expect(page.getByRole('button', { name: 'AuraGlass 3D OK' })).toBeVisible();\n});\n`,
);

console.log('📥 [react19] Installing Next.js integration dependencies with npm...');
run('npm install --dry-run=false --prefer-offline --no-audit --no-fund', { cwd: appDirReact19 });

console.log('🎭 [react19] Installing Playwright browsers (chromium only)...');
run('node ./node_modules/@playwright/test/cli.js install --with-deps chromium', { cwd: appDirReact19 });

console.log('🚀 [react19] Running Playwright smoke test against npm dev');
run('npm test', { cwd: appDirReact19 });

const integrationLogPathReact19 = path.join(appDirReact19, 'integration-react19.log');
if (fs.existsSync(integrationLogPathReact19)) {
  const logContent = fs.readFileSync(integrationLogPathReact19, 'utf8');
  const reportsDir = path.join(rootDir, 'reports');
  fs.mkdirSync(reportsDir, { recursive: true });
  const destLogPath = path.join(reportsDir, 'next-integration-react19.log');
  fs.copyFileSync(integrationLogPathReact19, destLogPath);

  if (failurePatterns.some((pattern) => pattern.test(logContent))) {
    throw new Error(
      'React 19 Next.js integration log contains registry or hook warnings. See reports/next-integration-react19.log for details.',
    );
  }
}

console.log('✅ AuraGlass Next.js React 19 integration smoke test completed successfully. Logs available in reports/next-integration-react19.log');
