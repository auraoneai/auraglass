import { test, expect, type Browser, type Page } from "@playwright/test";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { PNG } from "playwright-core/lib/utilsBundle";

/**
 * AuraGlass token-purity + layout runtime audit.
 *
 * Enumerates every visually renderable component export from
 * reports/public-export-audit.json (the authoritative inventory) plus every recipe from
 * reports/3.3-release/recipe-render-evidence.json, resolves each to a Storybook
 * story id, and evaluates computed styles + layout at 1440x900, 768x1024,
 * 390x844. Every glass surface must carry the canonical backdrop chain
 * (blur 16|24|32|40|48px, saturate>=1.4, brightness>=1.0, contrast in
 * [0.95,1.2]), white-frost fill (lightest stop alpha in [0.015,0.35]), a real
 * border floor (>=0.12), and text alpha floors (primary>=0.90, secondary>=0.70,
 * tertiary>=0.50). Layout: no horizontal overflow, no zero-size glass surface,
 * no interactive overlap >2px.
 *
 * Failures write screenshot + computed-style JSON to reports/audit/<export-id>/
 * and aggregate into reports/audit/audit-summary.json. This spec is wired into
 * both playwright.visual-ci.config.ts and playwright.visual-matrix.config.ts.
 */

const repoRoot = process.cwd();
const auditRoot = path.join(repoRoot, "reports", "audit");
const captureAllVisuals = process.env.CAPTURE_ALL_VISUALS === "1";
const canonicalVisualEvidenceRoot = path.join(auditRoot, "visual-all");
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
] as const;

/** Optional targeted-run filter: AUDIT_ONLY="button,glass-advanced,glass-code-editor" */
const auditOnlyFilter = new Set(
  (process.env.AUDIT_ONLY || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
);
const targetedRun = auditOnlyFilter.size > 0;
const auditTargetSlug =
  [...auditOnlyFilter]
    .sort()
    .join("_")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120) || "selection";
const auditSummaryFilename = targetedRun
  ? `audit-summary.targeted-${auditTargetSlug}.json`
  : "audit-summary.json";
const auditGeneratedAt = new Date().toISOString();
const auditRunId = `runtime-audit-${targetedRun ? "targeted" : "full"}-${auditGeneratedAt.replace(/[^0-9]/g, "").slice(0, 14)}-${crypto.randomUUID()}`;
const fullVisualStagingRoot = path.join(
  auditRoot,
  `.visual-all-staging-${auditRunId}`
);
const visualCaptureRoot = targetedRun
  ? path.join(auditRoot, `visual-targeted-${auditTargetSlug}`)
  : captureAllVisuals
    ? fullVisualStagingRoot
    : canonicalVisualEvidenceRoot;
const reportedVisualEvidenceRoot = captureAllVisuals
  ? visualCaptureRoot
  : canonicalVisualEvidenceRoot;
const progressPath =
  process.env.AUDIT_PROGRESS_PATH ||
  path.join(
    auditRoot,
    targetedRun
      ? `runtime-audit-progress.targeted-${auditTargetSlug}.jsonl`
      : "runtime-audit-progress.jsonl"
  );
const viewportTransactionTimeoutMs = Math.max(
  1_000,
  Number(process.env.AUDIT_VIEWPORT_TIMEOUT_MS || 45_000)
);
const itemTransactionTimeoutMs = Math.max(
  viewportTransactionTimeoutMs,
  Number(process.env.AUDIT_ITEM_TIMEOUT_MS || 135_000)
);
const forcedTimeoutTarget = (
  process.env.AUDIT_FORCE_TIMEOUT || ""
).toLowerCase();
const auditFiltered = (id: string, exportName: string) =>
  auditOnlyFilter.size === 0 ||
  auditOnlyFilter.has(id.toLowerCase()) ||
  auditOnlyFilter.has(exportName.toLowerCase());

/** Append one JSON line per completed item so a crash never loses the run. */
const recordProgress = (entry: Record<string, unknown>) => {
  fs.mkdirSync(auditRoot, { recursive: true });
  fs.appendFileSync(progressPath, `${JSON.stringify(entry)}\n`);
};

class AuditTransactionTimeoutError extends Error {
  constructor(
    readonly scope: "item" | "viewport",
    readonly timeoutMs: number,
    message: string
  ) {
    super(message);
    this.name = "AuditTransactionTimeoutError";
  }
}

