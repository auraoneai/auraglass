// REQ-SURF-08 render leg — runs under TZ=Pacific/Kiritimati (extreme +14).
// Writes <outdir>/<name>.html per fixture.
import { renderToString } from 'react-dom/server';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { FIXTURES } from './fixtures';

const out = process.argv[2]!;
mkdirSync(out, { recursive: true });
for (const [name, el] of FIXTURES) writeFileSync(join(out, `${name}.html`), renderToString(el));
console.log(`rendered ${FIXTURES.length} fixtures @ ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
