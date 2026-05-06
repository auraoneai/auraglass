#!/usr/bin/env node
/**
 * AuraGlass codemod: Replace common Tailwind-like utilities with glass-* equivalents
 * - Scope: src/components (TS/TSX files)
 * - Conservative: only maps a curated set; logs leftovers
 */

const fs = require('fs');
const path = require('path');

// Process all source directories, excluding tests and stories
const ROOT = path.join(process.cwd(), 'src');
const EXCLUDE_DIRS = new Set(['__tests__', 'tests', 'stories', 'styles']);
const exts = new Set(['.tsx', '.ts']);

const CLASS_MAP = new Map([
  // spacing
  [/\b(p|m|px|py|mx|my)-(\d+(?:-\d)?)\b/g, (m, k, v) => `glass-${k}-${v}`],
  [/\bgap-(\d+(?:-\d)?)\b/g, (m, v) => `glass-gap-${v}`],
  // radius
  [/\brounded-full\b/g, 'glass-radius-full'],
  [/\brounded-2xl\b/g, 'glass-radius-2xl'],
  [/\brounded-xl\b/g, 'glass-radius-xl'],
  [/\brounded-lg\b/g, 'glass-radius-lg'],
  [/\brounded-md\b/g, 'glass-radius-md'],
  [/\brounded-sm\b/g, 'glass-radius-sm'],
  [/\brounded\b/g, 'glass-radius'],
  // text
  [/\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)\b/g, (m, v) => `glass-text-${v}`],
  [/\btext-white\b/g, 'glass-text-primary'],
  [/\btext-black\b/g, 'glass-text-inverse'],
  [/\btext-center\b/g, 'glass-text-center'],
  [/\btext-left\b/g, 'glass-text-left'],
  [/\btext-primary\/(\d+)\b/g, (m, v) => `glass-text-primary-opacity-${v}`],
  [/\btext-primary\b/g, 'glass-text-primary'],
  [/\btext-foreground\b/g, 'glass-text-primary'],
  [/\btext-gray-(?:[456789]00)\b/g, 'glass-text-secondary'],
  [/\btext-(blue|green|red|yellow|purple|orange|cyan)-(?:[4-9]00)\b/g, 'glass-text-primary'],
  [/\btext-(blue|green|red|yellow|purple|orange|cyan)-300\b/g, 'glass-text-secondary'],
  [/\btext-(blue|green|red|yellow|purple|orange|cyan)-(?:[34]00)\/(\d+)\b/g, (m, c, v) => `glass-text-${c}-opacity-${v}`],
  [/\btext-muted(?:\/\d+)?\b/g, 'glass-text-secondary'],
  [/\btext-muted-foreground\b/g, 'glass-text-secondary'],
  [/\btext-destructive\b/g, 'glass-text-danger'],
  // bg
  [/\bbg-white\b/g, 'glass-surface-subtle'],
  [/\bbg-black\b/g, 'glass-surface-dark'],
  [/\bbg-gray-(50|100)\b/g, 'glass-surface-subtle'],
  [/\bbg-slate-800\b/g, 'glass-surface-dark'],
  [/\bbg-slate-900\b/g, 'glass-surface-dark'],
  [/\bbg-slate-700\b/g, 'glass-surface-dark'],
  [/\bhover:bg-slate-600\b/g, 'glass-hover-bg-slate-600'],
  [/\bfile:glass-surface-blue\b/g, 'glass-file-surface-blue'],
  [/\bfile:glass-text-primary\b/g, 'glass-file-text-primary'],
  [/\bbg-amber-400\b/g, 'glass-surface-amber'],
  [/\bbg-amber-500\b/g, 'glass-surface-amber'],
  [/\bbg-pink-400\b/g, 'glass-surface-pink'],
  [/\bbg-pink-500\b/g, 'glass-surface-pink'],
  [/\bbg-pink-500\/20\b/g, 'glass-surface-pink-opacity-20'],
  [/\bbg-indigo-600\b/g, 'glass-surface-indigo'],
  [/\bbg-emerald-500\b/g, 'glass-surface-emerald'],
  [/\bbg-success\b/g, 'glass-surface-success'],
  [/\bbg-stripes\b/g, 'glass-bg-stripes'],
  [/\bbg-gradient-radial\b/g, 'glass-bg-gradient-radial'],
  [/\bbg-glass-border\/20\b/g, 'glass-bg-border-opacity-20'],
  [/\bbg-clip-text\b/g, 'glass-bg-clip-text'],
  [/\bbg-opacity-75\b/g, 'glass-bg-opacity-75'],
  [/\bbg-opacity-5\b/g, 'glass-bg-opacity-5'],
  [/\bbg-glass-opacity-0\b/g, 'glass-bg-opacity-0'],
  [/\bbg-glass-fill\b/g, 'glass-bg-fill'],
  [/\bbg-background\b/g, 'glass-bg-background'],
  [/\bbg-(blue|green|red|yellow)-(?:[4-9]00)\b/g, 'glass-surface-$1'],
  [/\bbg-primary\b/g, 'glass-surface-primary'],
  [/\bbg-transparent\b/g, 'glass-bg-transparent'],
  [/\bbg-gradient-to-(r|br)\b/g, 'glass-gradient-primary'],
  [/\bvia-transparent\b/g, 'glass-via-transparent'],
  [/\bvia-white\b/g, 'glass-via-white'],
  [/\bvia-white\/5\b/g, 'glass-via-white-opacity-5'],
  [/\bvia-white\/40\b/g, 'glass-via-white-opacity-40'],
  [/\bvia-white\/60\b/g, 'glass-via-white-opacity-60'],
  [/\bvia-secondary\/4\b/g, 'glass-via-secondary-opacity-4'],
  [/\bvia-red-900\/50\b/g, 'glass-via-red-opacity-50'],
  [/\bvia-purple-900\b/g, 'glass-via-purple-900'],
  [/\bvia-purple-400\b/g, 'glass-via-purple-400'],
  [/\bvia-green-900\/50\b/g, 'glass-via-green-opacity-50'],
  [/\bvia-black\/40\b/g, 'glass-via-black-opacity-40'],
  [/\bvia-yellow-400\b/g, 'glass-via-yellow-400'],
  [/\bvia-purple\/30\b/g, 'glass-via-purple-opacity-30'],
  [/\bvia-blue-300\/10\b/g, 'glass-via-blue-opacity-10'],
  [/\bvia-blue-500\/10\b/g, 'glass-via-blue-opacity-10'],
  [/\bvia-blue-400\b/g, 'glass-via-blue-400'],
  [/\bvia-green-400\b/g, 'glass-via-green-400'],
  [/\bdrop-glass-shadow-sm\b/g, 'glass-drop-shadow-sm'],
  [/\bbg-(background|glass-surface)\/\d{1,2}\b/g, 'glass-surface-overlay'],
  [/\bbg-(?:gray|blue|green|red|yellow|purple|orange|cyan)-(50|100|200|300|700|900)\b/g, 'glass-surface-subtle'],
  [/\bbg-(?:gray|blue|green|red|yellow|purple|orange|cyan)-(400|500|600|800)\b/g, 'glass-surface-primary'],
  [/\bbg-current\b/g, 'glass-bg-transparent'],
  [/\bbg-muted(?:\/\d{1,2})?\b/g, 'glass-surface-subtle'],
  [/\bbg-opacity-50\b/g, 'glass-opacity-50'],
  [/\bbg-(?:black|white)\/\d{1,2}\b/g, 'glass-surface-overlay'],
  // border
  [/\bborder\b/g, 'glass-border'],
  [/\bborder-gray-(200|300|400)\b/g, 'glass-border-subtle'],
  [/\bborder-(blue|green|red|yellow)-(?:[3-9]00)\b/g, 'glass-border-$1'],
  // shadow
  [/\bshadow(?:-(sm|md|lg|xl|2xl))?\b/g, (m, v) => v ? `glass-shadow-${v}` : 'glass-shadow'],
  // layout/display
  [/\binline-flex\b/g, 'glass-inline-flex'],
  [/\bflex\b/g, 'glass-flex'],
  [/\bgrid\b/g, 'glass-grid'],
  [/\bitems-center\b/g, 'glass-items-center'],
  [/\bitems-start\b/g, 'glass-items-start'],
  [/\bitems-end\b/g, 'glass-items-end'],
  [/\bitems-baseline\b/g, 'glass-items-baseline'],
  [/\bjustify-center\b/g, 'glass-justify-center'],
  [/\bjustify-between\b/g, 'glass-justify-between'],
  [/\bjustify-start\b/g, 'glass-justify-start'],
  [/\bjustify-end\b/g, 'glass-justify-end'],
  [/\bw-full\b/g, 'glass-w-full'],
  [/\bh-full\b/g, 'glass-h-full'],
  [/\bh-auto\b/g, 'glass-h-auto'],
  [/\bmin-w-0\b/g, 'glass-min-w-0'],
  [/\bmin-h-0\b/g, 'glass-min-h-0'],
  [/\bmin-h-full\b/g, 'glass-min-h-full'],
  [/\brelative\b/g, 'glass-relative'],
  [/\binset-0\b/g, 'glass-inset-0'],
  [/\btop-2\b/g, 'glass-top-2'],
  [/\b-?top-1\b/g, (m) => m.startsWith('-') ? 'glass--top-1' : 'glass-top-1'],
  [/\b-?top-2\b/g, (m) => m.startsWith('-') ? 'glass--top-2' : 'glass-top-2'],
  // sizing tokens (expanded)
  [/\bw-(1|2|3|4|5|6|8|9|10|12|14|16|20|24|28|32|40|48|50|64|80|96)\b/g, (m, n) => `glass-w-${n}`],
  [/\bw-fit\b/g, 'glass-w-fit'],
  [/\bw-2\.5\b/g, 'glass-w-2-5'],
  [/\bw-3\.5\b/g, 'glass-w-3-5'],
  [/\bh-(1|2|3|4|5|6|8|9|10|12|16|20|24|32|48|64|80|96)\b/g, (m, n) => `glass-h-${n}`],
  [/\bh-\[500px\]\b/g, 'glass-h-500px'],
  [/\bh-2\.5\b/g, 'glass-h-2-5'],
  [/\bh-3\.5\b/g, 'glass-h-3-5'],
  [/\bw-0\b/g, 'glass-w-0'],
  [/\bh-0\b/g, 'glass-h-0'],
  [/\bw-px\b/g, 'glass-w-px'],
  [/\bh-px\b/g, 'glass-h-px'],
  [/\bh-0\.5\b/g, 'glass-h-0-5'],
  [/\bh-screen\b/g, 'glass-h-screen'],
  [/\bw-1\/2\b/g, 'glass-w-1-2'],
  [/\bw-3\/4\b/g, 'glass-w-3-4'],
  [/\bw-\[500px\]\b/g, 'glass-w-500px'],
  [/\bh-\[500px\]\b/g, 'glass-h-500px'],
  // overflow & truncate
  [/\boverflow-y-auto\b/g, 'glass-overflow-y-auto'],
  [/\boverflow-y-glass-hidden\b/g, 'glass-overflow-y-hidden'],
  [/\boverflow-x-auto\b/g, 'glass-overflow-x-auto'],
  [/\boverflow-x-hidden\b/g, 'glass-overflow-x-hidden'],
  [/\boverflow-hidden\b/g, 'glass-overflow-hidden'],
  [/\boverflow-auto\b/g, 'glass-overflow-auto'],
  [/\boverflow-visible\b/g, 'glass-overflow-visible'],
  [/\btruncate\b/g, 'glass-truncate'],
  [/\bline-clamp-2\b/g, 'glass-line-clamp-2'],
  [/\bline-clamp-3\b/g, 'glass-line-clamp-3'],
  [/\bline-through\b/g, 'glass-line-through'],
  [/\bunderline\b/g, 'glass-underline'],
  [/\bwhitespace-nowrap\b/g, 'glass-whitespace-nowrap'],
  [/\bwhitespace-pre-wrap\b/g, 'glass-whitespace-pre-wrap'],
  [/\bselect-none\b/g, 'glass-select-none'],
  // font weight and display
  [/\bfont-light\b/g, 'glass-font-light'],
  [/\bfont-medium\b/g, 'glass-font-medium'],
  [/\bfont-semibold\b/g, 'glass-font-semibold'],
  [/\bfont-bold\b/g, 'glass-font-bold'],
  [/\bfont-black\b/g, 'glass-font-black'],
  [/\bfont-mono\b/g, 'glass-font-mono'],
  [/\bsr-only\b/g, 'glass-sr-only'],
  [/\bblock\b/g, 'glass-block'],
  [/\bopacity-90\b/g, 'glass-opacity-90'],
  [/\bopacity-80\b/g, 'glass-opacity-80'],
  [/\bopacity-60\b/g, 'glass-opacity-60'],
  [/\bopacity-50\b/g, 'glass-opacity-50'],
  [/\bopacity-40\b/g, 'glass-opacity-40'],
  [/\bopacity-30\b/g, 'glass-opacity-30'],
  [/\bopacity-20\b/g, 'glass-opacity-20'],
  [/\bopacity-10\b/g, 'glass-opacity-10'],
  // positioning
  [/\babsolute\b/g, 'glass-absolute'],
  [/\bfixed\b/g, 'glass-fixed'],
  [/\bz-50\b/g, 'glass-z-50'],
  [/\bz-40\b/g, 'glass-z-40'],
  [/\bz-20\b/g, 'glass-z-20'],
  [/\bz-10\b/g, 'glass-z-10'],
  [/\bz-0\b/g, 'glass-z-0'],
  [/\bz-5\b/g, 'glass-z-5'],
  [/\bz-\[100\]\b/g, 'glass-z-100'],
  [/\bz-\[1000\]\b/g, 'glass-z-1000'],
  [/\bz-\[1100\]\b/g, 'glass-z-1100'],
  [/\bz-\[9996\]\b/g, 'glass-z-9996'],
  [/\bz-\[9997\]\b/g, 'glass-z-9997'],
  [/\bz-\[9998\]\b/g, 'glass-z-9998'],
  [/\bz-\[9999\]\b/g, 'glass-z-9999'],
  [/\bz-\[2147483647\]\b/g, 'glass-z-max'],
  [/\bmin-w-\[3ch\]\b/g, 'glass-min-w-3ch'],
  [/\btext-\[10px\]\b/g, 'glass-text-10px'],
  [/\bmd:text-8xl\b/g, 'glass-md-text-8xl'],
  [/\bmx-auto\b/g, 'glass-mx-auto'],
  // cursor
  [/\bcursor-pointer\b/g, 'glass-cursor-pointer'],
  // spacing shortcuts
  [/\bspace-y-(1|2|3|4|6)\b/g, (m,n)=>`glass-space-y-${n}`],
  [/\bmb-(0|1|2|3|4|6)\b/g, (m,n)=>`glass-mb-${n}`],
  [/\bmt-(0|1|2|3|4|6)\b/g, (m,n)=>`glass-mt-${n}`],
  [/\bpt-(0|1|2|3|4|6|8|12|24)\b/g, (m,n)=>`glass-pt-${n}`],
  [/\bpt-\[10vh\]\b/g, 'glass-pt-10vh'],
  [/\bpb-(0|2|3|4)\b/g, (m,n)=>`glass-pb-${n}`],
  [/\bmt-8\b/g, 'glass-mt-8'],
  [/\bmr-(2|3)\b/g, (m,n)=>`glass-mr-${n}`],
  [/\bml-(0|1|2|3|5|auto)\b/g, (m,n)=>`glass-ml-${n === 'auto' ? 'auto' : n}`],
  [/\bml-\[-10px\]\b/g, 'glass-ml--10px'],
  [/\bpx-(0|4)\b/g, (m,n)=>`glass-px-${n}`],
  [/\bpy-(0|2)\b/g, (m,n)=>`glass-py-${n}`],
  [/\bpl-(4|10)\b/g, (m,n)=>`glass-pl-${n}`],
  [/\bpr-(2|4|12)\b/g, (m,n)=>`glass-pr-${n}`],
  [/\bpb-6\b/g, 'glass-pb-6'],
  [/\bml-4\b/g, 'glass-ml-4'],
  [/\bmt-auto\b/g, 'glass-mt-auto'],
  [/\bright-1\b/g, 'glass-right-1'],
  // text alignment/transform
  [/\btext-right\b/g, 'glass-text-right'],
  [/\buppercase\b/g, 'glass-uppercase'],
  [/\bcapitalize\b/g, 'glass-capitalize'],
  // backdrop blur
  [/\bbackdrop-blur-sm\b/g, 'glass-backdrop-blur-sm'],
  // sizes
  [/\bmax-h-64\b/g, 'glass-max-h-64'],
  [/\bmax-h-80\b/g, 'glass-max-h-80'],
  [/\bmax-w-xs\b/g, 'glass-max-w-xs'],
  [/\bmax-w-md\b/g, 'glass-max-w-md'],
  // pointer events
  [/\bpointer-events-none\b/g, 'glass-pointer-events-none'],
  [/\bpointer-events-auto\b/g, 'glass-pointer-events-auto'],
  // overflow
  [/\boverflow-x-auto\b/g, 'glass-overflow-x-auto'],
  // min width
  [/\bmin-w-64\b/g, 'glass-min-w-64'],
  // transform
  [/\btransform\b/g, 'glass-transform'],
  // color shortcuts (fall back to sensible tokens)
  [/\btext-white(?:\/\d+)?\b/g, 'glass-text-primary'],
  [/\bbg-white(?:\/\d+)?\b/g, 'glass-surface-overlay'],
  [/\bfrom-[a-z0-9-]+(?:\/\d+)?\b/g, 'glass-gradient-primary'],
  [/\bto-[a-z0-9-]+(?:\/\d+)?\b/g, 'glass-gradient-primary'],
  [/\bbg-gradient-glass-gradient-primary\b/g, 'glass-gradient-primary'],
  [/\btext-glass-text-secondary\b/g, 'glass-text-secondary'],
  [/\btext-glass-text\b/g, 'glass-text-primary'],
  // grid-cols-N
  [/\bgrid-cols-(\d{1,2})\b/g, (m, n) => `glass-grid-cols-${n}`],
  [/\bmd:grid-cols-(\d{1,2})\b/g, (m, n) => `glass-md-grid-cols-${n}`],
  // hover states
  [/\bhover:text-primary\b/g, 'glass-hover-text-primary'],
  [/\bhover:scale-105\b/g, 'glass-hover-scale-105'],
  [/\bhover:scale-\[1\.01\]\b/g, 'glass-hover-scale-1-01'],
  [/\bhover:r-6\b/g, 'glass-hover-r-6'],
  [/\bhover:-translate-y-0\.5\b/g, 'glass-hover--translate-y-0-5'],
  [/\bhover:bg-(blue|green|red|gray|indigo)-(600|700)\b/g, (m, c, v) => `glass-hover-bg-${c}-${v}`],
  [/\bhover:bg-white\/20\b/g, 'glass-hover-bg-white-opacity-20'],
  [/\bhover:text-gray-700\b/g, 'glass-hover-text-gray-700'],
  [/\bhover:opacity-100\b/g, 'glass-hover-opacity-100'],
  // focus states
  [/\bfocus:ring-primary\b/g, 'glass-focus-ring-primary'],
  [/\bfocus:ring-2\b/g, 'glass-focus-ring-2'],
  [/\bfocus:outline-none\b/g, 'glass-focus-outline-none'],
  [/\bfocus:ring-offset-2\b/g, 'glass-focus-ring-offset-2'],
  [/\bfocus:ring-current\b/g, 'glass-focus-ring-current'],
  // stroke
  [/\bstroke-white\/10\b/g, 'glass-stroke-white-opacity-10'],
  // object fit
  [/\bobject-cover\b/g, 'glass-object-cover'],
  [/\bobject-contain\b/g, 'glass-object-contain'],
  // transition
  [/\btransition-all\b/g, 'glass-transition-all'],
  [/\btransition-opacity\b/g, 'glass-transition-opacity'],
  [/\btransition-colors\b/g, 'glass-transition-colors'],
  [/\btransition-glass-transform\b/g, 'glass-transition-transform'],
  [/\btransition-glass-shadow\b/g, 'glass-transition-shadow'],
  [/\bduration-100\b/g, 'glass-duration-100'],
  [/\bduration-200\b/g, 'glass-duration-200'],
  [/\bduration-500\b/g, 'glass-duration-500'],
  [/\bduration-75\b/g, 'glass-duration-75'],
  [/\bduration-1000\b/g, 'glass-duration-1000'],
  [/\bduration-400\b/g, 'glass-duration-400'],
  // bg gradients
  [/\bbg-glass-gradient-subtle\b/g, 'glass-bg-gradient-subtle'],
  [/\bbg-glass-gradient-strong\b/g, 'glass-bg-gradient-strong'],
  // bg colors with opacity
  [/\bbg-secondary\b/g, 'glass-bg-secondary'],
  [/\bbg-primary\b/g, 'glass-bg-primary'],
  // text colors with opacity
  [/\btext-muted\/20\b/g, 'glass-text-muted-opacity-20'],
  [/\btext-gray-300\b/g, 'glass-text-secondary'],
  [/\btext-pink-400\b/g, 'glass-text-pink'],
  [/\btext-md\b/g, 'glass-text-md'],
  [/\bmd:text-7xl\b/g, 'glass-md-text-7xl'],
  [/\bmd:text-8xl\b/g, 'glass-md-text-8xl'],
  [/\btext-success-foreground\b/g, 'glass-text-success-foreground'],
  [/\btext-green-200\/60\b/g, 'glass-text-green-opacity-60'],
  [/\btext-amber-400\b/g, 'glass-text-amber-400'],
  [/\btext-pink-300\b/g, 'glass-text-pink-300'],
  [/\btext-transparent\b/g, 'glass-text-transparent'],
  [/\bplaceholder-gray-400\b/g, 'glass-placeholder-gray-400'],
  [/\bplaceholder:glass-text-secondary\b/g, 'glass-placeholder-text-secondary'],
  [/\bplaceholder-white\/50\b/g, 'glass-placeholder-white-opacity-50'],
  [/\bleading-relaxed\b/g, 'glass-leading-relaxed'],
  [/\bleading-tight\b/g, 'glass-leading-tight'],
  [/\bleading-none\b/g, 'glass-leading-none'],
  [/\bleading-5\b/g, 'glass-leading-5'],
  // animations
  [/\banimate-spin\b/g, 'glass-animate-spin'],
  [/\banimate-pulse\b/g, 'glass-animate-pulse'],
  [/\banimate-slide-in-up\b/g, 'glass-animate-slide-in-up'],
  [/\banimate-slide-in-left\b/g, 'glass-animate-slide-in-left'],
  [/\banimate-glass-shimmer\b/g, 'glass-animate-shimmer'],
  [/\banimate-fade-in-up\b/g, 'glass-animate-fade-in-up'],
  [/\banimate-fade-in\b/g, 'glass-animate-fade-in'],
  // typography
  [/\btracking-wide\b/g, 'glass-tracking-wide'],
  [/\btracking-wider\b/g, 'glass-tracking-wider'],
  // spacing horizontal
  [/\bspace-x-(0|0\.5|px|1|2|3|4|6|8)\b/g, (m,n)=>`glass-space-x-${n === '0.5' ? '0-5' : n === 'px' ? 'px' : n}`],
  [/\bspace-y-(1|2|3|4|6|8)\b/g, (m,n)=>`glass-space-y-${n}`],
  [/\bpt-6\b/g, 'glass-pt-6'],
  [/\bmr-1\b/g, 'glass-mr-1'],
  [/\bml-6\b/g, 'glass-ml-6'],
  [/\bmb-8\b/g, 'glass-mb-8'],
  // appearance
  [/\bappearance-none\b/g, 'glass-appearance-none'],
  [/\boutline-none\b/g, 'glass-outline-none'],
  [/\bdisabled:cursor-not-allowed\b/g, 'glass-disabled-cursor-not-allowed'],
  // positioning
  [/\btop-(0|2|3|4|8|full)\b/g, (m,n)=>`glass-top-${n}`],
  [/-glass-top-3/g, 'glass--top-3'],
  [/-glass-top-4/g, 'glass--top-4'],
  [/-glass-bottom-0\.5/g, 'glass--bottom-0-5'],
  [/-glass-bottom-1/g, 'glass--bottom-1'],
  [/-glass-m-6/g, 'glass--m-6'],
  [/-glass-mb-1/g, 'glass--mb-1'],
  [/-glass-ml-1/g, 'glass--ml-1'],
  [/-glass-space-x-2/g, 'glass--space-x-2'],
  [/\bbottom-(0|1|2|4|6|8|12|24)\b/g, (m,n)=>`glass-bottom-${n}`],
  [/-bottom-8/g, 'glass--bottom-8'],
  [/\bright-(0|2|3|4|6|12)\b/g, (m,n)=>`glass-right-${n}`],
  [/\bbottom-10\b/g, 'glass-bottom-10'],
  [/\bleft-(0|1|2|3|4|6|full)\b/g, (m,n)=>`glass-left-${n}`],
  [/-left-1/g, 'glass--left-1'],
  [/-right-20/g, 'glass--right-20'],
  [/-top-6/g, 'glass--top-6'],
  [/-inset-1/g, 'glass--inset-1'],
  [/-inset-2/g, 'glass--inset-2'],
  [/\b-left-1\/2\b/g, 'glass--left-1-2'],
  [/\b-right-1\b/g, 'glass--right-1'],
  [/-right-1/g, 'glass--right-1'],
  [/-glass-right-2/g, 'glass--right-2'],
  [/-translate-y-1\/2/g, 'glass--translate-y-1-2'],
  [/-translate-x-1\/2/g, 'glass--translate-x-1-2'],
  [/-glass--glass--glass--glass-/g, 'glass--'],
  [/-glass--glass-/g, 'glass--'],
  [/\bglassglass--/g, 'glass--'],
  [/glassglassglassglass-/g, 'glass-'],
  [/glassglass--rotate-90/g, 'glass--rotate-90'],
  [/-glassglass--rotate-90/g, 'glass--rotate-90'],
  [/-glass--glassglass--rotate-90/g, 'glass--rotate-90'],
  [/-glass-right-4/g, 'glass--right-4'],
  [/-glass--left-1/g, 'glass--left-1'],
  [/-glass-left-1/g, 'glass--left-1'],
  [/-glass--bottom-8/g, 'glass--bottom-8'],
  [/-glass-bottom-8/g, 'glass--bottom-8'],
  [/-glass-z-10/g, 'glass--z-10'],
  // display
  [/\bhidden\b/g, 'glass-hidden'],
  [/\binvisible\b/g, 'glass-invisible'],
  [/\bsticky\b/g, 'glass-sticky'],
  [/\bisolate\b/g, 'glass-isolate'],
  [/\boverscroll-contain\b/g, 'glass-overscroll-contain'],
  [/\bwriting-mode-vertical-lr\b/g, 'glass-writing-mode-vertical-lr'],
  [/\bmix-blend-difference\b/g, 'glass-mix-blend-difference'],
  [/\bml-\[-10px\]\b/g, 'glass-ml--10px'],
  [/\bfile:mr-4\b/g, 'glass-file-mr-4'],
  [/\bfile:glass-py-2\b/g, 'glass-file-py-2'],
  [/\bfile:glass-px-4\b/g, 'glass-file-px-4'],
  [/\bfile:glass-radius\b/g, 'glass-file-radius'],
  [/\bfile:glass-border-0\b/g, 'glass-file-border-0'],
  [/\bhover:ring-white\/20\b/g, 'glass-hover-ring-white-opacity-20'],
  [/\bactive:cursor-grabbing\b/g, 'glass-active-cursor-grabbing'],
  [/\bcursor-none\b/g, 'glass-cursor-none'],
  [/\bcursor-se-resize\b/g, 'glass-cursor-se-resize'],
  [/\bhover:r-3\b/g, 'glass-hover-r-3'],
  [/\bhover:no-glass-glass-underline\b/g, 'glass-hover-no-underline'],
  [/\bfocus:ring-0\b/g, 'glass-focus-ring-0'],
  [/\blist-disc\b/g, 'glass-list-disc'],
  [/\blist-inside\b/g, 'glass-list-inside'],
  [/\bchip\b/g, 'glass-chip'],
  [/\bOptimizedGlass\b/g, 'glass-optimized-glass'],
  [/\binline-block\b/g, 'glass-inline-block'],
  [/\binline-glass-block\b/g, 'glass-inline-block'],
  [/\binline\b/g, 'glass-inline'],
  [/\bblock\b/g, 'glass-block'],
  // opacity
  [/\bopacity-0\b/g, 'glass-opacity-0'],
  [/\bopacity-70\b/g, 'glass-opacity-70'],
  [/\bopacity-75\b/g, 'glass-opacity-75'],
  [/\bopacity-15\b/g, 'glass-opacity-15'],
  // ring
  [/\bring-1\b/g, 'glass-ring-1'],
  [/\bring-2\b/g, 'glass-ring-2'],
  [/\bring-white\/10\b/g, 'glass-ring-white-opacity-10'],
  [/\bfocus:ring-blue-500\b/g, 'glass-focus-ring-blue-500'],
  [/\bdisabled:cursor-not-allowed\b/g, 'glass-disabled-cursor-not-allowed'],
  // aspect ratio
  [/\baspect-square\b/g, 'glass-aspect-square'],
  [/\baspect-video\b/g, 'glass-aspect-video'],
  // duration
  [/\bduration-300\b/g, 'glass-duration-300'],
  [/\bease-out\b/g, 'glass-ease-out'],
  [/\bease-linear\b/g, 'glass-ease-linear'],
  // fill
  [/\bfill-white\/80\b/g, 'glass-fill-white-opacity-80'],
  [/\bfill-white\b/g, 'glass-fill-white'],
  [/\bfill-gray-600\b/g, 'glass-fill-gray-600'],
  [/\bfill-gray-700\b/g, 'glass-fill-gray-700'],
  // group (keep as utility class, but allow)
  [/\bgroup\b/g, 'glass-group'],
  // min/max width/height
  [/\bmin-w-0\b/g, 'glass-min-w-0'],
  [/\bmin-glass-w-0\b/g, 'glass-min-w-0'],
  [/\bmin-w-\[3ch\]\b/g, 'glass-min-w-3ch'],
  [/\bmin-w-\[18px\]\b/g, 'glass-min-w-18px'],
  [/\bmin-w-\[120px\]\b/g, 'glass-min-w-120px'],
  [/\bmin-w-\[2ch\]\b/g, 'glass-min-w-2ch'],
  [/\bmin-w-\[1\.25rem\]\b/g, 'glass-min-w-1-25rem'],
  [/\bmin-h-\[400px\]\b/g, 'glass-min-h-400px'],
  [/\bmin-h-\[300px\]\b/g, 'glass-min-h-300px'],
  [/\bmin-h-\[200px\]\b/g, 'glass-min-h-200px'],
  [/\bmin-glass-w-full\b/g, 'glass-min-w-full'],
  [/\bmin-glass-w-64\b/g, 'glass-min-w-64'],
  [/\bmin-glass-w-16\b/g, 'glass-min-w-16'],
  [/\bmin-glass-w-12\b/g, 'glass-min-w-12'],
  [/\bmin-glass-h-screen\b/g, 'glass-min-h-screen'],
  [/\bshrink-0\b/g, 'glass-shrink-0'],
  [/\bmax-h-96\b/g, 'glass-max-h-96'],
  [/\bmax-glass-h-96\b/g, 'glass-max-h-96'],
  [/\bmax-h-60\b/g, 'glass-max-h-60'],
  [/\bmax-w-2xl\b/g, 'glass-max-w-2xl'],
  [/\bmax-w-4xl\b/g, 'glass-max-w-4xl'],
  [/\bmax-w-7xl\b/g, 'glass-max-w-7xl'],
  [/\bmax-glass-w-full\b/g, 'glass-max-w-full'],
  [/\bmax-glass-h-full\b/g, 'glass-max-h-full'],
  [/\bmax-glass-h-32\b/g, 'glass-max-h-32'],
  [/\bmax-w-lg\b/g, 'glass-max-w-lg'],
  [/\bmax-w-sm\b/g, 'glass-max-w-sm'],
  [/\bmax-w-3xl\b/g, 'glass-max-w-3xl'],
  [/\bmax-w-6xl\b/g, 'glass-max-w-6xl'],
  [/\bmax-w-xl\b/g, 'glass-max-w-xl'],
  [/\bmax-w-\[80px\]\b/g, 'glass-max-w-80px'],
  [/\bmax-w-\[100px\]\b/g, 'glass-max-w-100px'],
  [/\bmax-h-\[80vh\]\b/g, 'glass-max-h-80vh'],
  [/\bmax-h-\[90vh\]\b/g, 'glass-max-h-90vh'],
  [/\bmax-glass-w-32\b/g, 'glass-max-w-32'],
  [/\bmax-glass-w-24\b/g, 'glass-max-w-24'],
  [/\bmax-glass-w-20\b/g, 'glass-max-w-20'],
  [/\bmax-glass-w-16\b/g, 'glass-max-w-16'],
  [/\bmax-glass-h-48\b/g, 'glass-max-h-48'],
  // pseudo-classes
  [/\blast:glass-border-b-0\b/g, 'glass-last-border-b-0'],
  // typography
  [/\bitalic\b/g, 'glass-italic'],
  [/\bbreak-all\b/g, 'glass-break-all'],
  [/\bresize-none\b/g, 'glass-resize-none'],
  [/\bshimmer\b/g, 'glass-shimmer'],
  [/\bdivide-y\b/g, 'glass-divide-y'],
  [/\bdivide-x\b/g, 'glass-divide-x'],
  [/\bdivide-white\/5\b/g, 'glass-divide-white-opacity-5'],
  [/\bdivide-glass-border\/20\b/g, 'glass-divide-border-opacity-20'],
  [/\bcol-span-full\b/g, 'glass-col-span-full'],
  [/\bcol-span-8\b/g, 'glass-col-span-8'],
  [/\bcol-span-4\b/g, 'glass-col-span-4'],
  [/\bcol-span-2\b/g, 'glass-col-span-2'],
  [/\binset-x-0\b/g, 'glass-inset-x-0'],
  [/\bbottom-1\b/g, 'glass-bottom-1'],
  [/\bscale-150\b/g, 'glass-scale-150'],
  [/\bscale-95\b/g, 'glass-scale-95'],
  [/\bscale-0\b/g, 'glass-scale-0'],
  [/\brotate-90\b/g, 'glass-rotate-90'],
  [/\brotate-45\b/g, 'glass-rotate-45'],
  [/\brotate-180\b/g, 'glass-rotate-180'],
  [/-rotate-90/g, 'glass--rotate-90'],
  [/-skew-x-12/g, 'glass--skew-x-12'],
  [/-translate-x-full/g, 'glass--translate-x-full'],
  // focus states
  [/\bfocus:ring-white\/30\b/g, 'glass-focus-ring-white-opacity-30'],
  [/focus:ring-white\/30/g, 'glass-focus-ring-white-opacity-30'],
  // Allow custom classes that are part of the design system
  [/\bsurface-1\b/g, 'glass-surface-1'],
  [/\bslider\b/g, 'glass-slider'],
  [/\bpersona-picker-card__swatch\b/g, 'glass-persona-picker-card__swatch'],
  [/\bvia-white\/3\b/g, 'glass-via-white-opacity-3'],
  [/\bvia-white\/10\b/g, 'glass-via-white-opacity-10'],
  [/\bvia-secondary\/20\b/g, 'glass-via-secondary-opacity-20'],
  [/\bvia-purple-400\/30\b/g, 'glass-via-purple-opacity-30'],
  // cursor
  [/\bcursor-crosshair\b/g, 'glass-cursor-crosshair'],
  [/\bcursor-move\b/g, 'glass-cursor-move'],
  [/\bcursor-grab\b/g, 'glass-cursor-grab'],
  [/\bcursor-ew-resize\b/g, 'glass-cursor-ew-resize'],
  // dark mode (keep as-is but allow)
  [/\bdark:glass-/g, 'dark:glass-'],
]);

