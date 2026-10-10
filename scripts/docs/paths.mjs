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
    (llms.txt, @auraglass/mcp data): identical locally and in every pipeline. */
export const PUBLIC_DOCS_URL = CUSTOM_DOMAIN_LIVE ? CUSTOM_DOMAIN : PAGES_URL;

/** Root deprecations.json aggregate (git-ignored build output of fragments/deprecations/*). */
export const DEPRECATIONS_PATH = 'deprecations.json';

/** Local discovery index written by scripts/registry/build.mjs (git-ignored). */
export const REGISTRY_INDEX = 'registry/registry.json';

/** Claims file written by scripts/docs/gen-claims.mjs (git-ignored generated dir). */
export const CLAIMS_PATH = 'apps/docs/generated/claims.json';

/** Registry item JSONs served by the docs site and @auraglass/registry. */
export const GENERATED_DIR = 'apps/docs/generated';
export const REGISTRY_PUBLIC_DIR = 'apps/docs/public/r';
export const REGISTRY_PACKAGE_DIR = 'packages/registry';

/** Report written next to the index listing certified/omitted items. */
export const REGISTRY_REPORT = 'registry/registry-report.json';

/** Artifact paths (S-55 + PLAT's own), relative to the merged pipeline artifacts. */
export const ARTIFACTS = {
  perfReport: '.artifacts/qual/perf-report.json',
  releaseVerdict: '.artifacts/qual/release-verdict.json',
  visualClass: '.artifacts/qual/visual-class.json',
  subjects: 'storybook-static/cert-manifest.json',
  packEnv: '.artifacts/plat/pack.env',
  quickstartTiming: '.artifacts/plat/quickstart-timing.json',
  sizeMetafiles: '.artifacts/plat/size-budgets/',
  registryReport: '.artifacts/plat/registry-report.json',
};

/** Schema URLs pinned by the vendored shadcn registry format. */
export const SHADCN_SCHEMA = {
  registry: 'https://ui.shadcn.com/schema/registry.json',
  item: 'https://ui.shadcn.com/schema/registry-item.json',
};
