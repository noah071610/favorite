const { i18n } = require("./next-i18next.config")

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.NODE_ENV === "production",
  openAnalyzer: true,
})

module.exports = withBundleAnalyzer({
  i18n: {
    defaultLocale: "ko",
    locales: ["ko", "en", "jp"],
  },
})
