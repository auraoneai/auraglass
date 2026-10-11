// NavTree.tsx — REQ-PLAT-99. Renders nav.config.ts sections with next/link
// (basePath-aware). Shared by the desktop sidebar and the mobile Sheet.
import Link from 'next/link';
import type { NavSection } from '../nav.config';

export function NavTree({ nav, label, current, onNavigate }: { nav: NavSection[]; label: string; current?: string; onNavigate?: () => void }) {
  return (
    <nav aria-label={label} className="docs-nav">
      <ul>
        {nav.map((s) => (
          <li key={s.title}>
            <h2 className="docs-nav-section">{s.title}</h2>
            {s.groups.map((g) => (
              <div key={g.title}>
                {s.groups.length > 1 ? <h3 className="docs-nav-group">{g.title}</h3> : null}
                {g.entries.length ? (
                  <ul>
                    {g.entries.map((e) => (
                      <li key={e.href}>
                        <Link href={e.href} aria-current={current === e.href ? 'page' : undefined} {...(onNavigate ? { onClick: onNavigate } : {})}>{e.title}</Link>
                      </li>
                    ))}
                  </ul>
                ) : <p className="docs-nav-empty" data-ag-state="pending">None yet</p>}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </nav>
  );
}
