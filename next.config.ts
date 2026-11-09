import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return [
      { source: '/en/contact', destination: '/en/contacto' },
      { source: '/ca/contacte', destination: '/ca/contacto' },
    ];
  },
};

export default nextConfig;
