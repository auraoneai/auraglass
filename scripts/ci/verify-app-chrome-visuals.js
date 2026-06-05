#!/usr/bin/env node

const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { execSync, spawn } = require("child_process");
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

const safeId = (id) => id.replace(/[^a-z0-9-]/gi, "-").toLowerCase();

const targets = [
  { id: "icon-gallery", viewport: { width: 1280, height: 920 } },
  { id: "dropdown-menu", viewport: { width: 1280, height: 920 } },
  { id: "select", viewport: { width: 1280, height: 920 } },
  { id: "dialog", viewport: { width: 1280, height: 920 }, page: true },
  { id: "drawer", viewport: { width: 1280, height: 920 }, page: true },
  { id: "popover", viewport: { width: 1280, height: 920 }, page: true },
  {
    id: "tooltip",
    viewport: { width: 1280, height: 920 },
    page: true,
    beforeScreenshot: async (page) => {
      await page.locator("[data-tooltip-trigger]").hover();
      await page.waitForTimeout(150);
    },
  },
  { id: "tabs", viewport: { width: 1280, height: 920 } },
  { id: "command-palette", viewport: { width: 1280, height: 920 } },
  { id: "mobile-shell", viewport: { width: 390, height: 844 }, page: true },
  {
    id: "reduced-motion",
    viewport: { width: 1280, height: 920 },
    page: true,
    reducedMotion: "reduce",
  },
];

