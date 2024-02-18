"use client"

import { usePostStore } from "@/_store/post"
import { fadeMoveUpAnimation } from "@/_styles/animation"
import { PollingCandidateType } from "@/_types/post/polling"
import classNames from "classNames"
import React from "react"
import CountUp from "react-countup"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function Candidate({
  candidate,
  index,
  onClickSubmit,
}: {
  candidate: PollingCandidateType
  index: number
  onClickSubmit: () => void
}) {
  const { count, description, listId, title, imageSrc } = candidate
  const { isResultPage, layoutType, votedId, selectedCandidate, setSelectedCandidate } = usePostStore()

  const onClickSelect = (candidate: PollingCandidateType) => {
    !isResultPage && setSelectedCandidate(candidate)
  }

  const isSelected = (selectedCandidate?.listId || votedId?.listId) === listId

  const titleComponent = () => (
    <div className={cx(style.title)}>
      <h3>{title}</h3>
      {isResultPage && (
        <span className={cx(style.count)}>
          <CountUp prefix="(" suffix="표)" duration={4} end={count} />
        </span>
      )}
    </div>
  )

  return (
    layoutType && (
      <li
        className={cx(style.candidate, {
          [style.selected]: isSelected,
          [style.result]: isResultPage,
          [style[`layout-${layoutType}`]]: layoutType,
        })}
        onClick={() => onClickSelect(candidate)}
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
            {layoutType === "image" && titleComponent()}
            {layoutType === "image" && <div className={cx(style.overlay)} />}
          </div>
          <div
            className={cx(style.content, {
              [style.text]: !isResultPage && layoutType === "text",
            })}
          >
            {titleComponent()}
            {description && <p>{description}</p>}
          </div>
        </div>
        {layoutType === "text" && !isResultPage && (
          <button onClick={onClickSubmit} className={cx(style["select-btn"])}>
            <span className={cx(style.select)}>{title} 선택</span>
          </button>
        )}
      </li>
    )
  )
}

export default React.memo(Candidate)
