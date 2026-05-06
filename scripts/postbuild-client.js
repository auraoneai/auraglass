#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const distRoot = path.resolve(__dirname, '..', 'dist');
const clientDir = path.join(distRoot, 'client');

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

const writeFile = (filePath, contents) => {
  fs.writeFileSync(filePath, contents, 'utf8');
};

ensureDir(clientDir);

const cjsStub = `'use client';

module.exports = require('../index.js');
`;

const esmStub = `'use client';

export * from '../index.mjs';
`;

const dtsStub = "export * from '../index';\n";

writeFile(path.join(clientDir, 'index.js'), cjsStub);
writeFile(path.join(clientDir, 'index.mjs'), esmStub);
writeFile(path.join(clientDir, 'index.d.ts'), dtsStub);
