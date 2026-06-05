#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");

const projectRoot = path.resolve(__dirname, "..", "..");
const cliPath = path.join(projectRoot, "bin", "aura-glass.cjs");

const recipe33Ids = [
  "ai-ops-control-room",
  "semantic-search-console",
  "vision-review-workbench",
  "collaboration-room-console",
  "support-triage-workspace",
  "release-command-center",
  "developer-docs-portal",
  "marketing-launch-kit",
];

const providerBackedRecipeSmoke = [
  {
    id: "ai-ops-control-room",
    route: "/api/ai/provider-status",
    method: "GET",
    requiredText: [
      "Provider unconfigured",
      "OPENAI_API_KEY",
      "Rate limit",
      "Prompt safety review",
    ],
  },
  {
    id: "semantic-search-console",
    route: "/api/ai/semantic-search",
    method: "POST",
    requiredText: [
      "Search provider unconfigured",
      "Embeddings and vector index are disabled",
      "No indexed documents",
    ],
  },
  {
    id: "vision-review-workbench",
    route: "/api/ai/vision/analyze",
    method: "POST",
    requiredText: [
      "Vision provider not configured",
      "VISION_PROVIDER_READY=false",
      "Image upload is disabled",
    ],
  },
  {
    id: "support-triage-workspace",
    route: "/api/ai/summarize",
    method: "POST",
    requiredText: [
      "AI summary action is fail-closed",
      "POST /api/ai/summarize returns provider-unconfigured",
      "Generate summary after setup",
    ],
  },
];

