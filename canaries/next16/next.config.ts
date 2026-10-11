import type { NextConfig } from 'next';

/* PLAT-288: Turbopack, no transpilePackages (the packed artifact must stand on
   its own). */
const nextConfig: NextConfig = {
  turbopack: {},
};

export default nextConfig;
