/* Types for quickstart-steps.mjs (REQ-PLAT-103). */
export interface QuickstartBlock {
  kind: 'step' | 'prepare';
  phase: string;
  line: number;
  variant: string | null;
  file: string | null;
  lang: string;
  body: string;
}
export declare const PHASES: readonly string[];
export declare const SHELL_LANGS: Set<string>;
export declare const LIMITS: { commands: number; edits: number };
export declare function parseQuickstart(md: string): QuickstartBlock[];
export declare function stepsFor(blocks: QuickstartBlock[], variant: string): QuickstartBlock[];
export declare function isShell(b: QuickstartBlock): boolean;
export declare function isEdit(b: QuickstartBlock): boolean;
export declare function commandOf(b: QuickstartBlock): string;
export declare function countSteps(steps: QuickstartBlock[]): { commands: number; edits: number };
export declare function validateVariant(blocks: QuickstartBlock[], variant: string, framework: 'next' | 'vite'): string[];
export declare function renderReadmeQuickstart(blocks: QuickstartBlock[], variant: string): string;
