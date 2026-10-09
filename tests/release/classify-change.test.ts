/**
 * Classify-change fixtures — incl. REQ-PLAT-56 install-level cases.
 *
 * classify-change.mjs is ESM and jest's resolver can't load .mjs, so each
 * case runs in a spawned node --experimental-vm-modules subprocess that
 * imports the module and asserts — the subprocess exits non-zero on a
 * failed expectation.
 */
import { spawnSync } from "child_process";
import { join } from "path";

const ROOT = join(__dirname, "..", "..");

function runCase(name: string, inputs: unknown, expected: { class?: string; reason?: string }) {
  const script = `
    (async () => {
      const m = await import(${JSON.stringify(`file://${join(ROOT, "scripts/release/classify-change.mjs")}`)});
      const { classify, diffPackageJson } = m;
      const inputs = ${JSON.stringify(inputs)};
      for (const k of Object.keys(inputs)) {
        if (typeof inputs[k] === 'object' && inputs[k] && inputs[k].__pkgDiff) {
          inputs.packageDiff = diffPackageJson(inputs[k].base, inputs[k].head);
          delete inputs[k];
        }
      }
      const r = classify(inputs);
      const out = { cls: r.class, reasons: r.reasons };
      console.log('RESULT:' + JSON.stringify(out));
    })().catch((e) => { console.error(e); process.exit(2); });
  `;
  const r = spawnSync(
    process.execPath,
    ["--experimental-vm-modules", "-e", script],
    { cwd: ROOT, encoding: "utf8", timeout: 30_000 }
  );
  if (r.status !== 0) {
    throw new Error(`classify subprocess failed (${name}): ${r.stderr}`);
  }
  const m = /RESULT:(\{.*\})/.exec(r.stdout);
  if (!m) throw new Error(`no RESULT from subprocess (${name}): ${r.stdout}`);
  return JSON.parse(m[1]) as { cls: string; reasons: string[] };
}

const depEntry = {
  id: "DEP-P0072", kind: "dependency", symbol: "react-hook-form",
  since: "4.2.0", breaking: 14,
};

const lazySources = {
  "src/components/input/GlassForm.tsx":
    `const RHF = lazyPeer<typeof import("react-hook-form")>("react-hook-form");`,
};
const eagerSources = {
  "src/components/input/GlassForm.tsx":
    `import { Controller } from "react-hook-form";`,
};

const doctor = { undeclared: [] };
const notes = { firstList: ["react-hook-form", "zod"] };

const basePkg = JSON.stringify({
  dependencies: { "react-hook-form": "^7.54.0" },
  peerDependencies: { "react-hook-form": "^7.0.0" },
});
const headPkg = JSON.stringify({
  peerDependencies: { "react-hook-form": "^7.0.0" },
});
const pkgDiff = { __pkgDiff: true, base: basePkg, head: headPkg };

describe("classify-change", () => {
  it("dep → optional peer with all conditions met classifies C-D-IL", () => {
    const r = runCase("cd-il", {
      deprecationsAdded: [depEntry], pkgDiff,
      version: "4.2.0", sources: lazySources,
      doctorReport: doctor, releaseNotes: notes,
      installDeps: [depEntry.id], line: "4x", target: "4x-minor",
    }, {});
    expect(r.cls).toBe("C-D-IL");
  });

  it("lazy loading missing → C-B", () => {
    const r = runCase("no-lazy", {
      deprecationsAdded: [depEntry], pkgDiff,
      version: "4.2.0", sources: eagerSources,
      doctorReport: doctor, releaseNotes: notes,
      installDeps: [depEntry.id], line: "4x", target: "4x-minor",
    }, {});
    expect(r.cls).toBe("C-B");
    expect(r.reasons.join(" ")).toContain("install-level move fails conditions");
  });

  it("release-notes first-list miss → C-B", () => {
    const r = runCase("no-notes", {
      deprecationsAdded: [depEntry], pkgDiff,
      version: "4.2.0", sources: lazySources,
      doctorReport: doctor, releaseNotes: { firstList: [] },
      installDeps: [depEntry.id], line: "4x", target: "4x-minor",
    }, {});
    expect(r.cls).toBe("C-B");
  });

  it("uncovered dependency removal classifies C-B", () => {
    const r = runCase("uncovered", {
      pkgDiff, version: "4.2.0", line: "4x", target: "4x-minor",
    }, {});
    expect(r.cls).toBe("C-B");
    expect(r.reasons.join(" ")).toContain("dependencies removed");
  });

  it("non-dependency deprecation addition classifies C-D", () => {
    const r = runCase("cd", {
      deprecationsAdded: [
        { id: "DEP-P0001", kind: "export", symbol: "x", since: "4.3.0", breaking: 1 },
      ],
      version: "4.3.0", line: "4x", target: "4x-minor",
    }, {});
    expect(r.cls).toBe("C-D");
  });

  it("package.json exports addition classifies C-E", () => {
    const r = runCase("ce", {
      pkgDiff: {
        __pkgDiff: true,
        base: JSON.stringify({ exports: { ".": "./dist/index.mjs" } }),
        head: JSON.stringify({ exports: { ".": "./dist/index.mjs", "./new": "./dist/new.mjs" } }),
      },
      version: "4.3.0", line: "4x", target: "4x-minor",
    }, {});
    expect(r.cls).toBe("C-E");
  });
});
