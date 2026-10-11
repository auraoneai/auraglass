/* PLAT-293: `import *` from every public JS entry of package.json `exports`
   under strict + exactOptionalPropertyTypes + skipLibCheck:false. `internal`
   is not an export (consumers cannot reach it), so it is not imported. */
import * as root from 'aura-glass';
import * as material from 'aura-glass/material';
import * as theme from 'aura-glass/theme';
import * as tokens from 'aura-glass/tokens';
import * as motion from 'aura-glass/motion';
import * as primitives from 'aura-glass/primitives';
import * as icons from 'aura-glass/icons';
import * as forms from 'aura-glass/forms';
import * as appShell from 'aura-glass/app-shell';
import * as data from 'aura-glass/data';
import * as date from 'aura-glass/date';
import * as ai from 'aura-glass/ai';
import * as media from 'aura-glass/media';
import * as backdrops from 'aura-glass/backdrops';
import * as three from 'aura-glass/three';
import * as charts from 'aura-glass/charts';
import * as compat from 'aura-glass/compat';

export const modules = {
  root, material, theme, tokens, motion, primitives, icons, forms, appShell,
  data, date, ai, media, backdrops, three, charts, compat,
};
