/**
 * Next.js Configuration
 * Handles Next.js build and runtime configuration
 */

import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(process.cwd());
    return config;
  },
};

export default nextConfig;
