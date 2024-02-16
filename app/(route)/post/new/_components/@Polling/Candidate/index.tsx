"use client"

import "@/(route)/post/[postId]/_components/@Polling/Candidate/style.scss"
import { useNewPostStore } from "@/_store/newPost"
import { usePollingStore } from "@/_store/newPost/polling"
import { CandidateType } from "@/_types/post"
import classNames from "classnames"
import React, { useEffect, useState } from "react"
import CountUp from "react-countup"
import "./style.scss"

function Candidate({
  isResultPage,
  candidate,
  index,
}: {
  isResultPage: boolean
  candidate: CandidateType
  index: number
}) {
  const { count, description, listId, title, imageSrc } = candidate
  const [candidateStatus, setCandidateStatus] = useState<"add" | "delete" | "static">("add")
  const { newPost } = useNewPostStore()
  const { selectedCandidate, deleteCandidate, setSelectedCandidate } = usePollingStore()

  const onClickSelect = (e: any, candidate: CandidateType) => {
    if (!e.target.className.includes("delete-")) {
      !isResultPage && setSelectedCandidate(candidate)
    } else {
      setCandidateStatus("delete")
    }
  }

  useEffect(() => {
    if (candidateStatus === "delete") {
      setTimeout(() => {
        deleteCandidate(listId)
      }, 480)
    }
  }, [candidateStatus, listId, deleteCandidate])

  useEffect(() => {
    setTimeout(() => {
      setCandidateStatus("static")
    }, 500)
  }, [])

  const isSelected = selectedCandidate?.listId === listId

  const titleComponent = () => (
    <div className="title">
      <h3>{title.trim() ? title : "후보명 입력 (필수)"}</h3>
      {isResultPage && (
        <span className="count">
          <CountUp prefix="(" suffix="표)" duration={4} end={count} />
        </span>
      )}
    </div>
  )

  const layoutStyle = newPost?.content.layout!

  return (
    <li
      className={classNames("candidate-card", {
        selected: isSelected,
        isResultPage,
        [layoutStyle]: layoutStyle,
      })}
      onClick={(e) => onClickSelect(e, candidate)}
      style={{
        animation: isResultPage
          ? `fade-move-up ${1100 + index * 20}ms ${index * 100}ms cubic-bezier(0,1.1,.78,1) forwards`
          : candidateStatus === "delete"
          ? (layoutStyle === "image" ? "image-" : "") + "candidate-delete 500ms forwards"
          : candidateStatus === "add"
          ? (layoutStyle === "image" ? "image-" : "") + "candidate-add 500ms forwards"
          : "none", // memo: 드래그 드롭 순서변경 시 애니메이션 방지용
        opacity: isResultPage ? 0 : 1,
      }}
    >
      <div className={classNames("border")} />
      {!isResultPage && (
        <button className="delete-candidate">
          <i className="fa-solid fa-x delete-icon" />
        </button>
      )}
      {/* memo: 결과 페이지만 적용 */}
      {isResultPage && <div className="number ranking">{index + 1}</div>}

      <div className={classNames("inner")}>
        <div className={classNames("image-wrapper")}>
          <div
            style={{
              backgroundImage: `url('${imageSrc}'), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWDEOaqDXtUswwG_M29-z0hIYG-YQqUPBUidpFBHv6g60GgpYq2VQesjbpmVVu8kfd-pw&usqp=CAU')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className={classNames("image")}
          />
          {layoutStyle === "image" && titleComponent()}
          {layoutStyle === "image" && <div className="overlay" />}
        </div>
        <div className="text-info">
          {titleComponent()}
          {!isResultPage && !description && <p className="place-holder">후보 설명 입력 (옵션)</p>}
          {description && <p>{description}</p>}
        </div>
      </div>
    </li>
  )
}

export default React.memo(Candidate)
