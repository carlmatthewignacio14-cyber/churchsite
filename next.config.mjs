import { imageHosts } from './image-hosts.config.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: imageHosts,
  },
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
