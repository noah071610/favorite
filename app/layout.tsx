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
        <body>
          <Header />
          <div className="home-page">{children}</div>
          <Overlay />
        </body>
      </html>
    </>
  )
}
