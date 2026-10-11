/* PLAT-291: PLAT-owned canary entry — import.meta.glob discovers
   './<stream>/<File>.page.tsx' page modules as routes /<stream>/<file>.
   Pages are lazy: each route loads only its own chunk, so the first-load JS of
   /plat/button minus /plat/empty is the real cost of the styled Button. */
import { StrictMode, Suspense, createElement, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import 'aura-glass/styles.css';

const pages = import.meta.glob('./*/**/*.page.tsx') as Record<
  string,
  () => Promise<{ default: React.ComponentType }>
>;

const route = (path: string): string => {
  const m = path.match(/^\.\/([^/]+)\/([^/]+)\.page\.tsx$/);
  /* routes are lowercase: plat/Button.page.tsx -> /plat/button */
  return m ? `/${m[1]!.toLowerCase()}/${m[2]!.toLowerCase()}` : '/';
};

const current = () => window.location.pathname.replace(/\/$/, '') || '/';

const entries = Object.entries(pages).map(([file, load]) => [route(file), lazy(load)] as const);

function App() {
  const page = entries.find(([r]) => r === current());
  return (
    <Suspense fallback={null}>
      <nav data-ag-canary="nav">
        {entries.map(([r]) => (
          <a key={r} href={r} style={{ marginRight: 8 }}>{r}</a>
        ))}
      </nav>
      {page ? createElement(page[1]) : <p data-ag-canary="index">canary index</p>}
    </Suspense>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
);
