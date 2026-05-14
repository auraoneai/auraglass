#!/usr/bin/env node

const result = require("node:child_process").spawnSync(
  process.execPath,
  [require("node:path").resolve(__dirname, "../../bin/aura-glass.cjs"), "doctor", ...process.argv.slice(2)],
  { stdio: "inherit" }
);

process.exit(result.status ?? 1);
