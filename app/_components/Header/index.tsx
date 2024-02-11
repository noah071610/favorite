"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import NewPostNavigation from "./PostingNav"
import SearchBar from "./SearchBar"
import SearchModal from "./SearchModal"
import "./style.scss"

export default function Header() {
  const pathname = usePathname()
  const isPostingPage = pathname.includes("new")
  const isPostPage = pathname.includes("/post/") && !isPostingPage

  return isPostPage ? null : (
    <>
      <header className="header">
        <div className="left">
          <img src=""></img>
          {/* todo: 로고 만들기 */}
        </div>
        <div className="center">{isPostingPage && <NewPostNavigation />}</div>
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
      {!isPostPage && !isPostingPage && (
        <div className="header-search">
          <SearchBar />
          <SearchModal />
        </div>
      )}
    </>
  )
}
