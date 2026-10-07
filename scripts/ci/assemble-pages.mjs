#!/usr/bin/env node
/* pages job (§4.13.6): public/ <- apps/docs/out/ (docs site), public/storybook/ <-
   storybook-static/, public/lab/index.html redirecting to the Lab. Inputs come through
   optional: true needs; a missing input keeps a placeholder page. */
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('public', { recursive: true });

const docs = 'apps/docs/out';
if (existsSync(docs)) {
  cpSync(docs, 'public', { recursive: true });
} else {
  writeFileSync('public/index.html',
    '<!doctype html><title>AuraGlass docs</title><p>Docs site pending (apps/docs/out not built yet).</p>');
}

if (existsSync('storybook-static/index.html')) {
  cpSync('storybook-static', 'public/storybook', { recursive: true });
} else {
  mkdirSync('public/storybook', { recursive: true });
  writeFileSync('public/storybook/index.html',
    '<!doctype html><title>AuraGlass Storybook</title><p>Storybook pending (qual:build:storybook not merged yet).</p>');
}

mkdirSync('public/lab', { recursive: true });
writeFileSync('public/lab/index.html',
  '<!doctype html><meta http-equiv="refresh" content="0; url=/storybook/iframe.html?id=lab-shell">');
console.log('assemble-pages: public/ ready');
