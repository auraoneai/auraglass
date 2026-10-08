/* S-37 internals. `cn` is the only clsx importer in the package. */
import clsx, { type ClassValue } from 'clsx';

export const cn = (...inputs: ClassValue[]) => clsx(...inputs);
