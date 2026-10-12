/* Private S-31 factory shared by runtime seams and build-time metadata. */
import type { ComponentMeta } from '../contracts/components';
import { PART_NAME_RE } from '../contracts/components';

/** S-31. Identity at runtime; dev-validates the meta's part/state grammar once. */
const validated = new Set<string>();
export const defineMeta = <const M extends ComponentMeta>(meta: M): M => {
  if (process.env.NODE_ENV !== 'production' && !validated.has(meta.name)) {
    validated.add(meta.name);
    for (const part of meta.parts) {
      if (!PART_NAME_RE.test(part)) {
        console.error(`aura-glass: meta ${meta.name} has invalid part name ${JSON.stringify(part)} (S-33 kebab-case)`);
      }
    }
  }
  return meta;
};

