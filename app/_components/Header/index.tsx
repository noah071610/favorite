"use client"

import { refreshUser } from "@/_queries/user"
import { useMainStore } from "@/_store/main"
import { UserQueryType } from "@/_types/user"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import classNames from "classNames"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import LoginModal from "../LoginModal"
import NewPostNavigation from "./NewPostNavigation"
import SearchBar from "./SearchBar"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Header() {
  const queryClient = useQueryClient()
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: ["user"],
  })
  const { modalStatus, setModal } = useMainStore()
  const pathname = usePathname()
  const isNewPostPage = pathname.includes("new")
  const isPostPage = pathname.includes("/post/") && !isNewPostPage

  useEffect(() => {
    !(async function () {
      const { msg, user } = await refreshUser()
      if (user) {
        queryClient.setQueryData(["user"], { msg, user })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClickOpenAside = () => {
    setModal("aside")
  }

  const user = userData?.user

  return isPostPage ? null : (
    <>
      <header className={cx(style.header)}>
        <div className={cx(style.inner)}>
          <div className={cx(style.left)}>
            <button onClick={onClickOpenAside}>
              <div className={cx(style.icon)}>
                <i className={cx("fa-solid", "fa-bars")}></i>
              </div>
            </button>
            {/* <img src=""></img> */}
            {/* todo: 로고 만들기 */}
          </div>

          {/* CENTER */}
          <div className={cx(style.center)}>
            {isNewPostPage && <NewPostNavigation />}
            {!isPostPage && !isNewPostPage && <SearchBar />}
          </div>

          <div className={cx(style.right)}>
            <Link href={isNewPostPage ? "/" : "/post/new"} className={cx(style["new-post"])}>
              <span>{isNewPostPage ? "메인 페이지로" : "만들러가기"}</span>
            </Link>
            {user ? (
              <Link href="/user" className={cx(style["login"])}>
                <span>대시보드</span>
              </Link>
            ) : (
              <a onClick={() => setModal("login")} className={cx(style["login"])}>
                <span>로그인</span>
              </a>
            )}
          </div>
        </div>
        <div className={cx(style.search, { [style.open]: modalStatus === "search" })}></div>
      </header>
      <div className={cx(style.ghost)} />
      {(modalStatus === "login" || modalStatus === "loginNewPost" || modalStatus === "newPostLoginSuccess") && (
        <LoginModal />
      )}
    </>
  )
}
