import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // ✅ Compression Gzip/Brotli activée
    compress: true,

    // ✅ Optimisations expérimentales (CSS, import packages)
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['@heroicons/react', 'lucide-react'],
    },

    // ✅ Optimisation des images
    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // ✅ Configuration Webpack (utilisée uniquement si Turbopack est désactivé)
    webpack: (config, { dev, isServer }) => {
        // Optimisation de bundle en production côté client
        if (!dev && !isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        enforce: true,
                    },
                },
            };
        }

        return config;
    },
};

export default nextConfig;
