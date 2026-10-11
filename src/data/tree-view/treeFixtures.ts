/* Shared TreeView fixtures for the stories and the jest suites
   (REQ-SURF-82 keyboard tree, REQ-SURF-83 5,000-node tree). Not exported
   from the package entry. */

export type TreeFixtureNode = { id: string; label: string; children?: TreeFixtureNode[] };

/** Three levels with expandable siblings at the root ('*'), a nested parent
    (Right into child, Left to parent) and distinct initials (type-ahead). */
export const KEYBOARD_TREE: TreeFixtureNode[] = [
  {
    id: 'apple',
    label: 'Apple',
    children: [
      { id: 'apricot', label: 'Apricot' },
      { id: 'avocado', label: 'Avocado', children: [{ id: 'hass', label: 'Hass' }] },
    ],
  },
  { id: 'banana', label: 'Banana', children: [{ id: 'blueberry', label: 'Blueberry' }] },
  { id: 'cherry', label: 'Cherry' },
  { id: 'date', label: 'Date', children: [{ id: 'medjool', label: 'Medjool' }] },
];

const FOLDERS = 50;
const FILES_PER_FOLDER = 99;

/** 50 folders x 99 files = 5,000 nodes. */
export const VIRTUAL_TREE: TreeFixtureNode[] = Array.from({ length: FOLDERS }, (_, i) => ({
  id: `folder-${i}`,
  label: `Folder ${i}`,
  children: Array.from({ length: FILES_PER_FOLDER }, (_, j) => ({ id: `file-${i}-${j}`, label: `File ${i}.${j}` })),
}));

export const VIRTUAL_TREE_PARENT_KEYS: readonly string[] = VIRTUAL_TREE.map((n) => n.id);

export const VIRTUAL_TREE_NODE_COUNT = FOLDERS * (FILES_PER_FOLDER + 1);
