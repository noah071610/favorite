"use client"

import { useNewPostStore } from "@/_store/newPost"
import { PostingStatus } from "@/_types/post/post"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const navList = {
  init: "양식",
  edit: "제작",
  result: "결과",
  rending: "랜딩",
}

export default function NewPostNavigation() {
  const { newPostStatus, setStatus, newPost } = useNewPostStore()

  const onClickNav = (status: PostingStatus) => {
    if (!newPost?.type) {
      setStatus("init")
    } else {
      setStatus(status)
    }
  }

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
