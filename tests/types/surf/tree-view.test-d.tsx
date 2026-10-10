/* REQ-SURF-81: TreeView must be named — `aria-label | aria-labelledby` is a
   required union. Checked by `tsc -p tests/types/surf/tsconfig.json`. */
import * as React from 'react';
import { TreeView } from '../../../src/data/tree-view/TreeView';

type Node = { id: string; label: string; children?: Node[] };
const items: Node[] = [{ id: 'a', label: 'A' }];

// @ts-expect-error neither aria-label nor aria-labelledby
export const unnamed = <TreeView items={items} />;
// @ts-expect-error static children still need a name
export const unnamedStatic = <TreeView><TreeView.Item id="x" textValue="X">X</TreeView.Item></TreeView>;

export const labelled = <TreeView items={items} aria-label="Files" />;
export const labelledBy = <TreeView items={items} aria-labelledby="files-heading" />;
export const both = <TreeView items={items} aria-label="Files" aria-labelledby="files-heading" />;
export const localised = <TreeView items={items} aria-label="Fichiers" labels={{ expand: 'Ouvrir', collapse: 'Fermer' }} />;
void React;
