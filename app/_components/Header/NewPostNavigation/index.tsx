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
  const { section, setSection, newPost } = useNewPostStore()

  const onClickNav = (status: PostingStatus) => {
    if (!newPost?.type) {
      setSection("init")
    } else {
      setSection(status)
    }
  }

  return (
    <nav className="new-post-nav">
      {(Object.keys(navList) as PostingStatus[]).map((status, i) => (
        <a className={classNames({ active: section === status })} key={status} onClick={() => onClickNav(status)}>
          <span>{navList[status]}</span>
        </a>
      ))}
      <div className={classNames("follower-div", { [section]: section })} />
    </nav>
  )
}
