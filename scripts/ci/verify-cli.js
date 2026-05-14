#!/usr/bin/env node

const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..", "..");
const cliPath = path.join(projectRoot, "bin", "aura-glass.cjs");

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

const writeFile = (root, relativePath, contents) => {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, "utf8");
  return filePath;
};

const recipes = JSON.parse(runCli(["list", "--json"]));
assert.ok(recipes.length >= 20, "CLI should expose the 3.2 launch recipe registry");
assert.ok(
  recipes.some((recipe) => recipe.id === "saas-dashboard"),
  "saas-dashboard should be listed"
);
assert.ok(
  recipes.some((recipe) => recipe.id === "saas-admin-shell"),
  "saas-admin-shell should be listed"
);
assert.ok(
  recipes.some((recipe) => recipe.id === "creator-studio-dashboard"),
  "creator-studio-dashboard should be listed"
);
assert.ok(
  recipes.every((recipe) => Array.isArray(recipe.imports) && recipe.imports.length > 0),
  "each recipe should list public AuraGlass imports"
);

const info = JSON.parse(runCli(["info", "ai-command-center", "--json"]));
assert.equal(info.id, "ai-command-center");
assert.ok(
  info.files[0].content.includes("import 'aura-glass/styles';"),
  "recipe files should include the canonical CSS import"
);

const appShellInfo = JSON.parse(runCli(["info", "saas-admin-shell", "--json"]));
assert.equal(appShellInfo.id, "saas-admin-shell");
assert.ok(
  appShellInfo.files[0].content.includes("aura-glass/app-shell"),
  "3.2 recipes should document the app shell entrypoint"
);
assert.ok(
  appShellInfo.files[0].content.includes("aura-glass/icons/navigation"),
  "3.2 recipes should document category icon entrypoints"
);

for (const recipe of recipes) {
  const result = JSON.parse(runCli(["add", recipe.id, "--dry-run", "--json"]));
  assert.equal(result[0].recipe, recipe.id);
  assert.ok(result[0].written[0].path.endsWith(".tsx"), `${recipe.id} should scaffold a TSX file`);
}

const dryRun = JSON.parse(runCli(["add", "media-player-surface", "--dry-run", "--json"]));
assert.equal(dryRun[0].recipe, "media-player-surface");
assert.equal(dryRun[0].written[0].path, "src/components/auraglass/recipes/MediaPlayerSurface.tsx");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "auraglass-cli-"));
const writeResult = JSON.parse(
  runCli(["add", "settings-billing", "--cwd", tempDir, "--json"])
);
assert.equal(writeResult[0].recipe, "settings-billing");

const outputPath = path.join(
  tempDir,
  "src",
  "components",
  "auraglass",
  "recipes",
  "SettingsBillingPage.tsx"
);
const output = fs.readFileSync(outputPath, "utf8");
assert.ok(output.includes("GlassForm"), "generated recipe should contain AuraGlass imports");
assert.ok(output.includes("aura-glass/styles"), "generated recipe should include styles");

const auditDeps = JSON.parse(runCli(["audit", "deps", "--json"]));
assert.equal(auditDeps.findings.length, 0, "dependency audit should pass");

const auditImports = JSON.parse(runCli(["audit", "imports", "--json"]));
assert.equal(auditImports.findings.length, 0, "import audit should pass");

const lucideMigration = JSON.parse(runCli(["migrate", "icons", "--from", "lucide", "--dry-run", "--json"]));
assert.equal(lucideMigration.from, "lucide");
assert.equal(lucideMigration.mode, "dry-run");

const radixMigration = JSON.parse(runCli(["migrate", "radix", "--dry-run", "--json"]));
assert.equal(radixMigration.mode, "dry-run");

const muiMigration = JSON.parse(runCli(["migrate", "mui", "--dry-run", "--json"]));
assert.equal(muiMigration.mode, "dry-run");

