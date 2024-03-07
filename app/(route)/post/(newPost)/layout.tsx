import "@/_styles/components/global-newPost.scss"

export default function NewPostLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className={"global-new-post-page"}>{children}</div>
}
