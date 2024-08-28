/** @type {import('next').NextConfig} */
const config = {
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript build errors (not recommended for production)
  },
  swcMinify: true, // Enable SWC minification
}

export default config
