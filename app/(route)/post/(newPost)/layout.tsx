import "@/_styles/components/global-newPost.scss"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "콘텐츠 만들기",
}

export default function NewPostLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className={"global-new-post-page"}>{children}</div>
}
