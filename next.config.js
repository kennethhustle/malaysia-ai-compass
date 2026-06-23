/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent Next.js from bundling these — they must resolve as native Node modules at runtime
  serverExternalPackages: ['puppeteer', 'puppeteer-core'],

  webpack: (config, { isServer }) => {
    if (isServer) {
      const externals = Array.isArray(config.externals) ? config.externals : [config.externals].filter(Boolean);
      config.externals = [...externals, 'puppeteer', 'puppeteer-core'];
    }
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