const runBounded = async <T>(
  operation: Promise<T>,
  timeoutMs: number,
  scope: "item" | "viewport",
  description: string
): Promise<T> => {
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () =>
            reject(
              new AuditTransactionTimeoutError(
                scope,
                timeoutMs,
                `${description} exceeded ${timeoutMs}ms ${scope} deadline`
              )
            ),
          timeoutMs
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

const closePageBounded = async (page: Page) => {
  await runBounded(
    page.close({ runBeforeUnload: false }),
    5_000,
    "viewport",
    "discarding timed-out audit page"
  ).catch(() => undefined);
};

const replaceAuditPage = async (browser: Browser, page: Page) => {
  await closePageBounded(page);
  const replacement = await runBounded(
    browser.newPage(),
    10_000,
    "viewport",
    "creating replacement audit page"
  );
  replacement.setDefaultTimeout(20_000);
  return replacement;
};

const writeTimeoutArtifact = (
  item: {
    id: string;
    exportName: string;
    sourcePath: string;
    isRecipe: boolean;
  },
  identity: { storyId: string | null; recipeHarness: string | null },
  viewport: { name: string; width: number; height: number },
  reason: string,
  timeout: AuditTransactionTimeoutError
) => {
  const dir = path.join(visualCaptureRoot, item.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${viewport.name}.computed-styles.json`),
    `${JSON.stringify(
      {
        runId: auditRunId,
        id: item.id,
        name: item.exportName,
        kind: item.isRecipe ? "recipe" : "export",
        sourcePath: item.sourcePath,
        storyId: identity.storyId,
        recipeHarness: identity.recipeHarness,
        viewport,
        timeout: {
          scope: timeout.scope,
          timeoutMs: timeout.timeoutMs,
          reason,
        },
        surfaces: [],
        layoutIssues: [],
        textAlphas: [],
        texts: [],
        paints: [],
        consoleErrors: [],
        pageErrors: [],
      },
      null,
      2
    )}\n`
  );
};

const storybookUrl = process.env.STORYBOOK_URL || "http://localhost:6006";
const authoritativeVisualExportCount = 470;
const authoritativeNonvisualExportCount = 1;
const authoritativePublicExportScopeCount = 471;
const authoritativeRecipeCount = 28;
const authoritativeVisualTotal = 498;
const authoritativeAuditedTotal = 499;
const staleComponentLikeExportClaim = 439;

type ExportEntry = {
  exportName: string;
  importedName: string;
  kind: string;
  isAlias: boolean;
  isComponentLike: boolean;
  specifier: string;
  sourcePath: string;
  hasInventoryEntry: boolean;
  hasDirectStory: boolean;
  hasDirectTest?: boolean;
  nonVisualReason?: string;
};

type PublicExportAudit = {
  entries: ExportEntry[];
  nonVisualPublicExports?: Array<{
    exportName: string;
    sourcePath: string;
    reason: string;
  }>;
};

type PublicVisualTargetManifest = {
  schemaVersion: number;
  summary: {
    publicVisualExportCount: number;
    coverageIdentityCount: number;
    unclassifiedCount: number;
  };
  entries: Array<{
    exportName: string;
    sourcePath: string;
    classification: "canonical" | "alias" | "coveredBy";
    coverageId: string;
  }>;
  nonvisualExclusions: Array<{
    exportName: string;
    sourcePath: string;
    classification: "nonvisual";
    reason: string;
  }>;
};

type NonvisualExclusion = {
  name: string;
  sourcePath: string;
  reason: string;
  tests: Array<{
    path: string;
    command: string;
    status: "pass" | "fail";
  }>;
  apiTestEvidence: {
    path: string;
    command: string;
    status: "pass" | "fail";
  };
};

type InventoryEntry = {
  name: string;
  path: string;
  category: string;
};

type RecipeEvidence = {
  recipeCount: number;
  passed: boolean;
  screenshots: Array<{ id: string; file: string }>;
};

type RecipeComputedEvidence = {
  runId?: string;
  id?: string;
  name?: string;
  kind?: string;
  sourcePath?: string;
  storyId?: string | null;
  recipeHarness?: string | null;
  viewport?: { name?: string; width?: number; height?: number };
  surfaces?: unknown[];
  layoutIssues?: unknown[];
  textAlphas?: unknown[];
  texts?: unknown[];
  paints?: unknown[];
  consoleErrors?: unknown[];
  pageErrors?: unknown[];
};

type StoryEntry = {
  id: string;
  name?: string;
  title?: string;
  importPath?: string;
  type?: string;
};

type SurfaceInspection = {
  selector: string;
  className: string;
  inputType: string | null;
  surfaceKind: "backdrop" | "glass-surface" | "liquid" | "decorative";
  x: number;
  y: number;
  width: number;
  height: number;
  backdropFilter: string;
  webkitBackdropFilter: string;
  backdropFilterAuthored: boolean;
  webkitBackdropFilterAuthored: boolean;
  backgroundColor: string;
  backgroundImage: string;
  backgroundImages: string[];
  borderTopColor: string;
  borderWidth: string;
  borders: Array<{ color: string; width: string }>;
  boxShadow: string;
  color: string;
  overflowX: string;
  overflowY: string;
  scrollWidth: number;
  clientWidth: number;
  scrollHeight: number;
  clientHeight: number;
  elevationLevel: number | null;
  noiseOpacity: number | null;
  specularAlpha: number | null;
  sheenAlphas: number[];
};

type TextInspection = {
  selector: string;
  className: string;
  role: "primary" | "secondary" | "tertiary" | "unclassified";
  colorAlpha: number;
  effectiveAlpha: number;
  foregroundColor: string;
  localBackdropColor: string;
  contrastRatio: number | null;
  fontSize: number;
  fontWeight: number;
  text: string;
};

type PaintInspection = {
  selector: string;
  className: string;
  paintRole: "canvas" | "large-surface" | "interactive";
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage: string;
  boxShadow: string;
  colors: Array<{ r: number; g: number; b: number; a: number }>;
};

type LayoutIssue = { type: string; detail: string };

type PresentationIssue = { type: string; detail: string };

type ViewportColorCensus = {
  sampledPixels: number;
  coloredPixels: number;
  coloredAreaRatio: number;
  tintedNeutralPixels: number;
  tintedNeutralRatio: number;
  coolPixels: number;
  warmPixels: number;
  dominantCast: "cool" | "warm" | "mixed" | "neutral";
  meanChroma: number;
  meanNeutralChroma: number;
  localizedColoredRegions: number;
};

const readJson = <T>(relativePath: string): T =>
  JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8")) as T;

const toRepoRelativePath = (absolutePath: string) =>
  path.relative(repoRoot, absolutePath).split(path.sep).join("/");

const resolveRepoArtifact = (relativePath: string) => {
  const absolutePath = path.resolve(repoRoot, relativePath);
  const relative = path.relative(repoRoot, absolutePath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`artifact path escapes repository: ${relativePath}`);
  }
  return absolutePath;
};

const sha256File = (filePath: string) =>
  crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");

const sourceFingerprint = (paths: string[]) => {
  const hash = crypto.createHash("sha256");
  for (const relativePath of [...new Set(paths)].sort()) {
    const absolutePath = resolveRepoArtifact(relativePath);
    hash.update(relativePath);
    hash.update("\0");
    hash.update(fs.readFileSync(absolutePath));
    hash.update("\0");
  }
  return `sha256:${hash.digest("hex")}`;
};

const repositoryRelativePath = (relativePath: string) => {
  const absolutePath = resolveRepoArtifact(relativePath);
  if (fs.existsSync(absolutePath)) return relativePath;
  if (relativePath.startsWith("recipes/")) {
    return "src/registry/recipes.ts";
  }
  throw new Error(`source fingerprint input does not exist: ${relativePath}`);
};

const atomicWriteJson = (filePath: string, value: unknown) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporaryPath, filePath);
};

const normalizeName = (value: string) =>
  value
    .toLowerCase()
    .replace(/\.(stories|test|spec)?\.?tsx?$/, "")
    .replace(/\.md$/, "")
    .replace(/^glass/, "")
    .replace(/[^a-z0-9]/g, "");

const candidateNames = (componentName: string) =>
  new Set([
    normalizeName(componentName),
    normalizeName(componentName.replace(/^Glass/, "")),
    normalizeName(`Glass${componentName}`),
  ]);

const storyNameForMatch = (entry: StoryEntry) => {
  const titleLeaf =
    String(entry.title || "")
      .split("/")
      .pop() || "";
  const importLeaf = entry.importPath
    ? path.basename(entry.importPath).replace(/\.stories\.[^.]+$/, "")
    : "";
  return new Set([
    normalizeName(titleLeaf),
    normalizeName(importLeaf),
    normalizeName(entry.name || ""),
    normalizeName(`${titleLeaf}${entry.name || ""}`),
  ]);
};

const isDocsEntry = (entry: StoryEntry) =>
  entry.type === "docs" || String(entry.id || "").endsWith("--docs");

const findStoriesForName = (entries: StoryEntry[], name: string) => {
  const candidates = candidateNames(name);
  return entries.filter((entry) => {
    if (isDocsEntry(entry)) return false;
    const names = storyNameForMatch(entry);
    return [...candidates].some((candidate) => names.has(candidate));
  });
};

const isGeneratedCertificationStory = (entry: StoryEntry) =>
  String(entry.importPath || "").endsWith(
    "GlassMissingInventoryCertification.stories.tsx"
  );

const certificationStoryCache = new Map<string, boolean>();
const sourceDependencyCache = new Map<string, string[]>();
const sourceCertificationReachabilityCache = new Map<string, boolean>();
const sourceCertificationMarkerCache = new Map<string, boolean>();
const localSourceDependency = (fromPath: string, specifier: string) => {
  if (!specifier.startsWith(".")) return null;
  const basePath = path.resolve(path.dirname(fromPath), specifier);
  const candidates = /\.[cm]?[jt]sx?$/.test(basePath)
    ? [basePath]
    : [
        ...[".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"].map(
          (extension) => `${basePath}${extension}`
        ),
        ...[".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"].map((extension) =>
          path.join(basePath, `index${extension}`)
        ),
      ];
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
};

const sourceUsesGeneratedCertificationCase = (
  absolutePath: string
): boolean => {
  const cached = sourceCertificationReachabilityCache.get(absolutePath);
  if (cached !== undefined) return cached;
  const pending = [absolutePath];
  const reachable = new Set<string>();
  while (pending.length > 0) {
    const currentPath = pending.pop();
    if (!currentPath || reachable.has(currentPath)) continue;
    reachable.add(currentPath);
    const currentCached = sourceCertificationReachabilityCache.get(currentPath);
    if (currentCached === true) {
      sourceCertificationReachabilityCache.set(absolutePath, true);
      return true;
    }
    if (currentCached === false) continue;

    const relativePath = path.relative(repoRoot, currentPath);
    if (
      relativePath.startsWith("..") ||
      path.isAbsolute(relativePath) ||
      !fs.existsSync(currentPath)
    ) {
      sourceCertificationReachabilityCache.set(currentPath, false);
      continue;
    }
    let dependencies = sourceDependencyCache.get(currentPath);
    let hasCertificationMarker =
      sourceCertificationMarkerCache.get(currentPath);
    if (!dependencies || hasCertificationMarker === undefined) {
      const source = fs.readFileSync(currentPath, "utf8");
      hasCertificationMarker =
        source.includes("GlassMissingInventoryCertification") &&
        /\bCertificationCase\b/.test(source);
      sourceCertificationMarkerCache.set(currentPath, hasCertificationMarker);
      const moduleSpecifiers = [
        ...source.matchAll(
          /\b(?:import|export)\s+(?:type\s+)?(?:[^;"']*?\s+from\s+)?["']([^"']+)["']/g
        ),
      ].map((match) => match[1]);
      dependencies = moduleSpecifiers
        .map((specifier) => localSourceDependency(currentPath, specifier))
        .filter((dependency): dependency is string => Boolean(dependency));
      sourceDependencyCache.set(currentPath, dependencies);
    }
    if (hasCertificationMarker) {
      sourceCertificationReachabilityCache.set(currentPath, true);
      sourceCertificationReachabilityCache.set(absolutePath, true);
      return true;
    }
    pending.push(...dependencies);
  }

  // The complete dependency closure was inspected without finding a marker.
  // Every node in that closure is therefore safe to memoize as a clean root,
  // including nodes participating in import cycles.
  for (const reachablePath of reachable) {
    sourceCertificationReachabilityCache.set(reachablePath, false);
  }
  return false;
};

const storyUsesGeneratedCertificationCase = (entry: StoryEntry) => {
  const importPath = String(entry.importPath || "").replace(/^\.\//, "");
  if (!importPath) return false;
  const cached = certificationStoryCache.get(importPath);
  if (cached !== undefined) return cached;
  const usesFallback = sourceUsesGeneratedCertificationCase(
    path.resolve(repoRoot, importPath)
  );
  certificationStoryCache.set(importPath, usesFallback);
  return usesFallback;
};

const isCertificationFallbackStory = (entry: StoryEntry) =>
  isGeneratedCertificationStory(entry) ||
  storyUsesGeneratedCertificationCase(entry);

const rankStory = (entry: StoryEntry) => {
  const name = normalizeName(entry.name || "");
  if (name === "default") return 0;
  if (name === "primary") return 1;
  if (name.includes("basic")) return 2;
  if (name.includes("variants")) return 3;
  return 10;
};

const pathScoreForExport = (
  entry: StoryEntry,
  sourcePath: string,
  componentDir: string | null
) => {
  const importPath = String(entry.importPath || "");
  let score = rankStory(entry);
  const expectedStoryPath = sourcePath.replace(
    /\.(ts|tsx|js|jsx|mjs|cjs)$/,
    ".stories.tsx"
  );
  if (importPath.endsWith(expectedStoryPath)) score -= 100;
  if (componentDir && importPath.includes(componentDir)) score -= 25;
  if (isGeneratedCertificationStory(entry)) score += 100;
  return score;
};

const findStoriesForExport = (
  entries: StoryEntry[],
  exportName: string,
  sourcePath: string
) => {
  const candidates = candidateNames(exportName);
  const direct = entries.filter((entry) => {
    if (isDocsEntry(entry)) return false;
    const names = storyNameForMatch(entry);
    return [...candidates].some((candidate) => names.has(candidate));
  });
  const componentDir = path.posix.dirname(sourcePath);
  return direct.sort(
    (a, b) =>
      pathScoreForExport(a, sourcePath, componentDir) -
      pathScoreForExport(b, sourcePath, componentDir)
  );
};

const findStoriesBySourceFile = (entries: StoryEntry[], sourcePath: string) => {
  const expectedStoryPath = sourcePath.replace(
    /\.(ts|tsx|js|jsx|mjs|cjs)$/,
    ".stories.tsx"
  );
  return entries.filter((entry) => {
    if (isDocsEntry(entry)) return false;
    return String(entry.importPath || "").endsWith(expectedStoryPath);
  });
};

const exactExportStoryMatch = (entry: StoryEntry, exportName: string) => {
  return normalizeName(entry.name || "") === normalizeName(exportName);
};

const sourcePathForExport = (entry: ExportEntry) => {
  const raw = entry.sourcePath || entry.specifier || "";
  const cleaned = raw
    .replace(/^src\//, "")
    .replace(/\.(ts|tsx|js|jsx|mjs|cjs)$/, "");
  return path.posix.join("src", cleaned);
};

const toExportId = (name: string, fallbackIndex?: number) => {
  const base = name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase()
    .replace(/^-+|-+$/g, "");
  const suffix = fallbackIndex !== undefined ? `-${fallbackIndex}` : "";
  return `${base}${suffix}`;
};

const parseRgba = (
  value: string
): { r: number; g: number; b: number; a: number } | null => {
  const match = value.match(
    /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/
  );
  if (!match) return null;
  const alpha =
    match[4] === undefined
      ? 1
      : match[4].endsWith("%")
        ? Number.parseFloat(match[4]) / 100
        : Number.parseFloat(match[4]);
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: alpha,
  };
};

const parseHex = (
  value: string
): { r: number; g: number; b: number; a: number } | null => {
  const match = value.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (!match) return null;
  let hex = match[1];
  if (hex.length === 3 || hex.length === 4) {
    hex = [...hex].map((c) => `${c}${c}`).join("");
  }
  if (hex.length === 6) hex = `${hex}ff`;
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
    a: Number.parseInt(hex.slice(6, 8), 16) / 255,
  };
};

const normalizeAlpha = (alpha: string | undefined): number =>
  alpha === undefined
    ? 1
    : alpha.endsWith("%")
      ? Number.parseFloat(alpha) / 100
      : Number.parseFloat(alpha);

const parseColor = (
  value: string
): { r: number; g: number; b: number; a: number } | null => {
  const rgba = parseRgba(value);
  if (rgba) return rgba;
  const hex = parseHex(value);
  if (hex) return hex;
  // Chromium serializes modern color syntax as
  // color(srgb r g b / a) / color(srgb r g b) and percentage alphas.
  const modern = value.match(
    /^color\(\s*(srgb|display-p3|srgb-linear)\s+([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)$/
  );
  if (!modern) return null;
  const toChannel = (channel: string): number => {
    if (channel.endsWith("%")) return (Number.parseFloat(channel) / 100) * 255;
    return Number(channel);
  };
  // Serialized sRGB values are already in 0..255 (Chromium emits
  // color(srgb 0.98 0.98 0.98 / 0.5) with 0..1 ranges in modern spec, but
  // computed styles return 0..255 scaled values).
  const r = toChannel(modern[2]);
  const g = toChannel(modern[3]);
  const b = toChannel(modern[4]);
  // If values look like 0..1 (modern serialization), scale to 0..255.
  const max = Math.max(r, g, b);
  const scale = max <= 1 ? 255 : 1;
  return {
    r: r * scale,
    g: g * scale,
    b: b * scale,
    a: normalizeAlpha(modern[5]),
  };
};

const extractColorAlphas = (
  value: string
): Array<{ alpha: number; rgb: string }> => {
  const out: Array<{ alpha: number; rgb: string }> = [];
  const rgbaRe =
    /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/g;
  let match: RegExpExecArray | null;
  while ((match = rgbaRe.exec(value))) {
    out.push({
      rgb: `${match[1]},${match[2]},${match[3]}`,
      alpha: normalizeAlpha(match[4]),
    });
  }
  const modernRe =
    /color\(\s*(srgb|display-p3|srgb-linear)\s+([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)/g;
  while ((match = modernRe.exec(value))) {
    const toChannel = (channel: string): number => {
      if (channel.endsWith("%"))
        return (Number.parseFloat(channel) / 100) * 255;
      return Number(channel);
    };
    const r = toChannel(match[2]);
    const g = toChannel(match[3]);
    const b = toChannel(match[4]);
    const max = Math.max(r, g, b);
    const scale = max <= 1 ? 255 : 1;
    out.push({
      rgb: `${r * scale},${g * scale},${b * scale}`,
      alpha: normalizeAlpha(match[5]),
    });
  }
  return out;
};

const isDarkChannel = (color: { r: number; g: number; b: number }) => {
  const luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
  return luminance < 80;
};

const parseBlurPx = (filter: string): number | null => {
  const match = filter.match(/blur\(\s*([\d.]+)px\s*\)/);
  return match ? Number(match[1]) : null;
};

const parseFilterComponent = (
  filter: string,
  name: "saturate" | "brightness" | "contrast"
) => {
  const match = filter.match(new RegExp(`${name}\\(\\s*([\\d.]+)\\s*\\)`));
  return match ? Number(match[1]) : null;
};

const webkitBackdropFilter = (style: CSSStyleDeclaration): string => {
  const prefixed =
    style.getPropertyValue("-webkit-backdrop-filter") ||
    (style as unknown as { webkitBackdropFilter?: string })
      .webkitBackdropFilter;
  // Chromium aliases the prefixed property to the standard property and then
  // exposes the prefixed computed value as an empty string. In that engine the
  // standard computed chain is the authoritative value for both spellings.
  return prefixed && prefixed !== "none"
    ? prefixed
    : style.backdropFilter || "none";
};

const activeClassTokens = (cls: string) =>
  cls
    .split(/\s+/)
    .filter(Boolean)
    // Tailwind-style variants are literal DOM tokens until their state/media
    // condition applies. In particular, `hover:glass-surface-subtle/10` must
    // not turn an otherwise plain wrapper into a material surface.
    .filter((token) => !token.includes(":"));

const isSurfaceRoleClass = (cls: string) =>
  activeClassTokens(cls).some(
    (token) =>
      token === "glass" ||
      token === "optimized-glass-surface" ||
      /^glass-foundation-(?:basic|complete)$/.test(token) ||
      /^glass-(?:surface(?:[-/].*)?|(?:neutral|primary|success|warning|danger|info)-level[1-5])$/.test(
        token
      ) ||
      token === "liquid-glass-material" ||
      /^liquid-glass-[a-z0-9-]+-surface$/.test(token)
  );

const isStorybookChrome = (node: Element) => {
  const cls = String(node.className || "");
  // Storybook chrome wins over surface detection: the `ag-story-*` wrappers
  // are audit scaffolding, never shipped surfaces, even when they carry a
  // backdrop-filter or a glass surface class.
  if (/\bag-story-\b/.test(cls)) return true;
  if (/\bglass-sr-only\b/.test(cls)) return true;
  const tag = node.tagName.toLowerCase();
  if (tag === "a" && /skip-link|sr-only/i.test(cls)) return true;
  const style = window.getComputedStyle(node);
  const backdrop =
    style.backdropFilter || webkitBackdropFilter(style) || "none";
  const isSurfaceRole = backdrop !== "none" || isSurfaceRoleClass(cls);
  // A node with a real backdrop-filter or an explicit glass surface role is a
  // story surface even when it also carries the story contrast-guard or
  // on-light class (e.g. glass-foundation-complete ... glass-contrast-guard).
  // Only the non-surface chrome wrappers are excluded.
  if (isSurfaceRole) return false;
  if (/\bglass-on-light\b/.test(cls)) return true;
  if (/\bcontrast-guard\b|\bglass-contrast-guard\b/.test(cls)) return true;
  return false;
};

const inspectSurface = (page: Page): Promise<SurfaceInspection[]> =>
  page.evaluate(() => {
    const webkitBackdropFilter = (style: CSSStyleDeclaration) => {
      const prefixed =
        style.getPropertyValue("-webkit-backdrop-filter") ||
        (style as unknown as { webkitBackdropFilter?: string })
          .webkitBackdropFilter;
      return prefixed && prefixed !== "none"
        ? prefixed
        : style.backdropFilter || "none";
    };
    const isGenuinelyHidden = (node: Element) => {
      let current: Element | null = node;
      while (current && current !== document.documentElement) {
        const style = window.getComputedStyle(current);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number(style.opacity || "1") <= 0.01 ||
          current.hasAttribute("hidden")
        ) {
          return true;
        }
        current = current.parentElement;
      }
      return false;
    };
    const hasAuthoredProperty = (node: Element, property: string) => {
      if (node instanceof HTMLElement && node.style.getPropertyValue(property))
        return true;
      for (const sheet of [...document.styleSheets]) {
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        const visit = (list: CSSRuleList): boolean => {
          for (const rule of [...list]) {
            if (rule instanceof CSSStyleRule) {
              if (!rule.style.getPropertyValue(property)) continue;
              try {
                if (node.matches(rule.selectorText)) return true;
              } catch {
                // Ignore selectors Chromium cannot query directly.
              }
            } else if (
              "cssRules" in rule &&
              visit((rule as CSSGroupingRule).cssRules)
            ) {
              return true;
            }
          }
          return false;
        };
        if (visit(rules)) return true;
      }
      return false;
    };
    const activeClassTokens = (cls: string) =>
      cls
        .split(/\s+/)
        .filter(Boolean)
        .filter((token) => !token.includes(":"));
    const isSurfaceRoleClass = (cls: string) =>
      activeClassTokens(cls).some(
        (token) =>
          token === "glass" ||
          token === "optimized-glass-surface" ||
          /^glass-foundation-(?:basic|complete)$/.test(token) ||
          /^glass-(?:surface(?:[-/].*)?|(?:neutral|primary|success|warning|danger|info)-level[1-5])$/.test(
            token
          ) ||
          token === "liquid-glass-material" ||
          /^liquid-glass-[a-z0-9-]+-surface$/.test(token)
      );
    const isStorybookChrome = (node: Element) => {
      const cls = String(node.className || "");
      // Storybook chrome wins over surface detection (see top-level comment).
      if (/\bag-story-\b/.test(cls)) return true;
      if (/\bglass-sr-only\b/.test(cls)) return true;
      const tag = node.tagName.toLowerCase();
      if (tag === "a" && /skip-link|sr-only/i.test(cls)) return true;
      const style = window.getComputedStyle(node);
      const backdrop =
        style.backdropFilter || webkitBackdropFilter(style) || "none";
      if (backdrop !== "none" || isSurfaceRoleClass(cls)) {
        return false;
      }
      if (/\bglass-on-light\b/.test(cls)) return true;
      if (/\bcontrast-guard\b|\bglass-contrast-guard\b/.test(cls)) return true;
      return false;
    };
    // Portalled components (sheets, dialogs, popovers, menus) render as body
    // siblings of #storybook-root. Restricting the walk to the story root
    // silently omitted precisely those top-level material surfaces.
    const all = [...document.body.querySelectorAll("*")];
    const surfaceCandidates = all.filter((node) => {
      if (isStorybookChrome(node)) return false;
      if (isGenuinelyHidden(node)) return false;
      const style = window.getComputedStyle(node);
      const box = node.getBoundingClientRect();
      if (box.width <= 1 || box.height <= 1) return false;
      if (
        box.right <= 0 ||
        box.bottom <= 0 ||
        box.left >= window.innerWidth ||
        box.top >= window.innerHeight
      ) {
        return false;
      }
      const cls = String(node.className || "");
      const backdrop =
        style.backdropFilter || webkitBackdropFilter(style) || "none";
      if (backdrop !== "none") return true;
      // Only glass surface roles are token-inspected. Generic layout/utility
      // wrappers (glass-flex, glass-grid, glass-p-*, glass-w-*, ...) that carry
      // no backdrop-filter and no surface fill are not glass surfaces.
      const isSurfaceRole = isSurfaceRoleClass(cls);
      return isSurfaceRole;
    });

    // Preserve every rendered surface. Earlier versions retained only the four
    // largest nodes, which could hide a bad nested control behind a good card.
    const ranked = [...surfaceCandidates].sort((a, b) => {
      const areaA =
        a.getBoundingClientRect().width * a.getBoundingClientRect().height;
      const areaB =
        b.getBoundingClientRect().width * b.getBoundingClientRect().height;
      return areaB - areaA;
    });

    return ranked.map((node) => {
      const style = window.getComputedStyle(node);
      const box = node.getBoundingClientRect();
      const backgroundImage = style.backgroundImage || "none";
      // Keep the computed image list intact. Splitting on `),` corrupts
      // nested rgba()/gradient functions and can hide failing later stops.
      const backgroundImages =
        backgroundImage === "none" ? [] : [backgroundImage];
      const backdrop =
        style.backdropFilter || webkitBackdropFilter(style) || "none";
      const cls = String(node.className || "");
      const explicitSurfaceRole = isSurfaceRoleClass(cls);
      const tokens = activeClassTokens(cls);
      const isKnownDecorativeBackdrop =
        !explicitSurfaceRole &&
        tokens.some((token) =>
          /^(?:liquid-glass-sheen|glass-(?:overlay|ripple|shimmer|reflection|refraction)(?:-|$))/.test(
            token
          )
        );
      const surfaceKind = isKnownDecorativeBackdrop
        ? "decorative"
        : backdrop !== "none"
          ? "backdrop"
          : tokens.some(
                (token) =>
                  token === "liquid-glass-material" ||
                  /^liquid-glass-[a-z0-9-]+-surface$/.test(token)
              )
            ? "liquid"
            : explicitSurfaceRole
              ? "glass-surface"
              : "decorative";
      const elevationMatch = tokens
        .join(" ")
        .match(
          /(?:^|\s)glass-(?:neutral|primary|success|warning|danger|info)-level([1-5])(?:\s|$)/
        );
      const noiseStyle = window.getComputedStyle(node, "::before");
      const specularStyle = window.getComputedStyle(node, "::after");
      const hasNoise = tokens.includes("glass-overlay-noise");
      const hasSpecular = tokens.includes("glass-overlay-specular");
      const sheenAlphas = [
        ...node.querySelectorAll(":scope > .liquid-glass-sheen"),
      ].flatMap((sheen) => {
        const sheenStyle = window.getComputedStyle(sheen);
        const opacity = Number.parseFloat(sheenStyle.opacity || "1");
        const colors = `${sheenStyle.backgroundColor} ${sheenStyle.backgroundImage}`;
        const values: number[] = [];
        const re =
          /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/g;
        let match: RegExpExecArray | null;
        while ((match = re.exec(colors))) {
          const channels = [
            Number(match[1]),
            Number(match[2]),
            Number(match[3]),
          ];
          if (
            Math.min(...channels) < 245 ||
            Math.max(...channels) - Math.min(...channels) > 6
          )
            continue;
          const alpha =
            match[4] === undefined
              ? 1
              : match[4].endsWith("%")
                ? Number.parseFloat(match[4]) / 100
                : Number.parseFloat(match[4]);
          if (alpha > 0) values.push(alpha * opacity);
        }
        return values;
      });
      const borders = (["Top", "Right", "Bottom", "Left"] as const).map(
        (side) => ({
          color: style[`border${side}Color`],
          width: style[`border${side}Width`],
        })
      );
      return {
        selector: node.tagName.toLowerCase(),
        className: String(node.className || "").slice(0, 220),
        inputType: node instanceof HTMLInputElement ? node.type : null,
        surfaceKind,
        x: Math.round(box.x),
        y: Math.round(box.y),
        width: Math.round(box.width),
        height: Math.round(box.height),
        backdropFilter: backdrop,
        webkitBackdropFilter: webkitBackdropFilter(style),
        backdropFilterAuthored: hasAuthoredProperty(node, "backdrop-filter"),
        webkitBackdropFilterAuthored: hasAuthoredProperty(
          node,
          "-webkit-backdrop-filter"
        ),
        backgroundColor: style.backgroundColor,
        backgroundImage,
        backgroundImages,
        borderTopColor: style.borderTopColor,
        borderWidth: style.borderWidth,
        boxShadow: style.boxShadow,
        color: style.color,
        overflowX: style.overflowX,
        overflowY: style.overflowY,
        scrollWidth: node.scrollWidth,
        clientWidth: node.clientWidth,
        scrollHeight: node.scrollHeight,
        clientHeight: node.clientHeight,
        borders,
        elevationLevel: elevationMatch ? Number(elevationMatch[1]) : null,
        noiseOpacity:
          hasNoise && noiseStyle.content !== "none"
            ? Number.parseFloat(noiseStyle.opacity || "0")
            : null,
        specularAlpha:
          hasSpecular && specularStyle.content !== "none"
            ? Number.parseFloat(specularStyle.opacity || "0")
            : null,
        sheenAlphas,
      };
    });
  });

const collectLayoutIssues = (page: Page): Promise<LayoutIssue[]> =>
  page.evaluate(() => {
    const isGenuinelyHidden = (node: Element) => {
      let current: Element | null = node;
      while (current && current !== document.documentElement) {
        const style = window.getComputedStyle(current);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number(style.opacity || "1") <= 0.01 ||
          current.hasAttribute("hidden")
        ) {
          return true;
        }
        current = current.parentElement;
      }
      return false;
    };
    const activeClassTokens = (cls: string) =>
      cls
        .split(/\s+/)
        .filter(Boolean)
        .filter((token) => !token.includes(":"));
    const isSurfaceRoleClass = (cls: string) =>
      activeClassTokens(cls).some(
        (token) =>
          token === "glass" ||
          token === "optimized-glass-surface" ||
          /^glass-foundation-(?:basic|complete)$/.test(token) ||
          /^glass-(?:surface(?:[-/].*)?|(?:neutral|primary|success|warning|danger|info)-level[1-5])$/.test(
            token
          ) ||
          token === "liquid-glass-material" ||
          /^liquid-glass-[a-z0-9-]+-surface$/.test(token)
      );
    const isStorybookChrome = (node: Element) => {
      const cls = String(node.className || "");
      // Storybook chrome wins over surface detection (see top-level comment).
      if (/\bag-story-\b/.test(cls)) return true;
      if (/\bglass-sr-only\b/.test(cls)) return true;
      const tag = node.tagName.toLowerCase();
      if (tag === "a" && /skip-link|sr-only/i.test(cls)) return true;
      const style = window.getComputedStyle(node);
      const backdrop =
        style.backdropFilter || webkitBackdropFilter(style) || "none";
      if (backdrop !== "none" || isSurfaceRoleClass(cls)) {
        return false;
      }
      if (/\bglass-on-light\b/.test(cls)) return true;
      if (/\bcontrast-guard\b|\bglass-contrast-guard\b/.test(cls)) return true;
      return false;
    };
    const webkitBackdropFilter = (style: CSSStyleDeclaration) => {
      const prefixed =
        style.getPropertyValue("-webkit-backdrop-filter") ||
        (style as unknown as { webkitBackdropFilter?: string })
          .webkitBackdropFilter;
      return prefixed && prefixed !== "none"
        ? prefixed
        : style.backdropFilter || "none";
    };
    const issues: LayoutIssue[] = [];
    const documentElement = document.documentElement;
    if (documentElement.scrollWidth > documentElement.clientWidth + 2) {
      issues.push({
        type: "horizontal-overflow",
        detail: `documentElement scrollWidth=${documentElement.scrollWidth} clientWidth=${documentElement.clientWidth}`,
      });
    }

    const root = document.body;
    const isVisuallyHiddenA11yText = (node: Element) => {
      let current: Element | null = node;
      while (current && current !== root.parentElement) {
        const tokens = activeClassTokens(String(current.className || ""));
        if (tokens.includes("sr-only") || tokens.includes("glass-sr-only")) {
          return true;
        }
        const style = window.getComputedStyle(current);
        const box = current.getBoundingClientRect();
        const onePixelClip =
          box.width <= 1 &&
          box.height <= 1 &&
          ["absolute", "fixed"].includes(style.position) &&
          ["hidden", "clip"].includes(style.overflowX) &&
          ["hidden", "clip"].includes(style.overflowY) &&
          (style.clip !== "auto" ||
            style.clipPath !== "none" ||
            style.whiteSpace === "nowrap");
        if (onePixelClip) return true;
        current = current.parentElement;
      }
      return false;
    };
    const glassLike = [...root.querySelectorAll("*")].filter((node) => {
      if (isStorybookChrome(node)) return false;
      if (isGenuinelyHidden(node)) return false;
      const style = window.getComputedStyle(node);
      const box = node.getBoundingClientRect();
      if (
        box.right <= 0 ||
        box.bottom <= 0 ||
        box.left >= window.innerWidth ||
        box.top >= window.innerHeight
      ) {
        return false;
      }
      const cls = String(node.className || "");
      const backdrop =
        style.backdropFilter || webkitBackdropFilter(style) || "none";
      const isSurfaceRole = backdrop !== "none" || isSurfaceRoleClass(cls);
      if (!isSurfaceRole) return false;
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity || "1") > 0.01
      );
    });
    for (const node of glassLike) {
      const box = node.getBoundingClientRect();
      const tag = node.tagName.toLowerCase();
      const cls = String(node.className || "");
      const overflowStyle = window.getComputedStyle(node);
      const isSvgDescendant = node.closest("svg") !== null;
      // Native range controls expose the painted thumb/track through scroll
      // metrics that are a few pixels taller than the CSS content box. That
      // is UA-control geometry, not clipped recipe content; the range remains
      // in the surface/token and interactive-overlap audits.
      const isNativeRangeControl =
        node instanceof HTMLInputElement && node.type === "range";
      const isDivider =
        (tag === "div" || tag === "span") &&
        (box.width <= 2 || box.height <= 2);
      if (
        (box.width === 0 || box.height === 0) &&
        !isSvgDescendant &&
        !isDivider
      ) {
        issues.push({
          type: "zero-size-glass-surface",
          detail: `${node.tagName}.${String(node.className || "")}`.slice(
            0,
            160
          ),
        });
      }
      if (
        node.scrollWidth > node.clientWidth + 2 &&
        overflowStyle.overflowX !== "auto" &&
        overflowStyle.overflowX !== "scroll" &&
        !isSvgDescendant &&
        !/glass-sr-only/.test(cls)
      ) {
        issues.push({
          type: "glass-surface-overflow",
          detail: `${node.tagName}.${String(node.className || "")}`.slice(
            0,
            160
          ),
        });
      }
      if (
        node.scrollHeight > node.clientHeight + 2 &&
        overflowStyle.overflowY !== "auto" &&
        overflowStyle.overflowY !== "scroll" &&
        !isSvgDescendant &&
        !isNativeRangeControl &&
        !/glass-sr-only/.test(cls)
      ) {
        issues.push({
          type: "glass-surface-vertical-clipping",
          detail: `${node.tagName}.${String(node.className || "")}`.slice(
            0,
            160
          ),
        });
      }
    }

    const textBearing = [...root.querySelectorAll("*")].filter((node) => {
      if (isStorybookChrome(node) || isGenuinelyHidden(node)) return false;
      if (isVisuallyHiddenA11yText(node)) return false;
      const hasDirectText = [...node.childNodes].some(
        (child) =>
          child.nodeType === Node.TEXT_NODE &&
          Boolean(child.textContent?.trim())
      );
      return (
        hasDirectText ||
        (node instanceof HTMLInputElement && node.type !== "range") ||
        node instanceof HTMLTextAreaElement
      );
    });
    for (const node of textBearing) {
      const box = node.getBoundingClientRect();
      if (box.width <= 0 || box.height <= 0) continue;
      const style = window.getComputedStyle(node);
      const clippedX = node.scrollWidth > node.clientWidth + 2;
      const clippedY = node.scrollHeight > node.clientHeight + 2;
      const parsedLineClamp = Number.parseInt(
        style.getPropertyValue("-webkit-line-clamp").trim(),
        10
      );
      // Chromium returns the keyword `none` for ordinary text. parseInt(none)
      // is NaN; treating NaN as a positive clamp made every text node fail.
      const lineClamp =
        Number.isFinite(parsedLineClamp) && parsedLineClamp > 0
          ? parsedLineClamp
          : 0;
      let lineClampTruncated = false;
      if (lineClamp > 0 && node instanceof HTMLElement) {
        const clone = node.cloneNode(true) as HTMLElement;
        clone.style.cssText += [
          "position:fixed!important",
          "left:-10000px!important",
          "top:0!important",
          "visibility:hidden!important",
          "pointer-events:none!important",
          `width:${box.width}px!important`,
          "height:auto!important",
          "max-height:none!important",
          "overflow:visible!important",
          "-webkit-line-clamp:unset!important",
        ].join(";");
        document.body.appendChild(clone);
        lineClampTruncated =
          clone.scrollHeight > node.clientHeight + 2 ||
          clone.scrollWidth > node.clientWidth + 2;
        clone.remove();
      }
      let ancestor: Element | null = node;
      let insideIntendedScrollViewport = false;
      let clippedByAncestor = false;
      while (ancestor && ancestor !== root.parentElement) {
        const ancestorStyle = window.getComputedStyle(ancestor);
        if (
          ["auto", "scroll"].includes(ancestorStyle.overflowX) ||
          ["auto", "scroll"].includes(ancestorStyle.overflowY)
        ) {
          insideIntendedScrollViewport = true;
          break;
        }
        if (ancestor !== node) {
          const ancestorBox = ancestor.getBoundingClientRect();
          const clipsX = ["hidden", "clip"].includes(ancestorStyle.overflowX);
          const clipsY = ["hidden", "clip"].includes(ancestorStyle.overflowY);
          if (
            (clipsX &&
              (box.left < ancestorBox.left - 2 ||
                box.right > ancestorBox.right + 2)) ||
            (clipsY &&
              (box.top < ancestorBox.top - 2 ||
                box.bottom > ancestorBox.bottom + 2))
          ) {
            clippedByAncestor = true;
          }
        }
        ancestor = ancestor.parentElement;
      }
      // A line-clamp declaration alone is not evidence of truncation. Require
      // measured scroll overflow beyond the 2px tolerance, or geometry that
      // actually crosses a clipping ancestor.
      if (
        !insideIntendedScrollViewport &&
        (clippedX || clippedY || clippedByAncestor || lineClampTruncated)
      ) {
        issues.push({
          type: "text-truncation",
          detail: `${node.tagName}.${String(node.className || "").slice(0, 120)} scroll=${node.scrollWidth}x${node.scrollHeight} client=${node.clientWidth}x${node.clientHeight} lineClamp=${lineClamp} lineClampTruncated=${lineClampTruncated} clippedByAncestor=${clippedByAncestor}`,
        });
      }
    }

    const interactive = [
      ...root.querySelectorAll(
        'button, [href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])'
      ),
    ]
      .map((node) => {
        const box = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        return { node, box, style };
      })
      .filter(({ node, box, style }) => {
        if (box.width <= 0 || box.height <= 0) return false;
        if (isGenuinelyHidden(node)) return false;
        if (style.pointerEvents === "none") return false;
        if (node instanceof HTMLInputElement && node.type === "hidden")
          return false;
        if (
          node.matches(":disabled") ||
          node.getAttribute("aria-disabled") === "true"
        ) {
          return false;
        }
        // Responsive/off-canvas controls are intentionally outside the active
        // viewport and must not create phantom overlap findings.
        return !(
          box.right <= 0 ||
          box.bottom <= 0 ||
          box.left >= window.innerWidth ||
          box.top >= window.innerHeight
        );
      });
    const describeNode = (node: Element) => {
      const id = node.id ? `#${node.id}` : "";
      const cls = String(node.className || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 4)
        .join(".");
      const role = node.getAttribute("role");
      const name = node.getAttribute("aria-label") || node.getAttribute("name");
      return `${node.tagName.toLowerCase()}${id}${cls ? `.${cls}` : ""}${role ? `[role=${role}]` : ""}${name ? `[name=${name}]` : ""}`.slice(
        0,
        180
      );
    };
    for (let i = 0; i < interactive.length; i += 1) {
      for (let j = i + 1; j < interactive.length; j += 1) {
        const nodeA = interactive[i].node;
        const nodeB = interactive[j].node;
        // Composite controls often contain a focusable implementation detail.
        // Only independent hit targets can constitute a literal collision.
        if (nodeA.contains(nodeB) || nodeB.contains(nodeA)) continue;
        const a = interactive[i].box;
        const b = interactive[j].box;
        const overlapX = Math.max(
          0,
          Math.min(a.right, b.right) - Math.max(a.left, b.left)
        );
        const overlapY = Math.max(
          0,
          Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
        );
        if (overlapX > 2 && overlapY > 2) {
          issues.push({
            type: "interactive-overlap",
            detail:
              `${nodeA.tagName}.${String(nodeA.className || "")}`.slice(0, 90) +
              ` <-> ${nodeB.tagName}.${String(nodeB.className || "")}`.slice(
                0,
                90
              ) +
              ` overlap=${overlapX.toFixed(1)}x${overlapY.toFixed(1)}px`,
          });
        }
      }
    }

    // Literal overlap is too weak for visual QA: controls can be separated by
    // a fraction of a pixel and still read as colliding. Resolve the painted
    // hit area around each focus target (for example a switch's full settings
    // row), then require an 8px breathing-space floor between independent,
    // vertically adjacent control regions that substantially align.
    const paintedControlBox = ({
      node,
      box,
    }: {
      node: Element;
      box: DOMRect;
    }) => {
      let current: Element | null = node;
      let chosen = { node, box };
      for (
        let depth = 0;
        current && depth < 4;
        depth += 1, current = current.parentElement
      ) {
        const candidateBox = current.getBoundingClientRect();
        const candidateStyle = window.getComputedStyle(current);
        const painted =
          candidateStyle.backgroundColor !== "rgba(0, 0, 0, 0)" ||
          candidateStyle.backgroundImage !== "none" ||
          Number.parseFloat(candidateStyle.borderTopWidth || "0") > 0;
        if (
          painted &&
          candidateBox.width <= Math.max(box.width * 8, 560) &&
          candidateBox.height <= Math.max(box.height * 3, 96)
        ) {
          chosen = { node: current, box: candidateBox };
        }
      }
      return chosen;
    };
    const controlRegions = interactive.map(paintedControlBox);
    const proximityKeys = new Set<string>();
    for (let i = 0; i < controlRegions.length; i += 1) {
      for (let j = i + 1; j < controlRegions.length; j += 1) {
        const a = controlRegions[i];
        const b = controlRegions[j];
        if (
          a.node === b.node ||
          a.node.contains(b.node) ||
          b.node.contains(a.node)
        )
          continue;
        const horizontalIntersection = Math.max(
          0,
          Math.min(a.box.right, b.box.right) - Math.max(a.box.left, b.box.left)
        );
        const alignment =
          horizontalIntersection /
          Math.max(1, Math.min(a.box.width, b.box.width));
        const verticalGap = Math.max(
          0,
          Math.max(a.box.top, b.box.top) - Math.min(a.box.bottom, b.box.bottom)
        );
        if (alignment < 0.25 || verticalGap >= 8) continue;
        const key = [describeNode(a.node), describeNode(b.node)]
          .sort()
          .join(" <-> ");
        if (proximityKeys.has(key)) continue;
        proximityKeys.add(key);
        issues.push({
          type:
            verticalGap === 0 ? "visual-control-collision" : "control-spacing",
          detail: `${key} verticalGap=${verticalGap.toFixed(1)}px required>=8px horizontalAlignment=${(alignment * 100).toFixed(0)}% geometryA=${a.box.x.toFixed(1)},${a.box.y.toFixed(1)},${a.box.width.toFixed(1)}x${a.box.height.toFixed(1)} geometryB=${b.box.x.toFixed(1)},${b.box.y.toFixed(1)},${b.box.width.toFixed(1)}x${b.box.height.toFixed(1)}`,
        });
      }
    }
    return issues;
  });

