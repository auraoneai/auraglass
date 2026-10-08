// fixtures.ts — deterministic code sample (contract §3.3).
import type { CodeSurfaceProps } from './index';

export const codeSample = `export function emit(value: unknown): string {
  if (value == null) return '';
  if (Array.isArray(value)) return value.map(emit).join(',');
  return JSON.stringify(value);
}
`;

export const codeProps: CodeSurfaceProps = {
  name: 'emit.ts',
  language: 'ts',
  code: codeSample,
  readOnly: true,
};

export const codePropsEditable: CodeSurfaceProps = {
  name: 'notes.ts',
  language: 'ts',
  code: 'const draft = true;\n',
  readOnly: false,
};
