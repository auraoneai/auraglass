/* @ag-contract-seed: S-51. Owner QUAL. Each block renders a plain <table> from the
   meta fields named in §4.9. The only .storybook/** module MDX may import. */
import * as React from 'react';
import type { ComponentMeta } from '../../src/contracts/components';
import type { ApgStep } from '../../src/contracts/testing';

const T = ({ head, rows }: { head: readonly string[]; rows: readonly (readonly React.ReactNode[])[] }) => (
  <table>
    <thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
    <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
  </table>
);

/** The data-ag-part table. */
export function Anatomy({ of }: { of: ComponentMeta }) {
  return <T head={['part', 'selector']} rows={of.parts.map((p) => [p, `[data-ag-part="${p}"]`])} />;
}

/** APG keyboard script as a table. */
export function KeyboardTable({ script }: { script: readonly ApgStep[] }) {
  return (
    <T
      head={['keys', 'expected focus', 'expected state', 'announced']}
      rows={script.map((s) => [
        [s.press, s.type].filter(Boolean).join(' then ') || '—',
        s.expectFocus ?? '—',
        s.expectState ? Object.entries(s.expectState).map(([k, v]) => `${k}=${v}`).join(' ') : '—',
        s.expectAnnounced ?? '—',
      ])}
    />
  );
}

/** meta.migration rows. */
export function MigrationTable({ of }: { of: ComponentMeta }) {
  return (
    <T
      head={['4.x name', 'automation', 'compat', 'props']}
      rows={of.migration.map((m) => [
        m.from, m.automation, m.compat ? 'yes' : 'no',
        m.props ? Object.keys(m.props).join(', ') : '—',
      ])}
    />
  );
}

/** meta variants and states. */
export function PropsTable({ of }: { of: ComponentMeta }) {
  return (
    <T
      head={['prop', 'values']}
      rows={[
        ...Object.entries(of.variants).map(([k, v]) => [k, v.join(' | ')] as const),
        ...(of.states.length ? [['data-state', of.states.join(' | ')] as const] : []),
      ]}
    />
  );
}

/** migration.selectors rows across all migration entries. */
export function SelectorTable({ of }: { of: ComponentMeta }) {
  const rows = of.migration.flatMap((m) =>
    Object.entries(m.selectors ?? {}).map(([from, to]) => [m.from, from, to] as const));
  return <T head={['4.x name', 'from selector', 'to selector']} rows={rows} />;
}