const collectTextInspections = (page: Page): Promise<TextInspection[]> =>
  page.evaluate(() => {
    const root = document.body;
    const texts: TextInspection[] = [];
    const alphaFromColor = (color: string): number | null => {
      const rgba = color.match(
        /rgba?\(\s*[\d.]+[,\s]+[\d.]+[,\s]+[\d.]+(?:[,\s/]+([\d.]+%?))?\s*\)/
      );
      if (rgba) {
        if (rgba[1] === undefined) return 1;
        return rgba[1].endsWith("%")
          ? Number.parseFloat(rgba[1]) / 100
          : Number.parseFloat(rgba[1]);
      }
      const modern = color.match(
        /color\(\s*(?:srgb|display-p3|srgb-linear)\s+[\d.]+%?\s+[\d.]+%?\s+[\d.]+%?(?:\s*\/\s*([\d.]+%?))?\s*\)/
      );
      if (!modern) return null;
      if (modern[1] === undefined) return 1;
      return modern[1].endsWith("%")
        ? Number.parseFloat(modern[1]) / 100
        : Number.parseFloat(modern[1]);
    };
    const effectiveOpacity = (element: Element): number => {
      let opacity = 1;
      let current: Element | null = element;
      while (current && current !== document.documentElement) {
        const parsed = Number.parseFloat(
          window.getComputedStyle(current).opacity || "1"
        );
        if (Number.isFinite(parsed)) opacity *= parsed;
        current = current.parentElement;
      }
      return opacity;
    };
    type Rgba = { r: number; g: number; b: number; a: number };
    const rgba = (value: string): Rgba | null => {
      const match = value.match(
        /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/
      );
      if (!match) return null;
      const alpha =
        match[4] === undefined
          ? 1
          : match[4].endsWith("%")
            ? Number.parseFloat(match[4]) / 100
            : Number.parseFloat(match[4]);
      return {
        r: Number(match[1]),
        g: Number(match[2]),
        b: Number(match[3]),
        a: alpha,
      };
    };
    const composite = (front: Rgba, back: Rgba): Rgba => {
      const a = front.a + back.a * (1 - front.a);
      if (a <= 0) return { r: 255, g: 255, b: 255, a: 1 };
      return {
        r: (front.r * front.a + back.r * back.a * (1 - front.a)) / a,
        g: (front.g * front.a + back.g * back.a * (1 - front.a)) / a,
        b: (front.b * front.a + back.b * back.a * (1 - front.a)) / a,
        a,
      };
    };
    const localBackdrop = (element: Element): Rgba => {
      const layers: Rgba[] = [];
      let current: Element | null = element.parentElement;
      while (current) {
        const parsed = rgba(window.getComputedStyle(current).backgroundColor);
        if (parsed && parsed.a > 0) layers.push(parsed);
        current = current.parentElement;
      }
      let result: Rgba = { r: 255, g: 255, b: 255, a: 1 };
      for (let index = layers.length - 1; index >= 0; index -= 1) {
        result = composite(layers[index], result);
      }
      return result;
    };
    const channelLuminance = (channel: number) => {
      const normalized = channel / 255;
      return normalized <= 0.04045
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    };
    const luminance = (color: Rgba) =>
      0.2126 * channelLuminance(color.r) +
      0.7152 * channelLuminance(color.g) +
      0.0722 * channelLuminance(color.b);
    const contrastRatio = (a: Rgba, b: Rgba) => {
      const light = Math.max(luminance(a), luminance(b));
      const dark = Math.min(luminance(a), luminance(b));
      return (light + 0.05) / (dark + 0.05);
    };
    const colorString = (color: Rgba) =>
      `rgba(${color.r.toFixed(1)},${color.g.toFixed(1)},${color.b.toFixed(1)},${color.a.toFixed(3)})`;
    const textRole = (element: Element): TextInspection["role"] => {
      const declared = element
        .closest("[data-glass-text-role]")
        ?.getAttribute("data-glass-text-role");
      if (
        declared === "primary" ||
        declared === "secondary" ||
        declared === "tertiary"
      ) {
        return declared;
      }
      let current: Element | null = element;
      while (current && current !== document.body.parentElement) {
        const tokens = String(current.className || "")
          .split(/\s+/)
          .filter((token) => token && !token.includes(":"));
        if (tokens.some((token) => /(?:^|-)text-primary(?:-|\/|$)/.test(token)))
          return "primary";
        if (
          tokens.some((token) =>
            /(?:^|-)text-(?:secondary|muted)(?:-|\/|$)/.test(token)
          )
        )
          return "secondary";
        if (
          tokens.some((token) =>
            /(?:^|-)text-(?:tertiary|disabled|subtle)(?:-|\/|$)/.test(token)
          )
        )
          return "tertiary";
        current = current.parentElement;
      }
      return "unclassified";
    };
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node: Node | null = walker.nextNode();
    while (node) {
      const text = node.textContent?.trim() || "";
      if (text.length === 0) {
        node = walker.nextNode();
        continue;
      }
      const parent = node.parentElement;
      if (!parent) {
        node = walker.nextNode();
        continue;
      }
      const style = window.getComputedStyle(parent);
      const box = parent.getBoundingClientRect();
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        parent.closest("[hidden]")
      ) {
        node = walker.nextNode();
        continue;
      }
      if (box.width === 0 || box.height === 0) {
        node = walker.nextNode();
        continue;
      }
      if (
        box.right <= 0 ||
        box.bottom <= 0 ||
        box.left >= window.innerWidth ||
        box.top >= window.innerHeight
      ) {
        node = walker.nextNode();
        continue;
      }
      const alpha = alphaFromColor(style.color);
      if (alpha !== null) {
        const effectiveAlpha = alpha * effectiveOpacity(parent);
        if (effectiveAlpha < 0.5) {
          // Overlay editor pattern (e.g. GlassCodeEditor): the textarea text is
          // intentionally transparent and a syntactically highlighted <pre><code>
          // painted directly underneath is the visible text layer. Only treat the
          // transparent node as covered when a visible text element overlaps it.
          const parentBox = parent.getBoundingClientRect();
          // The textarea cannot contain the <pre>; search the whole audit root so
          // a sibling/ancestor layer is found, then require a real box overlap.
          const replacement = [...root.querySelectorAll("pre, pre code")].some(
            (candidate) => {
              if (!(candidate instanceof HTMLElement)) return false;
              const candidateStyle = window.getComputedStyle(candidate);
              const candidateAlpha = alphaFromColor(candidateStyle.color);
              if (
                candidateAlpha === null ||
                candidateAlpha * effectiveOpacity(candidate) < 0.9
              )
                return false;
              if (
                candidateStyle.display === "none" ||
                candidateStyle.visibility === "hidden"
              )
                return false;
              const candidateBox = candidate.getBoundingClientRect();
              const overlapX = Math.max(
                0,
                Math.min(parentBox.right, candidateBox.right) -
                  Math.max(parentBox.left, candidateBox.left)
              );
              const overlapY = Math.max(
                0,
                Math.min(parentBox.bottom, candidateBox.bottom) -
                  Math.max(parentBox.top, candidateBox.top)
              );
              return overlapX > 4 && overlapY > 4;
            }
          );
          if (replacement) {
            node = walker.nextNode();
            continue;
          }
        }
        const foreground = rgba(style.color);
        const backdrop = localBackdrop(parent);
        const effectiveForeground = foreground
          ? composite(
              { ...foreground, a: foreground.a * effectiveOpacity(parent) },
              backdrop
            )
          : null;
        texts.push({
          selector: parent.tagName.toLowerCase(),
          className: String(parent.className || "").slice(0, 220),
          role: textRole(parent),
          colorAlpha: alpha,
          effectiveAlpha,
          foregroundColor: style.color,
          localBackdropColor: colorString(backdrop),
          contrastRatio: effectiveForeground
            ? contrastRatio(effectiveForeground, backdrop)
            : null,
          fontSize: Number.parseFloat(style.fontSize || "0"),
          fontWeight: Number.parseInt(style.fontWeight || "400", 10) || 400,
          text: text.slice(0, 120),
        });
      }
      node = walker.nextNode();
    }
    return texts;
  });

const collectPaintInspections = (page: Page): Promise<PaintInspection[]> =>
  page.evaluate(() => {
    const colorValues = (value: string) => {
      const colors: Array<{ r: number; g: number; b: number; a: number }> = [];
      const re =
        /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/g;
      let match: RegExpExecArray | null;
      while ((match = re.exec(value))) {
        colors.push({
          r: Number(match[1]),
          g: Number(match[2]),
          b: Number(match[3]),
          a:
            match[4] === undefined
              ? 1
              : match[4].endsWith("%")
                ? Number.parseFloat(match[4]) / 100
                : Number.parseFloat(match[4]),
        });
      }
      return colors;
    };
    const interactiveSelector =
      'button, [href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])';
    const viewportArea = window.innerWidth * window.innerHeight;
    return [document.body, ...document.body.querySelectorAll("*")].flatMap(
      (node) => {
        const style = window.getComputedStyle(node);
        const box = node.getBoundingClientRect();
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number(style.opacity || "1") <= 0.01 ||
          box.width <= 1 ||
          box.height <= 1 ||
          box.right <= 0 ||
          box.bottom <= 0 ||
          box.left >= window.innerWidth ||
          box.top >= window.innerHeight
        )
          return [];
        const area =
          Math.min(box.width, window.innerWidth) *
          Math.min(box.height, window.innerHeight);
        const isCanvas = node === document.body || node.id === "storybook-root";
        const isInteractive = node.matches(interactiveSelector);
        const isLarge = !isCanvas && area >= viewportArea * 0.12;
        if (!isCanvas && !isInteractive && !isLarge) return [];
        const backgroundColor = style.backgroundColor || "rgba(0, 0, 0, 0)";
        const backgroundImage = style.backgroundImage || "none";
        const boxShadow = style.boxShadow || "none";
        const colors = colorValues(
          `${backgroundColor} ${backgroundImage} ${boxShadow}`
        ).filter((color) => color.a > 0.05);
        if (colors.length === 0) return [];
        return [
          {
            selector: node.tagName.toLowerCase(),
            className: String(node.className || "").slice(0, 220),
            paintRole: isCanvas
              ? "canvas"
              : isInteractive
                ? "interactive"
                : "large-surface",
            x: Math.round(box.x),
            y: Math.round(box.y),
            width: Math.round(box.width),
            height: Math.round(box.height),
            backgroundColor,
            backgroundImage,
            boxShadow,
            colors,
          } satisfies PaintInspection,
        ];
      }
    );
  });

