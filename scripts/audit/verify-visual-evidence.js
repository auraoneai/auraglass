#!/usr/bin/env node
/*
 * Verify the opt-in CAPTURE_ALL_VISUALS evidence set.
 *
 * This intentionally has no native/image-library dependency: CI can run it
 * after Playwright without downloading another package.  It validates the PNG
 * header and decodes non-interlaced 8-bit PNGs so that "a PNG exists" cannot
 * be mistaken for visual evidence.
 *
 * Usage:
 *   node scripts/audit/verify-visual-evidence.js
 *   node scripts/audit/verify-visual-evidence.js --root reports/audit/visual-all
 */

"use strict";

const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const crypto = require("node:crypto");
const { evidenceDir } = require("../ci/lib/evidence-dir");

const repoRoot = process.cwd();
const expectedViewports = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};
const EXPECTED_VISUAL_EXPORTS = 470;
const EXPECTED_NONVISUAL_EXPORTS = 1;
const EXPECTED_RECIPES = 28;
const EXPECTED_AUDITED_ENTITIES = 499;
const EXPECTED_VISUAL_ITEMS = 498;
const manifestFilename = "visual-run-manifest.json";
// Captures occasionally share an identical image (especially visual aliases).
// Cache by content rather than path so repeated evidence does not multiply the
// comparatively expensive PNG raster walk.
const pngInspectionCache = new Map();

function parseArgs(argv) {
  const rootAt = argv.indexOf("--root");
  const root = rootAt >= 0 && argv[rootAt + 1]
    ? path.resolve(repoRoot, argv[rootAt + 1])
    : evidenceDir("audit/visual-all");
  return { root };
}

