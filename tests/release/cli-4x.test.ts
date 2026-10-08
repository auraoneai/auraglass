import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..", "..");
const BIN = path.join(ROOT, "bin/aura-glass.cjs");
const FIXTURE = path.join(ROOT, "tests/release/fixtures/undeclared-deps");
const MOVED_NOTICE = "aura-glass CLI moved: use npx @auraglass/cli <command>";

describe("4.x cli bridge", () => {
  it("doctor --v5 reports undeclared imports on the fixture", () => {
    const res = spawnSync("node", [BIN, "doctor", "--v5", "--cwd", FIXTURE, "--json"], { encoding: "utf8" });
    expect(res.status).toBe(0);
    const report = JSON.parse(res.stdout);
    const check = report.checks.find((c: any) => c.id === "undeclared-imports");
    expect(check.status).toBe("fail");
    expect(check.message).toContain("axios");
    expect(check.message).toContain("lodash");
    expect(check.message).toContain("react");
  });
  it("MOVED_NOTICE prints exactly once to stderr per invocation", () => {
    const res = spawnSync("node", [BIN, "list", "--json"], { encoding: "utf8" });
    const occurrences = res.stderr.split(MOVED_NOTICE).length - 1;
    expect(occurrences).toBe(1);
  });
  it("MOVED_NOTICE is byte-equal to the canonical string", () => {
    const src = require("fs").readFileSync(BIN, "utf8");
    expect(src).toContain(`"${MOVED_NOTICE}"`);
  });
});
