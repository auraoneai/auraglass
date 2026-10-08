// registry/items/diff-viewer — PLAT-365. Unified-diff viewer: consumer
// supplies parsed lines; the item renders a scrollable line-numbered table
// with data-ag-state markers per row kind. No diff parsing dependency —
// hunks are a prop.
import { Badge, Card, Text } from 'aura-glass';

export interface DiffLine {
  kind: 'add' | 'del' | 'context' | 'hunk';
  text: string;
  oldNo?: number;
  newNo?: number;
}
export interface DiffViewerProps {
  fileName: string;
  lines: DiffLine[];
  added?: number;
  removed?: number;
}

const KIND_PREFIX: Record<DiffLine['kind'], string> = { add: '+', del: '-', context: ' ', hunk: '@' };

export function DiffViewer({ fileName, lines, added, removed }: DiffViewerProps) {
  const adds = added ?? lines.filter((l) => l.kind === 'add').length;
  const dels = removed ?? lines.filter((l) => l.kind === 'del').length;
  return (
    <Card.Root data-ag-part="root" className="@container">
      <Card.Header data-ag-part="header">
        <Card.Title>{fileName}</Card.Title>
        <div className="grid grid-flow-col auto-cols-max gap-2">
          <Badge>+{adds}</Badge>
          <Badge>-{dels}</Badge>
        </div>
      </Card.Header>
      <Card.Body data-ag-part="body">
        <div data-ag-part="lines" className="overflow-x-auto font-mono" role="region" aria-label={`Diff for ${fileName}`} tabIndex={0}>
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((l, i) => (
                <tr key={i} data-ag-part="line" data-ag-state={l.kind}>
                  <td data-ag-part="line-no" className="w-12 select-none text-end align-top">
                    <Text size="sm" muted>{l.oldNo ?? ''}</Text>
                  </td>
                  <td data-ag-part="line-no" className="w-12 select-none text-end align-top">
                    <Text size="sm" muted>{l.newNo ?? ''}</Text>
                  </td>
                  <td data-ag-part="line-text" className="whitespace-pre-wrap align-top">
                    <Text type="mono" size="sm">{KIND_PREFIX[l.kind]}{l.text}</Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {lines.length === 0 ? <Text muted size="sm">No changes</Text> : null}
        </div>
      </Card.Body>
    </Card.Root>
  );
}