function readJson(relative) {
  const filePath = path.isAbsolute(relative)
    ? relative
    : path.join(repoRoot, relative);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function toExportId(name, fallbackIndex) {
  const base = String(name)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase()
    .replace(/^-+|-+$/g, "");
  return `${base}${fallbackIndex === undefined ? "" : `-${fallbackIndex}`}`;
}

function buildExpectedInventory() {
  const exportAudit = readJson(path.join(evidenceDir(), "public-export-audit.json"));
  const recipeEvidence = readJson(path.join(evidenceDir("3.3-release"), "recipe-render-evidence.json"));
  const visualTargets = readJson(path.join(evidenceDir(), "public-visual-target-manifest.json"));
  const seen = new Map();
  const exports = (exportAudit.entries || [])
    .filter((entry) => entry.isComponentLike)
    .map((entry) => {
      const repeat = seen.get(entry.exportName) || 0;
      seen.set(entry.exportName, repeat + 1);
      return {
        id: toExportId(entry.exportName, repeat > 0 ? repeat + 1 : undefined),
        name: entry.exportName,
        kind: "export",
        sourcePath: entry.sourcePath,
      };
    });
  const recipes = (recipeEvidence.screenshots || []).map((recipe) => ({
    id: toExportId(`recipe-${recipe.id}`),
    name: recipe.id,
    kind: "recipe",
    sourcePath: `recipes/${recipe.id}`,
  }));
  const nonvisual = (exportAudit.entries || [])
    .filter((entry) => entry.nonVisualReason)
    .map((entry) => ({
      name: entry.exportName,
      sourcePath: entry.sourcePath,
      reason: entry.nonVisualReason,
      kind: "nonvisual-export",
    }));
  return {
    exports,
    recipes,
    nonvisual,
    all: [...exports, ...recipes],
    authority: {
      publicExportAuditSha256: sha256File(
        path.join(evidenceDir(), "public-export-audit.json")
      ),
      recipeEvidenceSha256: sha256File(
        path.join(evidenceDir("3.3-release"), "recipe-render-evidence.json")
      ),
      publicVisualTargetManifestSha256: sha256File(
        path.join(evidenceDir(), "public-visual-target-manifest.json")
      ),
    },
    visualTargets,
  };
}

function validatePublicVisualTargetManifest(inventory) {
  const manifest = inventory.visualTargets;
  const result = { valid: false, reasons: [], entries: new Map() };
  if (!manifest || typeof manifest !== "object") {
    pushReason(result, "public visual target manifest is not an object");
    return result;
  }
  if (manifest.schemaVersion !== 1) pushReason(result, "public visual target manifest schemaVersion must equal 1");
  if (!Array.isArray(manifest.entries)) {
    pushReason(result, "public visual target manifest entries is missing or not an array");
    return result;
  }
  if (manifest.entries.length !== EXPECTED_VISUAL_EXPORTS) {
    pushReason(result, `public visual target manifest must list exactly ${EXPECTED_VISUAL_EXPORTS} visual exports, received ${manifest.entries.length}`);
  }
  const classifications = new Set(["canonical", "alias", "coveredBy"]);
  const coverageIds = new Set();
  for (const entry of manifest.entries) {
    if (!entry || typeof entry !== "object" || typeof entry.exportName !== "string") {
      pushReason(result, "public visual target manifest contains a malformed entry");
      continue;
    }
    if (result.entries.has(entry.exportName)) pushReason(result, `public visual target manifest has duplicate export ${entry.exportName}`);
    result.entries.set(entry.exportName, entry);
    if (typeof entry.sourcePath !== "string" || !entry.sourcePath) pushReason(result, `public visual target ${entry.exportName} is missing sourcePath`);
    if (!classifications.has(entry.classification)) pushReason(result, `public visual target ${entry.exportName} has invalid classification ${JSON.stringify(entry.classification)}`);
    if (typeof entry.coverageId !== "string" || !entry.coverageId) pushReason(result, `public visual target ${entry.exportName} is missing coverageId`);
    else if (coverageIds.has(entry.coverageId)) pushReason(result, `public visual target manifest has duplicate coverageId ${entry.coverageId}`);
    else coverageIds.add(entry.coverageId);
  }
  for (const item of inventory.exports) {
    const entry = result.entries.get(item.name);
    if (!entry) { pushReason(result, `public visual target manifest missing export ${item.name}`); continue; }
    if (entry.sourcePath !== item.sourcePath) pushReason(result, `public visual target ${item.name} sourcePath does not match public export audit`);
    if (entry.coverageId !== item.id) pushReason(result, `public visual target ${item.name} coverageId must equal runtime-compatible id ${item.id}`);
  }
  for (const exportName of result.entries.keys()) {
    if (!inventory.exports.some((item) => item.name === exportName)) pushReason(result, `public visual target manifest has export not classified component-like by public audit: ${exportName}`);
  }
  const exclusions = manifest.nonvisualExclusions;
  if (!Array.isArray(exclusions) || exclusions.length !== EXPECTED_NONVISUAL_EXPORTS) {
    pushReason(result, `public visual target manifest must contain exactly ${EXPECTED_NONVISUAL_EXPORTS} nonvisual exclusion`);
  } else {
    const expected = inventory.nonvisual[0];
    const exclusion = exclusions[0] || {};
    for (const [targetField, auditField] of [["exportName", "name"], ["sourcePath", "sourcePath"], ["reason", "reason"]]) {
      if (exclusion[targetField] !== expected[auditField]) pushReason(result, `public visual target nonvisual exclusion ${targetField} does not match public export audit`);
    }
    if (exclusion.classification !== "nonvisual") pushReason(result, "public visual target nonvisual exclusion classification must equal nonvisual");
  }
  result.valid = result.reasons.length === 0;
  return result;
}

function pushReason(target, reason) {
  if (!target.reasons.includes(reason)) target.reasons.push(reason);
}

function pngError(message) {
  const error = new Error(message);
  error.name = "PngEvidenceError";
  return error;
}

/** Decode enough PNG to examine dimensions and raster evidence. */
function inspectPng(file) {
  const source = fs.readFileSync(file);
  const digest = crypto.createHash("sha256").update(source).digest("hex");
  const cached = pngInspectionCache.get(digest);
  if (cached) return { ...cached, cacheHit: true };
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (source.length < 33 || !source.subarray(0, 8).equals(signature)) {
    throw pngError("not a PNG file");
  }
  let offset = 8;
  let ihdr;
  let palette;
  let transparency;
  const data = [];
  while (offset + 12 <= source.length) {
    const length = source.readUInt32BE(offset);
    const type = source.toString("ascii", offset + 4, offset + 8);
    const start = offset + 8;
    const end = start + length;
    if (end + 4 > source.length) throw pngError(`truncated ${type} chunk`);
    const chunk = source.subarray(start, end);
    if (type === "IHDR") {
      if (length !== 13) throw pngError("invalid IHDR length");
      ihdr = {
        width: chunk.readUInt32BE(0), height: chunk.readUInt32BE(4),
        bitDepth: chunk[8], colorType: chunk[9], compression: chunk[10],
        filter: chunk[11], interlace: chunk[12],
      };
    } else if (type === "PLTE") {
      palette = chunk;
    } else if (type === "tRNS") {
      transparency = chunk;
    } else if (type === "IDAT") {
      data.push(chunk);
    } else if (type === "IEND") {
      break;
    }
    offset = end + 4;
  }
  if (!ihdr || !ihdr.width || !ihdr.height || !data.length) {
    throw pngError("PNG is missing IHDR or IDAT data");
  }
  if (ihdr.bitDepth !== 8 || ihdr.interlace !== 0 || ihdr.compression !== 0 || ihdr.filter !== 0) {
    throw pngError(`unsupported PNG encoding (bitDepth=${ihdr.bitDepth}, interlace=${ihdr.interlace})`);
  }
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ihdr.colorType];
  if (!channels) throw pngError(`unsupported PNG color type ${ihdr.colorType}`);
  if (ihdr.colorType === 3 && !palette) throw pngError("indexed PNG is missing PLTE");
  const inflated = zlib.inflateSync(Buffer.concat(data));
  const rowBytes = ihdr.width * channels;
  if (inflated.length !== (rowBytes + 1) * ihdr.height) {
    throw pngError(`unexpected decoded PNG length ${inflated.length}`);
  }
  const pixels = Buffer.alloc(rowBytes * ihdr.height);
  let previous = Buffer.alloc(rowBytes);
  let inputAt = 0;
  for (let y = 0; y < ihdr.height; y += 1) {
    const filter = inflated[inputAt++];
    const row = Buffer.alloc(rowBytes);
    const scan = inflated.subarray(inputAt, inputAt + rowBytes);
    inputAt += rowBytes;
    for (let x = 0; x < rowBytes; x += 1) {
      const left = x >= channels ? row[x - channels] : 0;
      const up = previous[x];
      const upLeft = x >= channels ? previous[x - channels] : 0;
      if (filter === 0) row[x] = scan[x];
      else if (filter === 1) row[x] = (scan[x] + left) & 255;
      else if (filter === 2) row[x] = (scan[x] + up) & 255;
      else if (filter === 3) row[x] = (scan[x] + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left), pb = Math.abs(p - up), pc = Math.abs(p - upLeft);
        row[x] = (scan[x] + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft)) & 255;
      } else throw pngError(`unsupported PNG filter ${filter}`);
    }
    row.copy(pixels, y * rowBytes);
    previous = row;
  }
  const result = rasterStats(ihdr, pixels, palette, transparency);
  pngInspectionCache.set(digest, result);
  return { ...result, cacheHit: false };
}

