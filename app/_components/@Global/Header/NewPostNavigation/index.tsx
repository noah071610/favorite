"use client"

import { errorMessage } from "@/_data/message"
import { toastError } from "@/_data/toast"
import { useMainStore } from "@/_store/main"
import { useNewPostStore } from "@/_store/newPost"
import { PostingStatus } from "@/_types/post/post"
import classNames from "classNames"
import { useCallback } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const navList = {
  init: "양식",
  edit: "제작",
  rending: "랜딩",
}

export default function NewPostNavigation() {
  const { setError } = useMainStore()
  const { newPostStatus, setStatus, newPost } = useNewPostStore()

  const onClickNav = useCallback(
    (status: PostingStatus) => {
      if (!newPost?.type) {
        setError({ type: "selectType", text: errorMessage["selectType"] })
        toastError("selectType")
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
      {(Object.keys(navList) as PostingStatus[]).map((status, i) => (
        <a className={cx({ [style.active]: newPostStatus === status })} key={status} onClick={() => onClickNav(status)}>
          <span>{navList[status]}</span>
        </a>
      ))}
      <div className={cx(style.shadow, { [style[newPostStatus]]: newPostStatus })} />
    </nav>
  )
}
