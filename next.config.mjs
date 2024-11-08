/** @type {import('next').NextConfig} */
const config = {
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript build errors (not recommended for production)
  },
  swcMinify: true, // Enable SWC minification
  output: 'standalone',
  reactStrictMode: false,
}

export default config
