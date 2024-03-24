const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: false,
  openAnalyzer: true,
  swcMinify: true,
})

module.exports = withBundleAnalyzer({
  compress: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  webpack(config) {
    const prod = process.env.NODE_ENV === "production"
    const plugins = [...config.plugins]
    return {
      ...config,
      mode: prod ? "production" : "development",
      plugins: plugins,
    }
  },
})
