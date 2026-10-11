// tests/types/surf/prop-grammar.app-shell.test-d.ts — REQ-SURF-11 / REQ-SURF-20
// (REQ-FIN-80, AC-FIN-80). AppShell.Root carries exactly the five serializable
// contract props; `density` (MAT's provider attribute data-ag-density) and
// `backdrop` (data-ag-backdrop) are not AppShell props.
//
// Producer: #349 (next-fin/surf-app-shell-b, SURF-20) removes the props. Until
// it is on the line, surf:test:types reports this file `pending` (lane runner,
// PRD-F §4.3 rule 2) instead of compiling it; once AppShellRootProps no longer
// declares `density`, the job compiles it and it must pass.
import type { PartProps } from '../../../src/contracts/components';
import type { AppShellRootProps } from '../../../src/app-shell/index';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Expect<T extends true> = T;

type OwnKeys = Exclude<keyof AppShellRootProps, keyof PartProps<'div'>>;
type _exactFive = Expect<Equal<OwnKeys, 'defaultSidebar' | 'defaultInspector' | 'sidebarSide' | 'layout' | 'persistKey'>>;
type _noDensity = Expect<Equal<'density' extends keyof AppShellRootProps ? true : false, false>>;
type _noBackdrop = Expect<Equal<'backdrop' extends keyof AppShellRootProps ? true : false, false>>;
type _layout = Expect<Equal<NonNullable<AppShellRootProps['layout']>, 'auto' | 'desktop' | 'mobile'>>;

// @ts-expect-error density is the provider's data-ag-density (MAT setter), not a Root prop
const withDensity: AppShellRootProps = { density: 'compact' };
// @ts-expect-error backdrop is declared by Backdrop/MAT, not by AppShell.Root
const withBackdrop: AppShellRootProps = { backdrop: 'page' };

export type { _exactFive, _noDensity, _noBackdrop, _layout };
export { withDensity, withBackdrop };
