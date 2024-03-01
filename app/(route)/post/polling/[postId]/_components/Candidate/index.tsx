"use client"

import { fadeMoveUpAnimation } from "@/_styles/animation"
import { PollingCandidateType } from "@/_types/post/polling"
import { ContentLayoutType } from "@/_types/post/post"
import classNames from "classNames"
import React from "react"
import CountUp from "react-countup"
import style from "./style.module.scss"
const cx = classNames.bind(style)

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
    <div className={cx(style.title)}>
      <h3>{title}</h3>
      {isResultPage && (
        <span className={cx(style.count)}>
          <CountUp prefix="(" suffix="표)" duration={4} end={pick} />
        </span>
      )}
    </div>
  )

  return (
    <li
      className={cx(style.candidate, {
        [style.selected]: isSelected,
        [style.result]: isResultPage,
        [style[`layout-${layout}`]]: layout,
      })}
      onClick={() => onClickCandidate("select", candidate)}
      style={fadeMoveUpAnimation(1100 + index * 20, index * 100)}
    >
      <div className={cx(style.border)} />
      {isResultPage && <div className={cx(style.number)}>{index + 1}</div>}

      <div className={cx(style.inner)}>
        <div className={cx(style["image-wrapper"])}>
          <div
            style={{
              backgroundImage: `url('${imageSrc}'), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWDEOaqDXtUswwG_M29-z0hIYG-YQqUPBUidpFBHv6g60GgpYq2VQesjbpmVVu8kfd-pw&usqp=CAU')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className={cx(style.image)}
          />
          {layout === "image" && titleComponent()}
          {layout === "image" && <div className={cx(style.overlay)} />}
        </div>
        <div
          className={cx(style.content, {
            [style.text]: !isResultPage && layout === "text",
          })}
        >
          {titleComponent()}
          {description && <p>{description}</p>}
        </div>
      </div>
      {layout === "text" && !isResultPage && (
        <button onClick={() => onClickCandidate("submit")} className={cx(style["select-btn"])}>
          <span className={cx(style.select)}>{title} 선택</span>
        </button>
      )}
    </li>
  )
}

export default React.memo(Candidate)