const collectPresentationIssues = (page: Page): Promise<PresentationIssue[]> =>
  page.evaluate(() => {
    const issues: PresentationIssue[] = [];
    const root = document.querySelector("#storybook-root") || document.body;
    const describe = (node: Element) => {
      const id = node.id ? `#${node.id}` : "";
      const cls = String(node.className || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 5)
        .join(".");
      return `${node.tagName.toLowerCase()}${id}${cls ? `.${cls}` : ""}`.slice(
        0,
        200
      );
    };
    const visible = (node: Element) => {
      let current: Element | null = node;
      while (current) {
        const style = window.getComputedStyle(current);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number(style.opacity || "1") <= 0.01 ||
          current.hasAttribute("hidden")
        )
          return false;
        current = current.parentElement;
      }
      const box = node.getBoundingClientRect();
      return box.width > 1 && box.height > 1;
    };
    const all = [...root.querySelectorAll("*")];
    const visibleNodes = all.filter(visible);
    const visibleBounds = visibleNodes.reduce(
      (bounds, node) => {
        const box = node.getBoundingClientRect();
        return {
          left: Math.min(bounds.left, box.left),
          top: Math.min(bounds.top, box.top),
          right: Math.max(bounds.right, box.right),
          bottom: Math.max(bounds.bottom, box.bottom),
        };
      },
      { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
    );
    const area = Number.isFinite(visibleBounds.left)
      ? Math.max(0, visibleBounds.right - visibleBounds.left) *
        Math.max(0, visibleBounds.bottom - visibleBounds.top)
      : 0;
    const viewportArea = window.innerWidth * window.innerHeight;
    const visibleText = visibleNodes
      .map((node) =>
        [...node.childNodes]
          .filter((child) => child.nodeType === Node.TEXT_NODE)
          .map((child) => child.textContent?.trim() || "")
          .join(" ")
      )
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    const meaningfulElements = visibleNodes.filter((node) =>
      node.matches(
        'button, input, select, textarea, canvas, svg, img, [role], [data-glass-surface], [class*="glass"]'
      )
    ).length;
    if (
      area < viewportArea * 0.006 ||
      (visibleText.length < 3 && meaningfulElements < 1)
    ) {
      issues.push({
        type: "blank-or-minuscule-primary-output",
        detail: `root=${describe(root)} visibleBounds=${Number.isFinite(visibleBounds.left) ? `${visibleBounds.left.toFixed(1)},${visibleBounds.top.toFixed(1)},${(visibleBounds.right - visibleBounds.left).toFixed(1)}x${(visibleBounds.bottom - visibleBounds.top).toFixed(1)}` : "none"} areaRatio=${(area / Math.max(1, viewportArea)).toFixed(4)} visibleTextChars=${visibleText.length} meaningfulElements=${meaningfulElements}`,
      });
    }

    // A primary region may be inside an intentional scroller, but its initial
    // presentation still cannot be mostly cropped or displaced offscreen.
    const primaryCandidates = [
      root,
      ...all.filter((node) =>
        node.matches(
          'main, article, section, [data-primary-output], [data-certification-component], [class*="showcase"], [class*="demo"]'
        )
      ),
    ].filter(visible);
    for (const node of primaryCandidates) {
      const box = node.getBoundingClientRect();
      const totalArea = box.width * box.height;
      if (totalArea <= 400) continue;
      const visibleWidth = Math.max(
        0,
        Math.min(box.right, window.innerWidth) - Math.max(box.left, 0)
      );
      const visibleHeight = Math.max(
        0,
        Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 0)
      );
      const visibleRatio = (visibleWidth * visibleHeight) / totalArea;
      const majorDisplacement =
        box.left < -window.innerWidth * 0.2 ||
        box.right > window.innerWidth * 1.2 ||
        box.top < -window.innerHeight * 0.2;
      const candidateStyle = window.getComputedStyle(node);
      const participatesInNormalFlow =
        candidateStyle.position !== "fixed" &&
        candidateStyle.position !== "absolute";
      const documentFlowsVertically =
        participatesInNormalFlow &&
        box.top >= -window.innerHeight * 0.05 &&
        box.left >= -1 &&
        box.right <= window.innerWidth + 1 &&
        box.bottom > window.innerHeight;
      if (
        (visibleRatio < 0.7 && !documentFlowsVertically) ||
        majorDisplacement
      ) {
        issues.push({
          type: majorDisplacement
            ? "major-responsive-offscreen-displacement"
            : "primary-output-viewport-cutoff",
          detail: `${describe(node)} geometry=${box.x.toFixed(1)},${box.y.toFixed(1)},${box.width.toFixed(1)}x${box.height.toFixed(1)} visibleRatio=${visibleRatio.toFixed(3)} viewport=${window.innerWidth}x${window.innerHeight}`,
        });
      }
    }

    const nativeControls = visibleNodes.filter((node) =>
      node.matches("button, select, input, textarea")
    );
    for (const node of nativeControls) {
      const style = window.getComputedStyle(node);
      const cls = String(node.className || "");
      const backdrop = style.backdropFilter || "none";
      const webkitBackdrop =
        style.getPropertyValue("-webkit-backdrop-filter") || "none";
      const explicitGlass =
        /glass|liquid|frost/i.test(cls) ||
        backdrop !== "none" ||
        webkitBackdrop !== "none";
      const untouchedAppearance =
        style.appearance === "auto" || node instanceof HTMLSelectElement;
      const defaultFont =
        style.fontFamily.includes("Arial") ||
        style.fontFamily.includes("Times New Roman");
      const plainOutlined =
        Number.parseFloat(style.borderTopWidth || "0") >= 1 &&
        style.boxShadow === "none" &&
        style.backgroundImage === "none" &&
        style.backdropFilter === "none";
      if (
        !explicitGlass &&
        (untouchedAppearance || (plainOutlined && defaultFont))
      ) {
        issues.push({
          type: "unfinished-native-control-presentation",
          detail: `${describe(node)} appearance=${style.appearance} fontFamily="${style.fontFamily}" background="${style.backgroundColor} ${style.backgroundImage}" border="${style.borderTopWidth} ${style.borderTopStyle} ${style.borderTopColor}" boxShadow="${style.boxShadow}"`,
        });
      }
    }

    for (const node of visibleNodes.filter(
      (candidate) => candidate instanceof HTMLCanvasElement
    )) {
      const canvas = node as HTMLCanvasElement;
      let context: CanvasRenderingContext2D | null = null;
      try {
        context = canvas.getContext("2d", { willReadFrequently: true });
      } catch {
        context = null;
      }
      if (!context || canvas.width === 0 || canvas.height === 0) continue;
      try {
        const stepX = Math.max(1, Math.floor(canvas.width / 24));
        const stepY = Math.max(1, Math.floor(canvas.height / 24));
        let painted = 0;
        let chromatic = 0;
        let darkChromatic = 0;
        let luminanceSum = 0;
        let chromaSum = 0;
        for (let y = 0; y < canvas.height; y += stepY) {
          for (let x = 0; x < canvas.width; x += stepX) {
            const [r, g, b, alphaByte] = context.getImageData(x, y, 1, 1).data;
            if (alphaByte < 26) continue;
            painted += 1;
            const chroma = Math.max(r, g, b) - Math.min(r, g, b);
            const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            luminanceSum += luminance;
            chromaSum += chroma;
            if (chroma > 48) chromatic += 1;
            if (chroma > 28 && luminance < 95) darkChromatic += 1;
          }
        }
        const estimatedSamples =
          Math.ceil(canvas.width / stepX) * Math.ceil(canvas.height / stepY);
        const isDecorativeOverlay =
          window.getComputedStyle(canvas).pointerEvents === "none" ||
          canvas.getAttribute("aria-hidden") === "true";
        if (painted === 0 && !isDecorativeOverlay) {
          issues.push({
            type: "blank-canvas-output",
            detail: `${describe(canvas)} bitmap=${canvas.width}x${canvas.height} sampledPixels=0`,
          });
          continue;
        }
        const chromaticRatio = chromatic / painted;
        const darkRatio = darkChromatic / painted;
        const paintedCoverage = painted / Math.max(1, estimatedSamples);
        if (
          paintedCoverage > 0.15 &&
          (chromaticRatio > 0.45 || darkRatio > 0.55)
        ) {
          issues.push({
            type: "dominant-canvas-chroma-darkness",
            detail: `${describe(canvas)} bitmap=${canvas.width}x${canvas.height} sampledPixels=${painted} chromaticRatio=${chromaticRatio.toFixed(3)} darkChromaticRatio=${darkRatio.toFixed(3)} meanChroma=${(chromaSum / painted).toFixed(1)} meanLuminance=${(luminanceSum / painted).toFixed(1)}`,
          });
        }
      } catch (error) {
        issues.push({
          type: "uninspectable-canvas-output",
          detail: `${describe(canvas)} bitmap=${canvas.width}x${canvas.height} error=${error instanceof Error ? error.message : String(error)}`,
        });
      }
    }

    // If a story presents a compound dropdown/menu/select export, it must show
    // more than a closed trigger or native select. A closed constituent cannot
    // be used as evidence for the panel/list/menu surface it claims to cover.
    // Scope compound-control certification to the actual target identity. Page
    // copy frequently contains words such as "select" or "menu" without the
    // exported component itself being a compound control.
    const compoundMarker = `${document.title} ${root.getAttribute("data-certification-component") || ""} ${new URL(window.location.href).searchParams.get("id") || ""}`;
    if (/dropdown|menu|combobox|select|popover/i.test(compoundMarker)) {
      const triggerCount = visibleNodes.filter((node) =>
        node.matches('select, [role="combobox"], [aria-haspopup], button')
      ).length;
      const expanded = visibleNodes.some(
        (node) => node.getAttribute("aria-expanded") === "true"
      );
      const panel = visibleNodes.some((node) =>
        node.matches(
          '[role="menu"], [role="listbox"], [role="option"], [data-radix-popper-content-wrapper], [class*="menu-content"], [class*="dropdown-content"]'
        )
      );
      if (triggerCount > 0 && !expanded && !panel) {
        issues.push({
          type: "hidden-constituent-evidence",
          detail: `compound control is only shown closed: triggers=${triggerCount} expanded=${expanded} visiblePanel=${panel}; marker="${compoundMarker.replace(/\s+/g, " ").trim().slice(0, 180)}"`,
        });
      }
    }
    return issues;
  });

const inspectViewportColorCensus = async (
  page: Page
): Promise<ViewportColorCensus> => {
  const buffer = await page.screenshot({
    animations: "disabled",
    fullPage: false,
  });
  const png = PNG.sync.read(buffer);
  const step = Math.max(2, Math.floor(Math.min(png.width, png.height) / 180));
  const columns = Math.ceil(png.width / step);
  const rows = Math.ceil(png.height / step);
  const coloredGrid = new Uint8Array(columns * rows);
  let sampledPixels = 0;
  let coloredPixels = 0;
  let tintedNeutralPixels = 0;
  let coolPixels = 0;
  let warmPixels = 0;
  let chromaSum = 0;
  let neutralChromaSum = 0;
  for (let gy = 0, y = 0; y < png.height; gy += 1, y += step) {
    for (let gx = 0, x = 0; x < png.width; gx += 1, x += step) {
      const offset = (y * png.width + x) * 4;
      const r = png.data[offset];
      const g = png.data[offset + 1];
      const b = png.data[offset + 2];
      const a = png.data[offset + 3] / 255;
      if (a < 0.1) continue;
      sampledPixels += 1;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const chroma = max - min;
      const light = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      chromaSum += chroma;
      const colored = chroma >= 14;
      if (colored) {
        coloredPixels += 1;
        coloredGrid[gy * columns + gx] = 1;
      }
      // Tint hidden in a nominally white material is more subtle: restrict
      // this census to light pixels and use a lower chroma threshold.
      if (light >= 148 && chroma >= 8) {
        tintedNeutralPixels += 1;
        neutralChromaSum += chroma;
      }
      const coolDelta = b - r + Math.max(0, g - r) * 0.45;
      const warmDelta = r - b + Math.max(0, r - g) * 0.35;
      if (chroma >= 8 && coolDelta >= 7) coolPixels += 1;
      if (chroma >= 8 && warmDelta >= 7) warmPixels += 1;
    }
  }
  const seen = new Uint8Array(coloredGrid.length);
  let localizedColoredRegions = 0;
  for (let index = 0; index < coloredGrid.length; index += 1) {
    if (!coloredGrid[index] || seen[index]) continue;
    let regionSize = 0;
    const queue = [index];
    seen[index] = 1;
    while (queue.length) {
      const current = queue.pop()!;
      regionSize += 1;
      const x = current % columns;
      const y = Math.floor(current / columns);
      for (const next of [
        current - 1,
        current + 1,
        current - columns,
        current + columns,
      ]) {
        if (
          next < 0 ||
          next >= coloredGrid.length ||
          seen[next] ||
          !coloredGrid[next]
        )
          continue;
        const nx = next % columns;
        const ny = Math.floor(next / columns);
        if (Math.abs(nx - x) + Math.abs(ny - y) !== 1) continue;
        seen[next] = 1;
        queue.push(next);
      }
    }
    if (regionSize >= 4) localizedColoredRegions += 1;
  }
  const coloredAreaRatio = coloredPixels / Math.max(1, sampledPixels);
  const tintedNeutralRatio = tintedNeutralPixels / Math.max(1, sampledPixels);
  const coolRatio = coolPixels / Math.max(1, sampledPixels);
  const warmRatio = warmPixels / Math.max(1, sampledPixels);
  const dominantCast =
    coolRatio >= 0.12 && coolRatio > warmRatio * 1.35
      ? "cool"
      : warmRatio >= 0.12 && warmRatio > coolRatio * 1.35
        ? "warm"
        : coloredAreaRatio >= 0.16
          ? "mixed"
          : "neutral";
  return {
    sampledPixels,
    coloredPixels,
    coloredAreaRatio,
    tintedNeutralPixels,
    tintedNeutralRatio,
    coolPixels,
    warmPixels,
    dominantCast,
    meanChroma: chromaSum / Math.max(1, sampledPixels),
    meanNeutralChroma: neutralChromaSum / Math.max(1, tintedNeutralPixels),
    localizedColoredRegions,
  };
};

const checkViewportColorCensus = (census: ViewportColorCensus): string[] => {
  const failures: string[] = [];
  // Tiny localized semantic/media accents are allowed; broad tint is not.
  if (
    census.coloredAreaRatio > 0.18 ||
    census.tintedNeutralRatio > 0.28 ||
    (census.dominantCast !== "neutral" && census.meanChroma > 9)
  ) {
    failures.push(
      `whole-viewport problematic tint: dominantCast=${census.dominantCast} coloredAreaRatio=${census.coloredAreaRatio.toFixed(3)} tintedNeutralRatio=${census.tintedNeutralRatio.toFixed(3)} meanChroma=${census.meanChroma.toFixed(1)} meanNeutralChroma=${census.meanNeutralChroma.toFixed(1)} localizedColoredRegions=${census.localizedColoredRegions} sampledPixels=${census.sampledPixels}`
    );
  }
  return failures;
};

// These exports deliberately present color-bearing media, generated palettes,
// maps, or scientific simulations as their primary content. Their surrounding
// chrome remains subject to every material/paint invariant; only pixel-level
// findings produced by the semantic content itself are classified here.
const semanticVisualizationTargetIds = new Set([
  "glass-color-scheme-generator",
  "liquid-glass-map-controls",
  "glass-gallery",
  "glass-image-viewer",
  "glass-lazy-image",
  "dynamic-atmosphere",
  "glass360-viewer",
  "glass-arpreview",
  "glass-biome-simulator",
  "glass-aurora-display",
  "glass-probability-cloud",
  "glass-advanced-video-player",
  "glass-particles",
  "particle-background",
  "glass-heatmap",
]);

const isSemanticVisualizationPixelFinding = (failure: string) =>
  failure.startsWith("whole-viewport problematic tint:") ||
  failure.startsWith("dominant-canvas-chroma-darkness:") ||
  failure.startsWith("large-surface paint broad low-alpha tint wash") ||
  // Heatmap cells are data ink, not chrome: their fill encodes the value and
  // legitimately spans the full sequential scale, including dark navy lows.
  // Scoped to the cell class so genuinely navy chrome elsewhere still fails.
  (failure.includes("interactive paint dark/navy") &&
    failure.includes("glass-heatmap-cell"));

const isOpaqueDarkFill = (surface: SurfaceInspection) => {
  const bg = parseColor(surface.backgroundColor);
  if (bg && isDarkChannel(bg) && bg.a >= 0.5) return true;
  for (const image of surface.backgroundImages) {
    const stops = extractColorAlphas(image);
    for (const stop of stops) {
      if (stop.alpha < 0.5) continue;
      const [r, g, b] = stop.rgb.split(",").map(Number);
      if (isDarkChannel({ r, g, b })) {
        return true;
      }
    }
  }
  return false;
};

const buildExportList = () => {
  const audit = readJson<PublicExportAudit>("reports/public-export-audit.json");
  const targetManifest = readJson<PublicVisualTargetManifest>(
    "reports/public-visual-target-manifest.json"
  );
  const inventory = readJson<{ components: InventoryEntry[] }>(
    "reports/component_inventory.json"
  );
  const inventoryByPath = new Map(
    inventory.components.map((component) => [
      `src/${component.path}`,
      component,
    ])
  );
  const exports = audit.entries.filter((entry) => entry.isComponentLike);

  const coverageIds = new Set<string>();
  if (
    targetManifest.schemaVersion !== 1 ||
    targetManifest.entries.length !== authoritativeVisualExportCount ||
    targetManifest.summary.publicVisualExportCount !==
      authoritativeVisualExportCount ||
    targetManifest.summary.coverageIdentityCount !==
      authoritativeVisualExportCount ||
    targetManifest.summary.unclassifiedCount !== 0
  ) {
    throw new Error(
      `public visual target manifest must classify exactly ${authoritativeVisualExportCount} visual exports`
    );
  }
  if (exports.length !== targetManifest.entries.length) {
    throw new Error(
      `public visual target manifest/export audit count mismatch: ${targetManifest.entries.length} vs ${exports.length}`
    );
  }
  targetManifest.entries.forEach((target, index) => {
    const exported = exports[index];
    if (
      target.exportName !== exported.exportName ||
      target.sourcePath !== exported.sourcePath ||
      target.coverageId !== toExportId(exported.exportName) ||
      !["canonical", "alias", "coveredBy"].includes(target.classification) ||
      !target.coverageId ||
      coverageIds.has(target.coverageId)
    ) {
      throw new Error(
        `public visual target manifest entry ${index} does not exactly match the public export audit: ${target.exportName}`
      );
    }
    coverageIds.add(target.coverageId);
  });
  if (coverageIds.size !== authoritativeVisualExportCount) {
    throw new Error(
      `public visual target manifest coverage IDs must be unique for all ${authoritativeVisualExportCount} visual exports`
    );
  }
  const [targetNonvisual] = targetManifest.nonvisualExclusions;
  if (
    targetManifest.nonvisualExclusions.length !==
      authoritativeNonvisualExportCount ||
    targetNonvisual?.exportName !== "QuantumNeuromorphicEngine" ||
    targetNonvisual.sourcePath !==
      "src/components/quantum/QuantumNeuromorphicEngine.ts" ||
    targetNonvisual.classification !== "nonvisual" ||
    !targetNonvisual.reason
  ) {
    throw new Error(
      "public visual target manifest must explicitly exclude only QuantumNeuromorphicEngine"
    );
  }

  const mapEntry = (entry: ExportEntry, fallbackIndex?: number) => {
    const sourcePath = sourcePathForExport(entry);
    const inventoryMatch = inventoryByPath.get(sourcePath);
    return {
      id: toExportId(entry.exportName, fallbackIndex),
      exportName: entry.exportName,
      sourcePath: entry.sourcePath,
      inventoryName: inventoryMatch?.name ?? null,
    };
  };

  const seen = new Map<string, number>();
  return exports.map((entry) => {
    const index = seen.get(entry.exportName) ?? 0;
    seen.set(entry.exportName, index + 1);
    return mapEntry(entry, index > 0 ? index + 1 : undefined);
  });
};

