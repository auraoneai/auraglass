"use client";

import fs from "fs";
import path from "path";

const repoRoot = path.resolve(__dirname, "../..");

const collectFiles = (dir: string, extensions: Set<string>): string[] => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(repoRoot, fullPath);

    if (
      entry.isDirectory() &&
      !["dist", "node_modules", "__snapshots__"].includes(entry.name)
    ) {
      files.push(...collectFiles(fullPath, extensions));
    } else if (
      entry.isFile() &&
      extensions.has(path.extname(entry.name)) &&
      !relativePath.includes(`${path.sep}__snapshots__${path.sep}`)
    ) {
      files.push(fullPath);
    }
  }

  return files;
};

describe("upstream glass regressions", () => {
  it("does not use numeric alpha as a var() fallback for glass color tokens", () => {
    const scanRoots = ["src", "scripts"].map((root) =>
      path.join(repoRoot, root)
    );
    const sourceFiles = scanRoots.flatMap((root) =>
      collectFiles(root, new Set([".ts", ".tsx", ".js", ".css"]))
    );
    const malformedUsages = sourceFiles.flatMap((file) => {
      const content = fs.readFileSync(file, "utf8");
      const matches = content.match(/var\(--glass-color-[^)]+,\s*0?\.\d+\)/g);

      return matches
        ? matches.map((match) => `${path.relative(repoRoot, file)}: ${match}`)
        : [];
    });

    expect(malformedUsages).toEqual([]);
  });

  it("keeps generated neutral and primary glass surfaces token driven", () => {
    const generatedCss = fs.readFileSync(
      path.join(repoRoot, "src/styles/glass.generated.css"),
      "utf8"
    );

    expect(generatedCss).not.toMatch(
      /rgba\((59,\s*130,\s*246|147,\s*51,\s*234|29,\s*78,\s*216)/
    );
    expect(generatedCss).toContain("hsl(var(--glass-color-primary)");
    expect(generatedCss).toMatch(/rgba\(255,\s*255,\s*255/);
  });

  it("does not throw provider-required errors from exported provider hooks", () => {
    const providerHookErrors = [
      "useHoudiniGlass must be used within",
      "useCollaboration must be used within",
      "useMotionController must be used within",
      "useAccessibility must be used within",
      "useMedia must be used within",
      "useDragDrop must be used within",
      "useSettings must be used within",
      "useConsciousnessStream must be used within",
      "useToast must be used within",
      "useNeuroSync must be used within",
      "useGlassEngine must be used within",
      "useEcommerce must be used within",
    ];
    const sourceFiles = collectFiles(
      path.join(repoRoot, "src"),
      new Set([".ts", ".tsx"])
    ).filter((file) => !file.includes(`${path.sep}__tests__${path.sep}`));
    const matches = sourceFiles.flatMap((file) => {
      const content = fs.readFileSync(file, "utf8");
      return providerHookErrors
        .filter((message) => content.includes(message))
        .map((message) => `${path.relative(repoRoot, file)}: ${message}`);
    });

    expect(matches).toEqual([]);
  });

  it("exports the real collaboration provider from the package barrel", () => {
    const indexSource = fs.readFileSync(
      path.join(repoRoot, "src/index.ts"),
      "utf8"
    );
    const workspaceSource = fs.readFileSync(
      path.join(
        repoRoot,
        "src/components/collaboration/CollaborativeGlassWorkspace.tsx"
      ),
      "utf8"
    );

    expect(indexSource).toContain(
      "GlassCollaborationProvider,\n  useCollaboration,"
    );
    expect(indexSource).toContain(
      'from "./components/collaboration/GlassCollaborationProvider"'
    );
    expect(indexSource).not.toMatch(
      /GlassCollaborationProvider,[\s\S]+from "\.\/components\/collaboration\/CollaborativeGlassWorkspace"/
    );
    expect(workspaceSource).not.toMatch(
      /export function GlassCollaborationProvider/
    );
  });

  it("normalizes every native color input value before render", () => {
    const sourceFiles = collectFiles(
      path.join(repoRoot, "src"),
      new Set([".tsx"])
    ).filter((file) => !file.includes(`${path.sep}__tests__${path.sep}`));
    const rawColorInputs = sourceFiles.flatMap((file) => {
      const content = fs.readFileSync(file, "utf8");
      const blocks =
        content.match(/<input[\s\S]*?type="color"[\s\S]*?\/>/g) ?? [];

      return blocks
        .filter((block) => !block.includes("normalizeColorInputValue"))
        .map((block) => `${path.relative(repoRoot, file)}: ${block}`);
    });

    expect(rawColorInputs).toEqual([]);
  });

  it("keeps glass surfaces from inheriting page-level light text tokens", () => {
    const tokenSource = fs.readFileSync(
      path.join(repoRoot, "src/tokens/glass.ts"),
      "utf8"
    );
    const glassCss = fs.readFileSync(
      path.join(repoRoot, "src/styles/glass.css"),
      "utf8"
    );

    expect(tokenSource).toContain(
      '"--glass-text-primary": surface.text.primary'
    );
    expect(tokenSource).toContain(
      '"--glass-text-secondary": surface.text.secondary'
    );
    expect(tokenSource).toContain(
      '"--typography-text-primary": surface.text.primary'
    );
    expect(glassCss).toContain(
      "rgba(var(--glass-color-white) / var(--glass-opacity-95))"
    );
    expect(glassCss).not.toContain(
      "--glass-text-primary: var(--glass-theme-text, currentColor)"
    );
  });

  it("does not show debug HUDs in consumer development builds unless opted in", () => {
    const sourceFiles = collectFiles(
      path.join(repoRoot, "src"),
      new Set([".ts", ".tsx"])
    );
    const implicitDebugHud = sourceFiles.flatMap((file) => {
      const content = fs.readFileSync(file, "utf8");
      return /showDebugHud\s*\|\|\s*process\.env\.NODE_ENV\s*===\s*["']development["']/.test(
        content
      )
        ? [path.relative(repoRoot, file)]
        : [];
    });

    expect(implicitDebugHud).toEqual([]);
  });

  it("does not hard-code a desktop minimum width into the data grid table", () => {
    const dataGridCss = fs.readFileSync(
      path.join(
        repoRoot,
        "src/components/data-display/GlassDataGrid.module.css"
      ),
      "utf8"
    );

    expect(dataGridCss).not.toContain("min-width: max(640px, 100%)");
    expect(dataGridCss).toContain(
      "min-width: var(--glass-datagrid-min-width, 100%)"
    );
  });

  it("does not force light-context text tokens onto neutral glass surfaces by default", () => {
    const glassCss = fs.readFileSync(
      path.join(repoRoot, "src/styles/glass.css"),
      "utf8"
    );
    const typographyCss = fs.readFileSync(
      path.join(repoRoot, "src/styles/typography.css"),
      "utf8"
    );

    expect(glassCss).not.toContain(
      ':root:not([data-theme="dark"]) .glass-surface-neutral'
    );
    expect(glassCss).not.toContain(
      ':root:not([data-theme="dark"]) .glass-surface-secondary'
    );
    expect(glassCss).toContain(".glass-on-light.glass-surface-neutral");
    expect(glassCss).toContain(
      "color: var(--glass-theme-text, var(--glass-text-primary)) !important;"
    );
    expect(typographyCss).toContain(
      "color: var(--glass-theme-text, var(--typography-text-primary)) !important;"
    );
  });

  it("uses stable tab keys when tab value is omitted", () => {
    const tabBarSource = fs.readFileSync(
      path.join(repoRoot, "src/components/navigation/GlassTabBar.tsx"),
      "utf8"
    );

    expect(tabBarSource).toContain(
      "const tabKey = tab.value ?? tab.id ?? index"
    );
    expect(tabBarSource).not.toContain("key={`tab-${tab.value}`}");
  });

  it("does not clone shell control props into arbitrary header or sidebar nodes", () => {
    const shellSource = fs.readFileSync(
      path.join(repoRoot, "src/components/layout/GlassAppShell.tsx"),
      "utf8"
    );

    expect(shellSource).toContain(
      'canEnhanceElement(sidebar, ["GlassSidebar"])'
    );
    expect(shellSource).toContain('canEnhanceElement(header, ["GlassHeader"])');
  });

  it("does not mirror fresh default arrays into state in file components", () => {
    const uploadSource = fs.readFileSync(
      path.join(repoRoot, "src/components/interactive/GlassFileUpload.tsx"),
      "utf8"
    );
    const treeSource = fs.readFileSync(
      path.join(repoRoot, "src/components/interactive/GlassFileTree.tsx"),
      "utf8"
    );

    expect(uploadSource).toContain("const EMPTY_UPLOADED_FILES");
    expect(uploadSource).toContain("files = EMPTY_UPLOADED_FILES");
    expect(treeSource).toContain("const EMPTY_EXPANDED_NODES");
    expect(treeSource).toContain("expandedNodes = EMPTY_EXPANDED_NODES");
  });
});