const appSource = `import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  GlassButton,
  GlassCard,
  GlassCommandPalette,
  GlassDialog,
  GlassDrawer,
  GlassDropdownMenu,
  GlassDropdownMenuContent,
  GlassDropdownMenuItem,
  GlassDropdownMenuLabel,
  GlassDropdownMenuSeparator,
  GlassDropdownMenuTrigger,
  GlassPopover,
  GlassSelectContent,
  GlassSelectItem,
  GlassSelectRoot,
  GlassSelectTrigger,
  GlassSelectValue,
  GlassTabs,
  GlassTabsContent,
  GlassTabsList,
  GlassTabsTrigger,
  GlassTooltip,
} from 'aura-glass';
import { GlassAppShell, GlassPageHeader, GlassSidebarRail, GlassTopBar } from 'aura-glass/app-shell';
import {
  ActivityIcon,
  BellIcon,
  CalendarIcon,
  CheckIcon,
  CloseIcon,
  DashboardIcon,
  DatabaseIcon,
  DownloadIcon,
  FilterIcon,
  HomeIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  SparkIcon,
  UserIcon,
  ZapIcon,
} from 'aura-glass/icons';
import { GlassThemeProvider } from 'aura-glass/theme';
import 'aura-glass/styles';
import './styles.css';

const target = new URLSearchParams(window.location.search).get('target') ?? 'icon-gallery';

function Frame({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <main className="visual-page">
      <section className="visual-frame" data-visual-id={id}>
        <p className="eyebrow">AuraGlass 3.3 visual baseline</p>
        <h1>{title}</h1>
        <div className="visual-surface">{children}</div>
      </section>
    </main>
  );
}

function IconGallery() {
  const icons = [
    ['Home', HomeIcon],
    ['Dashboard', DashboardIcon],
    ['Search', SearchIcon],
    ['Menu', MenuIcon],
    ['Settings', SettingsIcon],
    ['Bell', BellIcon],
    ['User', UserIcon],
    ['Calendar', CalendarIcon],
    ['Activity', ActivityIcon],
    ['Database', DatabaseIcon],
    ['Filter', FilterIcon],
    ['Download', DownloadIcon],
    ['Check', CheckIcon],
    ['Close', CloseIcon],
    ['Spark', SparkIcon],
    ['Zap', ZapIcon],
  ] as const;

  return (
    <Frame id="icon-gallery" title="First-party icon gallery">
      <div className="icon-grid">
        {icons.map(([label, Icon]) => (
          <div className="icon-tile" key={label}>
            <Icon aria-hidden="true" size={26} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function DropdownMenuVisual() {
  return (
    <Frame id="dropdown-menu" title="Native dropdown menu">
      <GlassDropdownMenu open>
        <GlassDropdownMenuTrigger>Workspace actions</GlassDropdownMenuTrigger>
        <GlassDropdownMenuContent
          contained
          portalled={false}
          positionStrategy="contained"
          align="start"
          className="visual-menu"
        >
          <GlassDropdownMenuLabel>Project</GlassDropdownMenuLabel>
          <GlassDropdownMenuItem>Open command center</GlassDropdownMenuItem>
          <GlassDropdownMenuItem>Duplicate workspace</GlassDropdownMenuItem>
          <GlassDropdownMenuSeparator />
          <GlassDropdownMenuItem>Archive surface</GlassDropdownMenuItem>
        </GlassDropdownMenuContent>
      </GlassDropdownMenu>
    </Frame>
  );
}

function SelectVisual() {
  return (
    <Frame id="select" title="Native select">
      <GlassSelectRoot open value="balanced">
        <GlassSelectTrigger className="visual-select-trigger">
          <GlassSelectValue placeholder="Choose density" />
        </GlassSelectTrigger>
        <GlassSelectContent contained portalled={false} positionStrategy="contained">
          <GlassSelectItem value="compact">Compact command UI</GlassSelectItem>
          <GlassSelectItem value="balanced">Balanced product surface</GlassSelectItem>
          <GlassSelectItem value="comfortable">Comfortable media controls</GlassSelectItem>
        </GlassSelectContent>
      </GlassSelectRoot>
    </Frame>
  );
}

function DialogVisual() {
  return (
    <Frame id="dialog" title="Glass dialog">
      <GlassDialog
        open
        title="Publish release evidence"
        description="Confirm package gates, visual baselines, and migration docs before marking 3.3 ready."
        footer={<GlassButton>Approve release</GlassButton>}
      >
        <div className="stack">
          <GlassCard>Dependency sovereignty gates passed.</GlassCard>
          <GlassCard>Manual certification still requires review.</GlassCard>
        </div>
      </GlassDialog>
    </Frame>
  );
}

function DrawerVisual() {
  return (
    <Frame id="drawer" title="Glass drawer">
      <GlassDrawer
        open
        contained
        position="right"
        title="Task details"
        description="Native AuraGlass drawer without Radix or MUI."
        footer={<GlassButton>Save status</GlassButton>}
      >
        <div className="stack">
          <GlassCard>Owner: Release engineering</GlassCard>
          <GlassCard>Status: Visual baseline capture</GlassCard>
        </div>
      </GlassDrawer>
    </Frame>
  );
}

function PopoverVisual() {
  return (
    <Frame id="popover" title="Glass popover">
      <GlassPopover
        open
        content={
          <div className="popover-content">
            <strong>Surface telemetry</strong>
            <span>Latency 212ms / Quality 98%</span>
          </div>
        }
      >
        <GlassButton>Inspect surface</GlassButton>
      </GlassPopover>
    </Frame>
  );
}

function TooltipVisual() {
  return (
    <Frame id="tooltip" title="Glass tooltip">
      <GlassTooltip content="First-party tooltip behavior, no Radix dependency." showDelay={0}>
        <button className="plain-trigger" data-tooltip-trigger type="button">
          Hover for details
        </button>
      </GlassTooltip>
    </Frame>
  );
}

function TabsVisual() {
  return (
    <Frame id="tabs" title="Native tabs">
      <GlassTabs defaultValue="overview">
        <GlassTabsList>
          <GlassTabsTrigger value="overview">Overview</GlassTabsTrigger>
          <GlassTabsTrigger value="gates">Gates</GlassTabsTrigger>
          <GlassTabsTrigger value="evidence">Evidence</GlassTabsTrigger>
        </GlassTabsList>
        <GlassTabsContent value="overview">
          <GlassCard>3.3 app chrome renders with AuraGlass primitives.</GlassCard>
        </GlassTabsContent>
        <GlassTabsContent value="gates">
          <GlassCard>Exports, pack, Vite, and Next gates are captured.</GlassCard>
        </GlassTabsContent>
        <GlassTabsContent value="evidence">
          <GlassCard>Screenshots are generated from the packed package.</GlassCard>
        </GlassTabsContent>
      </GlassTabs>
    </Frame>
  );
}

function CommandPaletteVisual() {
  return (
    <Frame id="command-palette" title="Command palette">
      <GlassCommandPalette
        open
        contained
        positionStrategy="inline"
        enableRecents={false}
        showFooter={false}
        placeholder="Search AuraGlass actions"
        items={[
          { id: 'open-dashboard', label: 'Open dashboard', category: 'Navigation', shortcut: 'CMD D' },
          { id: 'audit-deps', label: 'Audit dependencies', category: 'Release', shortcut: 'CMD A' },
          { id: 'capture-visuals', label: 'Capture visual baselines', category: 'Visual QA', shortcut: 'CMD V' },
        ]}
      />
    </Frame>
  );
}

function MobileShellVisual() {
  return (
    <GlassThemeProvider theme={{ density: 'compact', brandColor: '#7dd3fc' }}>
      <main className="mobile-shell" data-visual-id="mobile-shell">
        <GlassTopBar brand="AuraGlass" actions={<GlassButton size="sm">Ship</GlassButton>} />
        <GlassPageHeader title="Release desk" description="Mobile app chrome baseline." />
        <GlassCard>
          <div className="mobile-row"><DashboardIcon /> Package gates</div>
          <div className="mobile-row"><SearchIcon /> Visual evidence</div>
          <div className="mobile-row"><SettingsIcon /> Migration docs</div>
        </GlassCard>
      </main>
    </GlassThemeProvider>
  );
}

function ReducedMotionVisual() {
  return (
    <Frame id="reduced-motion" title="Reduced motion baseline">
      <div className="reduced-grid">
        <GlassButton leftIcon={<SparkIcon />}>Motion safe action</GlassButton>
        <GlassCard>CSS media query: prefers-reduced-motion</GlassCard>
        <GlassCard>Animations should resolve without continuous motion.</GlassCard>
      </div>
    </Frame>
  );
}

function KeyboardQaVisual() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <Frame id="keyboard-qa" title="Keyboard QA fixture">
      <div className="keyboard-grid">
        <GlassDropdownMenu>
          <GlassDropdownMenuTrigger data-testid="keyboard-menu-trigger">
            Keyboard menu
          </GlassDropdownMenuTrigger>
          <GlassDropdownMenuContent data-testid="keyboard-menu-content">
            <GlassDropdownMenuItem>Open command center</GlassDropdownMenuItem>
            <GlassDropdownMenuItem>Duplicate workspace</GlassDropdownMenuItem>
          </GlassDropdownMenuContent>
        </GlassDropdownMenu>

        <GlassSelectRoot>
          <GlassSelectTrigger aria-label="Keyboard density" data-testid="keyboard-select-trigger">
            <GlassSelectValue placeholder="Choose density" />
          </GlassSelectTrigger>
          <GlassSelectContent data-testid="keyboard-select-content">
            <GlassSelectItem value="compact">Compact UI</GlassSelectItem>
            <GlassSelectItem value="balanced">Balanced surface</GlassSelectItem>
          </GlassSelectContent>
        </GlassSelectRoot>

        <GlassTabs defaultValue="overview" aria-label="Keyboard release views">
          <GlassTabsList data-testid="keyboard-tabs-list">
            <GlassTabsTrigger value="overview">Overview</GlassTabsTrigger>
            <GlassTabsTrigger value="gates">Gates</GlassTabsTrigger>
            <GlassTabsTrigger value="evidence">Evidence</GlassTabsTrigger>
          </GlassTabsList>
          <GlassTabsContent value="overview">Overview panel</GlassTabsContent>
          <GlassTabsContent value="gates">Gates panel</GlassTabsContent>
          <GlassTabsContent value="evidence">Evidence panel</GlassTabsContent>
        </GlassTabs>

        <GlassButton data-testid="keyboard-dialog-open" onClick={() => setDialogOpen(true)}>
          Open dialog
        </GlassButton>
        <GlassDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Keyboard dialog"
          description="Escape closes this dialog."
        >
          <GlassButton>Focusable dialog action</GlassButton>
        </GlassDialog>

        <GlassButton data-testid="keyboard-drawer-open" onClick={() => setDrawerOpen(true)}>
          Open drawer
        </GlassButton>
        <GlassDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          contained
          title="Keyboard drawer"
          description="Escape closes this drawer."
        >
          <GlassButton>Focusable drawer action</GlassButton>
        </GlassDrawer>

        <GlassTooltip content="Keyboard QA tooltip" showDelay={0}>
          <button className="plain-trigger" data-testid="keyboard-tooltip-trigger" type="button">
            Hover tooltip
          </button>
        </GlassTooltip>

        <GlassCommandPalette
          open
          contained
          positionStrategy="inline"
          enableRecents={false}
          showFooter={false}
          placeholder="Search keyboard actions"
          items={[
            { id: 'open-dashboard', label: 'Open dashboard', category: 'Navigation' },
            { id: 'audit-deps', label: 'Audit dependencies', category: 'Release' },
            { id: 'capture-visuals', label: 'Capture visual baselines', category: 'Visual QA' },
          ]}
        />
      </div>
    </Frame>
  );
}

function App() {
  switch (target) {
    case 'dropdown-menu':
      return <DropdownMenuVisual />;
    case 'select':
      return <SelectVisual />;
    case 'dialog':
      return <DialogVisual />;
    case 'drawer':
      return <DrawerVisual />;
    case 'popover':
      return <PopoverVisual />;
    case 'tooltip':
      return <TooltipVisual />;
    case 'tabs':
      return <TabsVisual />;
    case 'command-palette':
      return <CommandPaletteVisual />;
    case 'mobile-shell':
      return <MobileShellVisual />;
    case 'reduced-motion':
      return <ReducedMotionVisual />;
    case 'keyboard-qa':
      return <KeyboardQaVisual />;
    default:
      return <IconGallery />;
  }
}

const root = document.getElementById('root');
if (!root) throw new Error('Missing root element');
createRoot(root).render(<App />);
`;

