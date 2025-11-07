'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { GlassButton } from '../button/GlassButton';

export interface ColumnDef<T=any> { key: keyof T; header: string }
export interface GlassFormTableProps<T=any> { columns: ColumnDef<T>[]; rows: T[]; onChange: (rows:T[])=>void }

export function GlassFormTable<T=any>({ columns, rows, onChange }: GlassFormTableProps<T>) {
  const update = (ri: number, key: keyof T, v: any) => {
    const next = rows.slice();
    (next[ri] as any)[key] = v; onChange(next);
  };
  const add = () => onChange([...rows, {} as any]);
  const remove = (ri: number) => onChange(rows.filter((_,i)=>i!==ri));
  return (
    <div className={cn('glass-overflow-auto glass-radius-xl glass-border glass-border-white-15')} role="region" aria-label="Editable data table">
      <table className={cn('glass-w-full glass-text-sm')} role="table" aria-label="Form data table">
        <thead className={cn('glass-surface-white-5')}>
          <tr role="row">
            {columns.map((c: any) => <th key={String(c.key)} role="columnheader" className={cn('glass-text-left glass-px-3 glass-py-2 glass-text-primary-70')}>{c.header}</th>)}
            <th role="columnheader" className={cn('glass-px-3 glass-py-2')} aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} role="row" className={cn('glass-border-t glass-border-white-10')}>
              {columns.map((c: any) => (
                <td key={String(c.key)} role="gridcell" className={cn('glass-px-3 glass-py-2')}>
                  <input
                    className={cn('glass-bg-transparent glass-border glass-border-white-20 glass-radius-md glass-px-2 glass-py-1 glass-w-full')}
                    value={(r as any)[c.key] ?? ''}
                    onChange={(e)=>update(ri, c.key, e.target.value)}
                    aria-label={`${c.header} for row ${ri + 1}`}
                  />
                </td>
              ))}
              <td role="gridcell" className={cn('glass-px-3 glass-py-2 glass-text-right')}>
                <GlassButton size="sm" variant="ghost" onClick={(e) =>remove(ri)} aria-label={`Remove row ${ri + 1}`}>Remove</GlassButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={cn('glass-p-2')}>
        <GlassButton size="sm" variant="secondary" onClick={add} aria-label="Add new row">Add Row</GlassButton>
      </div>
    </div>
  );
}

export default GlassFormTable;

