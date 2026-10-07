import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(__dirname, "..");

const read = (relativePath: string) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const unique = (values: string[]) => [...new Set(values)];

describe("documented capabilities match shipped source", () => {
  test("docs/package-entrypoints.md only names real package.json exports", () => {
    const pkg = JSON.parse(read("package.json")) as {
      exports: Record<string, unknown>;
    };
    const docs = read("docs/package-entrypoints.md");
    const mentioned = unique(
      [...docs.matchAll(/`aura-glass(\/[a-z0-9./-]+)?`/g)].map((match) =>
        match[1] ? `.${match[1]}` : "."
      )
    );

    const exportPaths = Object.keys(pkg.exports);
    expect(mentioned.length).toBeGreaterThan(10);
    for (const entry of mentioned) {
      expect(exportPaths).toContain(entry);
    }
  });

  test("docs/app-shell/readme.md only names exports from src/app-shell/components.tsx", () => {
    const docs = read("docs/app-shell/readme.md");
    const source = read("src/app-shell/components.tsx");
    const documented = unique(
      [...docs.matchAll(/`\b(Glass[A-Za-z]+)\b`/g)].map((match) => match[1])
    ).filter(
      (name) =>
        ![
          "GlassButton",
          "GlassCard",
          "GlassHeader",
          "GlassSidebar",
        ].includes(name)
    );

    expect(documented).toEqual(
      expect.arrayContaining([
        "GlassAppShell",
        "GlassTopBar",
        "GlassSidebarRail",
        "GlassMobileShell",
      ])
    );

    for (const name of documented) {
      expect(source).toMatch(new RegExp(`export const ${name}\\b`));
    }
  });

  test("docs/icons/readme.md *Icon aliases exist in src/icons/components.tsx", () => {
    const docs = read("docs/icons/readme.md");
    const source = read("src/icons/components.tsx");
    const aliases = unique(
      [...docs.matchAll(/`([A-Z][A-Za-z]+Icon)`/g)].map((match) => match[1])
    );

    expect(aliases.length).toBeGreaterThan(20);
    for (const name of aliases) {
      expect(source).toMatch(new RegExp(`export const ${name} =`));
    }

    const registryNames = unique(
      [
        ...docs.matchAll(
          /`((?:activity|alert|archive|calendar|check|close|command|data|filter|home|loading|menu|notification|search|settings|spark|user|users|warning))`/g
        ),
      ].map((match) => match[1])
    );

    expect(registryNames).toContain("search");
    for (const name of registryNames) {
      expect(source).toMatch(new RegExp(`\\b${name}:`));
    }
  });

  test("docs/theme/theme-engine.md APIs and material presets exist in src/theme", () => {
    const docs = read("docs/theme/theme-engine.md");
    const index = read("src/theme/index.ts");
    const materials = read("src/theme/materials.ts");
    const apis = [
      "GlassThemeProvider",
      "createGlassTheme",
      "createBrandGlassTheme",
      "createGlassThemeCssVars",
      "useGlassTheme",
      "useGlassDensity",
      "useGlassMotionPolicy",
      "glassMaterialPresets",
    ];

    for (const name of apis) {
      expect(docs).toContain(name);
      expect(index).toMatch(new RegExp(`\\b${name}\\b`));
    }

    for (const preset of ["clear", "regular", "dense", "luminous", "inset"]) {
      expect(docs).toContain(`\`${preset}\``);
      expect(materials).toMatch(new RegExp(`\\b${preset}:`));
    }

    for (const missing of ["frosted", "prism", "aurora", "chrome", "holo", "tinted"]) {
      expect(materials).not.toMatch(new RegExp(`\\b${missing}\\s*:`));
    }
  });

  test("docs/cli/migration.md commands exist in bin/aura-glass.cjs", () => {
    const docs = read("docs/cli/migration.md");
    const cli = read("bin/aura-glass.cjs");
    const commands = [
      "list",
      "info <recipe>",
      "add <recipe|all>",
      "audit deps",
      "audit imports",
      "migrate icons --from lucide",
      "migrate radix",
      "migrate mui",
      "doctor",
    ];

    for (const command of commands) {
      expect(docs).toContain(command);
      expect(cli).toContain(command);
    }
  });

  test("docs/deployment.md routes exist on the production API server", () => {
    const docs = read("docs/deployment.md");
    const server = read("server/index.ts");
    const routes: Array<{ path: string; source: RegExp }> = [
      { path: "/health", source: /app\.get\(\s*"\/health"/ },
      { path: "/ready", source: /app\.get\(\s*"\/ready"/ },
      { path: "/api/auth/login", source: /authRouter\.post\(\s*"\/login"/ },
      { path: "/api/auth/register", source: /authRouter\.post\(\s*"\/register"/ },
      { path: "/api/auth/refresh", source: /authRouter\.post\(\s*"\/refresh"/ },
      { path: "/api/auth/logout", source: /authRouter\.post\(\s*"\/logout"/ },
      { path: "/api/ai/generate-form", source: /aiRouter\.post\(\s*"\/generate-form"/ },
      { path: "/api/ai/search", source: /aiRouter\.post\(\s*"\/search"/ },
      { path: "/api/ai/index-documents", source: /aiRouter\.post\(\s*"\/index-documents"/ },
      { path: "/api/ai/analyze-image", source: /aiRouter\.post\(\s*"\/analyze-image"/ },
      { path: "/api/ai/remove-background", source: /aiRouter\.post\(\s*"\/remove-background"/ },
      { path: "/api/ai/summarize", source: /aiRouter\.post\(\s*"\/summarize"/ },
    ];

    for (const route of routes) {
      expect(docs).toContain(route.path);
      expect(server).toMatch(route.source);
    }

    expect(server).toContain('API_SERVER_PORT || "3002"');
    expect(read("server/websocket-server.js")).toContain(
      "process.env.WS_PORT || 3001"
    );
    expect(read("Dockerfile")).toContain("dist/server/server/index.js");
    expect(read("docker-compose.yml")).toContain(
      "node dist/server/server/index.js"
    );
  });

  test("removed prompt/PRD/todo files are gone", () => {
    for (const relativePath of [
      "auraglass32PRD.md",
      "auraglass33PRD.md",
      "PROMPT.md",
      "GoLiveCheckList.md",
    ]) {
      expect(fs.existsSync(path.join(repoRoot, relativePath))).toBe(false);
    }
  });
});
