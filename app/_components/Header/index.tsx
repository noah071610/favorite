"use client"

import { refreshUser } from "@/_queries/user"
import { useMainStore } from "@/_store/main"
import classNames from "classNames"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import LoginModal from "../LoginModal"
import NewPostNavigation from "./NewPostNavigation"
import SearchBar from "./SearchBar"
import SearchModal from "./SearchModal"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Header() {
  const { modalStatus, setModal } = useMainStore()
  const pathname = usePathname()
  const isNewPostPage = pathname.includes("new")
  const isPostPage = pathname.includes("/post/") && !isNewPostPage

  useEffect(() => {
    refreshUser()
  }, [])

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
          <a onClick={() => setModal("login")} className={cx(style["login"])}>
            <span>Login</span>
          </a>
        </div>
      </header>
      <div className={cx(style.ghost)} />
      {!isPostPage && !isNewPostPage && (
        <div className={cx(style.search)}>
          <SearchBar />
          <SearchModal />
        </div>
      )}
      {modalStatus === "login" && <LoginModal />}
    </>
  )
}
