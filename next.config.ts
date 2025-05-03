import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        turbo: {
          rules: {
            '*.svg': {
              loaders: ['@svgr/webpack'],
              as: '*.jsx'
            }
          }
        }
      },
    
};

export default nextConfig;
