/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, //changed to false to use pollInterval with apollo [temp workaround]
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
// const withPWA = require("next-pwa");
// module.exports = withPWA({
//   pwa: {
//     dest: "public",
//     register: true,
//     disable: process.env.NODE_ENV === "development",
//     skipWaiting: true,
//   },
// });
//
//
// {
//   reactStrictMode: true,
//   swcMinify: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'upload.wikimedia.org',
//       },
//     ],
//   },
// }
