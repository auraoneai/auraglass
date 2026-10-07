declare module 'next/navigation' {
  import type { ReactNode } from 'react';

  export function useServerInsertedHTML(handler: () => ReactNode): void;
}
