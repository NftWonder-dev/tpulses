/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "r2-bucket.flowith.net",
      },
    ],
  },
  experimental: {
    staleTimes: {
      dynamic: 60,
    },
  },
};

module.exports = nextConfig;
