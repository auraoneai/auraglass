#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const usage = `AuraGlass CLI

Usage:
  aura-glass list [--json]
  aura-glass info <recipe> [--json]
  aura-glass add <recipe|all> [--cwd <dir>] [--out <dir>] [--dry-run] [--force] [--json]
  aura-glass audit deps [--cwd <dir>] [--json]
  aura-glass audit imports [--cwd <dir>] [--json]
  aura-glass migrate icons --from lucide [--cwd <dir>] [--dry-run] [--write] [--json]
  aura-glass migrate radix [--cwd <dir>] [--dry-run] [--write] [--json]
  aura-glass migrate mui [--cwd <dir>] [--dry-run] [--write] [--json]
  aura-glass doctor [--cwd <dir>] [--json]

Examples:
  aura-glass list
  aura-glass info saas-dashboard
  aura-glass add ai-command-center
  aura-glass add all --out src/components/auraglass/recipes
  aura-glass audit deps --json
  aura-glass audit imports --cwd apps/web
  aura-glass migrate icons --from lucide --write
  aura-glass doctor
`;

const forbiddenPackages = [
  {
    id: "lucide-react",
    family: "Lucide",
    replacement: "aura-glass/icons",
    message: "Use AuraGlass first-party icons from aura-glass/icons.",
  },
  {
    id: "@radix-ui/",
    family: "Radix",
    replacement: "aura-glass/primitives and AuraGlass app-chrome components",
    prefix: true,
    message: "Use AuraGlass primitives, overlays, menu, select, tabs, tooltip, and app chrome.",
  },
  {
    id: "@mui/material",
    family: "MUI",
    replacement: "AuraGlass app shell, controls, forms, overlays, and workflow components",
    message: "Use AuraGlass core app chrome for target product surfaces.",
  },
  {
    id: "@mui/icons-material",
    family: "MUI icons",
    replacement: "aura-glass/icons",
    message: "Use AuraGlass first-party icons from aura-glass/icons.",
  },
  {
    id: "@material-ui/",
    family: "Material UI legacy",
    replacement: "AuraGlass app shell and workflow components",
    prefix: true,
    message: "Use AuraGlass core app chrome for target product surfaces.",
  },
  {
    id: "@material/",
    family: "Material components",
    replacement: "AuraGlass app shell and workflow components",
    prefix: true,
    message: "Use AuraGlass core app chrome for target product surfaces.",
  },
];

const lucideIconMap = {
  Activity: "ActivityIcon",
  AlertCircle: "AlertCircleIcon",
  AlertTriangle: "AlertTriangleIcon",
  Archive: "FolderIcon",
  ArrowDown: "ArrowDownIcon",
  ArrowDownIcon: "ArrowDownIcon",
  ArrowLeft: "ArrowLeftIcon",
  ArrowRight: "ArrowRightIcon",
  ArrowUp: "ArrowUpIcon",
  ArrowUpIcon: "ArrowUpIcon",
  BarChart: "BarChartIcon",
  BarChart3: "BarChartIcon",
  Bell: "BellIcon",
  Bold: "EditIcon",
  Bot: "BotIcon",
  Brain: "BrainIcon",
  Building2: "HomeIcon",
  Calendar: "CalendarIcon",
  Check: "CheckIcon",
  CheckCircle: "SuccessIcon",
  CheckCircle2: "SuccessIcon",
  ChevronDown: "ChevronDownIcon",
  ChevronLeft: "ChevronLeftIcon",
  ChevronRight: "ChevronRightIcon",
  ChevronUp: "ChevronUpIcon",
  Circle: "MinusIcon",
  Clock: "ActivityIcon",
  CloudUpload: "UploadIcon",
  Code2: "FileIcon",
  Columns3: "GridIcon",
  Command: "CommandIcon",
  Copy: "CopyIcon",
  CreditCard: "CreditCardIcon",
  Cursor: "CursorIcon",
  Database: "DatabaseIcon",
  DollarSign: "DollarIcon",
  Download: "DownloadIcon",
  Edit: "EditIcon",
  Error: "ErrorIcon",
  ExternalLink: "ExternalLinkIcon",
  Eye: "EyeIcon",
  EyeOff: "EyeOffIcon",
  File: "FileIcon",
  FileCheck2: "FileIcon",
  FilePenLine: "EditIcon",
  Filter: "FilterIcon",
  Folder: "FolderIcon",
  FolderKanban: "FolderIcon",
  FolderOpen: "FolderIcon",
  Gauge: "GaugeIcon",
  Grid: "GridIcon",
  Grid3X3: "GridIcon",
  GripVertical: "MoreVerticalIcon",
  Hand: "CursorIcon",
  Heart: "PresenceIcon",
  Home: "HomeIcon",
  Image: "ImageIcon",
  Info: "InfoIcon",
  Italic: "EditIcon",
  Keyboard: "CommandIcon",
  LayoutDashboard: "GridIcon",
  LineChart: "LineChartIcon",
  List: "ListIcon",
  Loader: "LoaderIcon",
  Loader2: "LoaderIcon",
  Lock: "LockIcon",
  Mail: "CommentIcon",
  Menu: "MenuIcon",
  MessageCircle: "CommentIcon",
  MessageSquare: "CommentIcon",
  MessageSquareText: "CommentIcon",
  Mic: "MicIcon",
  Minus: "MinusIcon",
  Model: "ModelIcon",
  MoreHorizontal: "MoreHorizontalIcon",
  MoreVertical: "MoreVerticalIcon",
  MousePointer2: "CursorIcon",
  Move: "CursorIcon",
  Music: "MusicIcon",
  Package: "PackageIcon",
  Palette: "SparkIcon",
  PanelsTopLeft: "SidebarIcon",
  Pause: "PauseIcon",
  Play: "PlayIcon",
  Plus: "AddIcon",
  Receipt: "ReceiptIcon",
  RefreshCw: "RefreshIcon",
  RotateCcw: "RefreshIcon",
  Save: "SaveIcon",
  Search: "SearchIcon",
  Settings: "SettingsIcon",
  Share: "ShareIcon",
  Share2: "ShareIcon",
  Shield: "ShieldIcon",
  ShieldCheck: "ShieldIcon",
  SkipBack: "SkipBackIcon",
  SkipForward: "SkipForwardIcon",
  Sparkles: "SparkIcon",
  Star: "SparkIcon",
  Stop: "StopIcon",
  Table: "TableIcon",
  Tag: "TagIcon",
  Target: "TargetIcon",
  ThumbsUp: "SuccessIcon",
  Trash: "TrashIcon",
  Trash2: "TrashIcon",
  Triangle: "AlertTriangleIcon",
  TrendingUp: "ArrowUpIcon",
  Underline: "EditIcon",
  Undo: "UndoIcon",
  Undo2: "UndoIcon",
  Unlock: "UnlockIcon",
  Upload: "UploadIcon",
  User: "UserIcon",
  UserRound: "UserIcon",
  Users: "UsersIcon",
  Video: "VideoIcon",
  Volume: "VolumeIcon",
  Volume2: "VolumeIcon",
  VolumeX: "VolumeMutedIcon",
  Wand: "WandIcon",
  X: "CloseIcon",
  Zap: "SparkIcon",
};

const radixReplacementMap = [
  {
    pattern: /^@radix-ui\/react-slot$/,
    replacement: "GlassSlot from aura-glass/primitives/slot",
  },
  {
    pattern: /^@radix-ui\/react-label$/,
    replacement: "GlassLabelPrimitive from aura-glass/primitives",
  },
  {
    pattern: /^@radix-ui\/react-dropdown-menu$/,
    replacement: "GlassDropdownMenu from aura-glass",
  },
  {
    pattern: /^@radix-ui\/react-select$/,
    replacement: "GlassSelect or GlassSelectCompound from aura-glass",
  },
  {
    pattern: /^@radix-ui\//,
    replacement: "AuraGlass primitives and app-chrome components",
  },
];

const muiReplacementMap = {
  AppBar: "GlassHeader or GlassAppShell",
  Toolbar: "GlassToolbar",
  Drawer: "GlassDrawer",
  Container: "GlassContainer",
  Grid: "GlassGrid",
  Button: "GlassButton",
  IconButton: "IconButton",
  Card: "GlassCard",
  Dialog: "GlassDialog",
  Menu: "GlassDropdownMenu or GlassMenubar",
  Select: "GlassSelect",
  Tabs: "GlassTabs",
  Tooltip: "GlassTooltip",
  Popover: "GlassPopover",
  TextField: "GlassInput, GlassTextarea, and GlassForm",
  Checkbox: "GlassCheckbox",
  RadioGroup: "GlassRadioGroup",
  Switch: "GlassSwitch",
  Alert: "GlassAlert",
  Chip: "GlassChip",
  Avatar: "GlassAvatar",
  Pagination: "GlassPagination",
  Skeleton: "GlassLoadingSkeleton",
  Table: "GlassDataTable",
};

const loadRegistry = () => {
  try {
    return require("../dist/registry/index.js");
  } catch (error) {
    try {
      return require(require.resolve("aura-glass/registry", { paths: [process.cwd()] }));
    } catch {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Unable to load the AuraGlass recipe registry. Run \`npm run build\` before using the local CLI. ${message}`
      );
    }
  }
};

