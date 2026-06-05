#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');
const defaultTargets = [
  'docs',
  'server/README.md',
];
const ignoredDirectories = new Set([
  '.git',
  'coverage',
  'dist',
  'node_modules',
  'playwright-report',
  'reports',
  'test-results',
]);
const externalSchemes = /^(?:https?:|mailto:|tel:|ftp:|data:|javascript:)/i;
const codeFencePattern = /```[\s\S]*?```|~~~[\s\S]*?~~~/g;
const inlineCodePattern = /`[^`\n]*`/g;

function usage() {
  console.log(`Usage: node scripts/ci/verify-markdown-links.js [files-or-directories...]

Validates local Markdown links and anchors. External URLs are skipped by default.
Default targets: ${defaultTargets.join(', ')}`);
}

function exists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function collectMarkdownFiles(targets) {
  const files = [];
  const seen = new Set();

  function visit(targetPath) {
    const resolvedPath = path.resolve(repoRoot, targetPath);
    if (!exists(resolvedPath)) {
      files.push({
        missingTarget: targetPath,
        absolutePath: resolvedPath,
      });
      return;
    }

    const stat = fs.statSync(resolvedPath);
    if (stat.isDirectory()) {
      const basename = path.basename(resolvedPath);
      if (ignoredDirectories.has(basename)) {
        return;
      }

      for (const entry of fs.readdirSync(resolvedPath).sort()) {
        visit(path.relative(repoRoot, path.join(resolvedPath, entry)));
      }
      return;
    }

    if (!/\.mdx?$/i.test(resolvedPath)) {
      return;
    }

    if (!seen.has(resolvedPath)) {
      seen.add(resolvedPath);
      files.push(resolvedPath);
    }
  }

  for (const target of targets) {
    visit(target);
  }

  return files;
}

function stripMarkdownCode(content) {
  return content
    .replace(codeFencePattern, (match) =>
      match.replace(/[^\n]/g, ' ')
    )
    .replace(inlineCodePattern, (match) => ' '.repeat(match.length));
}

function parseDestination(rawDestination) {
  const value = rawDestination.trim();

  if (value.startsWith('<')) {
    const closingIndex = value.indexOf('>');
    return closingIndex === -1 ? value.slice(1) : value.slice(1, closingIndex);
  }

  const quotedTitle = value.search(/\s+["'(]/);
  return quotedTitle === -1 ? value : value.slice(0, quotedTitle);
}

function extractLinks(content) {
  const stripped = stripMarkdownCode(content);
  const links = [];
  const inlineLinkPattern = /!?\[[^\]\n]*(?:\][^\[\n]*)?\]\(([^)\n]+)\)/g;
  const referenceDefinitionPattern = /^\s{0,3}\[[^\]\n]+\]:\s+(\S+)/gm;
  let match;

  while ((match = inlineLinkPattern.exec(stripped))) {
    links.push({
      destination: parseDestination(match[1]),
      index: match.index,
    });
  }

  while ((match = referenceDefinitionPattern.exec(stripped))) {
    links.push({
      destination: parseDestination(match[1]),
      index: match.index,
    });
  }

  return links;
}

function lineForIndex(content, index) {
  return content.slice(0, index).split('\n').length;
}

function decodePathname(pathname) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

function githubSlug(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&(?:amp|lt|gt|quot|#39);/g, '')
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/\s/g, '-');
}

function anchorsForMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const anchors = new Set();
  const counts = new Map();
  const headingPattern = /^(#{1,6})\s+(.+?)\s*#*\s*$/gm;
  const htmlIdPattern = /\bid=["']([^"']+)["']/g;
  let match;

  while ((match = headingPattern.exec(content))) {
    const baseSlug = githubSlug(match[2]);
    const count = counts.get(baseSlug) || 0;
    counts.set(baseSlug, count + 1);
    anchors.add(count === 0 ? baseSlug : `${baseSlug}-${count}`);
  }

  while ((match = htmlIdPattern.exec(content))) {
    anchors.add(match[1]);
  }

  return anchors;
}

function hasLineAnchor(filePath, fragment) {
  const match = /^L(\d+)(?:-L(\d+))?$/.exec(fragment);
  if (!match) {
    return false;
  }

  const lineCount = fs.readFileSync(filePath, 'utf8').split('\n').length;
  const start = Number(match[1]);
  const end = Number(match[2] || match[1]);
  return start >= 1 && end >= start && end <= lineCount;
}

function resolveLocalLink(sourceFile, destination) {
  const hashIndex = destination.indexOf('#');
  const rawPath = hashIndex === -1 ? destination : destination.slice(0, hashIndex);
  const fragment = hashIndex === -1 ? '' : destination.slice(hashIndex + 1);
  const normalizedFragment = fragment.replace(/^user-content-/, '');
  const withoutQuery = rawPath.split('?')[0];
  const decodedPath = decodePathname(withoutQuery);
  const absolutePath = decodedPath
    ? decodedPath.startsWith('/')
      ? path.resolve(repoRoot, `.${decodedPath}`)
      : path.resolve(path.dirname(sourceFile), decodedPath)
    : sourceFile;

  return {
    absolutePath,
    fragment: normalizedFragment,
  };
}

function validateLink(sourceFile, content, link) {
  const destination = link.destination.trim();

  if (
    !destination ||
    externalSchemes.test(destination) ||
    destination.startsWith('mailto:') ||
    destination.startsWith('//')
  ) {
    return null;
  }

  const { absolutePath, fragment } = resolveLocalLink(sourceFile, destination);

  if (!exists(absolutePath)) {
    return {
      source: sourceFile,
      line: lineForIndex(content, link.index),
      destination,
      message: `Target does not exist: ${path.relative(repoRoot, absolutePath)}`,
    };
  }

  const stat = fs.statSync(absolutePath);
  if (stat.isDirectory()) {
    return null;
  }

  if (fragment) {
    if (/\.mdx?$/i.test(absolutePath)) {
      const anchors = anchorsForMarkdown(absolutePath);
      if (!anchors.has(fragment)) {
        return {
          source: sourceFile,
          line: lineForIndex(content, link.index),
          destination,
          message: `Anchor does not exist: #${fragment}`,
        };
      }
    } else if (!hasLineAnchor(absolutePath, fragment)) {
      return {
        source: sourceFile,
        line: lineForIndex(content, link.index),
        destination,
        message: `Non-Markdown target only supports valid #Lx or #Lx-Ly anchors.`,
      };
    }
  }

  return null;
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    usage();
    return;
  }

  const targets = args.length > 0 ? args : defaultTargets;
  const files = collectMarkdownFiles(targets);
  const missingInputTargets = files.filter((file) => typeof file === 'object');
  const markdownFiles = files.filter((file) => typeof file === 'string');
  const failures = missingInputTargets.map((target) => ({
    source: path.resolve(repoRoot, target.missingTarget),
    line: 1,
    destination: target.missingTarget,
    message: `Input target does not exist: ${target.missingTarget}`,
  }));

  for (const filePath of markdownFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const link of extractLinks(content)) {
      const failure = validateLink(filePath, content, link);
      if (failure) {
        failures.push(failure);
      }
    }
  }

  if (failures.length > 0) {
    console.error(`Markdown link verification failed with ${failures.length} issue(s):`);
    for (const failure of failures) {
      console.error(
        `- ${path.relative(repoRoot, failure.source)}:${failure.line} ${failure.destination} - ${failure.message}`
      );
    }
    process.exit(1);
  }

  console.log(
    `Markdown link verification passed for ${markdownFiles.length} file(s).`
  );
}

main();
