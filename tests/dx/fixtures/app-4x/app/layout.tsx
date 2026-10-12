import 'aura-glass/styles';
import type { ReactNode } from 'react';

export const metadata = { title: 'AuraGlass 4.x canary app' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
