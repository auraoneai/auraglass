// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// A module-scope variable initializer that reads document: rule (d) must flag it
// even though no ExpressionStatement touches the DOM.
const root = document.body;
export const BodyRef = () => root;