function rasterStats(header, pixels, palette, transparency) {
  const total = header.width * header.height;
  const buckets = new Map();
  const gridX = 12, gridY = 12;
  const darkGrid = Array(gridX * gridY).fill(0);
  let nonTransparent = 0, opaqueDarkNavy = 0, sumLum = 0, sumLumSquared = 0;
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[header.colorType];
  for (let y = 0; y < header.height; y += 1) {
    for (let x = 0; x < header.width; x += 1) {
      const at = (y * header.width + x) * channels;
      let r, g, b, a;
      if (header.colorType === 0) r = g = b = pixels[at], a = 255;
      else if (header.colorType === 2) r = pixels[at], g = pixels[at + 1], b = pixels[at + 2], a = 255;
      else if (header.colorType === 3) {
        const index = pixels[at];
        r = palette[index * 3]; g = palette[index * 3 + 1]; b = palette[index * 3 + 2];
        a = transparency && index < transparency.length ? transparency[index] : 255;
      } else if (header.colorType === 4) r = g = b = pixels[at], a = pixels[at + 1];
      else r = pixels[at], g = pixels[at + 1], b = pixels[at + 2], a = pixels[at + 3];
      if (a > 0) nonTransparent += 1;
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      sumLum += luminance;
      sumLumSquared += luminance * luminance;
      // Quantization makes anti-aliased screenshots stable while still
      // distinguishing a rendered page from an all-one-color placeholder.
      const bucket = `${r >> 4},${g >> 4},${b >> 4},${a >> 4}`;
      buckets.set(bucket, (buckets.get(bucket) || 0) + 1);
      const darkNavy = a >= 250 && luminance < 68 && b >= r * 0.72 && b >= g * 0.42;
      if (darkNavy) {
        opaqueDarkNavy += 1;
        const cell = Math.min(gridY - 1, Math.floor(y * gridY / header.height)) * gridX +
          Math.min(gridX - 1, Math.floor(x * gridX / header.width));
        darkGrid[cell] += 1;
      }
    }
  }
  const dominantPixels = Math.max(0, ...buckets.values());
  const perCell = Math.ceil(header.width / gridX) * Math.ceil(header.height / gridY);
  return {
    width: header.width, height: header.height, byteLength: pixels.length,
    opaquePixelRatio: Number((nonTransparent / total).toFixed(6)),
    uniqueColorBuckets: buckets.size,
    dominantColorRatio: Number((dominantPixels / total).toFixed(6)),
    luminanceStdDev: Number(Math.sqrt(Math.max(0, sumLumSquared / total - (sumLum / total) ** 2)).toFixed(3)),
    opaqueDarkNavyPixelRatio: Number((opaqueDarkNavy / total).toFixed(6)),
    maxDarkNavyGridRatio: Number((Math.max(0, ...darkGrid) / perCell).toFixed(6)),
  };
}

