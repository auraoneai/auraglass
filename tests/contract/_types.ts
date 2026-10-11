/* Type-surface checks for S-30 (QUAL, §6.3 components.test.tsx): the props each CMP export
   declares, read with the TypeScript checker from the same source modules api-extractor rolls
   into the published .d.ts. */
import { join } from 'node:path';
import * as ts from 'typescript';
import { ROOT } from './_conformance';

export interface ExportProps { /** e.g. 'Dialog.Root' or 'Button' */ name: string; props: string[] }

let cached: { program: ts.Program; checker: ts.TypeChecker } | null = null;
function program(files: string[]) {
  if (cached) return cached;
  const cfg = ts.getParsedCommandLineOfConfigFile(join(ROOT, 'tsconfig.json'), {}, {
    ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {},
  });
  const p = ts.createProgram([...files.map((f) => join(ROOT, f)), join(ROOT, 'src/contracts/components.ts')],
    { ...(cfg?.options ?? {}), noEmit: true, skipLibCheck: true });
  cached = { program: p, checker: p.getTypeChecker() };
  return cached;
}

function propsOf(checker: ts.TypeChecker, type: ts.Type, at: ts.Node): string[] | null {
  const sig = type.getCallSignatures()[0];
  const param = sig?.getParameters()[0];
  if (!param) return null;
  return checker.getTypeOfSymbolAtLocation(param, at).getProperties().map((s) => s.name).sort();
}

/** Props of `exportName` in `file` (a component, or each component member of a compound object). */
export function exportProps(files: string[], file: string, exportName: string): ExportProps[] | null {
  const { program: p, checker } = program(files);
  const sf = p.getSourceFile(join(ROOT, file));
  if (!sf) return null;
  const mod = checker.getSymbolAtLocation(sf);
  if (!mod) return null;
  const ex = checker.getExportsOfModule(mod).find((s) => s.name === exportName);
  if (!ex) return null;
  const type = checker.getTypeOfSymbolAtLocation(ex, sf);
  const own = propsOf(checker, type, sf);
  if (own) return [{ name: exportName, props: own }];
  const out: ExportProps[] = [];
  for (const member of type.getProperties()) {
    const props = propsOf(checker, checker.getTypeOfSymbolAtLocation(member, sf), sf);
    if (props) out.push({ name: `${exportName}.${member.name}`, props });
  }
  return out;
}

/** Keys of CmpRootProps[K] from src/contracts/components.ts (the S-30 root props). */
export function contractRootProps(files: string[], name: string): string[] {
  const { program: p, checker } = program(files);
  const sf = p.getSourceFile(join(ROOT, 'src/contracts/components.ts'))!;
  const sym = checker.getExportsOfModule(checker.getSymbolAtLocation(sf)!).find((s) => s.name === 'CmpRootProps')!;
  const iface = checker.getDeclaredTypeOfSymbol(sym);
  const member = iface.getProperty(name);
  if (!member) return [];
  return checker.getTypeOfSymbolAtLocation(member, sf).getProperties().map((s) => s.name).sort();
}
