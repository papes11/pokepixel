// next.config.js
module.exports = {
  compiler: { styledComponents: true },
  images: { disableStaticImages: true },
  typedRoutes: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'vibrate=()'
          }
        ]
      }
    ];
  },
  // Fix HMR issues with Next.js 15
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  webpack: (config, { isServer, dev }) => {
    // Handle image assets imported from src
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]'
      }
    });
    // Handle audio assets (mp3/wav/ogg/m4a)
    config.module.rules.push({
      test: /\.(mp3|wav|ogg|m4a)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]'
      }
    });

    // Disable source maps for production to avoid 404 errors
    if (!dev) {
      config.devtool = false;
    }

    // Ignore source map warnings for wallet adapters
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Can't resolve.*\.map/,
    ];

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert'),
        os: require.resolve('os-browserify'),
        path: require.resolve('path-browserify'),
      };
    }
    return config;
  },
  // Also add this for Metaplex
  transpilePackages: [
    '@metaplex-foundation/mpl-token-metadata',
    '@metaplex-foundation/mpl-bubblegum',
    '@metaplex-foundation/umi',
    '@metaplex-foundation/umi-bundle-defaults',
  ],
};