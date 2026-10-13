/* User-app dependency model for docs snippet type-checking (REQ-PLAT-102).
   The Tailwind quickstart variant installs @tailwindcss/vite in the user
   app; samples use only its default export returning Vite plugins. */
import type { Plugin } from 'vite';

export default function tailwindcss(): Plugin[];