const styles = `body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at 18% 18%, rgba(94, 234, 212, 0.34), transparent 34%),
    radial-gradient(circle at 84% 30%, rgba(168, 85, 247, 0.28), transparent 35%),
    #07111f;
  color: #f8fafc;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.visual-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 48px;
  box-sizing: border-box;
}

.visual-frame {
  width: min(940px, 100%);
  min-height: 540px;
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 24px;
  background: rgba(7, 17, 31, 0.72);
  box-shadow: 0 32px 120px rgba(0, 0, 0, 0.48);
  box-sizing: border-box;
  overflow: hidden;
}

.eyebrow {
  margin: 0 0 8px;
  color: #7dd3fc;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  margin: 0 0 24px;
  font-size: 34px;
  font-weight: 650;
}

.visual-surface {
  min-height: 380px;
  display: grid;
  place-items: center;
  gap: 20px;
}

.icon-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.icon-tile {
  min-height: 96px;
  display: grid;
  place-items: center;
  gap: 8px;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 16px;
  background: rgba(255,255,255,0.07);
}

.icon-tile span {
  font-size: 13px;
  color: rgba(248, 250, 252, 0.78);
}

.visual-menu {
  width: 280px;
}

.visual-select-trigger {
  min-width: 320px;
}

.stack {
  display: grid;
  gap: 12px;
}

.popover-content {
  display: grid;
  gap: 8px;
  min-width: 220px;
  padding: 14px;
}

.plain-trigger {
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 999px;
  background: rgba(255,255,255,0.10);
  color: #f8fafc;
  font: inherit;
}

.reduced-grid {
  display: grid;
  gap: 14px;
  width: min(520px, 100%);
}

.keyboard-grid {
  width: min(760px, 100%);
  display: grid;
  gap: 16px;
  align-items: start;
}

.mobile-shell {
  min-height: 100vh;
  padding: 16px;
  box-sizing: border-box;
  display: grid;
  align-content: start;
  gap: 16px;
  background:
    radial-gradient(circle at 10% 12%, rgba(94, 234, 212, 0.35), transparent 38%),
    radial-gradient(circle at 86% 26%, rgba(168, 85, 247, 0.32), transparent 40%),
    #07111f;
}

.mobile-row {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.10);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
`;

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const runKeyboardQa = async (browser, baseUrl) => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 920 } });
  const checks = [];

  const pass = async (id, action) => {
    await action();
    checks.push({ id, passed: true });
  };

  try {
    await page.goto(`${baseUrl}/?target=keyboard-qa`, { waitUntil: "networkidle" });
    await page.locator('[data-visual-id="keyboard-qa"]').waitFor({
      state: "visible",
      timeout: 30000,
    });

    await pass("dropdown opens from keyboard and closes on escape", async () => {
      const trigger = page.getByTestId("keyboard-menu-trigger");
      await trigger.focus();
      await page.keyboard.press("Enter");
      await page.getByText("Open command center").waitFor({ state: "visible" });
      await page.keyboard.press("Escape");
      await page.getByText("Open command center").waitFor({ state: "hidden" });
    });

    await pass("select opens from keyboard and closes on escape", async () => {
      const trigger = page.getByTestId("keyboard-select-trigger");
      await trigger.focus();
      await page.keyboard.press("Enter");
      await page.getByText("Balanced surface").waitFor({ state: "visible" });
      await page.keyboard.press("Escape");
      await page.getByText("Balanced surface").waitFor({ state: "hidden" });
    });

    await pass("tabs support arrow-key activation", async () => {
      const overview = page.getByRole("tab", { name: "Overview" });
      const gates = page.getByRole("tab", { name: "Gates" });
      await overview.focus();
      await page.keyboard.press("ArrowRight");
      await gates.waitFor({ state: "visible" });
      assert(
        (await gates.getAttribute("aria-selected")) === "true",
        "Expected Gates tab to be selected after ArrowRight."
      );
    });

    await pass("dialog opens from button and closes on escape", async () => {
      await page.getByTestId("keyboard-dialog-open").click();
      await page.getByRole("dialog", { name: "Keyboard dialog" }).waitFor({
        state: "visible",
      });
      await page.keyboard.press("Escape");
      await page.getByRole("dialog", { name: "Keyboard dialog" }).waitFor({
        state: "hidden",
      });
    });

    await pass("drawer opens from button and closes on escape", async () => {
      await page.getByTestId("keyboard-drawer-open").click();
      await page.getByRole("dialog", { name: "Keyboard drawer" }).waitFor({
        state: "visible",
      });
      await page.keyboard.press("Escape");
      await page.getByRole("dialog", { name: "Keyboard drawer" }).waitFor({
        state: "hidden",
      });
    });

    await pass("tooltip appears on pointer hover", async () => {
      await page.getByTestId("keyboard-tooltip-trigger").hover();
      await page.getByRole("tooltip").waitFor({ state: "visible" });
    });

    await pass("command palette search input filters commands", async () => {
      const search = page.getByPlaceholder("Search keyboard actions");
      await search.fill("audit");
      await page.getByText("Audit dependencies").waitFor({ state: "visible" });
      assert(
        !(await page.getByText("Open dashboard").isVisible()),
        "Expected unmatched command item to be hidden after filtering."
      );
    });

    return checks;
  } finally {
    await page.close();
  }
};