const buildNonvisualExclusions = (): NonvisualExclusion[] => {
  const audit = readJson<PublicExportAudit>("reports/public-export-audit.json");
  const classified =
    audit.nonVisualPublicExports ||
    audit.entries
      .filter((entry) => Boolean(entry.nonVisualReason))
      .map((entry) => ({
        exportName: entry.exportName,
        sourcePath: entry.sourcePath,
        reason: entry.nonVisualReason || "",
      }));
  return classified.map((entry) => {
    const testPath = entry.sourcePath.replace(
      /\.(ts|tsx|js|jsx|mjs|cjs)$/,
      ".test.ts"
    );
    const testExists = fs.existsSync(resolveRepoArtifact(testPath));
    const command = `npx jest ${testPath} --runInBand`;
    const jestCli = path.join(
      repoRoot,
      "node_modules",
      "jest",
      "bin",
      "jest.js"
    );
    const testResult =
      testExists && fs.existsSync(jestCli)
        ? spawnSync(
            process.execPath,
            [jestCli, testPath, "--runInBand", "--silent"],
            { cwd: repoRoot, encoding: "utf8" }
          )
        : null;
    const status = testResult?.status === 0 ? "pass" : "fail";
    return {
      name: entry.exportName,
      sourcePath: entry.sourcePath,
      reason: entry.reason,
      tests: [
        {
          path: testPath,
          command,
          status,
        },
      ],
      apiTestEvidence: {
        path: testPath,
        command,
        status,
      },
    };
  });
};

const buildRecipeList = () => {
  const evidence = readJson<RecipeEvidence>(
    "reports/3.3-release/recipe-render-evidence.json"
  );
  const recipes = evidence.screenshots || [];
  const recipeIds = new Set<string>();
  const runtimeIds = new Set<string>();
  if (
    evidence.recipeCount !== authoritativeRecipeCount ||
    recipes.length !== authoritativeRecipeCount
  ) {
    throw new Error(
      `recipe evidence inventory must contain exactly ${authoritativeRecipeCount} recipes; declared ${String(evidence.recipeCount)}, listed ${recipes.length}`
    );
  }
  for (const recipe of recipes) {
    const runtimeId = toExportId(`recipe-${recipe.id}`);
    if (
      typeof recipe.id !== "string" ||
      recipe.id.trim() === "" ||
      typeof recipe.file !== "string" ||
      recipe.file.trim() === "" ||
      recipeIds.has(recipe.id) ||
      runtimeIds.has(runtimeId)
    ) {
      throw new Error(
        `recipe evidence contains a malformed or duplicate identity: ${String(recipe.id)}`
      );
    }
    recipeIds.add(recipe.id);
    runtimeIds.add(runtimeId);
  }
  return recipes.map((recipe) => ({
    id: toExportId(`recipe-${recipe.id}`),
    exportName: recipe.id,
    sourcePath: `recipes/${recipe.id}`,
    inventoryName: null,
    isRecipe: true,
    gateScreenshotPath: recipe.file,
    recipeHarness: "scripts/ci/verify-recipes-render.js",
  }));
};

const buildStoryIndex = async (): Promise<StoryEntry[]> => {
  const response = await fetch(`${storybookUrl}/index.json`);
  if (!response.ok) {
    throw new Error(`Unable to fetch Storybook index: ${response.status}`);
  }
  const index = (await response.json()) as {
    entries?: Record<string, StoryEntry>;
  };
  return Object.values(index.entries || {});
};

const resolveExportToStory = (
  entry: ReturnType<typeof buildExportList>[number],
  storyEntries: StoryEntry[]
): StoryEntry | null => {
  const sourcePath = entry.sourcePath || entry.exportName;
  const sourceFileMatches = findStoriesBySourceFile(
    storyEntries,
    sourcePath
  ).filter((story) => !isCertificationFallbackStory(story));
  if (sourceFileMatches.length > 0) {
    const ranked = [...sourceFileMatches].sort(
      (a, b) =>
        Number(exactExportStoryMatch(b, entry.exportName)) -
          Number(exactExportStoryMatch(a, entry.exportName)) ||
        rankStory(a) - rankStory(b)
    );
    return ranked[0];
  }
  const direct = findStoriesForExport(
    storyEntries,
    entry.exportName,
    sourcePath
  ).filter((story) => !isCertificationFallbackStory(story));
  const best = direct[0];
  if (best) {
    return best;
  }
  if (entry.inventoryName) {
    const viaInventory = findStoriesForExport(
      storyEntries,
      entry.inventoryName,
      entry.sourcePath || entry.inventoryName
    ).filter((story) => !isCertificationFallbackStory(story));
    if (viaInventory.length > 0) return viaInventory[0];
  }
  const aliasRoot = entry.exportName
    .replace(/^Glass/, "")
    .replace(/^Motion$/, "MotionNative")
    .replace(/^LiquidGlassDestination$/, "LiquidGlassSourceTransition")
    .replace(/^LiquidGlassSource$/, "LiquidGlassSourceTransition")
    .replace(/^LiquidGlassTransitionProvider$/, "LiquidGlassSourceTransition");
  if (aliasRoot !== entry.exportName) {
    const viaAlias = findStoriesForExport(
      storyEntries,
      aliasRoot,
      entry.sourcePath || aliasRoot
    ).filter((story) => !isCertificationFallbackStory(story));
    if (viaAlias.length > 0) return viaAlias[0];
  }
  return null;
};

const verifyStoryResolutionIntegrity = (
  exports: ReturnType<typeof buildExportList>,
  storyEntries: StoryEntry[]
) => {
  const resolutions = exports.map((entry) => ({
    entry,
    story: resolveExportToStory(entry, storyEntries),
  }));
  const placeholderResolutions = resolutions.filter(
    ({ story }) => story && isCertificationFallbackStory(story)
  );
  if (placeholderResolutions.length > 0) {
    throw new Error(
      `certification placeholder stories resolved for ${placeholderResolutions.length}/${exports.length} visual exports: ${placeholderResolutions
        .slice(0, 10)
        .map(({ entry, story }) => `${entry.exportName} -> ${story?.id}`)
        .join(", ")}`
    );
  }
  const skippedExactAdjacentStories = resolutions.filter(({ entry, story }) => {
    const eligibleAdjacentStories = findStoriesBySourceFile(
      storyEntries,
      entry.sourcePath || entry.exportName
    ).filter((candidate) => !isCertificationFallbackStory(candidate));
    return (
      eligibleAdjacentStories.some((candidate) =>
        exactExportStoryMatch(candidate, entry.exportName)
      ) &&
      (!story || !exactExportStoryMatch(story, entry.exportName))
    );
  });
  if (skippedExactAdjacentStories.length > 0) {
    throw new Error(
      `resolver skipped exact adjacent export stories for ${skippedExactAdjacentStories.length}/${exports.length} visual exports: ${skippedExactAdjacentStories
        .slice(0, 10)
        .map(
          ({ entry, story }) =>
            `${entry.exportName} -> ${story?.id ?? "unresolved"}`
        )
        .join(", ")}`
    );
  }
  return new Map(
    resolutions.map(({ entry, story }) => [entry.id, story] as const)
  );
};

const verifyStoryIndexHasNoCertificationRoutes = (
  storyEntries: StoryEntry[]
) => {
  const certificationRoutes = storyEntries.filter((story) =>
    isCertificationFallbackStory(story)
  );
  if (certificationRoutes.length > 0) {
    throw new Error(
      `Storybook index still contains ${certificationRoutes.length} generic certification route(s): ${certificationRoutes
        .slice(0, 10)
        .map((story) => story.id)
        .join(", ")}`
    );
  }
};

const waitForStoryRender = async (page: Page) => {
  await page.waitForFunction(
    () => {
      const root =
        document.querySelector("#storybook-root") ||
        document.querySelector("#root");
      if (!root) return false;
      const box = root.getBoundingClientRect();
      if (box.width <= 0 || box.height <= 0) return false;
      const text = root.textContent?.trim() || "";
      const hasVisualSurface = Boolean(
        root.querySelector("canvas, svg, img, video")
      );
      const visibleChildren = [...root.querySelectorAll("*")].some((node) => {
        const style = window.getComputedStyle(node);
        const childBox = node.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity || "1") > 0.01 &&
          childBox.width > 1 &&
          childBox.height > 1
        );
      });
      const looksLikeSpinner =
        box.width <= 48 && box.height <= 48 && !text && !hasVisualSurface;
      return (
        !looksLikeSpinner &&
        (text.length > 0 || hasVisualSurface || visibleChildren)
      );
    },
    { timeout: 20_000 }
  );
  // Wait out finite entrance/transition animations (entrances can still be at
  // opacity 0 / mid-blur 150ms after mount). Infinite ambient animations are
  // ignored so ambient stories do not stall the settle.
  await page
    .waitForFunction(
      () => {
        const runningFinite = document.getAnimations().filter((animation) => {
          if (animation.playState !== "running") return false;
          const effect = animation.effect as {
            getTiming?: () => { iterations?: number; duration?: number };
          } | null;
          const timing = effect?.getTiming?.();
          if (!timing) return true;
          return timing.iterations !== Infinity && timing.duration !== Infinity;
        });
        return runningFinite.length === 0;
      },
      { timeout: 10_000 }
    )
    .catch(() => {
      // Ambient/infinite animations may never finish; the extra timeout below
      // still gives the story time to reach a stable state.
    });
  // Settle rAF-driven (e.g. framer-motion) entrance animations, which the Web
  // Animations API above cannot see. Sampling text mid-entrance would measure
  // a transient alpha instead of the designed color, so wait until no element
  // sits at a partial opacity. A bare "no partial opacity" check passes
  // vacuously on the first poll while every entrance is still at opacity 0,
  // so also require the opacity distribution to be stable across two
  // consecutive polls: an entrance in flight changes values every tick, while
  // a rested tree (even one with intentionally hidden elements) does not.
  // Stories with perpetual ambient motion skip the wait via the catch below
  // instead of stalling the run.
  await page
    .waitForFunction(
      (nonce: string) => {
        const root =
          document.querySelector("#storybook-root") ||
          document.querySelector("#root");
        if (!root) return true;
        const nodes = root.querySelectorAll("*");
        let partial = 0;
        let transparent = 0;
        let opaque = 0;
        for (const node of nodes) {
          const opacity = Number(
            window.getComputedStyle(node).opacity || "1"
          );
          if (opacity > 0.01 && opacity < 0.995) partial += 1;
          else if (opacity >= 0.995) opaque += 1;
          else transparent += 1;
        }
        if (partial > 0) return false;
        const store = (window as unknown as Record<string, unknown>)
          .__auditOpacitySettle as
          | { nonce: string; signature: string }
          | undefined;
        const signature = `${partial}:${transparent}:${opaque}`;
        (window as unknown as Record<string, unknown>).__auditOpacitySettle =
          { nonce, signature };
        return (
          store !== undefined &&
          store.nonce === nonce &&
          store.signature === signature
        );
      },
      `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      // Interval polling (not rAF): one full-DOM opacity scan per tick keeps
      // the settle cheap; entrance staggers clear within a few ticks.
      { timeout: 8_000, polling: 500 }
    )
    .catch(() => {
      // Perpetual ambient motion (particles, shimmer, live bubbles) never
      // fully settles; sample the live state instead of failing the story.
    });
  await page.waitForTimeout(300);
};

const createPage = async (
  page: Page,
  viewport: { width: number; height: number }
) => {
  await page.setViewportSize({
    width: viewport.width,
    height: viewport.height,
  });
  await page.addInitScript(() => {
    window.matchMedia =
      window.matchMedia ||
      (((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      })) as unknown as typeof window.matchMedia);
  });
};

const evaluateStory = async (
  page: Page,
  storyId: string,
  viewport: { name: string; width: number; height: number }
) => {
  await createPage(page, viewport);
  const url = `${storybookUrl}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story&globals=previewMode:light`;
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  const onConsole = (message: { type: () => string; text: () => string }) => {
    if (message.type() === "error")
      consoleErrors.push(message.text().slice(0, 400));
  };
  const onPageError = (error: Error) =>
    pageErrors.push(error.message.slice(0, 400));
  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25_000 });
    await waitForStoryRender(page);
    const certificationComponent = await page.evaluate(() => {
      const placeholder = document.querySelector(
        "[data-certification-component]"
      );
      if (!placeholder) return null;
      return (
        placeholder.getAttribute("data-certification-component") ||
        "unknown component"
      );
    });
    const surfaces = await inspectSurface(page);
    const layoutIssues = await collectLayoutIssues(page);
    const texts = await collectTextInspections(page);
    const paints = await collectPaintInspections(page);
    const presentationIssues = await collectPresentationIssues(page);
    const viewportColorCensus = await inspectViewportColorCensus(page);
    const textAlphas = texts.map((text) => text.effectiveAlpha);
    return {
      surfaces,
      layoutIssues,
      textAlphas,
      texts,
      paints,
      presentationIssues,
      viewportColorCensus,
      consoleErrors,
      pageErrors,
      certificationComponent,
    };
  } finally {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
  }
};

const writeFailureArtifacts = async (
  page: Page,
  item: { id: string; exportName: string },
  viewport: { name: string; width: number; height: number },
  reasons: string[]
) => {
  const dir = path.join(auditRoot, item.id);
  fs.mkdirSync(dir, { recursive: true });
  const screenshotPath = path.join(dir, `${viewport.name}.png`);
  const collectStyles = () =>
    page.evaluate(() => {
      const root =
        document.querySelector("#storybook-root") ||
        document.querySelector("#root") ||
        document.body;
      return [...root.querySelectorAll("*")]
        .map((node) => {
          const style = window.getComputedStyle(node);
          const box = node.getBoundingClientRect();
          return {
            className: String(node.className || "").slice(0, 200),
            tag: node.tagName.toLowerCase(),
            width: Math.round(box.width),
            height: Math.round(box.height),
            backdropFilter: style.backdropFilter,
            webkitBackdropFilter:
              (style as unknown as { webkitBackdropFilter?: string })
                .webkitBackdropFilter || "none",
            backgroundColor: style.backgroundColor,
            backgroundImage: style.backgroundImage,
            borderTopColor: style.borderTopColor,
            color: style.color,
            overflowX: style.overflowX,
            scrollWidth: node.scrollWidth,
            clientWidth: node.clientWidth,
          };
        })
        .filter(
          (row) =>
            row.width > 1 &&
            row.height > 1 &&
            (row.backdropFilter !== "none" ||
              row.webkitBackdropFilter !== "none" ||
              /glass|liquid/i.test(row.className))
        )
        .slice(0, 40);
    });

  // A story may trigger a navigation (link, HMR, error boundary) mid-capture.
  // Retry once after the new document settles instead of losing the whole run.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await page.screenshot({ path: screenshotPath, fullPage: false });
      const styles = await collectStyles();
      fs.writeFileSync(
        path.join(dir, `${viewport.name}.computed-styles.json`),
        `${JSON.stringify({ reasons, styles }, null, 2)}\n`
      );
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (
        !/navigation|Execution context was destroyed|Target (closed|page)/i.test(
          message
        )
      ) {
        throw error;
      }
      try {
        await page.waitForLoadState("domcontentloaded", { timeout: 15_000 });
        await waitForStoryRender(page);
      } catch {
        // The story never stabilized; the retry still records whatever exists.
      }
    }
  }
  fs.writeFileSync(
    path.join(dir, `${viewport.name}.computed-styles.json`),
    `${JSON.stringify({ reasons, styles: [], navigationDuringCapture: true }, null, 2)}\n`
  );
};

/**
 * Capture independent evidence for every resolved story, including stories
 * that pass the invariant checks. This is intentionally opt-in because the
 * normal CI gate only needs failure artifacts; the full visual certification
 * run uses CAPTURE_ALL_VISUALS=1 and records all three viewport images plus
 * computed styles for reviewer inspection.
 */
const writeVisualEvidence = async (
  page: Page,
  item: {
    id: string;
    exportName: string;
    sourcePath: string;
    isRecipe: boolean;
    recipeHarness?: string;
  },
  identity: {
    runId: string;
    storyId: string | null;
    recipeHarness: string | null;
  },
  viewport: { name: string; width: number; height: number },
  result: {
    surfaces: SurfaceInspection[];
    layoutIssues: LayoutIssue[];
    textAlphas: number[];
    texts: TextInspection[];
    consoleErrors: string[];
    pageErrors: string[];
  }
) => {
  const dir = path.join(visualCaptureRoot, item.id);
  fs.mkdirSync(dir, { recursive: true });
  const screenshotPath = path.join(dir, `${viewport.name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: false });
  fs.writeFileSync(
    path.join(dir, `${viewport.name}.computed-styles.json`),
    `${JSON.stringify(
      {
        runId: identity.runId,
        id: item.id,
        name: item.exportName,
        kind: item.isRecipe ? "recipe" : "export",
        sourcePath: item.sourcePath,
        storyId: identity.storyId,
        recipeHarness: identity.recipeHarness,
        viewport,
        surfaces: result.surfaces,
        layoutIssues: result.layoutIssues,
        textAlphas: result.textAlphas,
        texts: result.texts,
        consoleErrors: result.consoleErrors,
        pageErrors: result.pageErrors,
      },
      null,
      2
    )}\n`
  );
};

const isWhiteNeutral = (color: { r: number; g: number; b: number }) =>
  Math.min(color.r, color.g, color.b) >= 245 &&
  Math.max(color.r, color.g, color.b) - Math.min(color.r, color.g, color.b) <=
    6;

const isPermittedScrim = (color: {
  r: number;
  g: number;
  b: number;
  a: number;
}) =>
  Math.abs(color.r - 15) <= 2 &&
  Math.abs(color.g - 23) <= 2 &&
  Math.abs(color.b - 42) <= 2 &&
  color.a >= 0.2 &&
  color.a <= 0.3;

const splitCssList = (value: string): string[] => {
  const entries: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === "(") depth += 1;
    else if (value[index] === ")") depth = Math.max(0, depth - 1);
    else if (value[index] === "," && depth === 0) {
      entries.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }
  const finalEntry = value.slice(start).trim();
  if (finalEntry) entries.push(finalEntry);
  return entries;
};

const checkFilterChain = (
  label: string,
  filter: string,
  surface: SurfaceInspection,
  failures: string[]
) => {
  const canonicalBlurs = new Set([16, 24, 32, 40, 48]);
  if (!filter || filter === "none") {
    failures.push(`${label} must resolve non-none on .${surface.className}`);
    return;
  }
  const blur = parseBlurPx(filter);
  if (blur === null || !canonicalBlurs.has(blur)) {
    failures.push(
      `${label} blur not in canonical scale (16|24|32|40|48px): "${filter}" on .${surface.className}`
    );
  }
  const saturate = parseFilterComponent(filter, "saturate");
  const brightness = parseFilterComponent(filter, "brightness");
  const contrast = parseFilterComponent(filter, "contrast");
  if (saturate === null || saturate < 1.4) {
    failures.push(
      `${label} saturate < 1.4 or missing: "${filter}" on .${surface.className}`
    );
  }
  if (brightness === null || brightness < 1.0) {
    failures.push(
      `${label} brightness < 1.0 or missing: "${filter}" on .${surface.className}`
    );
  }
  if (contrast === null || contrast < 0.95 || contrast > 1.2) {
    failures.push(
      `${label} contrast outside [0.95,1.2]: "${filter}" on .${surface.className}`
    );
  }
};

