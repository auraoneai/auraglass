/// <reference types="vite/client" />
/* QUAL (REQ-QUAL-51; FIN-450): every ComponentMeta in the tree, by name, for the generated docs pages.
   Kept in its own module because import.meta.glob is Vite-only (Jest config tests substitute it). */
import type { ComponentMeta } from '../../src/contracts/components';

const modules = import.meta.glob<Record<string, unknown>>('../../src/**/*.meta.ts', { eager: true });

const isMeta = (v: unknown): v is ComponentMeta =>
  !!v && typeof v === 'object' && typeof (v as ComponentMeta).name === 'string' && Array.isArray((v as ComponentMeta).parts)
  && Array.isArray((v as ComponentMeta).migration) && typeof (v as ComponentMeta).owner === 'string';

/** default export or a named `defineMeta` export (e.g. `export const AvatarGroupMeta = defineMeta(...)`). */
export const META_BY_NAME: ReadonlyMap<string, ComponentMeta> = new Map(
  Object.values(modules).flatMap((m) => Object.values(m).filter(isMeta)).map((m) => [m.name, m] as const));
