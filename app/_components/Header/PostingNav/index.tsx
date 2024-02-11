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
  const { currentPostingPage, setCurrentPostingPage } = useNewPostStore()

  const onClickNav = (status: PostingStatus) => {
    setCurrentPostingPage(status)
  }

  return (
    <nav className="new-post-nav">
      {(Object.keys(navList) as PostingStatus[]).map((status) => (
        <a
          className={classNames({ active: currentPostingPage === status })}
          key={status}
          onClick={() => onClickNav(status)}
        >
          <span>{navList[status]}</span>
        </a>
      ))}
      <div className={classNames("follower-div", { [currentPostingPage]: currentPostingPage })}></div>
    </nav>
  )
}