const checkTokenInvariants = (
  surfaces: SurfaceInspection[],
  texts: TextInspection[],
  paints: PaintInspection[] = []
) => {
  const failures: string[] = [];
  const realSurfaces = surfaces.filter(
    (surface) => surface.surfaceKind !== "decorative"
  );
  if (realSurfaces.length === 0) {
    failures.push(
      "no glass surface found (backdrop-filter or glass-named element)"
    );
  }

  for (const surface of realSurfaces) {
    // Chromium intentionally drops unsupported -webkit-backdrop-filter
    // declarations from CSSOM and exposes no prefixed computed property, even
    // when the source rule authored both spellings. The independent static
    // material audit proves same-rule authored provenance. Runtime proves the
    // effective chains and their parity instead of fabricating CSSOM presence.
    checkFilterChain(
      "backdrop-filter",
      surface.backdropFilter,
      surface,
      failures
    );
    checkFilterChain(
      "-webkit-backdrop-filter",
      surface.webkitBackdropFilter,
      surface,
      failures
    );
    const filterComponents = (filter: string) => ({
      blur: parseBlurPx(filter),
      saturate: parseFilterComponent(filter, "saturate"),
      brightness: parseFilterComponent(filter, "brightness"),
      contrast: parseFilterComponent(filter, "contrast"),
    });
    const standardComponents = filterComponents(surface.backdropFilter);
    const webkitComponents = filterComponents(surface.webkitBackdropFilter);
    if (
      standardComponents.blur !== webkitComponents.blur ||
      standardComponents.saturate !== webkitComponents.saturate ||
      standardComponents.brightness !== webkitComponents.brightness ||
      standardComponents.contrast !== webkitComponents.contrast
    ) {
      failures.push(
        `effective backdrop-filter spellings diverge on .${surface.className}: standard="${surface.backdropFilter}" webkit="${surface.webkitBackdropFilter}"`
      );
    }

    const bgColor = parseColor(surface.backgroundColor);
    const gradientColors = surface.backgroundImages.flatMap((image) => {
      const colors = extractColorAlphas(image);
      const recognizedRemoved = image
        .replace(
          /rgba?\(\s*[\d.]+[,\s]+[\d.]+[,\s]+[\d.]+(?:[,\s/]+[\d.]+%?)?\s*\)/gi,
          ""
        )
        .replace(
          /color\(\s*(?:srgb|display-p3|srgb-linear)\s+[\d.]+%?\s+[\d.]+%?\s+[\d.]+%?(?:\s*\/\s*[\d.]+%?)?\s*\)/gi,
          ""
        );
      if (
        /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\s*\(/i.test(
          recognizedRemoved
        )
      ) {
        failures.push(
          `gradient contains an unparsed color expression and cannot prove every stop on .${surface.className}: "${image}"`
        );
      }
      return colors;
    });
    let hasWhiteFrost = false;
    gradientColors.forEach(({ alpha, rgb }, stopIndex) => {
      const [r, g, b] = rgb.split(",").map(Number);
      const color = { r, g, b, a: alpha };
      if (isWhiteNeutral(color)) {
        hasWhiteFrost = hasWhiteFrost || (alpha >= 0.015 && alpha <= 0.35);
        if (alpha < 0.015 || alpha > 0.35) {
          failures.push(
            `white gradient stop ${stopIndex + 1} alpha ${alpha} outside [0.015,0.35] on .${surface.className}`
          );
        }
      } else if (!isPermittedScrim(color)) {
        failures.push(
          `non-neutral gradient stop ${stopIndex + 1} rgba(${r},${g},${b},${alpha}) is not white frost or canonical scrim on .${surface.className}`
        );
      }
    });

    if (bgColor && bgColor.a > 0) {
      if (isWhiteNeutral(bgColor)) {
        hasWhiteFrost =
          hasWhiteFrost || (bgColor.a >= 0.015 && bgColor.a <= 0.35);
        if (bgColor.a < 0.015 || bgColor.a > 0.35) {
          failures.push(
            `white background-color alpha ${bgColor.a} outside [0.015,0.35] on .${surface.className}`
          );
        }
      } else if (!isPermittedScrim(bgColor)) {
        failures.push(
          `non-neutral background-color rgba(${bgColor.r},${bgColor.g},${bgColor.b},${bgColor.a}) is not white frost or canonical scrim on .${surface.className}`
        );
      }
    }
    if (!hasWhiteFrost) {
      failures.push(
        `surface lacks a white-neutral frost fill in [0.015,0.35] on .${surface.className}`
      );
    }
    if (isOpaqueDarkFill(surface)) {
      failures.push(`opaque dark fill >= 0.50 on .${surface.className}`);
    }

    const borders =
      surface.borders.length > 0
        ? surface.borders
        : [{ color: surface.borderTopColor, width: surface.borderWidth }];
    for (const borderRecord of borders) {
      const borderWidth = Number.parseFloat(borderRecord.width || "0");
      if (borderWidth <= 0) continue;
      const border = parseColor(borderRecord.color);
      if (!border || border.a < 0.12) {
        failures.push(
          `border alpha ${border?.a ?? "unparsed"} < 0.12 on .${surface.className}`
        );
        break;
      }
    }

    const insetLayers = splitCssList(surface.boxShadow).filter((layer) =>
      /\binset\b/.test(layer)
    );
    const sheenAlphas = [...surface.sheenAlphas];
    const highlightAlphas: number[] = [];
    for (const layer of insetLayers) {
      const whiteColors = extractColorAlphas(layer).filter(({ rgb }) => {
        const [r, g, b] = rgb.split(",").map(Number);
        return isWhiteNeutral({ r, g, b });
      });
      const withoutColors = layer
        .replace(/rgba?\([^)]*\)/g, "")
        .replace(/color\([^)]*\)/g, "");
      const dimensions = [...withoutColors.matchAll(/-?[\d.]+px/g)].map(
        (match) => Math.abs(Number.parseFloat(match[0]))
      );
      const blurRadius = dimensions[2] ?? 0;
      for (const color of whiteColors) {
        if (blurRadius > 0) sheenAlphas.push(color.alpha);
        else highlightAlphas.push(color.alpha);
      }
    }
    if (sheenAlphas.some((alpha) => alpha < 0.1 || alpha > 0.18)) {
      failures.push(
        `inner-glow/sheen alpha outside [0.10,0.18] on .${surface.className}`
      );
    }
    if (
      surface.elevationLevel !== null &&
      surface.elevationLevel <= 3 &&
      !sheenAlphas.some((alpha) => alpha >= 0.1 && alpha <= 0.18)
    ) {
      failures.push(
        `level${surface.elevationLevel} surface is missing canonical inner-glow/sheen on .${surface.className}`
      );
    }
    if (surface.specularAlpha !== null)
      highlightAlphas.push(surface.specularAlpha);
    if (highlightAlphas.some((alpha) => alpha > 0.32)) {
      failures.push(`highlight alpha > 0.32 on .${surface.className}`);
    }
    if (
      surface.noiseOpacity !== null &&
      (!Number.isFinite(surface.noiseOpacity) || surface.noiseOpacity > 0.1)
    ) {
      failures.push(
        `noise opacity ${surface.noiseOpacity} > 0.10 on .${surface.className}`
      );
    }
  }

  const roleFloors: Record<TextInspection["role"], number> = {
    primary: 0.9,
    secondary: 0.7,
    tertiary: 0.5,
    unclassified: 0.5,
  };
  for (const text of texts) {
    const floor = roleFloors[text.role];
    if (text.effectiveAlpha < floor) {
      failures.push(
        `${text.role} text effective alpha ${text.effectiveAlpha.toFixed(3)} < ${floor.toFixed(2)} on ${text.selector}.${text.className}: "${text.text}"`
      );
    }
    const largeText =
      text.fontSize >= 24 || (text.fontSize >= 18.66 && text.fontWeight >= 700);
    const contrastFloor = largeText ? 3 : 4.5;
    if (text.contrastRatio === null) {
      failures.push(
        `cannot prove local contrast for ${text.selector}.${text.className}: foreground="${text.foregroundColor}" backdrop="${text.localBackdropColor}" text="${text.text}"`
      );
    } else if (text.contrastRatio < contrastFloor) {
      failures.push(
        `${text.role} text local contrast ${text.contrastRatio.toFixed(2)}:1 < ${contrastFloor.toFixed(1)}:1 on ${text.selector}.${text.className}; foreground="${text.foregroundColor}" effectiveBackdrop="${text.localBackdropColor}" font=${text.fontSize}px/${text.fontWeight}; text="${text.text}"`
      );
    }
  }

  // Apple-like liquid glass uses neutral frost and restrained semantic color,
  // not opaque navy controls or a saturated blue/teal story canvas. Inspect
  // every interactive fill and viewport-dominant painted region, including
  // story wrappers that are deliberately excluded from material-token checks.
  for (const paint of paints) {
    paint.colors.forEach((color, index) => {
      if (color.a < 0.2) return;
      const max = Math.max(color.r, color.g, color.b);
      const min = Math.min(color.r, color.g, color.b);
      const chroma = max - min;
      const luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
      const saturatedCanvas =
        (paint.paintRole === "canvas" || paint.paintRole === "large-surface") &&
        color.a >= 0.45 &&
        chroma > 48;
      const darkColoredControl =
        paint.paintRole === "interactive" &&
        color.a >= 0.45 &&
        luminance < 105 &&
        chroma > 18;
      const neutralScrim =
        paint.paintRole !== "interactive" &&
        color.a <= 0.3 &&
        luminance < 45 &&
        chroma <= 30;
      const broadTintWash =
        (paint.paintRole === "canvas" || paint.paintRole === "large-surface") &&
        color.a >= 0.08 &&
        chroma > 18 &&
        !neutralScrim;
      if (saturatedCanvas || darkColoredControl || broadTintWash) {
        failures.push(
          `${paint.paintRole} paint ${saturatedCanvas ? "saturated" : darkColoredControl ? "dark/navy" : "broad low-alpha tint wash"} rgba(${color.r},${color.g},${color.b},${color.a}) chroma=${chroma.toFixed(1)} luminance=${luminance.toFixed(1)} at stop ${index + 1} on ${paint.selector}.${paint.className}; geometry=${paint.x},${paint.y},${paint.width}x${paint.height}; backgroundColor="${paint.backgroundColor}" backgroundImage="${paint.backgroundImage}" boxShadow="${paint.boxShadow}"`
        );
      }
    });
  }
  return failures;
};

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === "string");

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === "number");

const isTextInspectionArray = (value: unknown): value is TextInspection[] =>
  Array.isArray(value) &&
  value.every((entry) => {
    if (typeof entry !== "object" || entry === null) return false;
    const text = entry as Partial<TextInspection>;
    return (
      typeof text.selector === "string" &&
      typeof text.className === "string" &&
      ["primary", "secondary", "tertiary", "unclassified"].includes(
        String(text.role)
      ) &&
      typeof text.colorAlpha === "number" &&
      typeof text.effectiveAlpha === "number" &&
      typeof text.foregroundColor === "string" &&
      typeof text.localBackdropColor === "string" &&
      (typeof text.contrastRatio === "number" || text.contrastRatio === null) &&
      typeof text.fontSize === "number" &&
      typeof text.fontWeight === "number" &&
      typeof text.text === "string"
    );
  });

const isPaintInspectionArray = (value: unknown): value is PaintInspection[] =>
  Array.isArray(value) &&
  value.every((entry) => {
    if (typeof entry !== "object" || entry === null) return false;
    const paint = entry as Partial<PaintInspection>;
    return (
      typeof paint.selector === "string" &&
      typeof paint.className === "string" &&
      ["canvas", "large-surface", "interactive"].includes(
        String(paint.paintRole)
      ) &&
      typeof paint.x === "number" &&
      typeof paint.y === "number" &&
      typeof paint.width === "number" &&
      typeof paint.height === "number" &&
      typeof paint.backgroundColor === "string" &&
      typeof paint.backgroundImage === "string" &&
      typeof paint.boxShadow === "string" &&
      Array.isArray(paint.colors) &&
      paint.colors.every(
        (color) =>
          typeof color === "object" &&
          color !== null &&
          ["r", "g", "b", "a"].every(
            (key) => typeof (color as Record<string, unknown>)[key] === "number"
          )
      )
    );
  });

const isLayoutIssueArray = (value: unknown): value is LayoutIssue[] =>
  Array.isArray(value) &&
  value.every(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as LayoutIssue).type === "string" &&
      typeof (entry as LayoutIssue).detail === "string"
  );

const toSurfaceInspection = (value: unknown): SurfaceInspection | null => {
  if (typeof value !== "object" || value === null) return null;
  const surface = value as Partial<SurfaceInspection>;
  if (
    typeof surface.selector !== "string" ||
    typeof surface.className !== "string" ||
    !["backdrop", "glass-surface", "liquid", "decorative"].includes(
      String(surface.surfaceKind)
    ) ||
    typeof surface.x !== "number" ||
    typeof surface.y !== "number" ||
    typeof surface.width !== "number" ||
    typeof surface.height !== "number" ||
    typeof surface.backdropFilter !== "string" ||
    typeof surface.webkitBackdropFilter !== "string" ||
    typeof surface.backgroundColor !== "string" ||
    typeof surface.backgroundImage !== "string" ||
    !isStringArray(surface.backgroundImages) ||
    typeof surface.borderTopColor !== "string" ||
    typeof surface.borderWidth !== "string" ||
    typeof surface.color !== "string" ||
    typeof surface.overflowX !== "string" ||
    typeof surface.overflowY !== "string" ||
    typeof surface.scrollWidth !== "number" ||
    typeof surface.clientWidth !== "number" ||
    typeof surface.scrollHeight !== "number" ||
    typeof surface.clientHeight !== "number"
  ) {
    return null;
  }
  return {
    ...surface,
    // inputType was added as observability for native range-control geometry.
    // Older evidence remains structurally valid; without this metadata it gets
    // no range exemption and is therefore evaluated by the stricter path.
    inputType: typeof surface.inputType === "string" ? surface.inputType : null,
    surfaceKind: surface.surfaceKind as SurfaceInspection["surfaceKind"],
    // Authored provenance is advisory in Chromium evidence because unsupported
    // prefixed declarations are removed from CSSOM. `npm run lint:tokens`
    // plus the static glass material audit own the authored-spelling gate.
    backdropFilterAuthored:
      typeof surface.backdropFilterAuthored === "boolean"
        ? surface.backdropFilterAuthored
        : false,
    webkitBackdropFilterAuthored:
      typeof surface.webkitBackdropFilterAuthored === "boolean"
        ? surface.webkitBackdropFilterAuthored
        : false,
    boxShadow:
      typeof surface.boxShadow === "string" ? surface.boxShadow : "none",
    borders:
      Array.isArray(surface.borders) &&
      surface.borders.every(
        (border) =>
          typeof border === "object" &&
          border !== null &&
          typeof (border as { color?: unknown }).color === "string" &&
          typeof (border as { width?: unknown }).width === "string"
      )
        ? surface.borders
        : [{ color: surface.borderTopColor, width: surface.borderWidth }],
    elevationLevel:
      typeof surface.elevationLevel === "number"
        ? surface.elevationLevel
        : null,
    noiseOpacity:
      typeof surface.noiseOpacity === "number" ? surface.noiseOpacity : null,
    specularAlpha:
      typeof surface.specularAlpha === "number" ? surface.specularAlpha : null,
    sheenAlphas: isNumberArray(surface.sheenAlphas) ? surface.sheenAlphas : [],
  } as SurfaceInspection;
};

const pngDimensions = (
  filePath: string
): { width: number; height: number } | null => {
  const header = fs.readFileSync(filePath).subarray(0, 24);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (header.length < 24 || !header.subarray(0, 8).equals(signature))
    return null;
  if (header.toString("ascii", 12, 16) !== "IHDR") return null;
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
};

const validateRecipeViewportEvidence = (
  item: ReturnType<typeof buildRecipeList>[number],
  viewport: (typeof viewports)[number]
) => {
  // Recipe render evidence is produced by the independent recipe harness. A
  // targeted runtime capture may copy it elsewhere, but must never treat that
  // targeted directory as canonical input.
  const evidenceDir = path.join(canonicalVisualEvidenceRoot, item.id);
  const screenshotPath = path.join(evidenceDir, `${viewport.name}.png`);
  const stylesPath = path.join(
    evidenceDir,
    `${viewport.name}.computed-styles.json`
  );
  const artifactPaths = [screenshotPath, stylesPath].map(toRepoRelativePath);
  const renderFailures: string[] = [];
  const tokenFailures: string[] = [];
  const layoutFailures: string[] = [];
  let surfaces: SurfaceInspection[] = [];
  let textAlphas: number[] = [];
  let texts: TextInspection[] = [];
  let paints: PaintInspection[] = [];
  let consoleErrors: string[] = [];
  let pageErrors: string[] = [];

  if (!fs.existsSync(screenshotPath)) {
    renderFailures.push(
      `missing screenshot: ${toRepoRelativePath(screenshotPath)}`
    );
  } else if (fs.statSync(screenshotPath).size === 0) {
    renderFailures.push(
      `empty screenshot: ${toRepoRelativePath(screenshotPath)}`
    );
  } else {
    const dimensions = pngDimensions(screenshotPath);
    if (!dimensions) {
      renderFailures.push(
        `invalid PNG header: ${toRepoRelativePath(screenshotPath)}`
      );
    } else if (
      dimensions.width !== viewport.width ||
      dimensions.height !== viewport.height
    ) {
      renderFailures.push(
        `screenshot viewport ${dimensions.width}x${dimensions.height} != ${viewport.width}x${viewport.height}`
      );
    }
  }

  if (!fs.existsSync(stylesPath)) {
    renderFailures.push(
      `missing computed styles: ${toRepoRelativePath(stylesPath)}`
    );
  } else {
    let evidence: RecipeComputedEvidence | null = null;
    try {
      evidence = JSON.parse(
        fs.readFileSync(stylesPath, "utf8")
      ) as RecipeComputedEvidence;
    } catch (error) {
      renderFailures.push(
        `invalid computed styles JSON: ${error instanceof Error ? error.message : String(error)}`
      );
    }
    if (evidence) {
      if (evidence.id !== item.exportName && evidence.id !== item.id) {
        renderFailures.push(
          `computed evidence id ${String(evidence.id)} != ${item.exportName} or ${item.id}`
        );
      }
      if (evidence.name !== undefined && evidence.name !== item.exportName) {
        renderFailures.push(
          `computed evidence name ${String(evidence.name)} != ${item.exportName}`
        );
      }
      if (evidence.kind !== undefined && evidence.kind !== "recipe") {
        renderFailures.push(
          `computed evidence kind ${String(evidence.kind)} != recipe`
        );
      }
      if (
        evidence.sourcePath !== undefined &&
        evidence.sourcePath !== item.sourcePath
      ) {
        renderFailures.push(
          `computed evidence sourcePath ${String(evidence.sourcePath)} != ${item.sourcePath}`
        );
      }
      if (
        evidence.viewport?.name !== viewport.name ||
        evidence.viewport?.width !== viewport.width ||
        evidence.viewport?.height !== viewport.height
      ) {
        renderFailures.push(
          `computed viewport ${String(evidence.viewport?.name)} ${String(evidence.viewport?.width)}x${String(evidence.viewport?.height)} != ${viewport.name} ${viewport.width}x${viewport.height}`
        );
      }
      if (!Array.isArray(evidence.surfaces)) {
        renderFailures.push("computed surfaces missing or not an array");
      } else {
        const parsed = evidence.surfaces.map(toSurfaceInspection);
        if (parsed.some((surface) => surface === null)) {
          renderFailures.push(
            "one or more computed surface records are malformed"
          );
        } else {
          surfaces = parsed as SurfaceInspection[];
        }
      }
      if (!isNumberArray(evidence.textAlphas)) {
        renderFailures.push(
          "computed textAlphas missing or not a number array"
        );
      } else {
        textAlphas = evidence.textAlphas;
      }
      if (!isTextInspectionArray(evidence.texts)) {
        renderFailures.push("computed role-aware texts missing or malformed");
      } else {
        texts = evidence.texts;
      }
      if (!isPaintInspectionArray(evidence.paints)) {
        renderFailures.push(
          "computed painted-region inspections missing or malformed"
        );
      } else {
        paints = evidence.paints;
      }
      if (!isLayoutIssueArray(evidence.layoutIssues)) {
        layoutFailures.push("computed layoutIssues missing or malformed");
      } else {
        layoutFailures.push(
          ...evidence.layoutIssues
            .filter((issue) => issue.type !== "primary-output-viewport-cutoff")
            .map(
            (issue) => `${issue.type}: ${issue.detail}`
            )
        );
      }
      if (!isStringArray(evidence.consoleErrors)) {
        renderFailures.push(
          "computed consoleErrors missing or not a string array"
        );
      } else {
        consoleErrors = evidence.consoleErrors;
        renderFailures.push(
          ...consoleErrors.map((error) => `console error: ${error}`)
        );
      }
      if (!isStringArray(evidence.pageErrors)) {
        renderFailures.push(
          "computed pageErrors missing or not a string array"
        );
      } else {
        pageErrors = evidence.pageErrors;
        renderFailures.push(
          ...pageErrors.map((error) => `page error: ${error}`)
        );
      }
    }
  }

  tokenFailures.push(...checkTokenInvariants(surfaces, texts, paints));
  for (const surface of surfaces) {
    const isNativeRangeControl =
      surface.selector === "input" && surface.inputType === "range";
    if (surface.width <= 1 || surface.height <= 1) {
      layoutFailures.push(
        `surface has zero/invalid geometry ${surface.width}x${surface.height} on .${surface.className}`
      );
    }
    if (
      surface.scrollWidth > surface.clientWidth + 2 &&
      surface.overflowX !== "auto" &&
      surface.overflowX !== "scroll"
    ) {
      layoutFailures.push(
        `surface overflow scrollWidth=${surface.scrollWidth} clientWidth=${surface.clientWidth} on .${surface.className}`
      );
    }
    if (
      surface.scrollHeight > surface.clientHeight + 2 &&
      surface.overflowY !== "auto" &&
      surface.overflowY !== "scroll" &&
      !isNativeRangeControl
    ) {
      layoutFailures.push(
        `surface vertical clipping scrollHeight=${surface.scrollHeight} clientHeight=${surface.clientHeight} on .${surface.className}`
      );
    }
  }
  return {
    viewport: viewport.name,
    surfaceCount: surfaces.length,
    textAlphaCount: textAlphas.length,
    screenshot: toRepoRelativePath(screenshotPath),
    computedStyles: toRepoRelativePath(stylesPath),
    artifacts: artifactPaths,
    render: renderFailures.length === 0 ? "pass" : "fail",
    tokens: tokenFailures.length === 0 ? "pass" : "fail",
    layout: layoutFailures.length === 0 ? "pass" : "fail",
    renderFailures,
    tokenFailures,
    layoutFailures,
    consoleErrors,
    pageErrors,
  };
};

