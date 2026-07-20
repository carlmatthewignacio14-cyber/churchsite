/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    // This ignores Prettier and ESLint errors during the build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This prevents TypeScript type warnings from breaking the build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
