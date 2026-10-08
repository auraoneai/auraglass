/** PLAT-344 / REQ-PLAT-93: type-DX contract for the packed aura-glass .d.ts.
 * Compile-time only (tsc --noEmit). Seed subjects report `pending` until the
 * 5.0 tarball exists; this file pins the expected post-migration grammar. */

// Minimal local mirror of the packed types (kept in sync with the canary).
interface ButtonProps {
  intent?: 'primary' | 'secondary' | 'ghost' | 'danger';
  prominent?: boolean;
  disabled?: boolean;
}
declare function Assert<T extends true>(): void;
type IsExact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

// intent literal union
type _I = Assert<IsExact<NonNullable<ButtonProps['intent']>, 'primary' | 'secondary' | 'ghost' | 'danger'>>;
// prominent exists (prop-grammar variant="primary" -> intent="primary" prominent)
type _P = Assert<IsExact<ButtonProps['prominent'], boolean | undefined>>;

// variant is not a 5.0 prop
const bad: ButtonProps = {
  // @ts-expect-error variant was renamed to intent by prop-grammar
  variant: 'primary',
};
void bad;
void _I;
