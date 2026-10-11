// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
// TODO(aura-glass 5): ambiguous GlassStepper — pick Steps (wizard UI) or NumberField (numeric input), see #dep
export function X() {
  return <GlassStepper value={n} onChange={setN} />;
}