const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), "auraglass-cli-fixture-"));
writeFile(
  fixtureDir,
  "package.json",
  JSON.stringify(
    {
      name: "auraglass-cli-fixture",
      private: true,
      dependencies: {
        "aura-glass": "file:../aura-glass.tgz",
        "lucide-react": "^0.468.0",
        "@mui/material": "^6.0.0",
      },
      devDependencies: {
        "@radix-ui/react-select": "^2.0.0",
      },
    },
    null,
    2
  )
);
const fixtureSource = writeFile(
  fixtureDir,
  "src/App.tsx",
  `import { Search, Settings as SettingsGlyph, X } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import { Button, Dialog } from '@mui/material';

export function App() {
  return (
    <Button>
      <Search />
      <SettingsGlyph />
      <X />
      <Dialog open />
      <Select.Root />
    </Button>
  );
}
`
);

const fixtureDepsAudit = JSON.parse(runCli(["audit", "deps", "--cwd", fixtureDir, "--json"]));
assert.ok(
  fixtureDepsAudit.findings.some((finding) => finding.package === "lucide-react"),
  "dependency audit should detect lucide-react in fixture package metadata"
);
assert.ok(
  fixtureDepsAudit.findings.some((finding) => finding.package === "@mui/material"),
  "dependency audit should detect @mui/material in fixture package metadata"
);
assert.ok(
  fixtureDepsAudit.findings.some((finding) => finding.package === "@radix-ui/react-select"),
  "dependency audit should detect Radix in fixture devDependencies"
);

const fixtureImportAudit = JSON.parse(runCli(["audit", "imports", "--cwd", fixtureDir, "--json"]));
assert.ok(
  fixtureImportAudit.findings.some((finding) => finding.source === "lucide-react"),
  "import audit should detect lucide-react in fixture source"
);
assert.ok(
  fixtureImportAudit.findings.some((finding) => finding.source === "@radix-ui/react-select"),
  "import audit should detect Radix in fixture source"
);
assert.ok(
  fixtureImportAudit.findings.some((finding) => finding.source === "@mui/material"),
  "import audit should detect MUI in fixture source"
);

const fixtureLucideDryRun = JSON.parse(
  runCli(["migrate", "icons", "--from", "lucide", "--cwd", fixtureDir, "--dry-run", "--json"])
);
assert.equal(fixtureLucideDryRun.mode, "dry-run");
assert.equal(fixtureLucideDryRun.wouldChangeFiles, 1);
assert.equal(fixtureLucideDryRun.files[0].replacements.length, 1);
assert.ok(
  fixtureLucideDryRun.files[0].replacements[0].after.includes("aura-glass/icons"),
  "lucide dry-run should show AuraGlass icon replacement"
);

const fixtureLucideWrite = JSON.parse(
  runCli(["migrate", "icons", "--from", "lucide", "--cwd", fixtureDir, "--write", "--json"])
);
assert.equal(fixtureLucideWrite.mode, "write");
assert.equal(fixtureLucideWrite.changedFiles, 1);

const rewrittenFixture = fs.readFileSync(fixtureSource, "utf8");
assert.ok(
  rewrittenFixture.includes("import { SearchIcon as Search, SettingsIcon as SettingsGlyph, CloseIcon as X } from 'aura-glass/icons';"),
  "lucide write migration should rewrite common icons to aura-glass/icons while preserving local names"
);
assert.ok(
  !rewrittenFixture.includes("from 'lucide-react'"),
  "lucide write migration should remove lucide-react import"
);

const fixtureRadixMigration = JSON.parse(
  runCli(["migrate", "radix", "--cwd", fixtureDir, "--dry-run", "--json"])
);
assert.equal(fixtureRadixMigration.mode, "dry-run");
assert.ok(
  fixtureRadixMigration.findings.some((finding) => finding.source === "@radix-ui/react-select"),
  "radix migration report should detect fixture Radix import"
);

const fixtureMuiMigration = JSON.parse(
  runCli(["migrate", "mui", "--cwd", fixtureDir, "--dry-run", "--json"])
);
assert.equal(fixtureMuiMigration.mode, "dry-run");
assert.ok(
  fixtureMuiMigration.findings.some((finding) => finding.source === "@mui/material"),
  "MUI migration report should detect fixture MUI import"
);

const doctor = JSON.parse(runCli(["doctor", "--json"]));
assert.ok(
  doctor.checks.every((check) => check.status === "pass"),
  "doctor should pass for the repository checkout"
);

console.log("[verify-cli] AuraGlass CLI registry checks passed");
