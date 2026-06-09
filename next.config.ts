import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return [
      // English routes
      { source: '/en/services', destination: '/en/servicios' },
      { source: '/en/services/:slug*', destination: '/en/servicios/:slug*' },
      { source: '/en/cases', destination: '/en/casos' },
      { source: '/en/cases/:slug*', destination: '/en/casos/:slug*' },
      { source: '/en/about', destination: '/en/nosotros' },
      { source: '/en/contact', destination: '/en/contacto' },
      // Catalan routes
      { source: '/ca/serveis', destination: '/ca/servicios' },
      { source: '/ca/serveis/:slug*', destination: '/ca/servicios/:slug*' },
      { source: '/ca/sobre-nosaltres', destination: '/ca/nosotros' },
      { source: '/ca/contacte', destination: '/ca/contacto' },
    ];
  },
};

export default nextConfig;
