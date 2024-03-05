import "@/_styles/global-components.scss"
import "@/_styles/global.scss"
import "swiper/css"
import "swiper/css/free-mode"

import type { Metadata } from "next"
import localFont from "next/font/local"
import { ToastContainer } from "react-toastify"
import Header from "./_components/@Global/Header"
import OverlayInjector from "./_hooks/OverlayInjector"
import ReactQueryProvider from "./_queries/provider/reactQueryProvider"

import "react-toastify/dist/ReactToastify.css"
import Aside from "./_components/@Global/Aside"
import Init from "./_components/@Global/Init"
import { ScriptTag } from "./_utils/darkmode"

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
  description: "What is your Favorite?",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <html className={pretendard.className} lang="ko">
        <head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
            integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
        </head>
        <body suppressHydrationWarning={true}>
          <ScriptTag />
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
