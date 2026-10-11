/* FIN-G lane fixture: repository root (lanes run from any cwd). */
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
