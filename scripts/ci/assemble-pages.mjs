#!/usr/bin/env node
/* pages job (§4.13.6, PLAT-022..024): public/ <- apps/docs/out/ (docs site),
   public/storybook/ <- storybook-static/, public/lab/index.html redirects to the
   Lab, public/r/** <- the registry build (registry-dist/ or .artifacts/plat/registry/,
   whichever the registry job produced). Inputs arrive via optional:true needs —
   a missing input keeps a "pending" placeholder page instead of failing. */
import { cpSync, existsSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';

mkdirSync('public', { recursive: true });

const placeholder = (dir, title, note) => {
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, `<!doctype html><title>${title} — pending</title><p>${note} — pending.</p>`);
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
const registrySrc = ['apps/docs/public', 'registry-dist', '.artifacts/plat/registry', 'registry/dist'].find((d) =>
  existsSync(`${d}/r`),
);
if (registrySrc) {
  cpSync(`${registrySrc}/r`, 'public/r', { recursive: true });
  console.log(`assemble-pages: registry copied from ${registrySrc}/r`);
} else if (existsSync('registry') && readdirSync('registry').length) {
  placeholder('public/r', 'AuraGlass registry', 'registry build (plat:test:registry) not merged yet');
}

// lab redirect — relative so it survives Pages subpath hosting
mkdirSync('public/lab', { recursive: true });
writeFileSync(
  'public/lab/index.html',
  '<!doctype html><meta http-equiv="refresh" content="0; url=../storybook/?path=/story/lab-shell">',
);

// _redirects: the docs build may ship apps/docs/public/_redirects (REQ-FIN-39);
// otherwise a placeholder sending /v4/* to the release/4.x Pages site.
if (existsSync('apps/docs/public/_redirects')) {
  cpSync('apps/docs/public/_redirects', 'public/_redirects');
  console.log('assemble-pages: _redirects copied from apps/docs/public');
} else {
  writeFileSync(
    'public/_redirects',
    '/v4/* https://chahal-foundation-group.gitlab.io/github-auraoneai/auraglass-v4/:splat 301\n',
  );
  console.log('assemble-pages: placeholder _redirects written (/v4/* → 4.x Pages)');
}
console.log('assemble-pages: public/ ready');
