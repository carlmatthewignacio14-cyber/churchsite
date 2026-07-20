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
};

export default nextConfig;
