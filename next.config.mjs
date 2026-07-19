/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    qualities: [85],
  },
};

export default nextConfig;
