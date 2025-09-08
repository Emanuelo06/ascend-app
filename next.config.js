/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      allowedOrigins: ['localhost:3000', 'yourdomain.com'],
    },
    // React 19 compatibility
    reactCompiler: false,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // External packages for server runtime (replaces experimental.serverComponentsExternalPackages)
  serverExternalPackages: ['@supabase/supabase-js'],

  // Typed routes
  typedRoutes: true,

  // PWA Configuration - Headers moved to vercel.json for production
  async headers() {
    // Only add headers in development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/manifest.json',
          headers: [
            {
              key: 'Content-Type',
              value: 'application/manifest+json',
            },
          ],
        },
        {
          source: '/sw.js',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=0, must-revalidate',
            },
          ],
        },
      ];
    }
    return [];
  },

  // Image optimization
  images: {
    domains: ['lhtlhgaoukfrkkxmcbhy.supabase.co'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add alias resolution for @ imports - more explicit for Vercel
    const path = require('path');
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/contexts': path.resolve(__dirname, 'src/contexts'),
      '@/data': path.resolve(__dirname, 'src/data'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/app': path.resolve(__dirname, 'src/app'),
    };

    // Ensure proper module resolution
    config.resolve.modules = [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
    ];

    // PWA support
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      // PWA manifest - only in development or when explicitly enabled
      if (dev || process.env.ENABLE_PWA_COPY === 'true') {
        try {
          const CopyWebpackPlugin = require('copy-webpack-plugin');
          config.plugins.push(
            new CopyWebpackPlugin({
              patterns: [
                {
                  from: 'public/manifest.json',
                  to: 'manifest.json',
                },
                {
                  from: 'public/sw.js',
                  to: 'sw.js',
                },
              ],
            })
          );
        } catch (error) {
          console.warn('CopyWebpackPlugin not available, skipping PWA file copying');
        }
      }
    }

    // Bundle analyzer (optional)
    if (process.env.ANALYZE === 'true') {
      try {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
          })
        );
      } catch (error) {
        console.warn('BundleAnalyzerPlugin not available, skipping bundle analysis');
      }
    }

    return config;
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Redirects and rewrites moved to vercel.json for production
  async redirects() {
    // Only add redirects in development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/home',
          destination: '/',
          permanent: true,
        },
        {
          source: '/app',
          destination: '/dashboard',
          permanent: true,
        },
      ];
    }
    return [];
  },

  async rewrites() {
    // Only add rewrites in development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ];
    }
    return [];
  },

  // Compression
  compress: true,

  // Powered by header
  poweredByHeader: false,

  // React strict mode
  reactStrictMode: true,

  // SWC minification is enabled by default in Next.js 13+

  // Output configuration
  output: 'standalone',

  // Trailing slash
  trailingSlash: false,

  // Base path (if needed for subdirectory deployment)
  // basePath: '/ascend',

  // Asset prefix (if needed for CDN)
  // assetPrefix: 'https://cdn.example.com',

  // generateStaticParams is a route-level export and should not be in next.config.js

  // Custom server (if needed)
  // serverRuntimeConfig: {
  //   // Will only be available on the server side
  //   mySecret: 'secret',
  // },

  // Public runtime config
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
  },

  // TypeScript configuration
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true, // Allow build to succeed despite TypeScript errors
  },

  // ESLint configuration
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true, // Allow build to succeed despite ESLint errors
  },

  // Performance monitoring
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
