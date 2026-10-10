/* @jest-environment node */
// PLAT-007: one case per ownership rule, run against the real script.
import { describe, expect, it } from "@jest/globals";
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const SCRIPT = "scripts/ci/verify-ownership.mjs";

function run(
  args: string[],
  env: Record<string, string> = {}
): { code: number; out: string } {
  try {
    const out = execFileSync("node", [SCRIPT, ...args], {
      encoding: "utf8",
      env: { ...process.env, ...env },
    });
    return { code: 0, out };
  } catch (e: unknown) {
    const err = e as { status: number; stdout: string; stderr: string };
    return { code: err.status, out: `${err.stdout}${err.stderr}` };
  }
}

describe("verify-ownership", () => {
  it("accepts own-path files on a next-plat branch", () => {
    const r = run([
      "--branch",
      "next-plat/ci-x",
      "--files",
      "ci/plat.gitlab-ci.yml,scripts/ci/gitlab-status.mjs",
    ]);
    expect(r.code).toBe(0);
  });

  it("rejects a foreign path on a next-plat branch", () => {
    const r = run([
      "--branch",
      "next-plat/ci-x",
      "--files",
      "src/material/theme.ts",
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("src/material/theme.ts");
  });

  it("prints the D02x note for invalid test locations", () => {
    const r = run([
      "--branch",
      "next-plat/ci-x",
      "--files",
      "tests/lint/anything.test.ts",
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("invalid location");
  });

  it("allows MAT row-H paths only for 4x-mat branches", () => {
    const mat = run([
      "--branch",
      "4x-mat/bridge",
      "--files",
      "src/material/tokens.ts",
    ]);
    expect(mat.code).toBe(0);
    const plat = run([
      "--branch",
      "4x-plat/ci-x",
      "--files",
      "src/material/tokens.ts",
    ]);
    expect(plat.code).toBe(1);
  });

  it("restricts sync/fragments branches to their fragment kind", () => {
    const dep = run([
      "--branch",
      "sync/fragments-deprecations-20261008",
      "--files",
      "fragments/deprecations/mat.ts",
    ]);
    expect(dep.code).toBe(0);
    const wrong = run([
      "--branch",
      "sync/fragments-deprecations-20261008",
      "--files",
      "fragments/codemods/mat.ts",
    ]);
    expect(wrong.code).toBe(1);
    const gen = run([
      "--branch",
      "sync/fragments-deprecations-20261008",
      "--files",
      "src/internal/deprecations.generated.ts",
    ]);
    expect(gen.code).toBe(0);
  });

  it("rejects a PLAT path (E04 scripts/**) on a next-mat branch", () => {
    const r = run([
      "--branch",
      "next-mat/tokens",
      "--files",
      "scripts/ci/verify-ownership.mjs",
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("-> PLAT (E04 scripts/**)");
  });

  it("warns but passes on unrestricted branches", () => {
    const r = run(["--branch", "next", "--files", "src/whatever.ts"]);
    expect(r.code).toBe(0);
    expect(r.out).toContain("unrestricted");
  });

  it("accepts contract/* branches for non-NONE owners", () => {
    const r = run([
      "--branch",
      "contract/c0-bootstrap",
      "--files",
      "contracts/ownership.json",
    ]);
    expect(r.code).toBe(0);
  });
});

// A throwaway git repo carrying the real contracts/ownership.json; the script
// runs from the checkout (so it reads the real scripts/ci/fin-ownership.json).
function tempRepo(): {
  dir: string;
  git: (a: string[]) => string;
  write: (p: string, body: string) => void;
  commit: (m: string) => void;
  check: (args: string[]) => { code: number; out: string };
  done: () => void;
} {
  const dir = mkdtempSync(join(tmpdir(), "own-"));
  const git = (a: string[]) =>
    execFileSync(
      "git",
      [
        "-c",
        "user.email=t@t",
        "-c",
        "user.name=t",
        "-c",
        "commit.gpgsign=false",
        ...a,
      ],
      {
        cwd: dir,
        encoding: "utf8",
      }
    );
  const write = (p: string, body: string) => {
    mkdirSync(dirname(join(dir, p)), { recursive: true });
    writeFileSync(join(dir, p), body);
  };
  const commit = (m: string) => {
    git(["add", "-A"]);
    git(["commit", "-qm", m]);
  };
  git(["init", "-q"]);
  write(
    "contracts/ownership.json",
    readFileSync("contracts/ownership.json", "utf8")
  );
  commit("base");
  const check = (a: string[]) => {
    try {
      const out = execFileSync("node", [join(process.cwd(), SCRIPT), ...a], {
        cwd: dir,
        encoding: "utf8",
      });
      return { code: 0, out };
    } catch (e: unknown) {
      const err = e as {
        status: number | null;
        stdout: string;
        stderr: string;
      };
      return { code: err.status ?? 1, out: `${err.stdout}${err.stderr}` };
    }
  };
  return {
    dir,
    git,
    write,
    commit,
    check,
    done: () => rmSync(dir, { recursive: true, force: true }),
  };
}

describe("REQ-FIN-30 rule cases (AC-FIN-30)", () => {
  it("(a) unmatched path on next-mat/* fails naming Z01 PLAT", () => {
    const r = run(["--branch", "next-mat/x", "--files", "zz-unmatched/x"]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("zz-unmatched/x  -> PLAT (Z01 **)");
  });

  it("(b) a real git rename lists old and new paths under --base", () => {
    const repo = tempRepo();
    try {
      repo.write("scripts/ci/a.mjs", "x\n");
      repo.commit("add");
      repo.git(["mv", "scripts/ci/a.mjs", "scripts/ci/b.mjs"]);
      repo.git(["commit", "-qm", "rename"]);
      const r = repo.check(["--branch", "next-mat/x", "--base", "HEAD~1"]);
      expect(r.code).toBe(1);
      expect(r.out).toContain("2 files"); // delete+add pair (--no-renames), not one rename
      expect(r.out).toContain("scripts/ci/a.mjs  -> PLAT");
      expect(r.out).toContain("scripts/ci/b.mjs  -> PLAT");
    } finally {
      repo.done();
    }
  });

  it("(c) 4x-cmp/* may touch fragments/deprecations/cmp.ts but not src/components/a.tsx", () => {
    expect(
      run(["--branch", "4x-cmp/x", "--files", "fragments/deprecations/cmp.ts"])
        .code
    ).toBe(0);
    const r = run(["--branch", "4x-cmp/x", "--files", "src/components/a.tsx"]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("src/components/a.tsx  -> PLAT (Z01 **)");
  });

  it("(d) sync/fragments-codemods-* allows codemods, rejects src/x.ts", () => {
    expect(
      run([
        "--branch",
        "sync/fragments-codemods-20261008",
        "--files",
        "fragments/codemods/mat.ts",
      ]).code
    ).toBe(0);
    const r = run([
      "--branch",
      "sync/fragments-codemods-20261008",
      "--files",
      "src/x.ts",
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("sync/fragments-codemods");
    expect(r.out).toContain("src/x.ts");
  });

  it("(e) a NONE-owned path fails with the use tests/<kind>/<stream>/ message", () => {
    const r = run([
      "--branch",
      "next-mat/x",
      "--files",
      "tests/e2e/foo/x.spec.ts",
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("tests/e2e/foo/x.spec.ts  -> NONE");
    expect(r.out).toContain("[invalid location: use tests/<kind>/<stream>/]");
  });

  it("(f) a non-prefixed branch fails", () => {
    const r = run(["--branch", "feature/foo", "--files", "src/theme/a.ts"]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("unrecognised branch feature/foo");
  });

  it("(g) 4x11-<stream>/* follows the 4x zone rule (OD-13)", () => {
    expect(
      run([
        "--branch",
        "4x11-cmp/x",
        "--files",
        "fragments/deprecations/cmp.ts",
      ]).code
    ).toBe(0);
    const r = run([
      "--branch",
      "4x11-cmp/x",
      "--files",
      "src/components/a.tsx",
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("stream CMP (4x bridge)");
    expect(
      run(["--branch", "4x11-plat/x", "--files", "ci/plat.gitlab-ci.yml"]).code
    ).toBe(0);
    expect(
      run(["--branch", "4x11-plat/x", "--files", "src/material/tokens.ts"]).code
    ).toBe(1); // row H is MAT's
  });
});

describe("REQ-FIN-30 FIN branch prefixes (PRD-F §6, §4 common rules)", () => {
  // One owned path per WP, taken from the PRD-F §6 table.
  const owned: Array<[string, string]> = [
    ["a", "scripts/build/generate-exports.mjs"],
    ["a", "src/primitives/FocusScope.tsx"],
    ["a", "tests/integration/x.test.ts"],
    ["b", ".gitlab-ci.yml"],
    ["b", "tests/ci/plat-fragment.test.ts"],
    ["c", "scripts/ci/verify-ownership.mjs"],
    ["c", "packages/cli/src/index.ts"],
    ["c", "etc/api/aura-glass.api.md"],
    ["d", "src/material/css/rungs.css"],
    ["d", "tests/a11y/contrast-matrix.test.ts"],
    ["e", "src/components/button/Button.tsx"],
    ["e", "tests/types/cmp-contract.test-d.ts"],
    ["f", "src/components/tabs/Tabs.tsx"],
    ["f", "packages/labs/package.json"],
    ["g", "showcase/app.tsx"],
    ["h", "docs/release/decisions/od-8.md"],
    ["h", "tests/a11y/manual/records/mat/r.json"],
  ];
  const WPS = ["a", "b", "c", "d", "e", "f", "g", "h"];

  it.each(owned)("next-fin/%s-* owns %s and no other WP does", (wp, path) => {
    for (const other of WPS) {
      const r = run(["--branch", `next-fin/${other}-x`, "--files", path]);
      expect([other, r.code]).toEqual([other, other === wp ? 0 : 1]);
      if (other !== wp)
        expect(r.out).toContain(`${path}  -> FIN-${wp.toUpperCase()}`);
    }
  });

  it('a FIN-A file inside a stream directory is not the stream WP\'s (§6 "minus FIN-A files")', () => {
    const r = run([
      "--branch",
      "next-fin/d-x",
      "--files",
      "src/material/css/material.css",
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain(
      "src/material/css/material.css  -> FIN-A (FIN:A02 src/material/css/{material,lens}.css)"
    );
    expect(
      run([
        "--branch",
        "next-fin/a-x",
        "--files",
        "src/material/css/material.css",
      ]).code
    ).toBe(0);
  });

  it("tests/showcase/** belongs to FIN-G (§3.1 R24)", () => {
    expect(
      run([
        "--branch",
        "next-fin/g-x",
        "--files",
        "tests/showcase/home.test.ts",
      ]).code
    ).toBe(0);
    const r = run([
      "--branch",
      "next-fin/c-x",
      "--files",
      "tests/showcase/home.test.ts",
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain(
      "-> FIN-G (FIN:G-R24 tests/showcase/**) [§3.1 R24 (contract F07)]"
    );
  });

  it("contract-only paths are rejected on every next-fin branch", () => {
    for (const path of [
      "jest.config.js",
      "src/contracts/index.ts",
      "contracts/ownership.json",
      "src/index.ts",
    ]) {
      for (const wp of WPS) {
        const r = run(["--branch", `next-fin/${wp}-x`, "--files", path]);
        expect([wp, path, r.code]).toEqual([wp, path, 1]);
        expect(r.out).toContain(`${path}  -> CONTRACT`);
      }
    }
    expect(
      run(["--branch", "contract/v1.2-final", "--files", "jest.config.js"]).code
    ).toBe(0);
  });

  it("a NONE-owned location stays rejected on next-fin branches", () => {
    const r = run([
      "--branch",
      "next-fin/d-x",
      "--files",
      "tests/visual/foo.spec.ts",
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("tests/visual/foo.spec.ts  -> NONE");
    expect(r.out).toContain("[invalid location: use tests/<kind>/<stream>/]");
  });

  it("existing next-fin/<stream>-* PR branches resolve to the stream WP", () => {
    expect(
      run([
        "--branch",
        "next-fin/cmp-31-forms",
        "--files",
        "src/components/button/Button.tsx",
      ]).code
    ).toBe(0);
    const r = run([
      "--branch",
      "next-fin/cmp-31-forms",
      "--files",
      "src/primitives/FocusScope.tsx",
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("FIN-E (next-fin, PRD-F §6)");
    expect(r.out).toContain("-> FIN-A");
    expect(
      run([
        "--branch",
        "next-fin/plat-81-consumer-grep",
        "--files",
        "scripts/removal/consumer-grep.mjs",
      ]).code
    ).toBe(0);
    expect(
      run([
        "--branch",
        "next-fin/surf-10-x",
        "--files",
        "src/app-shell/AppShell.tsx",
      ]).code
    ).toBe(0);
  });

  it("an unknown next-fin/<wp> letter fails closed", () => {
    const r = run(["--branch", "next-fin/z-x", "--files", "README.md"]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("unrecognised branch next-fin/z-x");
  });

  it("a real git rename on a next-fin branch lists both paths with their WP", () => {
    const repo = tempRepo();
    try {
      repo.write("scripts/build/generate-exports.mjs", "x\n");
      repo.commit("add");
      repo.git([
        "mv",
        "scripts/build/generate-exports.mjs",
        "scripts/build/exports.mjs",
      ]);
      repo.git(["commit", "-qm", "rename"]);
      const r = repo.check(["--branch", "next-fin/c-x", "--base", "HEAD~1"]);
      expect(r.code).toBe(1);
      expect(r.out).toContain("2 files");
      expect(r.out).toContain("scripts/build/generate-exports.mjs  -> FIN-A");
      expect(r.out).not.toContain("scripts/build/exports.mjs  ->"); // new path is FIN-C's
    } finally {
      repo.done();
    }
  });

  describe("package.json is split by key (exports/main/types → FIN-A, rest → FIN-C)", () => {
    const pkg = (extra: Record<string, unknown>) =>
      `${JSON.stringify({ name: "x", version: "1.0.0", exports: { ".": "./a.js" }, scripts: { t: "jest" }, ...extra }, null, 2)}\n`;
    function change(next: Record<string, unknown>, branch: string) {
      const repo = tempRepo();
      try {
        repo.write("package.json", pkg({}));
        repo.commit("pkg");
        repo.write("package.json", pkg(next));
        repo.commit("edit");
        return repo.check(["--branch", branch, "--base", "HEAD~1"]);
      } finally {
        repo.done();
      }
    }

    it("FIN-A may change exports, FIN-C may not", () => {
      const exportsEdit = { exports: { ".": "./b.js" } };
      expect(change(exportsEdit, "next-fin/a-x").code).toBe(0);
      const r = change(exportsEdit, "next-fin/c-x");
      expect(r.code).toBe(1);
      expect(r.out).toContain("package.json  -> keys exports belong to FIN-A");
    });

    it("FIN-C may change scripts/devDependencies, FIN-A may not", () => {
      const scriptsEdit = {
        scripts: { t: "jest --ci" },
        devDependencies: { prettier: "3.3.3" },
      };
      expect(change(scriptsEdit, "next-fin/c-x").code).toBe(0);
      const r = change(scriptsEdit, "next-fin/a-x");
      expect(r.code).toBe(1);
      expect(r.out).toContain(
        "package.json  -> keys scripts, devDependencies belong to FIN-C"
      );
    });

    it("no other WP may touch package.json", () => {
      const r = change({ scripts: { t: "jest --ci" } }, "next-fin/e-x");
      expect(r.code).toBe(1);
      expect(r.out).toContain(
        "package.json  -> FIN-A (keys exports/main/types) / FIN-C (other keys)"
      );
    });

    it("fails closed when the base does not resolve", () => {
      const r = run([
        "--branch",
        "next-fin/c-x",
        "--base",
        "refs/heads/does-not-exist-own",
        "--files",
        "package.json",
      ]);
      expect(r.code).toBe(1);
      expect(r.out).toContain("key split not verifiable");
    });
  });

  describe("4x-fin/*, 4x11-fin/* and next-fin/4x-<s>-* follow the 4x zone rule", () => {
    it.each(["4x-fin", "4x11-fin"])("%s/c-* is the PLAT zone", (p) => {
      expect(
        run([
          "--branch",
          `${p}/c-plat48-consent`,
          "--files",
          "src/components/cookie-consent/a.tsx,src/index.ts",
        ]).code
      ).toBe(0);
      const r = run([
        "--branch",
        `${p}/c-x`,
        "--files",
        "fragments/deprecations/cmp.ts",
      ]);
      expect(r.code).toBe(1);
      expect(r.out).toContain("FIN-C (4x zone PLAT)");
      expect(
        run(["--branch", `${p}/c-x`, "--files", "tokens/personas/default.json"])
          .code
      ).toBe(1); // row H
    });

    it.each(["4x-fin", "4x11-fin"])(
      "%s/d-* is the MAT zone incl. row H",
      (p) => {
        expect(
          run([
            "--branch",
            `${p}/d-font-stack`,
            "--files",
            "tokens/personas/default.json,fragments/deprecations/mat.ts",
          ]).code
        ).toBe(0);
        const r = run([
          "--branch",
          `${p}/d-font-stack`,
          "--files",
          "src/components/a.tsx",
        ]);
        expect(r.code).toBe(1);
        expect(r.out).toContain("FIN-D (4x zone MAT)");
      }
    );

    it("4x-fin/e-* and 4x-fin/f-* are the CMP and SURF zones", () => {
      expect(
        run([
          "--branch",
          "4x-fin/e-x",
          "--files",
          "fragments/deprecations/cmp.ts",
        ]).code
      ).toBe(0);
      expect(
        run(["--branch", "4x-fin/e-x", "--files", "src/components/a.tsx"]).code
      ).toBe(1);
      expect(
        run([
          "--branch",
          "4x-fin/f-deprecations",
          "--files",
          "fragments/deprecations/surf.ts",
        ]).code
      ).toBe(0);
      expect(
        run([
          "--branch",
          "4x-fin/f-deprecations",
          "--files",
          "fragments/deprecations/cmp.ts",
        ]).code
      ).toBe(1);
    });

    it("4x-fin/a-*, 4x-fin/b-* and topics without a WP letter are the PLAT zone", () => {
      expect(
        run([
          "--branch",
          "4x-fin/a-classify",
          "--files",
          "scripts/release/classify-change.mjs",
        ]).code
      ).toBe(0);
      expect(
        run([
          "--branch",
          "4x-fin/b-ci",
          "--files",
          ".gitlab-ci.yml,ci/plat.gitlab-ci.yml",
        ]).code
      ).toBe(0);
      expect(
        run([
          "--branch",
          "4x-fin/32-policy-v2",
          "--files",
          "scripts/release/lib/policy.mjs",
        ]).code
      ).toBe(0);
      expect(
        run([
          "--branch",
          "4x-fin/32-policy-v2",
          "--files",
          "ci/mat.gitlab-ci.yml",
        ]).code
      ).toBe(1);
      expect(
        run([
          "--branch",
          "4x-fin/plat-100-105-motion",
          "--files",
          "src/hooks/useMotion.ts",
        ]).code
      ).toBe(0);
    });

    it("next-fin/4x-<stream>-* (existing release/4.x PR heads) is that stream's 4x zone", () => {
      expect(
        run([
          "--branch",
          "next-fin/4x-cmp-132-deprecations",
          "--files",
          "fragments/deprecations/cmp.ts",
        ]).code
      ).toBe(0);
      const r = run([
        "--branch",
        "next-fin/4x-cmp-132-deprecations",
        "--files",
        "src/components/a.tsx",
      ]);
      expect(r.code).toBe(1);
      expect(r.out).toContain("next-fin/4x-cmp (4x zone CMP)");
    });
  });

  it("an empty --branch falls back to CI_MERGE_REQUEST_SOURCE_BRANCH_NAME instead of passing", () => {
    const r = run(
      ["--branch", "", "--files", "src/primitives/FocusScope.tsx"],
      {
        CI_MERGE_REQUEST_SOURCE_BRANCH_NAME: "next-fin/c-x",
      }
    );
    expect(r.code).toBe(1);
    expect(r.out).toContain("-> FIN-A");
  });

  it("release/4.1.x itself is report-only like release/4.x", () => {
    const r = run(["--branch", "release/4.1.x", "--files", "src/whatever.ts"]);
    expect(r.code).toBe(0);
    expect(r.out).toContain("unrestricted");
  });
});