function cssColors(value) {
  const colors = [];
  const rgba = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/gi;
  const modern = /color\(\s*(?:srgb|display-p3|srgb-linear)\s+([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi;
  const unit = (raw, isRgb) => raw && raw.endsWith("%") ? Number.parseFloat(raw) / 100 * (isRgb ? 255 : 1) : Number(raw);
  let match;
  while ((match = rgba.exec(String(value)))) {
    colors.push({ r: Number(match[1]), g: Number(match[2]), b: Number(match[3]), a: match[4] === undefined ? 1 : unit(match[4], false) });
  }
  while ((match = modern.exec(String(value)))) {
    let r = unit(match[1], true), g = unit(match[2], true), b = unit(match[3], true);
    if (Math.max(r, g, b) <= 1) { r *= 255; g *= 255; b *= 255; }
    colors.push({ r, g, b, a: match[4] === undefined ? 1 : unit(match[4], false) });
  }
  return colors.filter((color) => Number.isFinite(color.r) && Number.isFinite(color.g) && Number.isFinite(color.b) && Number.isFinite(color.a));
}

function isDark(color) {
  return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b < 80;
}

function isWhiteFrost(color) {
  return color.a >= 0.015 && color.a <= 0.35 && color.r >= 150 && color.g >= 150 && color.b >= 150;
}

function filterComponent(filter, name) {
  const unit = name === "blur" ? "px" : "";
  const match = String(filter).match(new RegExp(`${name}\\(\\s*([\\d.]+)\\s*${unit}\\s*\\)`));
  return match ? Number(match[1]) : null;
}

function canonicalSurfaceFailures(surface, colors) {
  const failures = [];
  const kind = String(surface && surface.surfaceKind || "");
  const standard = String(surface && surface.backdropFilter || "none");
  const webkit = String(surface && surface.webkitBackdropFilter || "none");
  const requiresBackdrop = kind === "backdrop" || kind === "glass-surface";
  if (requiresBackdrop && (standard === "none" || webkit === "none")) {
    failures.push("surface lacks one or both computed backdrop-filter spellings");
  }
  if (standard !== "none" || webkit !== "none") {
    if (standard === "none" || webkit === "none" || standard !== webkit) {
      failures.push("standard/WebKit backdrop-filter values must both exist and match");
    }
    const filter = standard !== "none" ? standard : webkit;
    const blur = filterComponent(filter, "blur");
    const saturate = filterComponent(filter, "saturate");
    const brightness = filterComponent(filter, "brightness");
    const contrast = filterComponent(filter, "contrast");
    if (![16, 24, 32, 40, 48].includes(blur)) failures.push(`blur ${blur ?? "missing"} is outside canonical 16|24|32|40|48px scale`);
    if (saturate === null || saturate < 1.4) failures.push("saturate is missing or below 1.4");
    if (brightness === null || brightness < 1.0) failures.push("brightness is missing or below 1.0");
    if (contrast === null || contrast < 0.95 || contrast > 1.2) failures.push("contrast is missing or outside [0.95, 1.2]");
  }
  const borderWidth = Number.parseFloat(String(surface && surface.borderWidth || "0"));
  const borders = cssColors(surface && surface.borderTopColor);
  if (borderWidth > 0 && (!borders.length || borders.some((color) => color.a < 0.12))) {
    failures.push("visible border alpha is missing or below 0.12");
  }
  if (colors.some((color) => color.a >= 0.5 && isDark(color))) failures.push("surface contains opaque dark/navy material color");
  if (!colors.some(isWhiteFrost)) failures.push("surface lacks a translucent white-frost alpha proxy [0.015, 0.35]");
  return failures;
}

function sameIdentity(value, item, manifestItem, runId, expectedViewport) {
  const identity = value && value.identity && typeof value.identity === "object"
    ? value.identity
    : value;
  const reasons = [];
  const expected = {
    runId,
    id: item.id,
    name: item.name,
    kind: item.kind,
    sourcePath: item.sourcePath,
    storyId: manifestItem.storyId ?? null,
    recipeHarness: manifestItem.recipeHarness ?? null,
  };
  for (const [field, expectedValue] of Object.entries(expected)) {
    if (!(field in identity)) reasons.push(`computed identity missing ${field}`);
    else if ((identity[field] ?? null) !== expectedValue) {
      reasons.push(`computed identity ${field}=${JSON.stringify(identity[field] ?? null)} != ${JSON.stringify(expectedValue)}`);
    }
  }
  const viewport = value.viewport || identity.viewport || {};
  if (
    viewport.name !== expectedViewport.name ||
    viewport.width !== expectedViewport.width ||
    viewport.height !== expectedViewport.height
  ) {
    reasons.push(
      `computed viewport ${String(viewport.name)} ${String(viewport.width)}x${String(viewport.height)} != ${expectedViewport.name} ${expectedViewport.width}x${expectedViewport.height}`
    );
  }
  return reasons;
}

function inspectStyles(file, expectedViewport, item, manifestItem, runId) {
  const result = {
    exists: fs.existsSync(file), valid: false, surfaceCount: 0,
    frostProxyCount: 0, surfacesWithoutWhiteFrostCount: 0,
    opaqueDarkStyleCount: 0, geometryCount: 0, layoutIssueCount: 0,
    consoleErrorCount: 0, pageErrorCount: 0, reasons: [],
  };
  if (!result.exists) { pushReason(result, "missing computed-styles JSON"); return result; }
  let data;
  try { data = JSON.parse(fs.readFileSync(file, "utf8")); } catch (error) { pushReason(result, `invalid computed-styles JSON: ${error.message}`); return result; }
  if (!data || typeof data !== "object") { pushReason(result, "computed-styles JSON is not an object"); return result; }
  for (const reason of sameIdentity(data, item, manifestItem, runId, expectedViewport)) pushReason(result, reason);
  for (const field of ["surfaces", "layoutIssues", "textAlphas", "consoleErrors", "pageErrors"]) {
    if (!Array.isArray(data[field])) pushReason(result, `computed-styles field ${field} is missing or not an array`);
  }
  if (result.reasons.length) return result;
  result.surfaceCount = data.surfaces.length;
  // Recipe pages are intentionally document-scrollable at the certification
  // viewports. The runtime gate and the independent four-viewport recipe gate
  // both classify primary-output-viewport-cutoff as normal below-fold flow for
  // recipes; keep the evidence verifier aligned with that exact contract while
  // continuing to fail every other captured layout issue.
  const actionableLayoutIssues = item.kind === "recipe"
    ? data.layoutIssues.filter(
        (issue) => issue && issue.type !== "primary-output-viewport-cutoff",
      )
    : data.layoutIssues;
  result.layoutIssueCount = actionableLayoutIssues.length;
  result.consoleErrorCount = data.consoleErrors.length;
  result.pageErrorCount = data.pageErrors.length;
  if (!result.surfaceCount) pushReason(result, "no surface records: no geometric/frost evidence");
  if (result.layoutIssueCount) pushReason(result, `${result.layoutIssueCount} captured layout issue(s)`);
  if (result.consoleErrorCount) pushReason(result, `${result.consoleErrorCount} captured console error(s)`);
  if (result.pageErrorCount) pushReason(result, `${result.pageErrorCount} captured page error(s)`);
  const surfaceInvariantExamples = [];
  for (const [surfaceIndex, surface] of data.surfaces.entries()) {
    const width = Number(surface && surface.width), height = Number(surface && surface.height);
    if (Number.isFinite(width) && Number.isFinite(height) && width > 1 && height > 1) result.geometryCount += 1;
    else pushReason(result, "surface record lacks non-zero geometry");
    const values = [surface && surface.backgroundColor, surface && surface.backgroundImage]
      .concat(Array.isArray(surface && surface.backgroundImages) ? surface.backgroundImages : []);
    const colors = values.flatMap(cssColors);
    const invariantFailures = canonicalSurfaceFailures(surface, colors);
    const frostColors = colors.filter(isWhiteFrost);
    result.frostProxyCount += frostColors.length;
    if (!frostColors.length) result.surfacesWithoutWhiteFrostCount += 1;
    result.opaqueDarkStyleCount += colors.filter((color) => color.a >= 0.5 && isDark(color)).length;
    if (invariantFailures.length && surfaceInvariantExamples.length < 5) {
      const label = String(surface && (surface.className || surface.tag || surface.role) || `surface-${surfaceIndex + 1}`).trim().replace(/\s+/g, ".");
      surfaceInvariantExamples.push(`${label || `surface-${surfaceIndex + 1}`}: ${invariantFailures.join(", ")}`);
    }
  }
  if (!result.geometryCount) pushReason(result, "no non-zero surface geometry records");
  if (result.surfacesWithoutWhiteFrostCount) {
    pushReason(
      result,
      `${result.surfacesWithoutWhiteFrostCount}/${result.surfaceCount} surface record(s) lack their own translucent white-frost alpha proxy (alpha 0.015–0.35)`,
    );
  }
  if (result.opaqueDarkStyleCount) pushReason(result, `${result.opaqueDarkStyleCount} opaque dark/navy style color(s) in surface records`);
  if (surfaceInvariantExamples.length) pushReason(result, `surface invariant failure(s): ${surfaceInvariantExamples.join("; ")}`);
  result.valid = result.reasons.length === 0;
  return result;
}

function inspectViewport(root, item, manifestItem, runId, viewportName, expectedViewport) {
  const directory = path.join(root, item.id);
  const pngPath = path.join(directory, `${viewportName}.png`);
  const stylesPath = path.join(directory, `${viewportName}.computed-styles.json`);
  const out = { viewport: viewportName, png: { exists: fs.existsSync(pngPath), valid: false, darkCanvasDetected: false, stats: null, reasons: [] }, styles: inspectStyles(stylesPath, { name: viewportName, ...expectedViewport }, item, manifestItem, runId), passed: false, reasons: [] };
  if (!out.png.exists) pushReason(out.png, "missing screenshot PNG");
  else {
    try {
      out.png.stats = inspectPng(pngPath);
      const stats = out.png.stats;
      if (stats.width !== expectedViewport.width || stats.height !== expectedViewport.height) pushReason(out.png, `image dimension mismatch (${stats.width}x${stats.height}, expected ${expectedViewport.width}x${expectedViewport.height})`);
      if (stats.opaquePixelRatio < 0.01) pushReason(out.png, "image is effectively transparent");
      if (stats.uniqueColorBuckets < 2 || (stats.dominantColorRatio > 0.995 && stats.luminanceStdDev < 1)) pushReason(out.png, "image is visually blank or a single-color placeholder");
      // Preserve the screen-level dark-canvas measurement for review, but do
      // not use it to condemn an otherwise canonical surface. The certification
      // contract explicitly permits dark canvases; anti-navy applies to the
      // recorded glass-surface fills, which inspectStyles validates separately.
      out.png.darkCanvasDetected =
        stats.opaqueDarkNavyPixelRatio > 0.55 &&
        stats.maxDarkNavyGridRatio > 0.9;
      out.png.valid = out.png.reasons.length === 0;
    } catch (error) {
      pushReason(out.png, error.message || String(error));
    }
  }
  out.reasons = [...out.png.reasons, ...out.styles.reasons];
  out.passed = out.png.valid && out.styles.valid;
  return out;
}

function valueAt(object, paths) {
  for (const pathParts of paths) {
    let value = object;
    for (const part of pathParts) value = value && value[part];
    if (value !== undefined) return value;
  }
  return undefined;
}

function validateRunManifest(root, inventory) {
  const file = path.join(root, manifestFilename);
  const result = { file: path.relative(repoRoot, file), exists: fs.existsSync(file), valid: false, runId: null, sourceFingerprint: null, reasons: [], manifest: null, visualItems: new Map() };
  if (!result.exists) {
    pushReason(result, `missing ${manifestFilename}; evidence provenance cannot be established`);
    return result;
  }
  try {
    result.manifest = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    pushReason(result, `invalid ${manifestFilename}: ${error.message}`);
    return result;
  }
  const manifest = result.manifest;
  if (!manifest || typeof manifest !== "object") {
    pushReason(result, "run manifest is not an object");
    return result;
  }
  if (!Number.isInteger(manifest.schemaVersion) || manifest.schemaVersion < 1) pushReason(result, "run manifest schemaVersion must be a positive integer");
  if (typeof manifest.runId !== "string" || !manifest.runId.trim()) pushReason(result, "run manifest runId is missing");
  else result.runId = manifest.runId;
  if (typeof manifest.generatedAt !== "string" || Number.isNaN(Date.parse(manifest.generatedAt))) pushReason(result, "run manifest generatedAt is missing or invalid");
  if (manifest.scope !== "full") pushReason(result, `run manifest scope must be full, received ${JSON.stringify(manifest.scope)}`);
  if (typeof manifest.sourceFingerprint !== "string" || !manifest.sourceFingerprint.trim()) pushReason(result, "run manifest sourceFingerprint is missing");
  else result.sourceFingerprint = manifest.sourceFingerprint;

  const audited = valueAt(manifest, [["inventory", "audited"]]);
  if (!audited || audited.total !== EXPECTED_AUDITED_ENTITIES || audited.visual !== EXPECTED_VISUAL_ITEMS || audited.nonvisual !== EXPECTED_NONVISUAL_EXPORTS) {
    pushReason(result, `run manifest audited inventory must be ${EXPECTED_AUDITED_ENTITIES} total / ${EXPECTED_VISUAL_ITEMS} visual / ${EXPECTED_NONVISUAL_EXPORTS} nonvisual`);
  }
  const hashes = valueAt(manifest, [["inventory", "hashes"]]) || {};
  for (const [field, expected] of Object.entries(inventory.authority)) {
    if (hashes[field] !== expected) pushReason(result, `run manifest inventory hash ${field} does not match current authoritative artifact`);
  }

  const manifestVisualItems = valueAt(manifest, [["inventory", "visualItems"], ["items"]]);
  if (!Array.isArray(manifestVisualItems)) {
    pushReason(result, "run manifest visualItems is missing or not an array");
  } else {
    if (manifestVisualItems.length !== EXPECTED_VISUAL_ITEMS) pushReason(result, `run manifest must list exactly ${EXPECTED_VISUAL_ITEMS} visual items, received ${manifestVisualItems.length}`);
    for (const entry of manifestVisualItems) {
      if (!entry || typeof entry !== "object" || typeof entry.id !== "string") {
        pushReason(result, "run manifest contains a malformed visual item");
        continue;
      }
      if (result.visualItems.has(entry.id)) pushReason(result, `run manifest has duplicate visual id ${entry.id}`);
      result.visualItems.set(entry.id, entry);
    }
    for (const item of inventory.all) {
      const entry = result.visualItems.get(item.id);
      if (!entry) { pushReason(result, `run manifest missing visual item ${item.id}`); continue; }
      for (const field of ["id", "name", "kind", "sourcePath"]) {
        if (entry[field] !== item[field]) pushReason(result, `run manifest ${item.id} ${field} does not match authoritative inventory`);
      }
      const hasStory = typeof entry.storyId === "string" && entry.storyId.trim().length > 0;
      const hasHarness = typeof entry.recipeHarness === "string" && entry.recipeHarness.trim().length > 0;
      if ((item.kind === "export" && (!hasStory || hasHarness)) || (item.kind === "recipe" && (!hasHarness || hasStory))) {
        pushReason(result, `run manifest ${item.id} must have exactly its ${item.kind === "export" ? "storyId" : "recipeHarness"} provenance`);
      }
    }
    for (const id of result.visualItems.keys()) {
      if (!inventory.all.some((item) => item.id === id)) pushReason(result, `run manifest has unexpected visual item ${id}`);
    }
  }

  const exclusions = valueAt(manifest, [["inventory", "nonvisualExclusions"]]);
  if (!Array.isArray(exclusions) || exclusions.length !== EXPECTED_NONVISUAL_EXPORTS) {
    pushReason(result, `run manifest must contain exactly ${EXPECTED_NONVISUAL_EXPORTS} nonvisual exclusion`);
  } else {
    const expected = inventory.nonvisual[0];
    const exclusion = exclusions[0] || {};
    for (const field of ["name", "sourcePath", "reason"]) {
      if (exclusion[field] !== expected[field]) pushReason(result, `nonvisual exclusion ${field} does not match the authoritative classification`);
    }
    const evidence = exclusion.apiTestEvidence;
    if (!evidence || typeof evidence !== "object" || typeof evidence.path !== "string" || !evidence.path) {
      pushReason(result, "nonvisual exclusion lacks apiTestEvidence.path");
    } else {
      const evidencePath = path.resolve(repoRoot, evidence.path);
      if (!fs.existsSync(evidencePath)) pushReason(result, `nonvisual API evidence does not exist: ${evidence.path}`);
      if (evidence.status !== "pass") pushReason(result, "nonvisual API evidence status must be pass");
    }
  }
  result.valid = result.reasons.length === 0;
  return result;
}

function markdown(summary) {
  const lines = [
    "# Full visual-evidence verification",
    "",
    `**Status: ${summary.status.toUpperCase()}**`,
    "",
    `Generated: ${summary.generatedAt}`,
    "",
    "## Coverage",
    "",
    `- Audited entities: ${summary.inventory.expected.auditedTotal} (${summary.inventory.expected.visualExports} visual exports + ${summary.inventory.expected.recipes} recipes + ${summary.inventory.expected.nonvisualExports} explicit nonvisual exclusion)`,
    `- Screenshot-required visual entities: ${summary.inventory.expected.visualTotal}`,
    `- Found evidence directories: ${summary.inventory.foundDirectories}`,
    `- Fully verified: ${summary.counts.passed}/${summary.inventory.expected.visualTotal}`,
    `- Failed or incomplete: ${summary.counts.failed}`,
    "",
    "## Gate criteria",
    "",
    "The public visual-target manifest is the 470-symbol visual authority: every symbol must correspond exactly to the public-export audit and have a unique, runtime-compatible coverage ID. A full, atomic `visual-run-manifest.json` is required before screenshot evidence is considered. It must identify every visual entity by id, name, kind, source path, Storybook story or recipe harness, source fingerprint, and authoritative inventory hashes—including the public visual-target manifest hash. Every expected visual id must contain desktop/tablet/mobile PNGs at 1440×900, 768×1024, and 390×844 respectively, plus matching computed-style records carrying the same run and item identity. PNGs must decode and contain non-blank rendered pixels. Dark canvases are permitted and reported as `darkCanvasDetected`; anti-navy enforcement applies to the recorded glass surfaces themselves. Every individual recorded surface must have non-zero geometry and its own translucent white-frost alpha proxy (0.015–0.35), with no opaque dark/navy surface color and no captured layout/console/page errors. Missing, stale, malformed, or unexpected evidence fails this verifier.",
    "",
    "## Results",
    "",
    "| ID | Kind | Result | Detail |",
    "| --- | --- | --- | --- |",
  ];
  for (const item of summary.items) {
    const detail = item.reasons.length ? item.reasons.join("; ").replace(/\|/g, "\\|") : "all three viewports verified";
    lines.push(`| ${item.id} | ${item.kind} | ${item.status.toUpperCase()} | ${detail} |`);
  }
  lines.push("", "## Explicit nonvisual exclusion", "");
  for (const exclusion of summary.inventory.nonvisualExclusions) {
    lines.push(`- **${exclusion.name}** — \`${exclusion.sourcePath}\`. ${exclusion.reason} API evidence: ${exclusion.apiTestEvidence?.path || "missing"} (${exclusion.apiTestEvidence?.status || "missing"}).`);
  }
  if (summary.provenance.reasons.length) {
    lines.push("", "## Provenance failures", "", ...summary.provenance.reasons.map((reason) => `- ${reason}`));
  }
  if (summary.publicVisualTargets.reasons.length) {
    lines.push("", "## Public visual-target failures", "", ...summary.publicVisualTargets.reasons.map((reason) => `- ${reason}`));
  }
  lines.push("", "## Commands", "", "```sh", "CAPTURE_ALL_VISUALS=1 npx playwright test --config=playwright.visual-ci.config.ts tests/visual/design-system/token-purity-layout-audit.spec.ts", "npm run audit:visual:evidence", "```");
  return `${lines.join("\n")}\n`;
}

function main() {
  const { root } = parseArgs(process.argv.slice(2));
  const inventory = buildExpectedInventory();
  const publicVisualTargets = validatePublicVisualTargetManifest(inventory);
  const expectedCountMismatch =
    inventory.exports.length !== EXPECTED_VISUAL_EXPORTS ||
    inventory.recipes.length !== EXPECTED_RECIPES ||
    inventory.nonvisual.length !== EXPECTED_NONVISUAL_EXPORTS ||
    inventory.all.length !== EXPECTED_VISUAL_ITEMS;
  const directories = fs.existsSync(root) ? fs.readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name) : [];
  const provenance = validateRunManifest(root, inventory);
  const items = inventory.all.map((item) => {
    const manifestItem = provenance.visualItems.get(item.id) || {};
    const viewports = Object.entries(expectedViewports).map(([name, viewport]) => inspectViewport(root, item, manifestItem, provenance.runId, name, viewport));
    const reasons = viewports.flatMap((viewport) => viewport.reasons.map((reason) => `${viewport.viewport}: ${reason}`));
    const manifestReasons = provenance.valid ? [] : [`provenance: ${provenance.reasons.join("; ")}`];
    const targetReasons = publicVisualTargets.valid ? [] : [`public visual targets: ${publicVisualTargets.reasons.join("; ")}`];
    return { ...item, status: reasons.length || manifestReasons.length || targetReasons.length ? "fail" : "pass", reasons: [...reasons, ...manifestReasons, ...targetReasons], viewports };
  });
  const expectedIds = new Set(inventory.all.map((item) => item.id));
  const unexpectedDirectories = directories.filter((id) => !expectedIds.has(id)).sort();
  const directoryCountFailure = directories.length === EXPECTED_VISUAL_ITEMS
    ? null
    : `expected exactly ${EXPECTED_VISUAL_ITEMS} screenshot-required visual directories, found ${directories.length}`;
  if (directoryCountFailure) {
    for (const item of items) {
      item.status = "fail";
      item.reasons.push(directoryCountFailure);
    }
  }
  if (unexpectedDirectories.length) {
    for (const item of items) {
      item.status = "fail";
      item.reasons.push(`unexpected visual evidence directory/directories: ${unexpectedDirectories.join(", ")}`);
    }
  }
  const summary = {
    generatedAt: new Date().toISOString(), root: path.relative(repoRoot, root) || ".",
    status: "fail",
    inventory: {
      expected: { visualExports: inventory.exports.length, recipes: inventory.recipes.length, nonvisualExports: inventory.nonvisual.length, visualTotal: inventory.all.length, auditedTotal: inventory.all.length + inventory.nonvisual.length },
      baseline: { visualExports: EXPECTED_VISUAL_EXPORTS, recipes: EXPECTED_RECIPES, nonvisualExports: EXPECTED_NONVISUAL_EXPORTS, visualTotal: EXPECTED_VISUAL_ITEMS, auditedTotal: EXPECTED_AUDITED_ENTITIES },
      foundDirectories: directories.length,
      directoryCountValid: directoryCountFailure === null,
      unexpectedDirectories,
      nonvisualExclusions: inventory.nonvisual,
    },
    provenance: { file: provenance.file, valid: provenance.valid, runId: provenance.runId, sourceFingerprint: provenance.sourceFingerprint, reasons: provenance.reasons },
    publicVisualTargets: {
      file: path.join(evidenceDir(), "public-visual-target-manifest.json"),
      valid: publicVisualTargets.valid,
      sha256: inventory.authority.publicVisualTargetManifestSha256,
      entryCount: inventory.visualTargets.entries?.length ?? null,
      reasons: publicVisualTargets.reasons,
    },
    counts: { passed: items.filter((item) => item.status === "pass").length, failed: items.filter((item) => item.status === "fail").length },
    inventoryBaselineValid: !expectedCountMismatch,
    items,
  };
  if (expectedCountMismatch) {
    summary.counts.failed += 1;
    summary.inventoryBaselineFailure = `authoritative inventory changed: expected ${EXPECTED_VISUAL_EXPORTS} visual exports + ${EXPECTED_RECIPES} recipes + ${EXPECTED_NONVISUAL_EXPORTS} nonvisual exclusion, received ${inventory.exports.length} + ${inventory.recipes.length} + ${inventory.nonvisual.length}`;
  }
  summary.status = summary.counts.failed === 0 ? "pass" : "fail";
  fs.mkdirSync(root, { recursive: true });
  fs.writeFileSync(path.join(root, "visual-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  fs.writeFileSync(path.join(root, "visual-summary.md"), markdown(summary));
  console.log(`Visual evidence ${summary.status.toUpperCase()}: ${summary.counts.passed}/${summary.inventory.expected.visualTotal} screenshot-required items verified.`);
  console.log(`Wrote ${path.relative(repoRoot, path.join(root, "visual-summary.json"))}`);
  console.log(`Wrote ${path.relative(repoRoot, path.join(root, "visual-summary.md"))}`);
  process.exitCode = summary.status === "pass" ? 0 : 1;
}

main();