const writeRecipeCaptureIdentity = (
  item: ReturnType<typeof buildRecipeList>[number],
  viewport: (typeof viewports)[number],
  runId: string
) => {
  const sourceDir = path.join(canonicalVisualEvidenceRoot, item.id);
  const destinationDir = path.join(visualCaptureRoot, item.id);
  fs.mkdirSync(destinationDir, { recursive: true });
  const sourceScreenshot = path.join(sourceDir, `${viewport.name}.png`);
  const destinationScreenshot = path.join(
    destinationDir,
    `${viewport.name}.png`
  );
  if (sourceScreenshot !== destinationScreenshot) {
    fs.copyFileSync(sourceScreenshot, destinationScreenshot);
  }
  const sourceStyles = path.join(
    sourceDir,
    `${viewport.name}.computed-styles.json`
  );
  const destinationStyles = path.join(
    destinationDir,
    `${viewport.name}.computed-styles.json`
  );
  const computed = JSON.parse(
    fs.readFileSync(sourceStyles, "utf8")
  ) as RecipeComputedEvidence;
  atomicWriteJson(destinationStyles, {
    ...computed,
    runId,
    id: item.id,
    name: item.exportName,
    kind: "recipe",
    sourcePath: item.sourcePath,
    storyId: null,
    recipeHarness: item.recipeHarness,
    viewport,
  });
};

const buildFullVisualRunManifest = (args: {
  visualItems: Array<{
    id: string;
    name: string;
    kind: "export" | "recipe";
    sourcePath: string;
    storyId?: string;
    recipeHarness?: string;
  }>;
  nonvisualExclusions: NonvisualExclusion[];
}) => {
  const expectedIds = new Set(args.visualItems.map((item) => item.id));
  const capturedIds = fs
    .readdirSync(visualCaptureRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  if (
    capturedIds.length !== authoritativeVisualTotal ||
    capturedIds.some((id) => !expectedIds.has(id))
  ) {
    throw new Error(
      `full visual staging inventory is not exact: expected ${authoritativeVisualTotal} directories, received ${capturedIds.length}`
    );
  }
  const visualItems = args.visualItems.map((item) => ({
    ...item,
    artifacts: Object.fromEntries(
      viewports.map((viewport) => {
        const screenshotPath = path.join(
          visualCaptureRoot,
          item.id,
          `${viewport.name}.png`
        );
        const computedStylesPath = path.join(
          visualCaptureRoot,
          item.id,
          `${viewport.name}.computed-styles.json`
        );
        for (const artifactPath of [screenshotPath, computedStylesPath]) {
          if (
            !fs.existsSync(artifactPath) ||
            fs.statSync(artifactPath).size === 0
          ) {
            throw new Error(
              `full visual staging artifact missing or empty: ${toRepoRelativePath(artifactPath)}`
            );
          }
        }
        return [
          viewport.name,
          {
            screenshot: {
              path: `reports/audit/visual-all/${item.id}/${viewport.name}.png`,
              sha256: sha256File(screenshotPath),
            },
            computedStyles: {
              path: `reports/audit/visual-all/${item.id}/${viewport.name}.computed-styles.json`,
              sha256: sha256File(computedStylesPath),
            },
          },
        ];
      })
    ),
  }));
  const publicAuditPath = resolveRepoArtifact(
    "reports/public-export-audit.json"
  );
  const publicVisualTargetManifestPath = resolveRepoArtifact(
    "reports/public-visual-target-manifest.json"
  );
  const recipeEvidencePath = resolveRepoArtifact(
    "reports/3.3-release/recipe-render-evidence.json"
  );
  const sourcePaths = [
    "reports/public-export-audit.json",
    "reports/public-visual-target-manifest.json",
    "reports/3.3-release/recipe-render-evidence.json",
    ...args.visualItems.map((item) => repositoryRelativePath(item.sourcePath)),
    ...args.nonvisualExclusions.flatMap((entry) => [
      entry.sourcePath,
      ...entry.tests.map((testEntry) => testEntry.path),
    ]),
  ];
  const manifest = {
    schemaVersion: 1,
    runId: auditRunId,
    generatedAt: auditGeneratedAt,
    scope: "full" as const,
    sourceFingerprint: sourceFingerprint(sourcePaths),
    inventory: {
      audited: {
        total: authoritativeAuditedTotal,
        visual: authoritativeVisualTotal,
        nonvisual: authoritativeNonvisualExportCount,
      },
      hashes: {
        publicExportAuditSha256: sha256File(publicAuditPath),
        publicVisualTargetManifestSha256: sha256File(
          publicVisualTargetManifestPath
        ),
        recipeEvidenceSha256: sha256File(recipeEvidencePath),
      },
      visualItems,
      nonvisualExclusions: args.nonvisualExclusions,
    },
  };
  return manifest;
};

const promoteFullVisualCapture = () => {
  const backupRoot = path.join(auditRoot, `.visual-all-backup-${auditRunId}`);
  const canonicalExists = fs.existsSync(canonicalVisualEvidenceRoot);
  if (canonicalExists) fs.renameSync(canonicalVisualEvidenceRoot, backupRoot);
  try {
    fs.renameSync(fullVisualStagingRoot, canonicalVisualEvidenceRoot);
  } catch (error) {
    if (canonicalExists && fs.existsSync(backupRoot)) {
      fs.renameSync(backupRoot, canonicalVisualEvidenceRoot);
    }
    throw error;
  }
  if (canonicalExists && fs.existsSync(backupRoot)) {
    fs.rmSync(backupRoot, { recursive: true, force: true });
  }
};

const artifactPathsForItem = (
  item: { id: string; isRecipe: boolean; gateScreenshotPath?: string },
  includeFailureArtifacts: boolean
) => {
  const paths = new Set<string>();
  for (const viewport of viewports) {
    paths.add(
      toRepoRelativePath(
        path.join(reportedVisualEvidenceRoot, item.id, `${viewport.name}.png`)
      )
    );
    paths.add(
      toRepoRelativePath(
        path.join(
          reportedVisualEvidenceRoot,
          item.id,
          `${viewport.name}.computed-styles.json`
        )
      )
    );
  }
  if (item.gateScreenshotPath) {
    paths.add(toRepoRelativePath(resolveRepoArtifact(item.gateScreenshotPath)));
  }
  if (includeFailureArtifacts) {
    const failureDir = path.join(auditRoot, item.id);
    if (fs.existsSync(failureDir)) {
      for (const artifact of fs.readdirSync(failureDir).sort()) {
        paths.add(toRepoRelativePath(path.join(failureDir, artifact)));
      }
    }
  }
  return [...paths];
};

const readJsonArtifactMetadata = (relativePath: string) => {
  const absolutePath = resolveRepoArtifact(relativePath);
  if (!fs.existsSync(absolutePath)) {
    return { path: relativePath, exists: false };
  }
  try {
    const value = JSON.parse(fs.readFileSync(absolutePath, "utf8")) as Record<
      string,
      unknown
    >;
    return {
      path: relativePath,
      exists: true,
      generatedAt: value.generatedAt ?? value.timestamp ?? null,
      status: value.status ?? null,
      statusCounts: value.statusCounts ?? null,
      summary: value.summary ?? null,
    };
  } catch (error) {
    return {
      path: relativePath,
      exists: true,
      parseError: error instanceof Error ? error.message : String(error),
    };
  }
};

const buildSupportingEvidence = () => ({
  staticSweep: [
    readJsonArtifactMetadata("reports/public-export-audit.json"),
    readJsonArtifactMetadata("reports/glass/pipeline-validation-report.json"),
    readJsonArtifactMetadata("reports/runtime-cleanliness-audit.json"),
  ],
  matrixEvidence: [
    readJsonArtifactMetadata(
      "reports/glassmorphism-storybook-visual-certification.json"
    ),
    readJsonArtifactMetadata("reports/audit/visual-all/visual-summary.json"),
    readJsonArtifactMetadata("test-results/visual-matrix-results.json"),
  ],
});

const markdownCell = (value: unknown) =>
  String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ");

const writeCleanFullRunReports = (summary: {
  generatedAt: string;
  inventory: {
    authoritative: {
      publicExportScope: number;
      visuallyRenderableComponentExports: number;
      nonvisualPublicExports: number;
      recipes: number;
      visualGateTotal: number;
      auditedTotal: number;
    };
    discrepancy: {
      authoritativePublicExportScope: number;
      staleClaim: number;
      delta: number;
    };
  };
  nonvisualExclusions: NonvisualExclusion[];
  statusCounts: { passed: number; blocked: number };
  exports: Array<Record<string, unknown>>;
}) => {
  const summaryLines = [
    "# Runtime token-purity and layout audit",
    "",
    `Generated: ${summary.generatedAt}`,
    "",
    `Status: PASS (${summary.statusCounts.passed}/${summary.inventory.authoritative.visualGateTotal} visual items; ${summary.inventory.authoritative.auditedTotal} audited entities)`,
    "",
    "## Inventory",
    "",
    `- Public export scope: ${summary.inventory.authoritative.publicExportScope}`,
    `- Visually renderable component exports: ${summary.inventory.authoritative.visuallyRenderableComponentExports}`,
    `- Explicitly nonvisual public exports: ${summary.inventory.authoritative.nonvisualPublicExports}`,
    `- Recipes: ${summary.inventory.authoritative.recipes}`,
    `- Screenshot-required visual total: ${summary.inventory.authoritative.visualGateTotal}`,
    `- Audited total: ${summary.inventory.authoritative.auditedTotal}`,
    `- Historical 439 count discrepancy: current public scope ${summary.inventory.discrepancy.authoritativePublicExportScope}, stale ${summary.inventory.discrepancy.staleClaim}, delta +${summary.inventory.discrepancy.delta}`,
    "",
    "## Explicit nonvisual exclusion",
    "",
    ...summary.nonvisualExclusions.map(
      (entry) =>
        `- **${markdownCell(entry.name)}** — \`${markdownCell(entry.sourcePath)}\`. ${markdownCell(entry.reason)} Behavior test: \`${markdownCell(entry.apiTestEvidence.path)}\` (PASS).`
    ),
    "",
    "## Results",
    "",
    "| ID | Kind | Render | Tokens | Layout | Artifacts |",
    "| --- | --- | --- | --- | --- | --- |",
    ...summary.exports.map((entry) => {
      const artifacts = Array.isArray(entry.artifacts)
        ? entry.artifacts.map(markdownCell).join("<br>")
        : "";
      return `| ${markdownCell(entry.id)} | ${markdownCell(entry.kind)} | ${markdownCell(entry.render)} | ${markdownCell(entry.tokens)} | ${markdownCell(entry.layout)} | ${artifacts} |`;
    }),
    "",
  ];
  const triageLines = [
    "# Runtime audit triage",
    "",
    `Generated: ${summary.generatedAt}`,
    "",
    "The full authoritative runtime audit completed cleanly. No evidence-only findings or blocked exports require triage.",
    "",
  ];
  fs.writeFileSync(
    path.join(auditRoot, "audit-summary.md"),
    `${summaryLines.join("\n")}\n`
  );
  fs.writeFileSync(
    path.join(auditRoot, "triage.md"),
    `${triageLines.join("\n")}\n`
  );
};

test.describe("perceptual audit regression fixtures", () => {
  test("fails a near-collision between a settings row and reset control", async ({
    page,
  }) => {
    await page.setContent(`
      <style>
        body { margin: 0; }
        .row { width: 320px; height: 48px; display:flex; align-items:center; background:rgba(255,255,255,.2); }
        .reset { display:block; width:140px; height:28px; margin-top:1px; background:rgba(255,255,255,.3); }
      </style>
      <div class="row"><button aria-label="Reduced motion">Reduced motion</button></div>
      <button class="reset">Reset to Defaults</button>
    `);
    const issues = await collectLayoutIssues(page);
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: expect.stringMatching(
            /control-spacing|visual-control-collision/
          ),
          detail: expect.stringContaining("required>=8px"),
        }),
      ])
    );
  });

  test("fails saturated canvas and opaque navy interactive paint", async ({
    page,
  }) => {
    await page.setContent(`
      <style>
        html, body, #storybook-root { width:100%; height:100%; margin:0; }
        body { background:rgb(18,82,182); }
        button { background:rgb(27,38,67); color:white; }
      </style>
      <button>Primary Button</button>
    `);
    const paints = await collectPaintInspections(page);
    const failures = checkTokenInvariants(
      [],
      await collectTextInspections(page),
      paints
    );
    expect(
      failures.some((failure) => failure.includes("canvas paint saturated"))
    ).toBe(true);
    expect(
      failures.some((failure) =>
        failure.includes("interactive paint dark/navy")
      )
    ).toBe(true);
  });

  test("fails opaque white and pastel text on a white local backdrop", async ({
    page,
  }) => {
    await page.setContent(`
      <style>
        body { margin:0; background:rgb(248,250,252); }
        .card { margin:20px; padding:20px; background:rgba(255,255,255,.84); }
        .white { color:rgb(255,255,255); }
        .pastel { color:rgb(210,225,238); }
      </style>
      <section class="card"><h2 class="white">Glass context</h2><p class="pastel">Persona details</p></section>
    `);
    const texts = await collectTextInspections(page);
    expect(texts.map((text) => text.contrastRatio)).toEqual(
      expect.arrayContaining([expect.any(Number)])
    );
    const failures = checkTokenInvariants([], texts, []);
    expect(
      failures.filter((failure) => failure.includes("local contrast"))
    ).toHaveLength(2);
    expect(
      failures.some((failure) => failure.includes('text="Glass context"'))
    ).toBe(true);
    expect(
      failures.some((failure) => failure.includes('text="Persona details"'))
    ).toBe(true);
  });

  test("fails blank and minuscule primary output", async ({ page }) => {
    await page.setContent(
      '<div id="storybook-root"><span style="display:inline-block;width:2px;height:2px"></span></div>'
    );
    const issues = await collectPresentationIssues(page);
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "blank-or-minuscule-primary-output" }),
      ])
    );
  });

  test("fails cropped and responsively displaced primary output even inside a scroller", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.setContent(`
      <style>body{margin:0}.scroll{width:390px;overflow:auto}.demo{width:900px;height:500px;transform:translateX(-240px);background:rgba(255,255,255,.2)}</style>
      <div id="storybook-root"><div class="scroll"><main class="demo" data-primary-output>Primary dashboard output</main></div></div>
    `);
    const issues = await collectPresentationIssues(page);
    expect(
      issues.some(
        (issue) =>
          issue.type === "major-responsive-offscreen-displacement" ||
          issue.type === "primary-output-viewport-cutoff"
      )
    ).toBe(true);
  });

  test("fails a compound dropdown shown only as a closed constituent", async ({
    page,
  }) => {
    await page.setContent(
      '<div id="storybook-root" data-certification-component="Glass Dropdown"><button aria-haspopup="menu" aria-expanded="false">Choose item</button></div>'
    );
    const issues = await collectPresentationIssues(page);
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "hidden-constituent-evidence" }),
      ])
    );
  });

  test("fails unfinished native controls and dominant chromatic canvas pixels", async ({
    page,
  }) => {
    await page.setContent(
      '<div id="storybook-root"><select><option>Native select</option></select><canvas width="240" height="160"></canvas></div>'
    );
    await page.locator("canvas").evaluate((canvas: HTMLCanvasElement) => {
      const context = canvas.getContext("2d")!;
      context.fillStyle = "rgb(8, 42, 118)";
      context.fillRect(0, 0, canvas.width, canvas.height);
    });
    const issues = await collectPresentationIssues(page);
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "unfinished-native-control-presentation",
        }),
        expect.objectContaining({ type: "dominant-canvas-chroma-darkness" }),
      ])
    );
  });

  test("fails broad subtle blue and mint field washes like EffectGroup", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 900, height: 600 });
    await page.setContent(`
      <style>
        html,body,#storybook-root{width:100%;height:100%;margin:0}
        body{background:linear-gradient(130deg,rgba(108,176,236,.34),rgba(115,222,202,.30)),rgb(238,244,249)}
        .glass{position:absolute;inset:70px;background:rgba(221,241,248,.58);box-shadow:0 24px 80px rgba(55,167,202,.28)}
      </style><div id="storybook-root"><main class="glass">Effect group</main></div>
    `);
    const census = await inspectViewportColorCensus(page);
    expect(checkViewportColorCensus(census), JSON.stringify(census)).toEqual([
      expect.stringContaining("whole-viewport problematic tint"),
    ]);
  });

  test("fails broad blue purple field and overlapping tinted shadows like AdvancedAnimations", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 900, height: 600 });
    await page.setContent(`
      <style>
        html,body,#storybook-root{width:100%;height:100%;margin:0}
        body{background:linear-gradient(120deg,rgb(28,53,126),rgb(40,102,219) 62%,rgb(28,142,151))}
        .card{display:inline-block;margin:160px 16px 0 90px;width:180px;height:110px;background:rgba(144,164,236,.42);box-shadow:0 20px 72px rgba(43,64,210,.42)}
      </style><div id="storybook-root"><div class="card">Advanced animation</div><div class="card">Material physics</div></div>
    `);
    const census = await inspectViewportColorCensus(page);
    expect(checkViewportColorCensus(census), JSON.stringify(census)).toEqual([
      expect.stringContaining("whole-viewport problematic tint"),
    ]);
  });

  test("allows tiny localized semantic and spectral edge accents", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 900, height: 600 });
    await page.setContent(`
      <style>
        html,body,#storybook-root{width:100%;height:100%;margin:0;background:rgb(242,245,248)}
        .glass{position:absolute;inset:70px;background:rgba(255,255,255,.34);box-shadow:inset 0 1px rgba(255,255,255,.28),0 20px 48px rgba(15,23,42,.08)}
        .edge{position:absolute;left:70px;top:70px;width:5px;height:90px;background:linear-gradient(rgb(66,153,225),rgb(147,51,234))}
        .status{position:absolute;right:90px;top:90px;width:12px;height:12px;border-radius:50%;background:rgb(34,197,94)}
      </style><div id="storybook-root"><main class="glass">Neutral liquid glass</main><span class="edge"></span><span class="status"></span></div>
    `);
    const census = await inspectViewportColorCensus(page);
    expect(checkViewportColorCensus(census), JSON.stringify(census)).toEqual(
      []
    );
  });
});