const leftovers = new Map();

function processFile(file) {
  const code = fs.readFileSync(file, 'utf8');
  const updated = code.replace(/className\s*=\s*(["\'])([^\1]*?)\1/g, (m, q, classes) => {
    // First, clean up any double-transformed classes
    let cleaned = classes.replace(/glass-glass-+/g, 'glass-');
    cleaned = cleaned.replace(/glassglass--/g, 'glass--');
    cleaned = cleaned.replace(/glass-glass-/g, 'glass-');
    cleaned = cleaned.replace(/-glass--glass--glass--glass-/g, 'glass--');
    cleaned = cleaned.replace(/-glass--glass-/g, 'glass--');
    cleaned = cleaned.replace(/glassglassglassglass-/g, 'glass-');
    cleaned = cleaned.replace(/glassglassglass-/g, 'glass-');
    cleaned = cleaned.replace(/glassglass-/g, 'glass-');
    cleaned = cleaned.replace(/glassglass--/g, 'glass--');
    cleaned = cleaned.replace(/-glass--glassglass--/g, 'glass--');
    
    // Split into individual classes
    const parts = cleaned.split(/\s+/).filter(Boolean);
    const transformed = parts.map(k => {
      // Skip already transformed classes
      if (k.startsWith('glass-') || k.startsWith('sb-') || k.startsWith('storybook-') || k.startsWith('auraglass-')) {
        return k;
      }
      
      // Handle prefixed classes (hover:, md:, dark:, disabled:, last:, etc.)
      const prefixMatch = k.match(/^((?:hover|focus|active|disabled|dark|md|lg|sm|xl|2xl|last|first|odd|even):)(.+)$/);
      if (prefixMatch) {
        const prefix = prefixMatch[1];
        const baseClass = prefixMatch[2];
        
        // Skip if base class already has glass-
        if (baseClass.startsWith('glass-')) {
          return k;
        }
        
        // Transform the base class
        let transformedBase = baseClass;
        for (const [re, rep] of CLASS_MAP) {
          if (typeof rep === 'function') {
            transformedBase = transformedBase.replace(re, rep);
          } else {
            transformedBase = transformedBase.replace(re, rep);
          }
        }
        
        // Only return transformed if it changed
        if (transformedBase !== baseClass) {
          return prefix + transformedBase;
        }
        return k;
      }
      
      // Transform non-prefixed classes
      let result = k;
      for (const [re, rep] of CLASS_MAP) {
        const before = result;
        if (typeof rep === 'function') {
          result = result.replace(re, rep);
        } else {
          result = result.replace(re, rep);
        }
        // Prevent double transformation
        if (result.includes('glass-glass-')) {
          result = result.replace(/glass-glass-+/g, 'glass-');
        }
      }
      
      return result;
    });
    
    const newVal = transformed.join(' ');
    
    // record leftovers that still look tailwind-ish
    newVal.split(/\s+/).forEach(k => {
      if (!k) return;
      if (k.startsWith('glass-') || k.startsWith('sb-') || k.startsWith('storybook-') || k.startsWith('auraglass-')) return;
      if (/^(flex|grid|inline-flex|inline-grid|items-|justify-|w-|h-|bg-|text-|rounded|shadow|border|gap-)/.test(k)) {
        leftovers.set(k, (leftovers.get(k) || 0) + 1);
      }
    });
    
    return `className=${q}${newVal}${q}`;
  });

  if (updated !== code) {
    fs.writeFileSync(file, updated);
    return true;
  }
  return false;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    // Skip excluded directories and test/story files
    if (e.isDirectory()) {
      if (!EXCLUDE_DIRS.has(e.name) && !e.name.includes('test') && !e.name.includes('story')) {
        walk(p);
      }
    } else if (e.isFile() && exts.has(path.extname(e.name)) && 
               !e.name.includes('.test.') && !e.name.includes('.spec.') && 
               !e.name.includes('.stories.')) {
      processFile(p);
    }
  }
}

function main() {
  if (!fs.existsSync(ROOT)) {
    console.error('No src folder found');
    process.exit(1);
  }
  console.log('🔧 Running tw-to-glass codemod on src directory (excluding tests and stories) ...');
  walk(ROOT);
  if (leftovers.size) {
    const reportPath = path.join(process.cwd(), 'reports', 'tw-to-glass-leftovers.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(Object.fromEntries(leftovers), null, 2));
    console.log(`⚠️  Leftover utility classes recorded: ${reportPath}`);
  } else {
    console.log('✅ No leftovers. All mapped classes converted.');
  }
}

if (require.main === module) main();

module.exports = { processFile };
