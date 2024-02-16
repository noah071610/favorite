"use client"

import { PostingStatus, useNewPostStore } from "@/_store/newPost"
import classNames from "classnames"
import "./style.scss"

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
    <nav className="new-post-nav">
      {(Object.keys(navList) as PostingStatus[]).map((status, i) => (
        <a className={classNames({ active: newPostStatus === status })} key={status} onClick={() => onClickNav(status)}>
          <span>{navList[status]}</span>
        </a>
      ))}
      <div className={classNames("follower-div", { [newPostStatus]: newPostStatus })} />
    </nav>
  )
}
