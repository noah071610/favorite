const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.NODE_ENV === "production",
  openAnalyzer: true,
  reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
  swcMinify: true,
})

module.exports = withBundleAnalyzer({
  compress: true,
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
