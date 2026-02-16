import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for faster development
  reactStrictMode: true,
  // Reduce file system polling on Windows
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

export default nextConfig;
