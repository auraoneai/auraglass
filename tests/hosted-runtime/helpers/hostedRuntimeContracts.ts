import fs from "fs";
import path from "path";

export const repoRoot = process.cwd();

export function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

export function readPackageJson(): any {
  return JSON.parse(readRepoFile("package.json"));
}

export function dependencyVersion(packageName: string): string | undefined {
  const pkg = readPackageJson();
  return (
    pkg.dependencies?.[packageName] ??
    pkg.devDependencies?.[packageName] ??
    pkg.peerDependencies?.[packageName]
  );
}

export interface ProviderUnconfiguredPayload {
  error: "Provider not configured";
  code: "AURA_PROVIDER_UNCONFIGURED";
  provider: string;
  feature: string;
  docsUrl: string;
}

export function expectProviderUnconfiguredPayload(
  payload: unknown,
  expected: Pick<ProviderUnconfiguredPayload, "provider" | "feature">
): void {
  expect(payload).toEqual(
    expect.objectContaining({
      error: "Provider not configured",
      code: "AURA_PROVIDER_UNCONFIGURED",
      provider: expected.provider,
      feature: expected.feature,
      docsUrl: expect.stringMatching(/^https?:\/\//),
    })
  );

  const serialized = JSON.stringify(payload);
  expect(serialized).not.toMatch(/sk-[A-Za-z0-9]/);
  expect(serialized).not.toMatch(/api[_-]?key/i);
  expect(serialized).not.toMatch(/jwt[_-]?secret/i);
  expect(serialized).not.toMatch(/stack/i);
  expect(serialized).not.toMatch(/prompt/i);
}
