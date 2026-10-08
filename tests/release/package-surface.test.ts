import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..", "..");

describe("4.1.1 package surface (patch-scope)", () => {
  const base = JSON.parse(
    execFileSync("git", ["show", "15b6de6f7:package.json"], {
      cwd: ROOT, encoding: "utf8", maxBuffer: 8 * 1024 * 1024,
    }),
  );
  const head = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));

  it.each(["dependencies", "peerDependencies", "exports"])(
    "%s deep-equals the 15b6de6f7 baseline",
    (key) => expect(head[key]).toEqual(base[key]),
  );

  it("only devDependencies/scripts/files/version may differ", () => {
    const allowed = new Set(["devDependencies", "scripts", "files", "version"]);
    for (const key of Object.keys(base)) {
      if (allowed.has(key)) continue;
      expect(head[key]).toEqual(base[key]);
    }
  });

  it("files gains deprecations.json and version is 4.1.1", () => {
    expect(head.files).toContain("deprecations.json");
    expect(head.version).toBe("4.1.1");
    expect(head.scripts.release).toBeUndefined();
    expect(head.scripts["release:dry-run"]).toBeUndefined();
    expect(head.scripts.prepublishOnly.startsWith("node scripts/ci/require-ci-publish.js")).toBe(true);
    expect(head.scripts.prepack).toContain("gen-deprecations.mjs");
  });
});

describe("4.1.1 deprecation fragment (>= 19 entries, DEP-P####)", () => {
  let entries: any[];
  beforeAll(async () => {
    const out = execFileSync(
      "npx", ["tsx", "-e", "import f from './fragments/deprecations/plat.ts'; process.stdout.write(JSON.stringify(f.default ?? f));"],
      { cwd: ROOT, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
    );
    entries = JSON.parse(out);
  });
  it("has >= 19 entries all since 4.1.1, removeIn 5.0.0, status active", () => {
    expect(entries.length).toBeGreaterThanOrEqual(19);
    for (const e of entries) {
      expect(e.id).toMatch(/^DEP-P\d{4}$/);
      expect(e.since).toBe("4.1.1");
      expect(e.removeIn).toBe("5.0.0");
      expect(e.status).toBe("active");
      expect(e.message.length).toBeLessThanOrEqual(200);
    }
  });
  it("honesty entries carry exception 'honesty'", () => {
    const honesty = entries.filter((e) => e.exception === "honesty");
    expect(honesty.map((e) => e.id)).toEqual(
      expect.arrayContaining(["DEP-P0018", "DEP-P0019"]),
    );
  });
});
