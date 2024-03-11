"use client"

import { errorMessage } from "@/_data/message"
import { toastError } from "@/_data/toast"
import { useMainStore } from "@/_store/main"
import { useNewPostStore } from "@/_store/newPost"
import { PostingStatus } from "@/_types/post/post"
import classNames from "classNames"
import { usePathname } from "next/navigation"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const navList = {
  init: "init",
  edit: "edit",
  rending: "rending",
}

const editPostNavList = {
  edit: "edit",
  rending: "rending",
}

export default function NewPostNavigation() {
  const { t } = useTranslation(["nav"])
  const pathname = usePathname()
  const isEditPage = pathname.includes("edit")
  const { t: message } = useTranslation(["messages"])
  const { setError } = useMainStore()
  const { newPostStatus, setStatus, newPost } = useNewPostStore()

  const onClickNav = useCallback(
    (status: PostingStatus) => {
      if (!newPost?.type) {
        setError({ type: "selectType", text: errorMessage["selectType"] })
        toastError(message(`error.selectType`))
        setTimeout(() => {
          setError({ type: "clear" })
        }, 3000)
        setStatus("init")
      } else {
        setStatus(status)
      }
    },
    [newPost?.type, setError, setStatus]
  )

  return (
    <nav className={cx(style.nav)}>
      {(Object.keys(navList) as PostingStatus[]).slice(isEditPage ? 1 : 0).map((status, i) => (
        <a
          className={cx({ [style.active]: newPostStatus === status })}
          key={`${status}_${i}`}
          onClick={() => onClickNav(status)}
        >
          <span>{t(navList[status])}</span>
        </a>
      ))}
      <div className={cx(style.shadow, { [style[newPostStatus]]: newPostStatus, [style["editPage"]]: isEditPage })} />
    </nav>
  )
}
