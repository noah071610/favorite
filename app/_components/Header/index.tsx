"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import NewPostNavigation from "./NewPostNavigation"
import SearchBar from "./SearchBar"
import SearchModal from "./SearchModal"
import "./style.scss"

export default function Header() {
  const pathname = usePathname()
  const isNewPostPage = pathname.includes("new")
  const isPostPage = pathname.includes("/post/") && !isNewPostPage

  return isPostPage ? null : (
    <>
      <header className="header">
        <div className="left">
          <img src=""></img>
          {/* todo: 로고 만들기 */}
        </div>
        <div className="center">{isNewPostPage && <NewPostNavigation />}</div>
        <div className="right">
          <Link href={isNewPostPage ? "/" : "/post/new"} className="new-post-btn">
            <span>{isNewPostPage ? "Go back" : "New post"}</span>
          </Link>
          <Link href="/post/new" className="login-btn">
            <span>Login</span>
          </Link>
        </div>
      </header>
      <div className="header-padding" />
      {!isPostPage && !isNewPostPage && (
        <div className="header-search">
          <SearchBar />
          <SearchModal />
        </div>
      )}
    </>
  )
}
