import type { Metadata } from 'next';
import Link from 'next/link';
import { AuraGlassProvider, AuraGlassScript } from 'aura-glass';
import { buildSite, docsAppDir } from '../lib/routes';
import { NavTree } from '../components/NavTree';
import { MobileNav } from '../components/MobileNav';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'AuraGlass 5.0', template: '%s · AuraGlass 5.0' },
  description: 'AuraGlass 5.0 platform documentation — components, registry, guides and migration.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { nav, data } = buildSite(docsAppDir());
  return (
    /* The pre-paint script writes data-ag-* from the reader's own stored and
       system preferences; the provider gets no preference props, so the docs
       never force a scheme, contrast, transparency or motion setting. */
    <html lang="en" suppressHydrationWarning>
      <head><AuraGlassScript /></head>
      <body>
        <AuraGlassProvider>
        <a href="#main" className="skip">Skip to content</a>
        <header role="banner" className="docs-header">
          <Link href="/" className="docs-home">AuraGlass {data.version}</Link>
          <MobileNav nav={nav} />
        </header>
        <div className="docs-shell">
          <aside className="docs-sidebar"><NavTree nav={nav} label="Primary" /></aside>
          <main id="main" role="main" tabIndex={-1}>{children}</main>
        </div>
        <footer role="contentinfo"><p>AuraGlass {data.version} · Apache-2.0</p></footer>
        </AuraGlassProvider>
      </body>
    </html>
  );
}
