"use client"

import { usePostStore } from "@/_store/post"
import { fadeMoveUpAnimation } from "@/_styles/animation"
import { PollingCandidateType } from "@/_types/post/polling"
import classNames from "classnames"
import React from "react"
import CountUp from "react-countup"
import "./style.scss"

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
    <div className="title">
      <h3>{title}</h3>
      {isResultPage && (
        <span>
          <CountUp prefix="(" suffix="표)" duration={4} end={count} />
        </span>
      )}
    </div>
  )

  return (
    layoutType && (
      <li
        className={classNames("candidate-card", { selected: isSelected, isResultPage, [layoutType]: layoutType })}
        onClick={() => onClickSelect(candidate)}
        style={fadeMoveUpAnimation(1100 + index * 20, index * 100)}
      >
        <div className={classNames("border")} />
        {isResultPage && <div className="number">{index + 1}</div>}

        <div className={classNames("inner")}>
          <div className={classNames("image-wrapper")}>
            <div
              style={{
                backgroundImage: `url('${imageSrc}'), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWDEOaqDXtUswwG_M29-z0hIYG-YQqUPBUidpFBHv6g60GgpYq2VQesjbpmVVu8kfd-pw&usqp=CAU')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="image"
            />
            {layoutType === "image" && titleComponent()}
            {layoutType === "image" && <div className="overlay" />}
          </div>
          <div
            className={classNames("text-info", {
              onlyTextStyle: !isResultPage && layoutType === "text",
            })}
          >
            {titleComponent()}
            {description && <p>{description}</p>}
          </div>
        </div>
        {layoutType === "text" && !isResultPage && (
          <button onClick={onClickSubmit} className={classNames("select-btn")}>
            <span>{title} 선택</span>
          </button>
        )}
      </li>
    )
  )
}

export default React.memo(Candidate)
