/**
 * REQ-PLAT-53 — spawn test: assertJwtSecret fails the process closed.
 *
 * The server entry calls `assertJwtSecret(process.env)` before any service
 * construction; this suite proves a real spawned process exits 1 with the
 * FATAL message when the secret is unsafe, and exits 0 when it is.
 */
import { spawnSync } from "child_process";
import { join } from "path";

const ROOT = join(__dirname, "..", "..");

function spawnAssert(jwtSecret: string | undefined) {
  const script = `
    require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'commonjs', moduleResolution: 'node', esModuleInterop: true } });
    const { assertJwtSecret } = require(${JSON.stringify(join(ROOT, "src/services/auth/auth-service.ts"))});
    assertJwtSecret({ JWT_SECRET: process.env.AG_TEST_JWT });
    console.log('BOOTED');
  `;
  return spawnSync(process.execPath, ["-e", script], {
    cwd: ROOT,
    encoding: "utf8",
    env: { ...process.env, AG_TEST_JWT: jwtSecret ?? "" },
    timeout: 60_000,
  });
}

describe("assertJwtSecret spawn behavior (PLAT-53)", () => {
  it("exits 1 with FATAL when JWT_SECRET is unset", () => {
    const r = spawnAssert(undefined);
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/FATAL: JWT_SECRET/);
    expect(r.stdout).not.toContain("BOOTED");
  });

  it("exits 1 when JWT_SECRET is the shipped example default", () => {
    const r = spawnAssert("changeme-in-production");
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/FATAL: JWT_SECRET/);
  });

  it("exits 1 when JWT_SECRET is shorter than 32 characters", () => {
    const r = spawnAssert("too-short-secret");
    expect(r.status).toBe(1);
  });

  it("exits 0 (boots) with a real >=32-char secret", () => {
    const r = spawnAssert("a".repeat(40));
    expect(r.status).toBe(0);
    expect(r.stdout).toContain("BOOTED");
  });

  it("server/index.ts calls assertJwtSecret(process.env) before Sentry init", () => {
    const src = require("fs").readFileSync(join(ROOT, "server/index.ts"), "utf8");
    const assertPos = src.indexOf("assertJwtSecret(process.env)");
    expect(assertPos).toBeGreaterThan(-1);
    const sentryPos = src.indexOf("Sentry.init");
    expect(assertPos).toBeLessThan(sentryPos);
  });
});
