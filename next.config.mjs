/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable typed routes
  typedRoutes: false,
  // Optimize for Vercel
  output: 'standalone',
  // Empty turbopack config
  turbopack: {},
};

export default nextConfig;