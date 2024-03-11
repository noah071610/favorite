import "@/_styles/components/global-candidate.scss"
import "@/_styles/components/global-comment.scss"
import "@/_styles/components/global-confirm.scss"
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

import type { Metadata } from "next"
import localFont from "next/font/local"
import { ToastContainer } from "react-toastify"
import Header from "./_components/@Global/Header"
import OverlayInjector from "./_components/@Global/OverlayInjector"
import ReactQueryProvider from "./_components/@Global/ReactQueryProvider"

import Aside from "./_components/@Global/Aside"
import Init from "./_components/@Global/Init"
import { DarkModeScriptTag } from "./_utils/darkmode"

const pretendard = localFont({
  src: [
    {
      path: "./_font/Pretendard-Regular.woff",
      weight: "400",
    },
    {
      path: "./_font/Pretendard-SemiBold.woff",
      weight: "600",
    },
    {
      path: "./_font/Pretendard-Bold.woff",
      weight: "700",
    },
  ],
})

export const metadata: Metadata = {
  title: {
    default: "Favorite",
    template: "%s | Favorite",
  },
  description: "너를 통해 알게되는 내 마음 최고의 Favorite",
}

async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <html className={pretendard.className} lang="ko">
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
