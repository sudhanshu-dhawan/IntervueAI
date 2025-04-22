/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // This forces Node.js runtime for actions
  serverRuntimeConfig: {
    runtime: 'nodejs',
  },
};

module.exports = nextConfig;
