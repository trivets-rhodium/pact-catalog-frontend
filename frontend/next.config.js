/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: '/pact-catalog',
  async redirects() {
    return [
      {
        source: '/extensions/:slug*',
        has: [
          {
            type: 'query',
            key: '',
            value: '',
          },
        ],
        destination: '/extensions/:slug*',
        has: [
          {
            type: 'query',
            key: 'activeTab',
            value: 'readme',
          },
        ],
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
