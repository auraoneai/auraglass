import type { NextConfig } from 'next';
import { DOCS_BASE_URL } from '../../scripts/docs/paths.mjs';

/* Static export for GitLab Pages; basePath mirrors the Pages URL until the
   custom domain decision (OD-12) lands — paths.mjs resolves $CI_PAGES_URL. */
const base = process.env.NEXT_BASE_PATH ?? (DOCS_BASE_URL ? new URL(DOCS_BASE_URL, 'https://pages.example.com').pathname.replace(/\/$/, '') : '');
const config: NextConfig = {
  output: 'export',
  basePath: base || undefined,
  assetPrefix: base ? `${base}/` : undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};
export default config;
