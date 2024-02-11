"use client"

import "@/(route)/post/[postId]/_components/Candidate/style.scss"
import { useNewPostStore } from "@/_store/newPost"
import { usePostStore } from "@/_store/post"
import { CandidateType } from "@/_types/post"
import classNames from "classnames"
import React, { useEffect, useState } from "react"
import CountUp from "react-countup"
import "./style.scss"

function EditorCandidate({
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
  const { setViewCandidateNum } = usePostStore()
  const { selectedCandidate, deleteCandidate, setSelectedCandidate } = useNewPostStore()

  const onClickSelect = (e: any, candidate: CandidateType) => {
    if (!e.target.className.includes("delete-")) {
      !isResultPage && setSelectedCandidate(candidate)
    } else {
      setCandidateStatus("delete")
    }
  }
  const onMouseEnterCard = (candidate: CandidateType) => {
    setViewCandidateNum(candidate.number)
  }
  const onMouseLeaveCard = () => {
    setViewCandidateNum(0)
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

  return (
    <li
      onClick={(e) => onClickSelect(e, candidate)}
      onMouseEnter={() => onMouseEnterCard(candidate)}
      onMouseLeave={onMouseLeaveCard}
      style={{
        animation: isResultPage
          ? `fade-move-up ${1100 + index * 20}ms ${index * 100}ms cubic-bezier(0,1.1,.78,1) forwards`
          : candidateStatus === "delete"
          ? "candidate-delete 500ms forwards"
          : candidateStatus === "add"
          ? "candidate-add 500ms forwards"
          : "none", // memo: 드래그 드롭 순서변경 시 애니메이션 방지용
        opacity: isResultPage ? 0 : 1,
      }}
    >
      <div
        className={classNames("candidate-card-bg", {
          selected: isSelected,
        })}
      ></div>
      <div
        className={classNames("candidate-card editor-candidate-card", {
          selected: isSelected,
        })}
      >
        {!isResultPage && (
          <button className="delete-candidate">
            <i className="fa-solid fa-x delete-icon"></i>
          </button>
        )}
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
            <div className="number ranking">{index + 1}</div>
          </>
        )}

        <div className={classNames("candidate-card-inner", { isResultPage })}>
          <div className="candidate-image-wrapper">
            <div
              style={{
                backgroundImage: `url('${imageSrc}'), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWDEOaqDXtUswwG_M29-z0hIYG-YQqUPBUidpFBHv6g60GgpYq2VQesjbpmVVu8kfd-pw&usqp=CAU')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="candidate-image"
            />
          </div>
          <div className="candidate-description">
            <h3>
              <span className={classNames("title", { isEdit: !isResultPage })}>
                {title.trim() ? title : "후보명 입력 (필수)"}
              </span>
              {isResultPage && (
                <span className="count">
                  <CountUp prefix="(" suffix="표)" duration={4} end={count} />
                </span>
              )}
            </h3>
            {!isResultPage && !description && <p className="place-holder">후보 설명 입력 (옵션)</p>}
            {description && <p>{description}</p>}
          </div>
        </div>
      </div>
    </li>
  )
}

export default React.memo(EditorCandidate)
