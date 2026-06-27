/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
      crypto: false,
      os: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      net: false,
      tls: false,
    }
    return config
  },
  output: 'standalone',
}

module.exports = nextConfig
