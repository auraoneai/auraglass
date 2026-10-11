/* REQ-SURF-82 / OD-20: the single place that names TreeView's ARIA roles.
   TreeView renders a React Aria Components Tree, whose semantics are the APG
   treegrid pattern: role=treegrid on the root, role=row (+ aria-level,
   aria-setsize, aria-posinset, aria-expanded) on every item. OD-20 (owner
   decision, not yet recorded) chooses between accepting that `treegrid`
   rendering and requiring the APG `tree`/`treeitem` roles. Until it is
   recorded, `treegrid` is the default (PRD-F §5.6 / OD-20 proposal).

   Everything that depends on the role names — TreeView's own keyboard
   handling, the jest suites and the remote APG / e2e / perf specs — reads
   them from here, so the OD-20 outcome changes this module (and, for
   `tree`, the RAC role override in TreeView.tsx) and nothing else. */

export const TREE_SEMANTICS = 'treegrid' as const;

/** Role of the TreeView root element. */
export const TREE_ROLE = 'treegrid' as const;

/** Role of every TreeView item element. */
export const TREE_ITEM_ROLE = 'row' as const;

/** CSS selector matching every rendered TreeView item. */
export const TREE_ITEM_SELECTOR = `[role="${TREE_ITEM_ROLE}"]` as const;
