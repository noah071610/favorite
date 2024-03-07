"use client"

import { queryKey } from "@/_data"
import { useMainStore } from "@/_store/main"
import { useNewPostStore } from "@/_store/newPost"
import { UserQueryType } from "@/_types/user"
import { handleBeforeUnload } from "@/_utils/post"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"
import LoginModal from "../../LoginModal"
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
  const { newPost, newPostStatus, content, candidates, thumbnail, selectedCandidateIndex, loadNewPost, clearNewPost } =
    useNewPostStore()
  const [saved, setSaved] = useState(false)

  const saveData = useMemo(
    () => ({ newPost, newPostStatus, content, candidates, thumbnail, selectedCandidateIndex }),
    [newPost, newPostStatus, content, candidates, thumbnail, selectedCandidateIndex]
  )

  const onClickSave = () => {
    if (!saved) {
      handleBeforeUnload(saveData)
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
      }, 5000)
    }
  }
  const user = userData?.user

  const onClickOpenAside = () => {
    setModal("aside")
  }
  const onClickSearch = (isOpen: boolean) => {
    setModal(isOpen ? "search" : "none")
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
            {/* PC */}
            <div className={cx(style.pc)}>
              {/* new post */}
              {isNewPostPage && newPostStatus === "init" && (
                <Link href={"/"} className={cx(style["new-post"])}>
                  <span>메인페이지로</span>
                </Link>
              )}
              {isNewPostPage && newPostStatus !== "init" && (
                <button onClick={onClickSave} className={cx(style.save, { [style.saved]: saved })}>
                  <div className={cx(style.icon)}>
                    <i className={cx("fa-solid", "fa-floppy-disk", style.disk)}></i>
                    <i className={cx("fa-solid", "fa-check", style.check)}></i>
                  </div>
                  <span>저장하기</span>
                </button>
              )}

              {/* main */}
              {!isNewPostPage && (
                <Link href={"/post/new"} className={cx(style["new-post"])}>
                  <span>만들러가기</span>
                </Link>
              )}
              {!isNewPostPage &&
                (user ? (
                  <Link href={`/user/${user.userId}`} className={cx(style["login"])}>
                    <span>대시보드</span>
                  </Link>
                ) : (
                  <a onClick={() => setModal("login")} className={cx(style["login"])}>
                    <span>로그인</span>
                  </a>
                ))}
            </div>

            {/* mobile */}
            <div className={cx(style.mobile)}>
              {/* new post */}
              {isNewPostPage && newPostStatus === "init" && (
                <Link href="/">
                  <div className={cx(style.icon)}>
                    <i className="fa-solid fa-house"></i>
                  </div>
                </Link>
              )}
              {isNewPostPage && newPostStatus !== "init" && (
                <button onClick={onClickSave} className={cx(style["save-mobile"], { [style.saved]: saved })}>
                  <div className={cx(style.icon)}>
                    <i className={cx("fa-solid", "fa-floppy-disk", style.disk)}></i>
                    <i className={cx("fa-solid", "fa-check", style.check)}></i>
                  </div>
                </button>
              )}

              {/* search  */}
              {!isNewPostPage && modalStatus === "search" && (
                <button onClick={() => onClickSearch(false)} className={cx(style["search-btn"])}>
                  <i className="fa-solid fa-close"></i>
                </button>
              )}
              {!isNewPostPage && modalStatus !== "search" && (
                <>
                  <Link href="/post/new">
                    <div className={cx(style.icon)}>
                      <i className="fa-solid fa-pen"></i>
                    </div>
                  </Link>
                  <button onClick={() => onClickSearch(true)}>
                    <div className={cx(style.icon)}>
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                  </button>
                </>
              )}
            </div>
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