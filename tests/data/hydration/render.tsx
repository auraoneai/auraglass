// REQ-SURF-08 render leg — runs under TZ=Pacific/Kiritimati (UTC+14).
// Writes <outdir>/<name>.html per fixture (FIXTURES + CONTROL_FIXTURES) and
// prints a JSON summary including the time zone the process actually ran in.
import { renderToString } from 'react-dom/server';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONTROL_FIXTURES, FIXTURES } from './fixtures';

const out = process.argv[2]!;
mkdirSync(out, { recursive: true });
const rendered: string[] = [];
for (const [name, el] of [...FIXTURES, ...CONTROL_FIXTURES]) {
  writeFileSync(join(out, `${name}.html`), renderToString(el));
  rendered.push(name);
}
console.log(JSON.stringify({ timeZone: Intl.DateTimeFormat('en-US').resolvedOptions().timeZone, rendered }));