const parseArgs = (argv) => {
  const args = [];
  const flags = {};
  const valueFlags = new Set(["cwd", "out", "from"]);

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) {
      args.push(value);
      continue;
    }

    const [rawKey, inlineValue] = value.slice(2).split("=", 2);
    if (valueFlags.has(rawKey)) {
      flags[rawKey] = inlineValue === undefined ? argv[index + 1] : inlineValue;
      if (inlineValue === undefined) {
        index += 1;
      }
    } else {
      flags[rawKey] = inlineValue === undefined ? true : inlineValue;
    }
  }

  return { args, flags };
};

const toJson = (value) => `${JSON.stringify(value, null, 2)}\n`;

const resolveCwd = (flags) => path.resolve(process.cwd(), flags.cwd || ".");

const ensureInsideCwd = (cwd, target) => {
  const relative = path.relative(cwd, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside the current project: ${target}`);
  }
};

const readJsonIfExists = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const packageMatchesForbidden = (name, forbidden) =>
  forbidden.prefix ? name.startsWith(forbidden.id) : name === forbidden.id;

const findForbiddenPackage = (name) =>
  forbiddenPackages.find((forbidden) => packageMatchesForbidden(name, forbidden));

const auditPackageDependencies = (cwd) => {
  const packageJsonPath = path.join(cwd, "package.json");
  const packageJson = readJsonIfExists(packageJsonPath);
  const findings = [];

  if (!packageJson) {
    return {
      cwd,
      packageJsonPath,
      packageName: null,
      findings,
      missingPackageJson: true,
    };
  }

  const sections = [
    "dependencies",
    "peerDependencies",
    "peerDependenciesMeta",
    "optionalDependencies",
    "devDependencies",
  ];

  for (const section of sections) {
    const entries = packageJson[section] || {};
    for (const name of Object.keys(entries)) {
      const forbidden = findForbiddenPackage(name);
      if (!forbidden) {
        continue;
      }

      findings.push({
        section,
        package: name,
        version: section === "peerDependenciesMeta" ? null : entries[name],
        severity: section === "devDependencies" ? "warning" : "error",
        family: forbidden.family,
        replacement: forbidden.replacement,
        message: forbidden.message,
      });
    }
  }

  return {
    cwd,
    packageJsonPath,
    packageName: packageJson.name || null,
    findings,
    missingPackageJson: false,
  };
};

const isIgnoredDirectory = (name) =>
  new Set([
    ".git",
    ".next",
    ".turbo",
    ".vercel",
    "build",
    "coverage",
    "dist",
    "node_modules",
    "storybook-static",
  ]).has(name);

const sourceExtensions = new Set([
  ".cjs",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".mts",
  ".ts",
  ".tsx",
]);

const walkSourceFiles = (root) => {
  const files = [];
  const stack = [root];

  while (stack.length > 0) {
    const current = stack.pop();
    let stat;
    try {
      stat = fs.statSync(current);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      if (isIgnoredDirectory(path.basename(current))) {
        continue;
      }

      for (const child of fs.readdirSync(current)) {
        stack.push(path.join(current, child));
      }
      continue;
    }

    if (stat.isFile() && sourceExtensions.has(path.extname(current))) {
      files.push(current);
    }
  }

  return files.sort();
};

const getLineNumber = (content, index) => content.slice(0, index).split(/\r?\n/).length;

const detectForbiddenImportSource = (source) => {
  for (const forbidden of forbiddenPackages) {
    if (forbidden.prefix ? source.startsWith(forbidden.id) : source === forbidden.id) {
      return forbidden;
    }
  }

  return null;
};

const auditImports = (cwd) => {
  const roots = ["src", "app", "pages", "components"]
    .map((name) => path.join(cwd, name))
    .filter((candidate) => fs.existsSync(candidate));
  const scanRoots = roots.length > 0 ? roots : [cwd];
  const findings = [];
  const importPattern =
    /(?:from\s*["']([^"']+)["']|require\(\s*["']([^"']+)["']\s*\)|import\(\s*["']([^"']+)["']\s*\))/g;

  for (const root of scanRoots) {
    for (const filePath of walkSourceFiles(root)) {
      const content = fs.readFileSync(filePath, "utf8");
      let match;
      while ((match = importPattern.exec(content))) {
        const source = match[1] || match[2] || match[3];
        const forbidden = detectForbiddenImportSource(source);
        if (!forbidden) {
          continue;
        }

        findings.push({
          file: path.relative(cwd, filePath),
          line: getLineNumber(content, match.index),
          source,
          family: forbidden.family,
          replacement: forbidden.replacement,
          message: forbidden.message,
        });
      }
    }
  }

  return {
    cwd,
    scannedRoots: scanRoots.map((root) => path.relative(cwd, root) || "."),
    findings,
  };
};

const parseNamedImports = (rawSpecifiers) =>
  rawSpecifiers
    .split(",")
    .map((specifier) => specifier.trim())
    .filter(Boolean)
    .map((specifier) => {
      const aliasMatch = specifier.match(/^([A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)$/);
      if (aliasMatch) {
        return { imported: aliasMatch[1], local: aliasMatch[2] };
      }

      return { imported: specifier, local: specifier };
    });

const buildIconImportReplacement = (rawSpecifiers) => {
  const specifiers = parseNamedImports(rawSpecifiers);
  const unresolved = specifiers.filter((specifier) => !lucideIconMap[specifier.imported]);

  if (specifiers.length === 0 || unresolved.length > 0) {
    return { replacement: null, specifiers, unresolved };
  }

  const nextSpecifiers = specifiers.map((specifier) => {
    const mappedName = lucideIconMap[specifier.imported];
    return mappedName === specifier.local
      ? mappedName
      : `${mappedName} as ${specifier.local}`;
  });

  return {
    replacement: `import { ${nextSpecifiers.join(", ")} } from 'aura-glass/icons';`,
    specifiers,
    unresolved,
  };
};

const migrateLucideIcons = (cwd, flags) => {
  const write = Boolean(flags.write) && !flags["dry-run"];
  const roots = ["src", "app", "pages", "components"]
    .map((name) => path.join(cwd, name))
    .filter((candidate) => fs.existsSync(candidate));
  const scanRoots = roots.length > 0 ? roots : [cwd];
  const files = [];
  const importPattern = /import\s*\{([^}]+)\}\s*from\s*["']lucide-react["']\s*;?/g;

  for (const root of scanRoots) {
    for (const filePath of walkSourceFiles(root)) {
      const original = fs.readFileSync(filePath, "utf8");
      let changed = original;
      const replacements = [];
      const unresolved = [];

      changed = changed.replace(importPattern, (statement, rawSpecifiers, offset) => {
        const result = buildIconImportReplacement(rawSpecifiers);
        if (!result.replacement) {
          unresolved.push({
            line: getLineNumber(original, offset),
            imports: result.specifiers.map((specifier) => specifier.imported),
            unmapped: result.unresolved.map((specifier) => specifier.imported),
          });
          return statement;
        }

        replacements.push({
          line: getLineNumber(original, offset),
          before: statement,
          after: result.replacement,
        });
        return result.replacement;
      });

      if (replacements.length > 0 || unresolved.length > 0) {
        if (write && changed !== original) {
          fs.writeFileSync(filePath, changed, "utf8");
        }

        files.push({
          file: path.relative(cwd, filePath),
          changed: write && changed !== original,
          wouldChange: changed !== original,
          replacements,
          unresolved,
        });
      }
    }
  }

  return {
    cwd,
    mode: write ? "write" : "dry-run",
    from: "lucide",
    files,
    changedFiles: files.filter((file) => file.changed).length,
    wouldChangeFiles: files.filter((file) => file.wouldChange).length,
    unresolvedFiles: files.filter((file) => file.unresolved.length > 0).length,
  };
};

const suggestRadixReplacement = (source) => {
  const match = radixReplacementMap.find((entry) => entry.pattern.test(source));
  return match ? match.replacement : "AuraGlass primitives and app-chrome components";
};

const extractNamedImportNames = (statement) => {
  const match = statement.match(/import\s*\{([^}]+)\}/);
  if (!match) {
    return [];
  }

  return parseNamedImports(match[1]).map((specifier) => specifier.imported);
};

const migrateByReport = (cwd, kind, flags) => {
  const audit = auditImports(cwd);
  const families =
    kind === "radix"
      ? new Set(["Radix"])
      : new Set(["MUI", "MUI icons", "Material UI legacy", "Material components"]);
  const findings = audit.findings
    .filter((finding) => families.has(finding.family))
    .map((finding) => ({
      ...finding,
      suggestion:
        kind === "radix"
          ? suggestRadixReplacement(finding.source)
          : "Replace imported Material components with the mapped AuraGlass component family.",
    }));

  return {
    cwd,
    mode: flags.write && !flags["dry-run"] ? "report-only-write-requested" : "dry-run",
    migration: kind,
    findings,
    note:
      kind === "radix"
        ? "Radix migration is currently report-first because behavior must be moved to AuraGlass primitives intentionally."
        : "MUI migration is currently report-first because component replacements are contextual.",
  };
};

const findReactVersionsInLockfile = (cwd) => {
  const lockPath = path.join(cwd, "package-lock.json");
  const lock = readJsonIfExists(lockPath);
  const versions = new Set();

  if (!lock || !lock.packages) {
    return [];
  }

  for (const [packagePath, meta] of Object.entries(lock.packages)) {
    if ((packagePath === "node_modules/react" || packagePath.endsWith("/node_modules/react")) && meta.version) {
      versions.add(meta.version);
    }
  }

  return [...versions].sort();
};

const loadInstalledAuraGlassPackage = (cwd) => {
  try {
    return require(require.resolve("aura-glass/package.json", { paths: [cwd] }));
  } catch {
    const localPackagePath = path.resolve(__dirname, "..", "package.json");
    return readJsonIfExists(localPackagePath);
  }
};

const runDoctor = (cwd) => {
  const checks = [];
  const depsAudit = auditPackageDependencies(cwd);
  const importsAudit = auditImports(cwd);
  const packageJson = readJsonIfExists(path.join(cwd, "package.json"));
  const auraGlassPackage = loadInstalledAuraGlassPackage(cwd);
  const packageName = packageJson && packageJson.name;
  const allDeps = {
    ...(packageJson && packageJson.dependencies),
    ...(packageJson && packageJson.devDependencies),
    ...(packageJson && packageJson.peerDependencies),
  };

  checks.push({
    id: "package-json",
    status: packageJson ? "pass" : "warning",
    message: packageJson ? `Found package.json for ${packageName || "unnamed project"}.` : "No package.json found.",
  });

  checks.push({
    id: "aura-glass-install",
    status: packageName === "aura-glass" || (allDeps && allDeps["aura-glass"]) ? "pass" : "warning",
    message:
      packageName === "aura-glass"
        ? "Running inside the AuraGlass package source."
        : allDeps && allDeps["aura-glass"]
          ? `aura-glass is declared as ${allDeps["aura-glass"]}.`
          : "aura-glass is not declared in this package.json.",
  });

  checks.push({
    id: "aura-glass-package",
    status: auraGlassPackage && auraGlassPackage.version ? "pass" : "warning",
    message:
      auraGlassPackage && auraGlassPackage.version
        ? `Resolved aura-glass package metadata version ${auraGlassPackage.version}.`
        : "Could not resolve aura-glass package metadata.",
  });

  const errorDeps = depsAudit.findings.filter((finding) => finding.severity === "error");
  const warningDeps = depsAudit.findings.filter((finding) => finding.severity !== "error");
  checks.push({
    id: "forbidden-core-ui-deps",
    status: errorDeps.length === 0 ? (warningDeps.length === 0 ? "pass" : "warning") : "fail",
    message:
      errorDeps.length === 0
        ? warningDeps.length === 0
          ? "No forbidden core UI packages found in package metadata."
          : `${warningDeps.length} forbidden core UI package reference(s) remain in devDependencies.`
        : `${errorDeps.length} forbidden core UI package reference(s) found in production-facing metadata.`,
  });

  checks.push({
    id: "forbidden-imports",
    status: importsAudit.findings.length === 0 ? "pass" : "fail",
    message:
      importsAudit.findings.length === 0
        ? "No forbidden MUI, Radix, or Lucide imports found in scanned source roots."
        : `${importsAudit.findings.length} forbidden MUI, Radix, or Lucide import(s) found.`,
  });

  const styleImportHits = auditStyleImports(cwd);
  checks.push({
    id: "styles-import",
    status: styleImportHits.length > 0 || packageName === "aura-glass" ? "pass" : "warning",
    message:
      styleImportHits.length > 0
        ? `Found aura-glass/styles import in ${styleImportHits.length} file(s).`
        : packageName === "aura-glass"
          ? "Package source uses generated styles; consumer apps should import aura-glass/styles once."
          : "No aura-glass/styles import found in scanned source roots.",
  });

  let recipeCount = 0;
  try {
    const { auraGlassRecipes } = loadRegistry();
    recipeCount = Array.isArray(auraGlassRecipes) ? auraGlassRecipes.length : 0;
  } catch {
    recipeCount = 0;
  }
  checks.push({
    id: "recipe-registry",
    status: recipeCount > 0 ? "pass" : "warning",
    message:
      recipeCount > 0
        ? `Resolved ${recipeCount} AuraGlass recipe(s).`
        : "Could not resolve AuraGlass recipe registry.",
  });

  const reactVersions = findReactVersionsInLockfile(cwd);
  checks.push({
    id: "duplicate-react-risk",
    status: reactVersions.length <= 1 ? "pass" : "warning",
    message:
      reactVersions.length <= 1
        ? reactVersions.length === 1
          ? `One React version in package-lock.json: ${reactVersions[0]}.`
          : "No package-lock React version evidence found."
        : `Multiple React versions found in package-lock.json: ${reactVersions.join(", ")}.`,
  });

  return {
    cwd,
    checks,
    dependencyFindings: depsAudit.findings,
    importFindings: importsAudit.findings,
    styleImportFiles: styleImportHits,
  };
};

const auditStyleImports = (cwd) => {
  const roots = ["src", "app", "pages", "components"]
    .map((name) => path.join(cwd, name))
    .filter((candidate) => fs.existsSync(candidate));
  const scanRoots = roots.length > 0 ? roots : [cwd];
  const hits = [];

  for (const root of scanRoots) {
    for (const filePath of walkSourceFiles(root)) {
      const content = fs.readFileSync(filePath, "utf8");
      if (content.includes("aura-glass/styles")) {
        hits.push(path.relative(cwd, filePath));
      }
    }
  }

  return hits.sort();
};

const writeRecipe = (recipe, flags) => {
  const cwd = resolveCwd(flags);
  const outDir = path.resolve(cwd, flags.out || "src/components/auraglass/recipes");
  ensureInsideCwd(cwd, outDir);

  const written = [];
  const skipped = [];

  for (const file of recipe.files) {
    const target = path.resolve(outDir, file.path);
    ensureInsideCwd(cwd, target);

    if (flags["dry-run"]) {
      written.push({ path: path.relative(cwd, target), bytes: Buffer.byteLength(file.content) });
      continue;
    }

    if (fs.existsSync(target) && !flags.force) {
      skipped.push(path.relative(cwd, target));
      continue;
    }

    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, file.content, "utf8");
    written.push({ path: path.relative(cwd, target), bytes: Buffer.byteLength(file.content) });
  }

  return { recipe: recipe.id, written, skipped };
};

const printAuditDeps = (report) => {
  if (report.missingPackageJson) {
    process.stdout.write(`No package.json found at ${report.packageJsonPath}\n`);
    return;
  }

  if (report.findings.length === 0) {
    process.stdout.write("No forbidden core UI dependencies found.\n");
    return;
  }

  process.stdout.write("Forbidden core UI dependencies:\n");
  for (const finding of report.findings) {
    process.stdout.write(
      `  ${finding.section}: ${finding.package}${finding.version ? `@${finding.version}` : ""} -> ${finding.replacement}\n`
    );
  }
};

const printAuditImports = (report) => {
  if (report.findings.length === 0) {
    process.stdout.write("No forbidden MUI, Radix, or Lucide imports found.\n");
    return;
  }

  process.stdout.write("Forbidden core UI imports:\n");
  for (const finding of report.findings) {
    process.stdout.write(
      `  ${finding.file}:${finding.line} imports ${finding.source} -> ${finding.replacement}\n`
    );
  }
};

const printMigrationReport = (report) => {
  if (report.from === "lucide") {
    process.stdout.write(
      `${report.mode === "write" ? "Updated" : "Would update"} ${report.mode === "write" ? report.changedFiles : report.wouldChangeFiles} file(s) from lucide-react to aura-glass/icons.\n`
    );
    if (report.unresolvedFiles > 0) {
      process.stdout.write(`${report.unresolvedFiles} file(s) include unmapped Lucide imports.\n`);
    }
    return;
  }

  process.stdout.write(`${report.migration} migration report: ${report.findings.length} finding(s).\n`);
  process.stdout.write(`${report.note}\n`);
  for (const finding of report.findings) {
    process.stdout.write(`  ${finding.file}:${finding.line} ${finding.source} -> ${finding.suggestion}\n`);
  }
};

const printDoctor = (report) => {
  process.stdout.write("AuraGlass doctor\n");
  for (const check of report.checks) {
    process.stdout.write(`  ${check.status.toUpperCase().padEnd(7)} ${check.id}: ${check.message}\n`);
  }
};

const main = () => {
  const { args, flags } = parseArgs(process.argv.slice(2));
  const command = args[0];

  if (!command || command === "help" || command === "--help" || command === "-h") {
    process.stdout.write(usage);
    return;
  }

  if (command === "list") {
    const { auraGlassRecipes } = loadRegistry();
    const rows = auraGlassRecipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      category: recipe.category,
      files: recipe.files.map((file) => file.path),
      imports: recipe.imports,
      peerDependencies: recipe.peerDependencies,
    }));

    if (flags.json) {
      process.stdout.write(toJson(rows));
      return;
    }

    process.stdout.write("Available AuraGlass recipes:\n");
    for (const recipe of rows) {
      process.stdout.write(`  ${recipe.id.padEnd(26)} ${recipe.title}\n`);
    }
    return;
  }

  if (command === "info") {
    const { getAuraGlassRecipe } = loadRegistry();
    const id = args[1];
    const recipe = getAuraGlassRecipe(id);
    if (!recipe) {
      throw new Error(`Unknown recipe "${id}". Run \`aura-glass list\` for valid ids.`);
    }

    if (flags.json) {
      process.stdout.write(toJson(recipe));
      return;
    }

    process.stdout.write(`${recipe.title}\n`);
    process.stdout.write(`${recipe.description}\n\n`);
    process.stdout.write(`id: ${recipe.id}\n`);
    process.stdout.write(`category: ${recipe.category}\n`);
    process.stdout.write(`imports: ${recipe.imports.join(", ")}\n`);
    process.stdout.write(`peers: ${recipe.peerDependencies.join(", ")}\n`);
    process.stdout.write(`files: ${recipe.files.map((file) => file.path).join(", ")}\n`);
    process.stdout.write("3.2 target: No MUI, Radix, or Lucide required for core UI.\n");
    return;
  }

  if (command === "add") {
    const { auraGlassRecipes, getAuraGlassRecipe } = loadRegistry();
    const id = args[1];
    if (!id) {
      throw new Error("Missing recipe id. Run `aura-glass list` for valid ids.");
    }

    const recipes =
      id === "all"
        ? auraGlassRecipes
        : [getAuraGlassRecipe(id)].filter(Boolean);

    if (recipes.length === 0) {
      throw new Error(`Unknown recipe "${id}". Run \`aura-glass list\` for valid ids.`);
    }

    const results = recipes.map((recipe) => writeRecipe(recipe, flags));
    if (flags.json) {
      process.stdout.write(toJson(results));
      return;
    }

    for (const result of results) {
      process.stdout.write(`${flags["dry-run"] ? "Would add" : "Added"} ${result.recipe}\n`);
      for (const file of result.written) {
        process.stdout.write(`  ${file.path}\n`);
      }
      for (const file of result.skipped) {
        process.stdout.write(`  skipped existing ${file}\n`);
      }
    }
    return;
  }

  if (command === "audit") {
    const subcommand = args[1];
    const cwd = resolveCwd(flags);
    if (subcommand === "deps") {
      const report = auditPackageDependencies(cwd);
      if (flags.json) {
        process.stdout.write(toJson(report));
      } else {
        printAuditDeps(report);
      }
      return;
    }

    if (subcommand === "imports") {
      const report = auditImports(cwd);
      if (flags.json) {
        process.stdout.write(toJson(report));
      } else {
        printAuditImports(report);
      }
      return;
    }

    throw new Error("Unknown audit command. Use `aura-glass audit deps` or `aura-glass audit imports`.");
  }

  if (command === "migrate") {
    const subcommand = args[1];
    const cwd = resolveCwd(flags);

    if (subcommand === "icons") {
      if (flags.from !== "lucide") {
        throw new Error("Icon migration currently requires `--from lucide`.");
      }

      const report = migrateLucideIcons(cwd, flags);
      if (flags.json) {
        process.stdout.write(toJson(report));
      } else {
        printMigrationReport(report);
      }
      return;
    }

    if (subcommand === "radix" || subcommand === "mui") {
      const report = migrateByReport(cwd, subcommand, flags);
      if (flags.json) {
        process.stdout.write(toJson(report));
      } else {
        printMigrationReport(report);
      }
      return;
    }

    throw new Error("Unknown migrate command. Use `icons --from lucide`, `radix`, or `mui`.");
  }

  if (command === "doctor") {
    const report = runDoctor(resolveCwd(flags));
    if (flags.json) {
      process.stdout.write(toJson(report));
    } else {
      printDoctor(report);
    }
    return;
  }

  throw new Error(`Unknown command "${command}".\n\n${usage}`);
};

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
