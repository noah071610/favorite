import "@/_styles/components/global-candidate.scss"
import "@/_styles/components/global-comment.scss"
import "@/_styles/components/global-confirm.scss"
import "@/_styles/components/global-pagination.scss"
import "@/_styles/components/global-post-card.scss"
import "@/_styles/components/global-post-info.scss"
import "@/_styles/components/global-select.scss"
import "@/_styles/global-components.scss"
import "@/_styles/global.scss"
import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import "react-toastify/dist/ReactToastify.css"
import "swiper/css"
import "swiper/css/free-mode"
config.autoAddCss = false

import Aside from "@/_components/@Global/Aside"
import Header from "@/_components/@Global/Header"
import Init from "@/_components/@Global/Init"
import OverlayInjector from "@/_components/@Global/OverlayInjector"
import ReactQueryProvider from "@/_components/@Global/ReactQueryProvider"
import { LangType } from "@/_types"
import { useTranslation } from "@/i18n"
import { dir } from "i18next"
import { Prompt } from "next/font/google"
import localFont from "next/font/local"
import { ToastContainer } from "react-toastify"
import { DarkModeScriptTag } from "../_utils/darkmode"
import { fallbackLng, languages } from "../i18n/settings"

const pretendard = localFont({
  src: [
    {
      path: "../_font/Pretendard-Regular.woff",
      weight: "400",
    },
    {
      path: "../_font/Pretendard-SemiBold.woff",
      weight: "600",
    },
    {
      path: "../_font/Pretendard-Bold.woff",
      weight: "700",
    },
  ],
  display: "swap",
})

const prompt = Prompt({
  weight: ["400", "600", "700"],
  subsets: ["thai"],
  display: "swap",
})

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }))
}

export async function generateMetadata({ params: { lang } }: { params: { lang: LangType } }) {
  if (languages.indexOf(lang) < 0) lang = fallbackLng
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang, ["meta"])
  return {
    title: {
      default: "Favorite",
      template: "%s | Favorite",
    },
    icons: {
      icon: `/images/favicon.png`, // /public path
    },
    description: t("description"),
    openGraph: {
      title: "Favorite",
      description: t("description"),
      // images: [
      //   {
      //     url: "./images/thumbnail.jpg",
      //     width: 600,
      //     height: 315,
      //     alt: "favorite_thumbnail",
      //   },
      // ],
      type: "website",
      siteName: "favorite",
    },
    twitter: {
      card: "summary_large_image",
      title: "Favorite",
      description: t("description"),
      // images: [
      //   {
      //     url: "./images/thumbnail.jpg",
      //     width: 600,
      //     height: 315,
      //     alt: "favorite_thumbnail",
      //   },
      // ],
    },
  }
}

async function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode
  params: {
    lang: LangType
  }
}>) {
  return (
    <>
      <html className={lang === "th" ? prompt.className : pretendard.className} lang={lang} dir={dir(lang)}>
        <head>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <meta name="keywords" content="퀴즈, 게임, 투표, 픽, 월드컵, 이상형 월드컵" />
          <meta name="author" content="Noah"></meta>
        </head>
        <body suppressHydrationWarning={true}>
          <DarkModeScriptTag />
          <ReactQueryProvider>
            <Init />
            <Header />
            <Aside />
            <main>{children}</main>
            <OverlayInjector />
            <ToastContainer />
          </ReactQueryProvider>
        </body>
      </html>
    </>
  )
}

export default RootLayout
