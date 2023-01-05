/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: '/pact-catalog',
  env: {
    secretKey: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
  },
};

module.exports = nextConfig;
