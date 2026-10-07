/* tree-select fixtures — deterministic values only. */
export const FILES = [
  { key: 'src', label: 'src', children: [
    { key: 'src/app', label: 'app' },
    { key: 'src/lib', label: 'lib', children: [{ key: 'src/lib/util', label: 'util' }] },
  ] },
  { key: 'docs', label: 'docs', children: [{ key: 'docs/api', label: 'api' }] },
];
