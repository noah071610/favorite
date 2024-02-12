"use client"

import { CandidateDisplayType } from "@/_store/newPost"
import { fadeMoveUpAnimation } from "@/_styles/animation"
import { ListType } from "@/_types/post"
import classNames from "classnames"
import React from "react"
import CountUp from "react-countup"
import "./style.scss"

function Candidate({
  isResultPage,
  votedListId,
  selectedCandidate,
  setSelectedCandidate,
  candidate,
  index,
  type,
  onClickSubmit,
}: {
  isResultPage: boolean
  selectedCandidate: ListType | null
  setSelectedCandidate: (state: ListType | null) => void
  votedListId?: string
  candidate: ListType
  index: number
  type: CandidateDisplayType
  onClickSubmit: () => void
}) {
  const { count, description, listId, title, imageSrc } = candidate

  const onClickSelect = (candidate: ListType) => {
    !isResultPage && setSelectedCandidate(candidate)
  }

  const isSelected = (selectedCandidate?.listId || votedListId) === listId

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
    <li
      className={classNames("candidate-card", { selected: isSelected, isResultPage, [type]: type })}
      onClick={() => onClickSelect(candidate)}
      style={fadeMoveUpAnimation(1100 + index * 20, index * 100)}
    >
      <div className={classNames("border")} />
      {/* memo: 결과 페이지만 적용 */}
      {isResultPage && (
        <>
          {index === 0 && (
            <img
              className="number-one"
              src={`/images/ranking/number_${index + 1}.png`}
              alt={`ranking_number_${index + 1}`}
            />
          )}
          <div className="number">{index + 1}</div>
        </>
      )}

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
          {type === "image" && titleComponent()}
          {type === "image" && <div className="overlay" />}
        </div>
        <div
          className={classNames("text-info", {
            onlyTextStyle: !isResultPage && type === "text",
          })}
        >
          {titleComponent()}
          {description && <p>{description}</p>}
        </div>
      </div>
      {type === "text" && !isResultPage && (
        <button onClick={onClickSubmit} className={classNames("select-btn")}>
          <span>{title} 선택</span>
        </button>
      )}
    </li>
  )
}

export default React.memo(Candidate)
