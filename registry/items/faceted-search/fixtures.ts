/* faceted-search fixtures — deterministic values only. */
export const FACETS = [
  { id: 'type', label: 'Type', type: 'enum' as const, options: [{ value: 'doc', label: 'Doc' }, { value: 'issue', label: 'Issue' }, { value: 'pr', label: 'Pr' }] },
  { id: 'repo', label: 'Repo', type: 'enum' as const, options: [{ value: 'core', label: 'Core' }, { value: 'web', label: 'Web' }, { value: 'docs', label: 'Docs' }] },
  { id: 'stars', label: 'Stars', type: 'number' as const },
];

export const RESULTS = [
  { id: 'r1', title: 'Grid keyboard spec', type: 'doc', repo: 'core', stars: 41 },
  { id: 'r2', title: 'Fix paginator off-by-one', type: 'issue', repo: 'web', stars: 3 },
  { id: 'r3', title: 'Add aria-live to feed', type: 'pr', repo: 'core', stars: 12 },
];
