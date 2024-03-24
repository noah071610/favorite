"use client"

import { errorMessage } from "@/_data/message"
import { toastError } from "@/_data/toast"
import { useMainStore } from "@/_store/main"
import { useNewPostStore } from "@/_store/newPost"
import { PostingStatus } from "@/_types/post"
import { useTranslation } from "@/i18n/client"
import classNames from "classNames"
import { useParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const navList = {
  init: "init",
  edit: "edit",
  rending: "rending",
}

export default function NewPostNavigation() {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["nav"])
  const pathname = usePathname()
  const isEditPage = pathname.includes("edit")
  const { t: message } = useTranslation(lang, ["messages"])
  const { setError } = useMainStore()
  const {
    setStatus,
    type,
    content: { newPostStatus },
  } = useNewPostStore()

  const onClickNav = useCallback(
    (status: PostingStatus) => {
      if (type === "none") {
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
    [message, type, setError, setStatus]
  )

  return (
    <nav className={cx(style.nav)}>
      {(Object.keys(navList) as PostingStatus[]).map((status, i) => (
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
