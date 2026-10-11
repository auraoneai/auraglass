/**
 * REQ-PLAT-52 — claims lint over README.md and llms.txt.
 *
 * The 4.1.1 trust patch retracted three standing claims (see
 * docs/release/ledger-corrections.json): "498 certified" standing claims,
 * "SSR-safe" component claims, and "optional backend" claims; plus dead
 * links into the untracked reports/ directory. This test pins the
 * retractions so the claims cannot silently return.
 */
import { readFileSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "..", "..");
const DOCS = ["README.md", "llms.txt"] as const;

const FORBIDDEN: Array<{ name: string; re: RegExp }> = [
  { name: "standing 'certified green' claim", re: /certified green/i },
  { name: "dead ./reports/ link", re: /\]\(\.\/reports\// },
  { name: "dead reports/ link", re: /\]\(reports\// },
  { name: "SSR-safe component claim", re: /SSR-safe (React )?components?/i },
  { name: "optional backend claim", re: /optional backend/i },
  { name: "498-certified claim", re: /498[^\n]*certif/i },
];

describe("claims lint (PLAT-52)", () => {
  for (const doc of DOCS) {
    it(`${doc} carries none of the retracted claims`, () => {
      const text = readFileSync(join(ROOT, doc), "utf8");
      const hits = FORBIDDEN.filter(({ re }) => re.test(text)).map((f) => f.name);
      expect(hits).toEqual([]);
    });
  }

  it("README states certification is per-run CI artifacts, not a standing claim", () => {
    const readme = readFileSync(join(ROOT, "README.md"), "utf8");
    expect(readme).toMatch(/no standing certification claim/i);
    expect(readme).toMatch(/CI artifacts/);
  });

  it("llms.txt describes components as client components, not SSR-safe", () => {
    const llms = readFileSync(join(ROOT, "llms.txt"), "utf8");
    expect(llms).toMatch(/client React components/i);
    expect(llms).toMatch(/server-safe/i);
  });

  it("fixture: each forbidden pattern still matches a poisoned string", () => {
    const poisoned =
      "All 498 targets certified green! See [evidence](./reports/x.md). " +
      "SSR-safe components, optional backend included. " +
      "Alt link: [evidence](reports/x.md).";
    for (const { name, re } of FORBIDDEN) {
      expect({ name, hit: re.test(poisoned) }).toEqual({ name, hit: true });
    }
  });
});
