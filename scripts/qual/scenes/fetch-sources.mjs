#!/usr/bin/env node
/* REQ-QUAL-07 (FIN-427): fetch the third-party scene sources named in sources.json.
   Usage: node scripts/qual/scenes/fetch-sources.mjs --out <empty scratch dir>
   - Reads each Commons file's imageinfo (url, size, sha1, extmetadata) from the public API.
   - Refuses any file whose LicenseShortName is not in sources.json acceptedLicences.
   - Downloads the original, verifies the API sha1, and writes <out>/provenance.json, which
     generate.mjs copies into scenes.manifest.json. Provenance is therefore never hand-typed.
   One-off authoring tool (network + disk); never run in CI lanes. */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCES = JSON.parse(readFileSync(join(HERE, 'sources.json'), 'utf8'));
const UA = 'AuraGlass-certification-scenes/1.0 (https://github.com/auraoneai/auraglass; licence evidence collection)';
const API = 'https://commons.wikimedia.org/w/api.php';

const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined; };
const out = arg('--out');
if (!out) { console.error('usage: fetch-sources.mjs --out <empty dir>'); process.exit(2); }
mkdirSync(out, { recursive: true });
if (readdirSync(out).some((f) => f === 'provenance.json')) { console.error(`${out} already holds provenance.json; use an empty dir`); process.exit(1); }

const strip = (html) => String(html ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function info(title) {
  const u = new URL(API);
  for (const [k, v] of Object.entries({ action: 'query', format: 'json', formatversion: '2', titles: title, prop: 'imageinfo',
    iiprop: 'url|size|sha1|mime|extmetadata', iiextmetadatafilter: 'LicenseShortName|LicenseUrl|License|Artist|Credit|DateTimeOriginal|UsageTerms' })) {
    u.searchParams.set(k, v);
  }
  const res = await fetch(u, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`${title}: API HTTP ${res.status}`);
  const page = (await res.json()).query.pages[0];
  if (!page.imageinfo) throw new Error(`${title}: not found on Commons`);
  return { page, ii: page.imageinfo[0] };
}

const provenance = { retrievedAt: new Date().toISOString(), api: API, files: {}, fonts: {} };
for (const [id, title] of Object.entries(SOURCES.commons)) {
  const { page, ii } = await info(title);
  const m = ii.extmetadata ?? {};
  const licence = strip(m.LicenseShortName?.value);
  if (!SOURCES.acceptedLicences.includes(licence)) throw new Error(`${id}: ${title} licence "${licence}" is not accepted`);
  const original = new URL(ii.url); original.search = '';
  const res = await fetch(original, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`${id}: download HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const sha1 = createHash('sha1').update(buf).digest('hex');
  if (sha1 !== ii.sha1) throw new Error(`${id}: sha1 ${sha1} != API ${ii.sha1}`);
  const file = `${id}.source${original.pathname.slice(original.pathname.lastIndexOf('.')).toLowerCase()}`;
  writeFileSync(join(out, file), buf);
  provenance.files[id] = {
    file, title, pageUrl: ii.descriptionurl, originalUrl: original.href, pageId: page.pageid, mime: ii.mime,
    width: ii.width, height: ii.height, bytes: ii.size, sha1: ii.sha1,
    licence, licenceUrl: strip(m.LicenseUrl?.value) || null, usageTerms: strip(m.UsageTerms?.value) || null,
    author: strip(m.Artist?.value) || null, credit: strip(m.Credit?.value) || null, date: strip(m.DateTimeOriginal?.value) || null,
  };
  console.log(`${id}: ${title} (${licence}) ${ii.width}x${ii.height}`);
}
for (const [name, url] of Object.entries(SOURCES.fonts)) {
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(join(out, name), buf);
  provenance.fonts[name] = { url, licence: SOURCES.fontLicence, sha256: createHash('sha256').update(buf).digest('hex') };
}
if (existsSync(join(out, 'provenance.json'))) throw new Error('race: provenance.json appeared');
writeFileSync(join(out, 'provenance.json'), `${JSON.stringify(provenance, null, 2)}\n`);
console.log(`wrote ${join(out, 'provenance.json')}`);
