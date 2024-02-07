"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import PostingNav from "./PostingNav"
import SearchBar from "./SearchBar"
import "./style.scss"

function Center() {
  const pathname = usePathname()
  const isPostingPage = pathname.includes("/post/new")

  return (
    <div className="center">
      {isPostingPage ? (
        <PostingNav pathname={pathname} />
      ) : (
        <>
          <SearchBar />
          {/* <SearchModal /> */}
        </>
      )}
    </div>
  )
}

export default function Header() {
  const pathname = usePathname()
  const isResultPage = pathname.includes("/post/")

  return isResultPage ? null : (
    <>
      <header className="header">
        <div className="left">
          <img src=""></img>
          {/* todo: 로고 만들기 */}
        </div>
        <Center />
        <div className="right">
          <Link href="/post/new" className="new-post-btn">
            <span>New post</span>
          </Link>
          <Link href="/post/new" className="login-btn">
            <span>Login</span>
          </Link>
        </div>
      </header>
      <div className="header-padding" />
    </>
  )
}
