/** @type {import('next').NextConfig} */
const nextConfig = {
  // The canary asserts `next build` exit 0 on the migrated tree; type and lint
  // errors must fail it (tsc runs separately as well).
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
