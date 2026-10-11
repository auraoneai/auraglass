/* PLAT-293: `import *` from every non-pending manifest entry under strict +
   exactOptionalPropertyTypes + skipLibCheck:false. Regenerate from
   `node scripts/build/generate-exports.mjs --list-entries --json` (the runner
   regenerates the manifest). Seed-pending entries are added as they land. */
import * as material from 'aura-glass/material';
import * as tokens from 'aura-glass/tokens';
import * as icons from 'aura-glass/icons';
import * as data from 'aura-glass/data';
import * as date from 'aura-glass/date';
import * as three from 'aura-glass/three';
import * as charts from 'aura-glass/charts';

export const modules = {
  "material": material,
  "tokens": tokens,
  "icons": icons,
  "data": data,
  "date": date,
  "three": three,
  "charts": charts,
};
