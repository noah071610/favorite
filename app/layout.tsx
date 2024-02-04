import "@/_styles/global.scss"
import type { Metadata } from "next"
import localFont from "next/font/local"
import Header from "./_components/Header"
import Overlay from "./_components/Overlay"

import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
config.autoAddCss = false

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
    default: "Travel Receipt",
    template: "%s | Travel Receipt",
  },
  description: "What is going on your trip",
}

export default function RootLayout({
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
        </head>
        <body>
          <Header />
          <main>{children}</main>
          <Overlay />
        </body>
      </html>
    </>
  )
}
