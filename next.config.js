const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.NODE_ENV === "production",
  openAnalyzer: true,
})
const { i18n } = require("./next-i18next.config")

module.exports = withBundleAnalyzer({
  i18n,
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
