// app/nav.json/route.ts — REQ-PLAT-99. Emits the resolved navigation as
// out/nav.json in the static export; scripts/docs/verify-docs-out.mjs checks
// that every href in it has an HTML file in apps/docs/out.
import { buildSite, docsAppDir } from '../../lib/routes';

export const dynamic = 'force-static';

export function GET() {
  const { nav, data } = buildSite(docsAppDir());
  return Response.json({ version: data.version, nav });
}