const main = async () => {
  console.log("Running AuraGlass app-chrome visual baseline gate...");

  if (!skipBuild) {
    run("npm run build", { cwd: projectRoot });
  } else {
    console.log("Skipping AuraGlass rebuild (skip-build flag set).");
  }

  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "auraglass-app-chrome-"));
  const packOutput = runWithOutput(
    `npm pack --dry-run=false --json --pack-destination ${tmpRoot}`,
    { cwd: projectRoot }
  );
  const packInfo = JSON.parse(packOutput)[0];
  if (!packInfo || !packInfo.filename) {
    throw new Error("Failed to generate npm pack tarball for AuraGlass.");
  }

  const appDir = path.join(tmpRoot, "app-chrome-visuals");
  fs.mkdirSync(appDir);
  const tarballPath = path.join(tmpRoot, packInfo.filename);
  const relativeTarball = path.relative(appDir, tarballPath);

  writeFile(
    appDir,
    "package.json",
    JSON.stringify(
      {
        name: "auraglass-app-chrome-visuals",
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
          "framer-motion": "^11.18.2",
          react: "18.2.0",
          "react-dom": "18.2.0",
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
  writeFile(appDir, "src/App.tsx", appSource);
  writeFile(appDir, "src/styles.css", styles);

  console.log("Installing app-chrome visual dependencies...");
  run("npm install --dry-run=false --prefer-offline --no-audit --no-fund", {
    cwd: appDir,
  });

  console.log("Building app-chrome visual fixture...");
  run("npm run build", { cwd: appDir });

  const port = 4691;
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

    const screenshotDir = path.join(projectRoot, "reports", "3.3-release", "app-chrome-visuals");
    fs.rmSync(screenshotDir, { recursive: true, force: true });
    fs.mkdirSync(screenshotDir, { recursive: true });

    const browser = await chromium.launch();
    const screenshots = [];
    const pageErrors = [];
    const consoleErrors = [];

    for (const target of targets) {
      const page = await browser.newPage({
        viewport: target.viewport,
        reducedMotion: target.reducedMotion,
      });
      page.on("pageerror", (error) => pageErrors.push({ target: target.id, message: error.message }));
      page.on("console", (message) => {
        if (message.type() === "error") {
          consoleErrors.push({ target: target.id, message: message.text() });
        }
      });

      await page.goto(`http://127.0.0.1:${port}/?target=${encodeURIComponent(target.id)}`, {
        waitUntil: "networkidle",
      });
      await page.locator(`[data-visual-id="${target.id}"]`).waitFor({
        state: "visible",
        timeout: 30000,
      });
      if (target.beforeScreenshot) {
        await target.beforeScreenshot(page);
      }

      const screenshotPath = path.join(screenshotDir, `${safeId(target.id)}.png`);
      if (target.page) {
        await page.screenshot({ path: screenshotPath, fullPage: true });
      } else {
        await page.locator(`[data-visual-id="${target.id}"]`).screenshot({
          path: screenshotPath,
        });
      }
      screenshots.push({
        id: target.id,
        file: path.relative(projectRoot, screenshotPath),
        viewport: target.viewport,
        reducedMotion: target.reducedMotion ?? "no-preference",
      });
      await page.close();
    }

    const keyboardChecks = await runKeyboardQa(
      browser,
      `http://127.0.0.1:${port}`
    );

    await browser.close();

    if (pageErrors.length > 0 || consoleErrors.length > 0) {
      throw new Error(
        `App-chrome visual fixture emitted browser errors.\npageErrors=${JSON.stringify(pageErrors, null, 2)}\nconsoleErrors=${JSON.stringify(consoleErrors, null, 2)}`
      );
    }

    const report = {
      generatedAt: new Date().toISOString(),
      package: packInfo.name,
      version: packInfo.version,
      filename: packInfo.filename,
      shasum: packInfo.shasum,
      integrity: packInfo.integrity,
      targetCount: targets.length,
      appDir,
      screenshots,
      keyboardChecks,
      passed: screenshots.length === targets.length,
    };

    const reportDir = path.join(projectRoot, "reports", "3.3-release");
    fs.writeFileSync(
      path.join(reportDir, "app-chrome-visual-evidence.json"),
      `${JSON.stringify(report, null, 2)}\n`,
      "utf8"
    );
    fs.writeFileSync(
      path.join(reportDir, "app-chrome-visual-evidence.md"),
      `# 3.3 App-Chrome Visual Evidence

Generated at: ${report.generatedAt}

Command:

\`\`\`bash
node scripts/ci/verify-app-chrome-visuals.js
\`\`\`

Result: pass. The script packed \`${packInfo.name}@${packInfo.version}\`, installed the tarball into a temporary Vite app, rendered the app-chrome surfaces from public package entrypoints, loaded each target in Chromium, and captured visual baselines.

| Target | Viewport | Reduced motion | Screenshot |
| --- | --- | --- | --- |
${screenshots
  .map(
    (screenshot) =>
      `| \`${screenshot.id}\` | ${screenshot.viewport.width}x${screenshot.viewport.height} | \`${screenshot.reducedMotion}\` | [${path.basename(screenshot.file)}](./app-chrome-visuals/${path.basename(screenshot.file)}) |`
  )
  .join("\n")}

## Keyboard QA

The same packed-package fixture also runs browser keyboard and interaction checks:

| Check | Status |
| --- | --- |
${keyboardChecks.map((check) => `| ${check.id} | ${check.passed ? "Pass" : "Fail"} |`).join("\n")}
`,
      "utf8"
    );

    console.log(
      `App-chrome visual gate passed for ${screenshots.length} targets and ${keyboardChecks.length} keyboard checks.`
    );
  } finally {
    server.kill("SIGTERM");
    const reportDir = path.join(projectRoot, "reports", "3.3-release");
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(path.join(reportDir, "app-chrome-visual-server.log"), serverLog, "utf8");
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
