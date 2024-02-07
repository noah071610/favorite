"use client"

import classNames from "classnames"
import { useState } from "react"
import ChartPart from "./_components/Chartpart"
import CommentPart from "./_components/CommentPart"
import "./style.scss"

export default function Result() {
  const [currentSection, setCurrentSection] = useState<"analytics" | "comments">("analytics")

  const onClickNav = (type: "analytics" | "comments") => {
    setCurrentSection(type)
  }

  return (
    <div className="result">
      <div className="result-nav">
        <button
          className={classNames({ active: currentSection === "analytics" })}
          onClick={() => onClickNav("analytics")}
        >
          통계
        </button>
        <button
          className={classNames({ active: currentSection === "comments" })}
          onClick={() => onClickNav("comments")}
        >
          코멘트
        </button>
        <div className={classNames("follower-div", {})}></div>
      </div>
      {currentSection === "analytics" ? <ChartPart /> : <CommentPart />}
    </div>
  )
}
