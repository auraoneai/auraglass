import { spawnSync } from "node:child_process";
import path from "node:path";

const MOD = path.resolve(__dirname, "..", "..", "src", "services", "auth", "auth-service.ts");

function call(env: Record<string, string | undefined>) {
  return spawnSync(
    "npx",
    ["tsx", "-e", `const {assertJwtSecret}=require(${JSON.stringify(MOD)});try{assertJwtSecret(JSON.parse(process.env.E))}catch(e){}`],
    { env: { ...process.env, E: JSON.stringify(env) }, encoding: "utf8" },
  );
}

describe("assertJwtSecret", () => {
  it("exits 1 when JWT_SECRET is unset", () => {
    const r = call({});
    expect(r.status).toBe(1);
    expect(String(r.stderr)).toContain("JWT_SECRET");
  });
  it("exits 1 for the .env.example default", () => {
    const r = call({ JWT_SECRET: "your-super-secret-jwt-key-change-in-production" });
    expect(r.status).toBe(1);
  });
  it("exits 1 for a 16-char secret", () => {
    expect(call({ JWT_SECRET: "a".repeat(16) }).status).toBe(1);
  });
  it("proceeds for >= 32 chars", () => {
    expect(call({ JWT_SECRET: "s".repeat(40) }).status).toBe(0);
  });
  it("Dockerfile has 0 .env.example copies", () => {
    const df = require("node:fs").readFileSync(path.resolve(__dirname, "../../Dockerfile"), "utf8");
    expect(df.match(/env\.example/g)).toBeNull();
  });
});
