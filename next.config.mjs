/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: false,
  allowedDevOrigins: ["192.168.30.74", "192.168.30.74:3000", "192.168.43.148"],
  // Disable i18n routing at Next.js level - we'll handle it manually
  i18n: undefined,
};

export default nextConfig;