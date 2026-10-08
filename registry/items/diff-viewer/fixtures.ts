// fixtures.ts — deterministic diff rows (contract §3.3).
import type { DiffViewerProps } from './index';

export const diffLines: DiffViewerProps['lines'] = [
  { kind: 'hunk', text: '@@ -12,7 +12,8 @@ export function build' },
  { kind: 'context', text: '  const items = collect();', oldNo: 12, newNo: 12 },
  { kind: 'del', text: '  return items.sort((a, b) => a.name - b.name);', oldNo: 13 },
  { kind: 'add', text: '  return items.sort((a, b) => a.name.localeCompare(b.name));', newNo: 13 },
  { kind: 'add', text: '}', newNo: 14 },
  { kind: 'context', text: '}', oldNo: 14, newNo: 15 },
];

export const diffProps: DiffViewerProps = {
  fileName: 'scripts/registry/build.mjs',
  lines: diffLines,
};
