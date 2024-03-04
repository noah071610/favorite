"use client"

import { queryKey } from "@/_data"
import { useMainStore } from "@/_store/main"
import { UserQueryType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import Link from "next/link"
import { usePathname } from "next/navigation"
import LoginModal from "../LoginModal"
import NewPostNavigation from "./NewPostNavigation"
import SearchBar from "./SearchBar"
import SearchModal from "./SearchModal"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Header() {
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user,
  })
  const { modalStatus, setModal } = useMainStore()
  const pathname = usePathname()
  const isNewPostPage = pathname.includes("new")
  const isHideHeader = (pathname.includes("/post/") && !isNewPostPage) || pathname.includes("loginSuccess")

  const user = userData?.user

  const onClickOpenAside = () => {
    setModal("aside")
  }

  return isHideHeader ? null : (
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
          <div className={cx(style.center)}>{isNewPostPage ? <NewPostNavigation /> : <SearchBar />}</div>

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
      </header>
      <SearchModal />
      <div className={cx(style.ghost)} />
      {(modalStatus === "login" || modalStatus === "loginNewPost" || modalStatus === "newPostLoginSuccess") && (
        <LoginModal />
      )}
    </>
  )
}
