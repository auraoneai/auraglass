// filter-model-ops.ts: pure tree operations backing FilterBar.useModel —
// same update logic shared between the React hook and non-React tests.
import type { FilterGroup, FilterModel, FilterNode, FilterRule } from './filter-model';
import { isGroup } from './filter-model';

/* SURF-085: identity-preserving updates — a subtree is only re-created when
   a descendant actually changed; untouched branches keep their objects so
   memoized consumers (React.memo on group refs) don't re-render. */

function updateNode(node: FilterNode, fn: (g: FilterGroup) => FilterGroup, targetId: string): FilterNode {
  if (node.kind === 'rule') return node;
  if (node.id === targetId) return fn(node);
  const children = node.children.map((c) => updateNode(c, fn, targetId));
  return children.every((c, i) => c === node.children[i]) ? node : { ...node, children };
}

function withoutRule(node: FilterNode, ruleId: string): FilterNode | null {
  if (node.kind === 'rule') return node.id === ruleId ? null : node;
  const children = node.children
    .map((c) => withoutRule(c, ruleId))
    .filter((c): c is FilterNode => c !== null);
  return children.length === node.children.length && children.every((c, i) => c === node.children[i])
    ? node
    : { ...node, children };
}

function withoutGroup(node: FilterNode, groupId: string, rootId: string): FilterNode {
  if (node.kind === 'rule') return node;
  const filtered = node.children.filter(
    (c) => !(c.kind === 'group' && c.id === groupId && c.id !== rootId),
  );
  const children = filtered.map((c) => withoutGroup(c, groupId, rootId));
  return children.length === node.children.length && children.every((c, i) => c === node.children[i])
    ? node
    : { ...node, children };
}

function withRulePatch(node: FilterNode, ruleId: string, patch: Partial<Omit<FilterRule, 'id' | 'kind'>>): FilterNode {
  if (node.kind === 'rule') return node.id === ruleId ? ({ ...node, ...patch } as FilterRule) : node;
  const children = node.children.map((c) => withRulePatch(c, ruleId, patch));
  return children.every((c, i) => c === node.children[i]) ? node : { ...node, children };
}

/** applyModel(root, fn) — runs a model-shaped mutation set, returns the new root. */
export function applyModel(root: FilterGroup, fn: (m: Omit<FilterModel, 'value'>) => void): FilterGroup {
  let next = root;
  const model: Omit<FilterModel, 'value'> = {
    addRule: (rule, groupId) => {
      const target = groupId ?? next.id;
      next = updateNode(next, (g) => ({ ...g, children: [...g.children, rule] }), target) as FilterGroup;
    },
    updateRule: (ruleId, patch) => {
      next = withRulePatch(next, ruleId, patch) as FilterGroup;
    },
    removeRule: (ruleId) => {
      next = withoutRule(next, ruleId) as FilterGroup;
    },
    addGroup: (group, parentId) => {
      if (group === undefined) return;
      const target = parentId ?? next.id;
      next = updateNode(next, (g) => ({ ...g, children: [...g.children, group] }), target) as FilterGroup;
    },
    removeGroup: (groupId) => {
      next = withoutGroup(next, groupId, next.id) as FilterGroup;
    },
    setCombinator: (groupId, combinator) => {
      next = updateNode(next, (g) => ({ ...g, combinator }), groupId) as FilterGroup;
    },
    clear: () => {
      next = { ...next, children: [] };
    },
  };
  fn(model);
  return next;
}

export { isGroup };
