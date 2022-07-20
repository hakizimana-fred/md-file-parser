/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    baseURL: 'http://localhost:3000'
  }
}

module.exports = nextConfig