const serverSafeRecipeSmoke = [
  {
    id: "collaboration-room-console",
    requiredText: [
      "Editing unsupported",
      "Collaboration transport is disconnected by default",
      "No live cursor stream",
    ],
    forbiddenPatterns: [
      /\bnew\s+WebSocket\b/,
      /\bio\s*\(/,
      /\bsocket\.emit\b/,
    ],
  },
];

const providerRouteFixtures = new Map([
  [
    "GET /api/ai/provider-status",
    {
      ok: true,
      provider: "mock",
      configured: true,
      budget: { dailyUsd: 0, monthlyUsd: 0 },
      rateLimit: { remaining: 100, resetSeconds: 60 },
    },
  ],
  [
    "POST /api/ai/semantic-search",
    {
      ok: true,
      provider: "mock",
      query: "release evidence",
      results: [
        {
          id: "doc-1",
          title: "Mocked release evidence",
          score: 0.98,
        },
      ],
    },
  ],
  [
    "POST /api/ai/vision/analyze",
    {
      ok: true,
      provider: "mock",
      labels: ["interface", "document"],
      ocr: "mocked OCR result",
      safeSearch: "pass",
    },
  ],
  [
    "POST /api/ai/summarize",
    {
      ok: true,
      provider: "mock",
      summary: "Mocked support summary",
      citations: ["ticket-123"],
    },
  ],
]);

const runCli = (args, options = {}) => {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd: options.cwd ?? projectRoot,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(
      `aura-glass ${args.join(" ")} failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
    );
  }

  return result.stdout;
};

const runCliJson = (args, options) => JSON.parse(runCli(args, options));

const assertNoForbiddenCoreImports = (recipeId, content) => {
  for (const forbidden of ["lucide-react", "@radix-ui/", "@mui/material", "@mui/icons-material"]) {
    assert.ok(
      !content.includes(forbidden),
      `${recipeId} should not scaffold forbidden core UI import ${forbidden}`
    );
  }
};

const assertTranspiles = (recipeId, filePath, content) => {
  const result = ts.transpileModule(content, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filePath,
    reportDiagnostics: true,
  });

  const diagnostics = (result.diagnostics || []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
  );

  assert.equal(
    diagnostics.length,
    0,
    `${recipeId} should transpile cleanly: ${diagnostics
      .map((diagnostic) => diagnostic.messageText)
      .join("; ")}`
  );
};

const mockProviderFetch = async (route, options = {}) => {
  const method = String(options.method || "GET").toUpperCase();
  const key = `${method} ${route}`;
  const payload = providerRouteFixtures.get(key);

  if (!payload) {
    return {
      ok: false,
      status: 404,
      json: async () => ({ ok: false, error: `No mocked route fixture for ${key}` }),
    };
  }

  return {
    ok: true,
    status: 200,
    json: async () => payload,
  };
};

const assertProviderBackedRecipeSmoke = async (recipeInfoById) => {
  for (const smoke of providerBackedRecipeSmoke) {
    const recipe = recipeInfoById.get(smoke.id);
    assert.ok(recipe, `${smoke.id} should have recipe info loaded`);

    const content = recipe.files.map((file) => file.content).join("\n");
    for (const text of smoke.requiredText) {
      assert.ok(
        content.includes(text),
        `${smoke.id} should include provider-safe text: ${text}`
      );
    }

    assert.ok(
      !/\bfetch\s*\(/.test(content),
      `${smoke.id} should not call provider routes during scaffolded render`
    );

    const response = await mockProviderFetch(smoke.route, { method: smoke.method });
    assert.equal(response.status, 200, `${smoke.id} mocked provider route should return 200`);
    const payload = await response.json();
    assert.equal(payload.provider, "mock", `${smoke.id} mocked provider route should identify mock provider`);
    assert.equal(payload.ok, true, `${smoke.id} mocked provider route should return ok payload`);
  }
};

const assertServerSafeRecipeSmoke = (recipeInfoById) => {
  for (const smoke of serverSafeRecipeSmoke) {
    const recipe = recipeInfoById.get(smoke.id);
    assert.ok(recipe, `${smoke.id} should have recipe info loaded`);

    const content = recipe.files.map((file) => file.content).join("\n");
    for (const text of smoke.requiredText) {
      assert.ok(content.includes(text), `${smoke.id} should include server-safe text: ${text}`);
    }

    for (const pattern of smoke.forbiddenPatterns) {
      assert.ok(
        !pattern.test(content),
        `${smoke.id} should not open live collaboration transports in the scaffold`
      );
    }
  }
};

const main = async () => {
  const list = runCliJson(["list", "--json"]);
  assert.ok(list.length >= 28, "CLI list should expose the 3.3 recipe registry");

  const listedById = new Map(list.map((recipe) => [recipe.id, recipe]));
  for (const id of recipe33Ids) {
    const listed = listedById.get(id);
    assert.ok(listed, `${id} should be listed by aura-glass list --json`);
    assert.ok(listed.title, `${id} should expose a title`);
    assert.ok(listed.category, `${id} should expose a category`);
    assert.ok(Array.isArray(listed.files) && listed.files.length > 0, `${id} should expose files`);
    assert.ok(
      Array.isArray(listed.imports) && listed.imports.length > 0,
      `${id} should expose public AuraGlass imports`
    );
  }

  const recipeInfoById = new Map();
  for (const id of recipe33Ids) {
    const info = runCliJson(["info", id, "--json"]);
    recipeInfoById.set(id, info);

    assert.equal(info.id, id, `${id} info should round-trip the recipe id`);
    assert.ok(info.description, `${id} info should expose a description`);
    assert.ok(Array.isArray(info.accessibility) && info.accessibility.length > 0, `${id} should expose accessibility notes`);
    assert.ok(Array.isArray(info.performance) && info.performance.length > 0, `${id} should expose performance notes`);
    assert.ok(Array.isArray(info.tokens) && info.tokens.length > 0, `${id} should expose token guidance`);

    for (const file of info.files) {
      assert.ok(file.path.endsWith(".tsx"), `${id} should scaffold TSX recipe files`);
      assert.ok(
        file.content.includes("import 'aura-glass/styles';"),
        `${id} should include the canonical AuraGlass CSS import`
      );
      assertNoForbiddenCoreImports(id, file.content);
      assertTranspiles(id, file.path, file.content);
    }

    const dryRun = runCliJson(["add", id, "--dry-run", "--json"]);
    assert.equal(dryRun.length, 1, `${id} dry-run should return one result`);
    assert.equal(dryRun[0].recipe, id, `${id} dry-run should identify the recipe`);
    assert.equal(dryRun[0].skipped.length, 0, `${id} dry-run should not skip files`);
    assert.ok(dryRun[0].written.length > 0, `${id} dry-run should report written files`);
    for (const file of dryRun[0].written) {
      assert.ok(
        file.path.startsWith("src/components/auraglass/recipes/"),
        `${id} dry-run should use the default recipe output directory`
      );
      assert.ok(file.path.endsWith(".tsx"), `${id} dry-run should report TSX output`);
      assert.ok(file.bytes > 0, `${id} dry-run should report non-empty file bytes`);
    }
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "auraglass-33-recipes-cli-"));
  const dryRunOut = "src/generated/aura-recipes";
  const allDryRun = runCliJson([
    "add",
    "all",
    "--cwd",
    tempDir,
    "--out",
    dryRunOut,
    "--dry-run",
    "--json",
  ]);
  assert.equal(allDryRun.length, list.length, "add all --dry-run --json should report every recipe");
  assert.deepEqual(
    recipe33Ids.filter((id) => allDryRun.some((result) => result.recipe === id)),
    recipe33Ids,
    "add all --dry-run --json should include every 3.3 recipe"
  );
  for (const result of allDryRun) {
    assert.equal(result.skipped.length, 0, `${result.recipe} dry-run should not skip files`);
    for (const file of result.written) {
      assert.ok(
        file.path.startsWith(`${dryRunOut}/`),
        `${result.recipe} dry-run should honor --out`
      );
      assert.ok(file.bytes > 0, `${result.recipe} dry-run should report non-empty bytes`);
      assert.equal(
        fs.existsSync(path.join(tempDir, file.path)),
        false,
        `${result.recipe} dry-run should not create files`
      );
    }
  }

  const writeOut = "app/auraglass-recipes";
  const allWrite = runCliJson([
    "add",
    "all",
    "--cwd",
    tempDir,
    "--out",
    writeOut,
    "--json",
  ]);
  assert.equal(allWrite.length, list.length, "add all --json should write every recipe");
  assert.deepEqual(
    recipe33Ids.filter((id) => allWrite.some((result) => result.recipe === id)),
    recipe33Ids,
    "add all --json should include every 3.3 recipe"
  );

  for (const result of allWrite) {
    assert.equal(result.skipped.length, 0, `${result.recipe} write should not skip files in a fresh temp dir`);
    for (const file of result.written) {
      const outputPath = path.join(tempDir, file.path);
      assert.ok(file.path.startsWith(`${writeOut}/`), `${result.recipe} write should honor --out`);
      assert.ok(fs.existsSync(outputPath), `${result.recipe} write should create ${file.path}`);
      const content = fs.readFileSync(outputPath, "utf8");
      assert.ok(content.includes("aura-glass/styles"), `${result.recipe} output should include styles`);
      assertNoForbiddenCoreImports(result.recipe, content);
      assertTranspiles(result.recipe, file.path, content);
    }
  }

  await assertProviderBackedRecipeSmoke(recipeInfoById);
  assertServerSafeRecipeSmoke(recipeInfoById);

  console.log(
    `[verify-recipes-cli] verified ${recipe33Ids.length} AuraGlass 3.3 recipes through list/info/add/add all/--dry-run/--json/--out and mocked provider-safe smoke`
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
