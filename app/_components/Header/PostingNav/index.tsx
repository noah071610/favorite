"use client"

import { PostingStatus, useMainStore } from "@/_store"
import classNames from "classnames"
import "./style.scss"

const posting_nav = {
  init: "도입부",
  result: "결과",
  rending: "랜딩",
}

export default function PostingNav({ pathname }: { pathname: string }) {
  const { currentPostingPage, setCurrentPostingPage } = useMainStore()

  const onClickNav = (status: PostingStatus) => {
    setCurrentPostingPage(status)
  }

  return (
    <nav className="posting-nav">
      {(["init", "result", "rending"] as PostingStatus[]).map((status) => (
        <a
          className={classNames({ active: currentPostingPage === status })}
          key={status}
          onClick={() => onClickNav(status)}
        >
          <span>{posting_nav[status]}</span>
        </a>
      ))}
      <div className={classNames("follower-div", { [currentPostingPage]: currentPostingPage })}></div>
    </nav>
  )
}
