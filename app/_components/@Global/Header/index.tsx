"use client"

import { queryKey } from "@/_data"
import { useMainStore } from "@/_store/main"
import { NewPostStates, useNewPostStore } from "@/_store/newPost"
import { UserQueryType } from "@/_types/user"
import { handleBeforeUnload } from "@/_utils/post"
import { faBars, faCheck, faClose, faFloppyDisk, faMagnifyingGlass, faPen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import classNames from "classNames"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import NewPostNavigation from "./NewPostNavigation"
import SearchBar from "./SearchBar"
import SearchModal from "./SearchModal"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Header() {
  const queryClient = useQueryClient()
  const { t } = useTranslation(["nav"])
  const pathname = usePathname()
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user.login,
  })
  const { push } = useRouter()
  const user = userData?.user

  const { modalStatus, setModal } = useMainStore()
  const isNewPostPage = pathname.includes("new") || pathname.includes("edit")
  const isHideHeader = (pathname.includes("/post/") && !isNewPostPage) || pathname.includes("loginSuccess")

  const { content, postId, type, thumbnail, title, description, format, count } = useNewPostStore()
  const [saved, setSaved] = useState(false)

  const newPost: NewPostStates = {
    postId,
    type,
    thumbnail,
    title,
    description,
    format,
    count,
    content,
  }

  const onClickSave = async () => {
    if (!saved && user) {
      await handleBeforeUnload(newPost)
      await queryClient.invalidateQueries({ queryKey: queryKey.posts.user })
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
      }, 5000)
    }
  }

  const onClickOpenAside = () => {
    setModal("aside")
  }
  const onClickSearch = (isOpen: boolean) => {
    setModal(isOpen ? "search" : "none")
  }
  const onClickMobileCreateNewPost = () => {
    if (user) {
      push(`/user/${user.userId}`)
    } else {
      setModal("login")
    }
  }

  return isHideHeader ? null : (
    <>
      <header className={cx(style.header)}>
        <div className={cx(style.inner)}>
          <div className={cx(style.left)}>
            <button onClick={onClickOpenAside}>
              <div className={cx(style.icon)}>
                <FontAwesomeIcon icon={faBars} />
              </div>
            </button>
            {modalStatus !== "search" && (
              <Link className={cx({ [style.newPost]: isNewPostPage })} href="/">
                <Image width={150} height={30} alt="logo" src="/images/Favorite.png"></Image>
              </Link>
            )}
          </div>

          {/* CENTER */}
          <div className={cx(style.center)}>{isNewPostPage ? <NewPostNavigation /> : <SearchBar />}</div>

          <div className={cx(style.right)}>
            {/* PC */}
            <div className={cx(style.pc)}>
              {/* new post */}
              {isNewPostPage && (
                <button onClick={onClickSave} className={cx(style.save, { [style.saved]: saved })}>
                  <div className={cx(style.icon)}>
                    <FontAwesomeIcon className={cx(style.disk)} icon={faFloppyDisk} />
                    <FontAwesomeIcon className={cx(style.check)} icon={faCheck} />
                  </div>
                  <span>{t("save")}</span>
                </button>
              )}

              {/* main */}
              {!isNewPostPage && !user && (
                <button onClick={() => setModal("login")} className={cx(style["new-post"])}>
                  <span>{t("makeNew")}</span>
                </button>
              )}
              {!isNewPostPage &&
                (user ? (
                  <Link href={`/user/${user.userId}`} className={cx(style["login"])}>
                    <span>{t("dashboard")}</span>
                  </Link>
                ) : (
                  <a onClick={() => setModal("login")} className={cx(style["login"])}>
                    <span>{t("login")}</span>
                  </a>
                ))}
            </div>

            {/* mobile */}
            <div className={cx(style.mobile)}>
              {/* new post */}
              {isNewPostPage && (
                <button onClick={onClickSave} className={cx(style["save-mobile"], { [style.saved]: saved })}>
                  <div className={cx(style.icon)}>
                    <FontAwesomeIcon className={cx(style.disk)} icon={faFloppyDisk} />
                    <FontAwesomeIcon className={cx(style.check)} icon={faCheck} />
                  </div>
                </button>
              )}

              {/* search  */}
              {!isNewPostPage && modalStatus === "search" && (
                <button onClick={() => onClickSearch(false)} className={cx(style["search-btn"])}>
                  <div className={cx(style.icon)}>
                    <FontAwesomeIcon icon={faClose} />
                  </div>
                </button>
              )}
              {!isNewPostPage && modalStatus !== "search" && (
                <>
                  <button onClick={onClickMobileCreateNewPost}>
                    <div className={cx(style.icon)}>
                      <FontAwesomeIcon icon={faPen} />
                    </div>
                  </button>
                  <button onClick={() => onClickSearch(true)}>
                    <div className={cx(style.icon)}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
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
    </>
  )
}
