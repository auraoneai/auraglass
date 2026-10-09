#!/usr/bin/env node
/* pages job (§4.13.6, PLAT-022..024): public/ <- apps/docs/out/ (docs site),
   public/storybook/ <- storybook-static/, public/lab/index.html redirects to the
   Lab, public/r/** <- the registry build (registry-dist/ or .artifacts/plat/registry/,
   whichever the registry job produced). Inputs arrive via optional:true needs —
   a missing input keeps a "pending" placeholder page instead of failing. */
import { cpSync, existsSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { generate } from '../docs/gen-redirects.mjs';

mkdirSync('public', { recursive: true });

const placeholder = (dir, title, note) => {
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, `<!doctype html><title>${title}</title><p>${note} — pending.</p>`);
};

if (existsSync('apps/docs/out')) {
  cpSync('apps/docs/out', 'public', { recursive: true });
  console.log('assemble-pages: docs site copied from apps/docs/out');
} else {
  placeholder('public', 'AuraGlass docs', 'Docs site (apps/docs/out) not built yet');
}

if (existsSync('storybook-static/index.html')) {
  cpSync('storybook-static', 'public/storybook', { recursive: true });
  console.log('assemble-pages: storybook copied');
} else {
  placeholder('public/storybook', 'AuraGlass Storybook', 'Storybook build (qual:build:storybook) not merged yet');
}

// registry → public/r/**
const registrySrc = ['registry-dist', '.artifacts/plat/registry', 'registry/dist'].find((d) =>
  existsSync(`${d}/r`),
);
if (registrySrc) {
  cpSync(`${registrySrc}/r`, 'public/r', { recursive: true });
  console.log(`assemble-pages: registry copied from ${registrySrc}/r`);
} else if (existsSync('registry') && readdirSync('registry').length) {
  placeholder('public/r', 'AuraGlass registry', 'registry build (plat:test:registry) not merged yet');
}

// lab redirect
mkdirSync('public/lab', { recursive: true });
writeFileSync(
  'public/lab/index.html',
  '<!doctype html><meta http-equiv="refresh" content="0; url=/storybook/iframe.html?id=lab-shell">',
);
// _redirects — 301s for every docs path RM-13 removed, dep anchors, and /v4/*
// to the release/4.x Pages deployment. Emitted unconditionally: even without
// apps/docs/out the old URLs must not 404.
writeFileSync('public/_redirects', await generate());
console.log('assemble-pages: public/_redirects emitted');
console.log('assemble-pages: public/ ready');
