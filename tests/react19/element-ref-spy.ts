/**
 * REQ-PLAT-47 element-ref spy.
 *
 * React 19 removed `element.ref`; reading it logs
 * "Accessing element.ref was removed in React 19 ...". Any console.error
 * matching /element\.ref/ during a test fails that test, so a regression that
 * reintroduces a `child.ref` read on React 19 turns the react19 legs red.
 *
 * Usable two ways (idempotent, installs its hooks once per test file):
 * - imported by the leg test files (`import './element-ref-spy'`), and
 * - as `jest --setupFilesAfterEnv tests/react19/element-ref-spy.ts` in the CI
 *   leg script (FIN-B, ci/plat.gitlab-ci.yml).
 */

export const ELEMENT_REF_PATTERN = /element\.ref/;

const INSTALLED = Symbol.for('auraglass.react19.elementRefSpy');
type GlobalWithFlag = typeof globalThis & { [INSTALLED]?: boolean };

const formatArgs = (args: unknown[]): string =>
  args
    .map((a) => (typeof a === 'string' ? a : a instanceof Error ? a.message : String(a)))
    .join(' ');

/** Messages captured in the current test (exported for the spy's own test). */
export const capturedElementRefErrors: string[] = [];

export function installElementRefSpy(): void {
  const g = globalThis as GlobalWithFlag;
  if (g[INSTALLED]) return;
  g[INSTALLED] = true;

  let previous: typeof console.error | undefined;

  beforeEach(() => {
    capturedElementRefErrors.length = 0;
    previous = console.error;
    const forward = previous;
    console.error = (...args: unknown[]) => {
      const message = formatArgs(args);
      if (ELEMENT_REF_PATTERN.test(message)) {
        capturedElementRefErrors.push(message);
      }
      forward.apply(console, args as []);
    };
  });

  afterEach(() => {
    if (previous) console.error = previous;
    previous = undefined;
    if (capturedElementRefErrors.length > 0) {
      const found = capturedElementRefErrors.splice(0);
      throw new Error(
        `element-ref-spy: ${found.length} console.error call(s) matched ${ELEMENT_REF_PATTERN}:\n` +
          found.join('\n')
      );
    }
  });
}

installElementRefSpy();
