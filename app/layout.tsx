"use clinet"

import "@/_styles/global.scss"
import type { Metadata } from "next"
import localFont from "next/font/local"
import Header from "./_components/Header"
import Nav from "./_components/Nav"
import Overlay from "./_components/Overlay"

const pretendard = localFont({
  src: [
    {
      path: "./_font/Pretendard-Regular.woff2",
      style: "normal",
      weight: "400",
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
          <div className="main">
            <Nav />
            {children}
          </div>
          <Overlay />
        </body>
      </html>
    </>
  )
}
