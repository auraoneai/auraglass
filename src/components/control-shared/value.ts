/** Controlled/uncontrolled switch guard (CMP-096): warns once per component when a
 * value-ish prop flips between controlled and uncontrolled across renders. */
const warned = new Set<string>();

export function warnControlledSwitch(
  component: string,
  prop: 'value' | 'checked' | 'pressed',
  wasControlled: boolean,
  isControlled: boolean,
): void {
  if (wasControlled === isControlled || warned.has(`${component}:${prop}`)) return;
  warned.add(`${component}:${prop}`);
  // eslint-disable-next-line no-console
  console.error(
    `[aura-glass] ${component}: '${prop}' switched from ${wasControlled ? 'controlled' : 'uncontrolled'} ` +
      `to ${isControlled ? 'controlled' : 'uncontrolled'}. Keep it in one mode for the component's lifetime.`,
  );
}
