/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ["https://res.cloudinary.com"],
  },
};

module.exports = nextConfig;
