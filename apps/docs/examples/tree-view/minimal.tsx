import { TreeView } from 'aura-glass/data';

type Node = { id: string; label: string; children?: Node[] };

const FILES: Node[] = [
  { id: 'src', label: 'src', children: [{ id: 'index', label: 'index.ts' }] },
  { id: 'readme', label: 'README.md' },
];

export default function TreeViewMinimal() {
  return (
    <TreeView<Node>
      aria-label="Project files"
      items={FILES}
      getKey={(n) => n.id}
      getTextValue={(n) => n.label}
      getChildren={(n) => n.children}
      defaultExpandedKeys={['src']}
    />
  );
}
