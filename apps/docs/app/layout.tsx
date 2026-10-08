import type { Metadata } from 'next';
import NAV from '../nav.config';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'AuraGlass 5.0', template: '%s · AuraGlass 5.0' },
  description: 'AuraGlass 5.0 platform documentation — components, registry, guides and migration.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <header role="banner"><nav aria-label="Primary">
          <ul>{NAV.map((s) => (
            <li key={s.title}><strong>{s.title}</strong>
              <ul>{s.entries.map((e) => <li key={e.href}><a href={e.href}>{e.title}</a></li>)}</ul>
            </li>))}
          </ul>
        </nav></header>
        <main id="main" role="main">{children}</main>
        <footer role="contentinfo"><p>AuraGlass 5.0 · Apache-2.0</p></footer>
      </body>
    </html>
  );
}
