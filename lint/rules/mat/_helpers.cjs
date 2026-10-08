/* MAT lane V lint helpers — shared filename/predicate utilities (CJS). */
'use strict';
const path = require('node:path');

const norm = (f) => f.split(path.sep).join('/');
const inFile = (filename, re) => re.test(norm(filename));
const isTestFile = (f) => /__tests__|\.test\.|\.stories\.|fixtures/.test(norm(f));

const SRC_GLOB = 'src/**/*.{ts,tsx,js,jsx}';
const SRC_ALL_GLOB = 'src/**/*.{ts,tsx,js,jsx,mjs,cjs}';

/** Object property key as a plain string ('"x"'/x/`x` → 'x'). */
const keyName = (prop) => {
  if (!prop || prop.type !== 'Property') return null;
  const k = prop.key;
  if (k.type === 'Identifier') return k.name;
  if (k.type === 'Literal') return String(k.value);
  return null;
};

module.exports = { norm, inFile, isTestFile, keyName, SRC_GLOB, SRC_ALL_GLOB };
