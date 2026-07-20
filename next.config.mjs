import { imageHosts } from './image-hosts.config.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: imageHosts,
    qualities: [75, 85, 90, 95, 100],
  },
  webpack: (config) => {
    return config;
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
