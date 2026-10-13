/* User-app dependency model for docs snippet type-checking (REQ-PLAT-102).
   Quickstart/guide samples run in an app where the user installed
   @vitejs/plugin-react; this declared surface is exactly what the samples
   use — a default export returning Vite plugins. It is not a copy of the
   package's own types and never ships. */
import type { Plugin } from 'vite';

export default function react(): Plugin[];
