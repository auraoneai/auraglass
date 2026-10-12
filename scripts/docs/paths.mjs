/* scripts/docs/paths.mjs — PLAT-350 (REQ-PLAT-07, REQ-PLAT-99). Single
   constants module imported by every scripts/docs and scripts/registry
   module. DOCS_BASE_URL is $CI_PAGES_URL until OD-12 lands the custom
   domain; only then may it become https://auraglass.dev. */

/* GitLab Pages unique domain of project 87152036 (`glab api projects/87152036/pages`
   → url); CI_PAGES_URL carries the same value inside pipelines. */
const PAGES_URL = 'https://auraglass-48859d.gitlab.io/';
const CUSTOM_DOMAIN = 'https://auraglass.dev/';

/** True when the owner decision OD-12 (custom domain) has landed. */
export const CUSTOM_DOMAIN_LIVE = false;

/** Base URL the docs site, registry homepage and generated links resolve against. */
export const DOCS_BASE_URL =
  process.env.DOCS_BASE_URL ??
  (CUSTOM_DOMAIN_LIVE ? CUSTOM_DOMAIN : process.env.CI_PAGES_URL ?? PAGES_URL);

/** Environment-independent public docs URL for tracked, shipped files
    (llms.txt, aura-glass-mcp data): identical locally and in every pipeline. */
export const PUBLIC_DOCS_URL = CUSTOM_DOMAIN_LIVE ? CUSTOM_DOMAIN : PAGES_URL;

/** Root deprecations.json aggregate (git-ignored build output of fragments/deprecations/*). */
export const DEPRECATIONS_PATH = 'deprecations.json';

/** Local discovery index written by scripts/registry/build.mjs (git-ignored). */
export const REGISTRY_INDEX = 'registry/registry.json';

/** Claims file written by scripts/docs/gen-claims.mjs (git-ignored generated dir). */
export const CLAIMS_PATH = 'apps/docs/generated/claims.json';

/** Registry item JSONs served by the docs site and aura-glass-registry. */
export const GENERATED_DIR = 'apps/docs/generated';
export const REGISTRY_PUBLIC_DIR = 'apps/docs/public/r';
export const REGISTRY_PACKAGE_DIR = 'packages/registry';

/** Report written next to the index listing certified/omitted items. */
export const REGISTRY_REPORT = 'registry/registry-report.json';

/** Artifact paths (S-55 + PLAT's own + MAT's), relative to the merged pipeline
    artifacts. Each path is the one its producer writes:
      perfReport/releaseVerdict/visualClass/subjects  src/contracts/testing.ts REPORTS (QUAL)
      packEnv            plat:package:pack (dotenv: TARBALL_MB, PACK_SHA)
      quickstartTiming   tests/dx/quickstart.spec.ts
      sizeBudgets        scripts/ci/verify-size-budgets.mjs (sha-stamped copy of docs/size-budgets.json)
      registryReport     scripts/registry/build.mjs (REGISTRY_REPORT)
      matContrast        scripts/mat/token-drift-l4.mjs (S-48 lane evidence)
      matRecipes         scripts/mat/count-glass-recipes.mjs */
export const ARTIFACTS = {
  perfReport: '.artifacts/qual/perf-report.json',
  releaseVerdict: '.artifacts/qual/release-verdict.json',
  visualClass: '.artifacts/qual/visual-class.json',
  subjects: 'storybook-static/cert-manifest.json',
  packEnv: '.artifacts/plat/pack.env',
  quickstartTiming: '.artifacts/plat/quickstart-timing.json',
  sizeBudgets: '.artifacts/plat/size-budgets/size-budgets.json',
  registryReport: REGISTRY_REPORT,
  matContrast: '.artifacts/mat/l4-token-contrast/contrast-matrix.json',
  matRecipes: '.artifacts/mat/count-glass-recipes/recipes.json',
};

/** Committed sources read from the build checkout itself (custody = the build commit's tree). */
export const TREE_SOURCES = {
  rootExports: 'etc/api/root.exports.json',
  catalogue: 'packages/cli/src/migrate/4to5/catalogue.json',
};

/** Generated release body (plat:release:notes) that render-claims fills and lint-claims scans. */
export const RELEASE_BODY = '.artifacts/plat/release-notes.md';

/** Schema URLs pinned by the vendored shadcn registry format. */
export const SHADCN_SCHEMA = {
  registry: 'https://ui.shadcn.com/schema/registry.json',
  item: 'https://ui.shadcn.com/schema/registry-item.json',
};
