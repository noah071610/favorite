"use client"

import { getImageUrl } from "@/_data"
import { noImageUrl } from "@/_data/post"
import { fadeMoveUpAnimation } from "@/_styles/animation"
import { PollingCandidateType } from "@/_types/post/polling"
import { ContentLayoutType } from "@/_types/post/post"
import classNames from "classNames"
import React from "react"
import CountUp from "react-countup"

function Candidate({
  candidate,
  onClickCandidate,
  layout,
  isResultPage,
  isSelected,
  index,
}: {
  candidate: PollingCandidateType
  onClickCandidate: (type: "submit" | "select", candidate?: PollingCandidateType) => void
  isResultPage: boolean
  layout: ContentLayoutType
  isSelected: boolean
  index: number
}) {
  const { pick, description, title, imageSrc } = candidate

  const titleComponent = () => (
    <div className={classNames("title")}>
      <h3>{title}</h3>
      {isResultPage && (
        <span className={classNames("count")}>
          <CountUp prefix="(" suffix="표)" duration={4} end={pick} />
        </span>
      )}
    </div>
  )

  return (
    <li
      className={classNames("global-candidate", {
        ["selected"]: isSelected,
        ["result"]: isResultPage,
        [`layout-${layout}`]: layout,
      })}
      onClick={() => onClickCandidate("select", candidate)}
      style={fadeMoveUpAnimation(1100 + index * 20, index * 100)}
    >
      <div className={classNames("border")} />
      {isResultPage && <div className={classNames("number")}>{index + 1}</div>}

      <div className={classNames("inner")}>
        <div className={classNames("image-wrapper")}>
          {layout === "image" && isResultPage && isSelected && <span className={"image-like"}>LIKE!</span>}
          <div
            style={{
              backgroundImage: !!imageSrc ? getImageUrl({ url: imageSrc }) : noImageUrl,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className={classNames("image")}
          />
          {layout === "image" && titleComponent()}
          {layout === "image" && <div className={classNames("overlay")} />}
        </div>
        <div
          className={classNames("content", {
            ["text"]: !isResultPage && layout === "text",
          })}
        >
          {titleComponent()}
          {description && <p>{description}</p>}
        </div>
      </div>
      {layout === "text" && !isResultPage && (
        <button onClick={() => onClickCandidate("submit")} className={classNames("select-btn")}>
          <span className={classNames("select")}>{title} 선택</span>
        </button>
      )}
    </li>
  )
}

export default React.memo(Candidate)
