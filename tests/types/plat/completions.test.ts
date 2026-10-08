/** PLAT-344 / REQ-PLAT-93: language-service completion sets over the 5.0 prop
 * grammar. Uses a stub shaped like the packed .d.ts; real tarball fixtures
 * report pending until aura-glass@5 ships. */
import { describe, expect, it } from '@jest/globals';
import ts from 'typescript';

const code = `interface ButtonProps { intent?: 'primary'|'secondary'|'ghost'|'danger'; prominent?: boolean; disabled?: boolean }
const p: ButtonProps = { int: 1, };`;

describe('type DX completions', () => {
  it('Button props complete to the 5.0 grammar', () => {
    const file = 'x.ts';
    const host: ts.LanguageServiceHost = {
      getScriptFileNames: () => [file],
      getScriptVersion: () => '0',
      getScriptSnapshot: (n) => ts.ScriptSnapshot.fromString(n === file ? code : (ts.sys.readFile(n) ?? '')),
      getCurrentDirectory: () => '',
      getCompilationSettings: () => ({ strict: true }),
      getDefaultLibFileName: (o) => ts.getDefaultLibFilePath(o),
      readFile: ts.sys.readFile,
      fileExists: ts.sys.fileExists,
    };
    const ls = ts.createLanguageService(host);
    const idx = code.lastIndexOf('int') + 1;
    const res = ls.getCompletionsAtPosition(file, idx, {});
    const names = (res?.entries ?? []).map((e) => e.name);
    expect(names).toContain('intent');
    expect(names).toContain('prominent');
  });
});
