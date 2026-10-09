/**
 * REQ-PLAT-60 — tarball-based bridge-wiring test: packs the package, walks
 * every exports.* target, and asserts 0 dangling paths inside the tgz.
 */
import { execFileSync } from "child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const ROOT = join(__dirname, "..", "..");

describe("bridge wiring (tarball)", () => {
  it("every exports target resolves inside the packed tgz", () => {
    const work = join(tmpdir(), `bridge-wiring-${process.pid}`);
    mkdirSync(work, { recursive: true });
    try {
      const pack = execFileSync("npm", ["pack", "--ignore-scripts", "--pack-destination", work], {
        cwd: ROOT,
        encoding: "utf8",
      });
      const name = pack.trim().split("\n").pop()!.replace(/\.tgz$/, "") + ".tgz";
      const tgz = join(work, name);
      const extractDir = join(work, "pkg");
      mkdirSync(extractDir);
      execFileSync("tar", ["-xzf", tgz, "-C", extractDir]);
      const pkgRoot = join(extractDir, "package");
      const pkg = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8"));

      const dangling: string[] = [];
      const walk = (node: any, path: string) => {
        if (typeof node === "string") {
          if (node.startsWith("./") && !existsSync(join(pkgRoot, node))) {
            dangling.push(`${path} -> ${node}`);
          }
          return;
        }
        if (node && typeof node === "object") {
          for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
        }
      };
      walk(pkg.exports ?? {}, "exports");
      expect(dangling).toEqual([]);
    } finally {
      rmSync(work, { recursive: true, force: true });
    }
  }, 120_000);
});
