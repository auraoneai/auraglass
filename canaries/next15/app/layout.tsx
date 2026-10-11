/* PLAT-288 layout — Server Component: imports the assembled stylesheet and
   renders the S-22 provider shell. AuraGlassScript + AuraGlassProvider come
   from the theme entry; styles.css ships as its own subpath. */
import 'aura-glass/styles.css';
import { AuraGlassProvider, AuraGlassScript } from 'aura-glass/theme';
import type { ReactNode } from 'react';

export const metadata = { title: 'AuraGlass canary — next16' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <AuraGlassScript />
      </head>
      <body>
        <AuraGlassProvider>{children}</AuraGlassProvider>
      </body>
    </html>
  );
}
