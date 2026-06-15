import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['node-shazam', '@ffmpeg-installer/ffmpeg', 'fluent-ffmpeg'],
  experimental: {
    workerThreads: false,
  },
};

export default nextConfig;
