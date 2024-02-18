"use client"

import classNames from "classNames"
import Link from "next/link"
import { usePathname } from "next/navigation"
import NewPostNavigation from "./NewPostNavigation"
import SearchBar from "./SearchBar"
import SearchModal from "./SearchModal"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Header() {
  const pathname = usePathname()
  const isNewPostPage = pathname.includes("new")
  const isPostPage = pathname.includes("/post/") && !isNewPostPage

  return isPostPage ? null : (
    <>
      <header className={cx(style.header)}>
        <div className={cx(style.left)}>
          <img src=""></img>
          {/* todo: 로고 만들기 */}
        </div>
        <div className={cx(style.center)}>{isNewPostPage && <NewPostNavigation />}</div>
        <div className={cx(style.right)}>
          <Link href={isNewPostPage ? "/" : "/post/new"} className={cx(style["new-post"])}>
            <span>{isNewPostPage ? "Go back" : "New post"}</span>
          </Link>
          <Link href="/post/new" className={cx(style["login"])}>
            <span>Login</span>
          </Link>
        </div>
      </header>
      <div className={cx(style.ghost)} />
      {!isPostPage && !isNewPostPage && (
        <div className={cx(style.search)}>
          <SearchBar />
          <SearchModal />
        </div>
      )}
    </>
  )
}
