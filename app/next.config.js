/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["avatar.vercel.sh"],
  },
  output: "standalone",
};

module.exports = nextConfig;
