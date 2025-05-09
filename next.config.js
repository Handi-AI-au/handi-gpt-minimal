/** @type {import('next').NextConfig} */
const withLess = require('next-with-less')
const path = require('node:path')

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
  },
  transpilePackages: ['antd-mobile', 'lodash-es'],
  webpack(config, options) {
    // disable css-module in Next.js
    config.module.rules.forEach((rule) => {
      const { oneOf } = rule
      if (oneOf) {
        oneOf.forEach((one) => {
          if (!`${one.issuer?.and}`.includes('_app')) return
          one.issuer.and = [path.resolve(__dirname)]
        })
      }
    })

    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: '@svgr/webpack', options: { icon: true } }]
    })

    return config
  }
}

module.exports = withLess(nextConfig)