test.describe("AuraGlass token purity + layout runtime audit", () => {
  test("all component-like exports and recipes pass render/tokens/layout at 3 viewports", async ({
    browser,
    page,
  }) => {
    test.setTimeout(180 * 60 * 1000);
    // Keep the Playwright fixture page untouched. The runner may attach
    // failure screenshots/traces to it after the test, so closing it during
    // recovery produces runner-internal fixture errors. Audit work happens on
    // disposable pages that can be killed and recreated independently.
    let auditPage = await browser.newPage();
    auditPage.setDefaultTimeout(20_000);
    const fullExportList = buildExportList();
    const nonvisualExclusions = buildNonvisualExclusions();
    const fullRecipeList = buildRecipeList();
    const exportList = fullExportList.filter((entry) =>
      auditFiltered(entry.id, entry.exportName)
    );
    const recipeList = fullRecipeList.filter((entry) =>
      auditFiltered(entry.id, entry.exportName)
    );
    if (targetedRun && exportList.length + recipeList.length === 0) {
      throw new Error(
        `AUDIT_ONLY selected zero runtime items: ${[...auditOnlyFilter].sort().join(", ")}`
      );
    }
    const storyEntries = exportList.length > 0 ? await buildStoryIndex() : [];
    verifyStoryIndexHasNoCertificationRoutes(storyEntries);
    const storyResolutions = verifyStoryResolutionIntegrity(
      exportList,
      storyEntries
    );
    const all = [
      ...exportList.map((entry) => ({ ...entry, isRecipe: false })),
      ...recipeList.map((entry) => ({ ...entry, isRecipe: true })),
    ];

    const unresolved: string[] = [];
    const supportingEvidence = buildSupportingEvidence();
    const summary: {
      generatedAt: string;
      run: {
        runId: string;
        mode: "full" | "targeted";
        filters: string[];
        summaryPath: string;
        visualCaptureRoot: string;
      };
      inventory: {
        authoritative: {
          publicExportScope: number;
          visuallyRenderableComponentExports: number;
          nonvisualPublicExports: number;
          recipes: number;
          visualGateTotal: number;
          auditedTotal: number;
        };
        baseline: {
          publicExportScope: number;
          visuallyRenderableComponentExports: number;
          nonvisualPublicExports: number;
          recipes: number;
          visualGateTotal: number;
          auditedTotal: number;
        };
        discrepancy: {
          authoritativePublicExportScope: number;
          staleClaim: number;
          delta: number;
          note: string;
        };
        evaluated: {
          visuallyRenderableComponentExports: number;
          recipes: number;
          visualGateTotal: number;
        };
      };
      nonvisualExclusions: NonvisualExclusion[];
      statusCounts: { passed: number; blocked: number };
      staticSweep: Array<Record<string, unknown>>;
      matrixEvidence: Array<Record<string, unknown>>;
      exports: Array<Record<string, unknown>>;
    } = {
      generatedAt: auditGeneratedAt,
      run: {
        runId: auditRunId,
        mode: targetedRun ? "targeted" : "full",
        filters: [...auditOnlyFilter].sort(),
        summaryPath: `reports/audit/${auditSummaryFilename}`,
        visualCaptureRoot: toRepoRelativePath(reportedVisualEvidenceRoot),
      },
      inventory: {
        authoritative: {
          publicExportScope: fullExportList.length + nonvisualExclusions.length,
          visuallyRenderableComponentExports: fullExportList.length,
          nonvisualPublicExports: nonvisualExclusions.length,
          recipes: fullRecipeList.length,
          visualGateTotal: fullExportList.length + fullRecipeList.length,
          auditedTotal:
            fullExportList.length +
            nonvisualExclusions.length +
            fullRecipeList.length,
        },
        baseline: {
          publicExportScope: authoritativePublicExportScopeCount,
          visuallyRenderableComponentExports: authoritativeVisualExportCount,
          nonvisualPublicExports: authoritativeNonvisualExportCount,
          recipes: authoritativeRecipeCount,
          visualGateTotal: authoritativeVisualTotal,
          auditedTotal: authoritativeAuditedTotal,
        },
        discrepancy: {
          authoritativePublicExportScope:
            fullExportList.length + nonvisualExclusions.length,
          staleClaim: staleComponentLikeExportClaim,
          delta:
            fullExportList.length +
            nonvisualExclusions.length -
            staleComponentLikeExportClaim,
          note: `${staleComponentLikeExportClaim} is the stale historical claim; reports/public-export-audit.json establishes ${fullExportList.length} visually renderable exports + ${nonvisualExclusions.length} explicitly nonvisual public export = ${fullExportList.length + nonvisualExclusions.length} public export scope`,
        },
        evaluated: {
          visuallyRenderableComponentExports: exportList.length,
          recipes: recipeList.length,
          visualGateTotal: all.length,
        },
      },
      nonvisualExclusions,
      statusCounts: { passed: 0, blocked: 0 },
      staticSweep: supportingEvidence.staticSweep,
      matrixEvidence: supportingEvidence.matrixEvidence,
      exports: [],
    };

    if (!targetedRun) {
      if (
        fullExportList.length !== authoritativeVisualExportCount ||
        nonvisualExclusions.length !== authoritativeNonvisualExportCount ||
        fullRecipeList.length !== authoritativeRecipeCount ||
        all.length !== authoritativeVisualTotal ||
        all.length + nonvisualExclusions.length !== authoritativeAuditedTotal
      ) {
        throw new Error(
          `authoritative inventory changed: expected ${authoritativeVisualExportCount} visual exports + ${authoritativeNonvisualExportCount} nonvisual export + ${authoritativeRecipeCount} recipes = ${authoritativeAuditedTotal} audited (${authoritativeVisualTotal} visual), received ${fullExportList.length} + ${nonvisualExclusions.length} + ${fullRecipeList.length}`
        );
      }
      const [nonvisual] = nonvisualExclusions;
      if (
        nonvisual?.name !== "QuantumNeuromorphicEngine" ||
        nonvisual.sourcePath !==
          "src/components/quantum/QuantumNeuromorphicEngine.ts" ||
        nonvisual.apiTestEvidence.status !== "pass"
      ) {
        throw new Error(
          "authoritative nonvisual exclusion must be the tested QuantumNeuromorphicEngine computation class"
        );
      }
      if (all.length !== fullExportList.length + fullRecipeList.length) {
        throw new Error(
          "full runtime audit did not select the complete inventory"
        );
      }
    }

    const failureDetails: Array<{ id: string; name: string; reason: string }> =
      [];
    const exportIds = new Set<string>();

    for (const item of all) {
      const itemStartedAt = Date.now();
      const resolvedStory = item.isRecipe
        ? null
        : (storyResolutions.get(item.id) ?? null);
      const storyId = resolvedStory?.id ?? null;
      if (!item.isRecipe && !storyId) {
        unresolved.push(item.exportName);
        summary.statusCounts.blocked += 1;
        summary.exports.push({
          id: item.id,
          name: item.exportName,
          kind: "export",
          status: "blocked",
          render: "fail",
          tokens: "fail",
          layout: "fail",
          artifacts: artifactPathsForItem(item, true),
          reasons: ["no resolvable Storybook story id"],
        });
        failureDetails.push({
          id: item.id,
          name: item.exportName,
          reason: "no resolvable Storybook story id",
        });
        recordProgress({
          id: item.id,
          name: item.exportName,
          kind: "export",
          status: "blocked",
          render: "fail",
          tokens: "fail",
          layout: "fail",
        });
        continue;
      }

      let ok = true;
      const reasons: string[] = [];
      let storySurfaceFound = false;
      let anyTokens = true;
      let anyLayout = true;
      const viewportEvidence: Array<Record<string, unknown>> = [];

      if (storyId) {
        for (const viewport of viewports) {
          const remainingItemMs =
            itemTransactionTimeoutMs - (Date.now() - itemStartedAt);
          const transactionTimeoutMs = Math.max(
            1,
            Math.min(viewportTransactionTimeoutMs, remainingItemMs)
          );
          const forceThisViewportTimeout = Boolean(
            forcedTimeoutTarget &&
              (item.id.toLowerCase() === forcedTimeoutTarget ||
                item.exportName.toLowerCase() === forcedTimeoutTarget) &&
              viewport.name === "desktop"
          );
          try {
            const transaction = await runBounded(
              (async () => {
                if (remainingItemMs <= 0) {
                  throw new AuditTransactionTimeoutError(
                    "item",
                    itemTransactionTimeoutMs,
                    `${item.exportName} exceeded ${itemTransactionTimeoutMs}ms item deadline`
                  );
                }
                if (forceThisViewportTimeout) {
                  await new Promise<never>(() => undefined);
                }
                const result = await evaluateStory(
                  auditPage,
                  storyId,
                  viewport
                );
                const certificationFailure = result.certificationComponent
                  ? `${viewport.name}: certification placeholder rendered for ${result.certificationComponent} instead of the exported component ${item.exportName}`
                  : null;
                const semanticVisualization =
                  semanticVisualizationTargetIds.has(item.id);
                const tokenFailures = checkTokenInvariants(
                  result.surfaces,
                  result.texts,
                  result.paints
                ).filter(
                  (failure) =>
                    !semanticVisualization ||
                    !isSemanticVisualizationPixelFinding(failure)
                );
                const layoutFailures = result.layoutIssues.map(
                  (issue) => `${issue.type}: ${issue.detail}`
                );
                layoutFailures.push(
                  ...result.presentationIssues.map(
                    (issue) => `${issue.type}: ${issue.detail}`
                  )
                );
                if (semanticVisualization) {
                  for (let index = layoutFailures.length - 1; index >= 0; index -= 1) {
                    if (isSemanticVisualizationPixelFinding(layoutFailures[index])) {
                      layoutFailures.splice(index, 1);
                    }
                  }
                }
                const recipePresentation =
                  item.isRecipe ||
                  item.id.startsWith("recipe-") ||
                  item.sourcePath.startsWith("recipes/");
                if (recipePresentation) {
                  for (let index = layoutFailures.length - 1; index >= 0; index -= 1) {
                    if (layoutFailures[index].startsWith("primary-output-viewport-cutoff:")) {
                      layoutFailures.splice(index, 1);
                    }
                  }
                }
                tokenFailures.push(
                  ...checkViewportColorCensus(result.viewportColorCensus).filter(
                    (failure) =>
                      !semanticVisualization ||
                      !isSemanticVisualizationPixelFinding(failure)
                  )
                );
                if (captureAllVisuals) {
                  await writeVisualEvidence(
                    auditPage,
                    item,
                    {
                      runId: auditRunId,
                      storyId,
                      recipeHarness: null,
                    },
                    viewport,
                    result
                  );
                }
                if (
                  tokenFailures.length > 0 ||
                  layoutFailures.length > 0 ||
                  certificationFailure !== null ||
                  result.consoleErrors.length > 0 ||
                  result.pageErrors.length > 0
                ) {
                  await writeFailureArtifacts(auditPage, item, viewport, [
                    ...reasons,
                    ...tokenFailures.map(
                      (failure) => `${viewport.name}: ${failure}`
                    ),
                    ...layoutFailures.map(
                      (failure) => `${viewport.name}: ${failure}`
                    ),
                  ]);
                }
                return {
                  result,
                  certificationFailure,
                  tokenFailures,
                  layoutFailures,
                };
              })(),
              forceThisViewportTimeout ? 1_000 : transactionTimeoutMs,
              remainingItemMs <= viewportTransactionTimeoutMs
                ? "item"
                : "viewport",
              `${item.exportName} ${viewport.name}`
            );
            const {
              result,
              certificationFailure,
              tokenFailures,
              layoutFailures,
            } = transaction;
            if (
              result.surfaces.some(
                (s) =>
                  s.surfaceKind === "backdrop" ||
                  s.surfaceKind === "glass-surface" ||
                  s.surfaceKind === "liquid"
              )
            ) {
              storySurfaceFound = true;
            }
            if (tokenFailures.length > 0) {
              anyTokens = false;
              reasons.push(
                ...tokenFailures.map((f) => `${viewport.name}: ${f}`)
              );
            }
            if (layoutFailures.length > 0) {
              anyLayout = false;
              reasons.push(
                ...layoutFailures.map((f) => `${viewport.name}: ${f}`)
              );
            }
            if (certificationFailure) {
              ok = false;
              reasons.push(certificationFailure);
            }
            viewportEvidence.push({
              viewport: viewport.name,
              surfaceCount: result.surfaces.length,
              textAlphaCount: result.textAlphas.length,
              paintInspectionCount: result.paints.length,
              presentationIssueCount: result.presentationIssues.length,
              viewportColorCensus: result.viewportColorCensus,
              consoleErrors: result.consoleErrors,
              pageErrors: result.pageErrors,
            });
            if (
              result.consoleErrors.length > 0 ||
              result.pageErrors.length > 0
            ) {
              ok = false;
              reasons.push(
                ...result.consoleErrors.map(
                  (e) => `${viewport.name}: console error: ${e}`
                ),
                ...result.pageErrors.map(
                  (e) => `${viewport.name}: page error: ${e}`
                )
              );
            }
          } catch (error) {
            if (!(error instanceof AuditTransactionTimeoutError)) throw error;
            ok = false;
            // A timed-out transaction produced no trustworthy token/layout
            // inspection, so all three dimensions fail closed.
            anyTokens = false;
            anyLayout = false;
            storySurfaceFound = false;
            const timeoutReason = `${viewport.name}: ${error.message}`;
            reasons.push(timeoutReason);
            viewportEvidence.push({
              viewport: viewport.name,
              surfaceCount: 0,
              textAlphaCount: 0,
              paintInspectionCount: 0,
              consoleErrors: [],
              pageErrors: [],
              timeout: { scope: error.scope, timeoutMs: error.timeoutMs },
            });
            writeTimeoutArtifact(
              item,
              { storyId, recipeHarness: null },
              viewport,
              timeoutReason,
              error
            );
            recordProgress({
              id: item.id,
              name: item.exportName,
              kind: "export",
              viewport: viewport.name,
              status: "timeout",
              render: "fail",
              tokens: "fail",
              layout: "fail",
              reasons: [timeoutReason],
            });
            auditPage = await replaceAuditPage(browser, auditPage);
          }
        }
      } else if (item.isRecipe) {
        for (const viewport of viewports) {
          const evidence = validateRecipeViewportEvidence(item, viewport);
          viewportEvidence.push(evidence);
          if (evidence.renderFailures.length > 0) {
            ok = false;
            reasons.push(
              ...evidence.renderFailures.map(
                (failure) => `${viewport.name}: ${failure}`
              )
            );
          }
          if (evidence.tokenFailures.length > 0) {
            anyTokens = false;
            reasons.push(
              ...evidence.tokenFailures.map(
                (failure) => `${viewport.name}: ${failure}`
              )
            );
          }
          if (evidence.layoutFailures.length > 0) {
            anyLayout = false;
            reasons.push(
              ...evidence.layoutFailures.map(
                (failure) => `${viewport.name}: ${failure}`
              )
            );
          }
          if (evidence.surfaceCount > 0) storySurfaceFound = true;
          if (captureAllVisuals && evidence.renderFailures.length === 0) {
            writeRecipeCaptureIdentity(item, viewport, auditRunId);
          }
        }
      }

      const passed = ok && anyTokens && anyLayout && storySurfaceFound;
      if (!passed) {
        summary.statusCounts.blocked += 1;
        const status = {
          status: "fail",
          render: ok && storySurfaceFound ? "pass" : "fail",
          tokens: anyTokens ? "pass" : "fail",
          layout: anyLayout ? "pass" : "fail",
          artifacts: artifactPathsForItem(item, true),
          reasons: [...new Set(reasons)],
        };
        summary.exports.push({
          id: item.id,
          name: item.exportName,
          kind: item.isRecipe ? "recipe" : "export",
          storyId,
          ...status,
          viewports: viewportEvidence,
        });
        failureDetails.push({
          id: item.id,
          name: item.exportName,
          reason: status.reasons.join(" | ") || "failed",
        });
        recordProgress({
          id: item.id,
          name: item.exportName,
          kind: item.isRecipe ? "recipe" : "export",
          status: "fail",
          render: status.render,
          tokens: status.tokens,
          layout: status.layout,
          reasons: status.reasons,
        });
      } else {
        summary.statusCounts.passed += 1;
        summary.exports.push({
          id: item.id,
          name: item.exportName,
          kind: item.isRecipe ? "recipe" : "export",
          storyId,
          status: "pass",
          render: "pass",
          tokens: "pass",
          layout: "pass",
          reasons: [],
          artifacts: artifactPathsForItem(item, false),
          viewports: viewportEvidence,
        });
        recordProgress({
          id: item.id,
          name: item.exportName,
          kind: item.isRecipe ? "recipe" : "export",
          status: "pass",
          render: "pass",
          tokens: "pass",
          layout: "pass",
          reasons: [],
        });
      }

      // Keep export ids unique per export name (aliases share a name).
      if (!item.isRecipe && exportIds.has(item.id)) {
        failureDetails.push({
          id: item.id,
          name: item.exportName,
          reason: "duplicate export id",
        });
        recordProgress({
          id: item.id,
          name: item.exportName,
          kind: "export",
          status: "fail",
          render: "pass",
          tokens: "pass",
          layout: "pass",
          reasons: ["duplicate export id"],
        });
      }
      exportIds.add(item.id);
    }

    await closePageBounded(auditPage);

    const passCount = summary.statusCounts.passed;
    const total = summary.inventory.evaluated.visualGateTotal;
    const cleanFullRun =
      !targetedRun && passCount === total && summary.statusCounts.blocked === 0;
    if (cleanFullRun) {
      if (captureAllVisuals) {
        const visualItems = summary.exports.map((entry) => {
          const kind = entry.kind as "export" | "recipe";
          const item = all.find((candidate) => candidate.id === entry.id);
          if (!item) {
            throw new Error(
              `cannot manifest missing runtime item ${String(entry.id)}`
            );
          }
          return kind === "export"
            ? {
                id: item.id,
                name: item.exportName,
                kind,
                sourcePath: item.sourcePath,
                storyId: String(entry.storyId),
              }
            : {
                id: item.id,
                name: item.exportName,
                kind,
                sourcePath: item.sourcePath,
                recipeHarness: item.isRecipe
                  ? item.recipeHarness
                  : "scripts/ci/verify-recipes-render.js",
              };
        });
        const manifest = buildFullVisualRunManifest({
          visualItems,
          nonvisualExclusions,
        });
        atomicWriteJson(
          path.join(visualCaptureRoot, "visual-run-manifest.json"),
          manifest
        );
        promoteFullVisualCapture();
        const stagedRoot = toRepoRelativePath(fullVisualStagingRoot);
        const canonicalRoot = toRepoRelativePath(canonicalVisualEvidenceRoot);
        summary.run.visualCaptureRoot = canonicalRoot;
        for (const entry of summary.exports) {
          if (!Array.isArray(entry.artifacts)) continue;
          entry.artifacts = entry.artifacts.map((artifact) =>
            typeof artifact === "string" &&
            (artifact === stagedRoot || artifact.startsWith(`${stagedRoot}/`))
              ? `${canonicalRoot}${artifact.slice(stagedRoot.length)}`
              : artifact
          );
        }
      }
    }
    atomicWriteJson(path.join(auditRoot, auditSummaryFilename), summary);
    if (cleanFullRun) {
      writeCleanFullRunReports(summary);
    }
    expect(
      passCount,
      `expected all ${total} exports/recipes to pass; failed: ${failureDetails
        .slice(0, 10)
        .map((f) => `${f.name}: ${f.reason}`)
        .join("; ")}`
    ).toBe(total);
    expect(summary.statusCounts.blocked).toBe(0);
  });
});
