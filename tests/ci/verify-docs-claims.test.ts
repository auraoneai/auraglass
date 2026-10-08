import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..", "..");
const SCRIPT = path.join(ROOT, "scripts", "ci", "verify-docs-claims.js");

function runSandbox(files: Record<string, string>) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "docs-claims-"));
  for (const [rel, text] of Object.entries(files)) {
    const p = path.join(dir, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, text);
  }
  try {
    const out = execFileSync("node", [SCRIPT], {
      cwd: dir, encoding: "utf8",
      env: { ...process.env, AURAGLASS_REPO_ROOT: dir },
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: String(e.stdout || "") + String(e.stderr || "") };
  }
}

describe("verify-docs-claims seeded fixtures", () => {
  const cases: Array<[string, string]> = [
    ["498 targets", "all 498 certified targets passed"],
    ["100% coverage", "100% coverage guaranteed"],
    ["SSR-safe", "SSR-safe package entrypoints"],
    ["optional backend", "an optional backend for teams"],
    ["licensed Aeonik", "the licensed Aeonik family"],
  ];
  it.each(cases)("fails on a seeded %s fixture", (_n, claim) => {
    const r = runSandbox({ "README.md": claim, "docs/x.md": "fine" });
    expect(r.code).toBe(1);
  });
  it("ignores retraction blocks and docs/auraglass-5", () => {
    const r = runSandbox({
      "README.md": "> **Retraction (4.1.1):** 498 certified overstated.\nok",
      "docs/auraglass-5/notes.md": "498 certified is fine here",
    });
    expect(r.code).toBe(0);
  });
  it("scans SECURITY.md", () => {
    const r = runSandbox({ "SECURITY.md": "498 certified builds" });
    expect(r.code).toBe(1);
  });
  it("4.1.1 tree passes", () => {
    const out = execFileSync("node", [SCRIPT], {
      cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
    });
    expect(out).toContain("clean");
  });
});
