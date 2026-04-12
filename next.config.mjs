import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: false,
  allowedDevOrigins: ["192.168.30.74", "192.168.30.74:3000", "192.168.43.148"],
};

export default withNextIntl(nextConfig);