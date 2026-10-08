// filter-model-ops.ts: pure tree operations backing FilterBar.useModel —
// same update logic shared between the React hook and non-React tests.
import type { FilterGroup, FilterModel, FilterNode, FilterRule } from './filter-model';
import { isGroup } from './filter-model';

function updateNode(node: FilterNode, fn: (g: FilterGroup) => FilterGroup, targetId: string): FilterNode {
  if (node.kind === 'rule') return node;
  if (node.id === targetId) return fn(node);
  return { ...node, children: node.children.map((c) => updateNode(c, fn, targetId)) };
}

function withoutRule(node: FilterNode, ruleId: string): FilterNode | null {
  if (node.kind === 'rule') return node.id === ruleId ? null : node;
  const children = node.children
    .map((c) => withoutRule(c, ruleId))
    .filter((c): c is FilterNode => c !== null);
  return { ...node, children };
}

function withoutGroup(node: FilterNode, groupId: string, rootId: string): FilterNode {
  if (node.kind === 'rule') return node;
  return {
    ...node,
    children: node.children
      .filter((c) => !(c.kind === 'group' && c.id === groupId && c.id !== rootId))
      .map((c) => withoutGroup(c, groupId, rootId)),
  };
}

function withRulePatch(node: FilterNode, ruleId: string, patch: Partial<Omit<FilterRule, 'id' | 'kind'>>): FilterNode {
  if (node.kind === 'rule') return node.id === ruleId ? ({ ...node, ...patch } as FilterRule) : node;
  return { ...node, children: node.children.map((c) => withRulePatch(c, ruleId, patch)) };
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
