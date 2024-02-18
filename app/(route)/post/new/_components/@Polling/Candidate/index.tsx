"use client"

import candidateStyle from "@/(route)/post/polling/[postId]/_components/Candidate/style.module.scss"
import { useNewPostStore } from "@/_store/newPost"
import { usePollingStore } from "@/_store/newPost/polling"
import { PollingCandidateType } from "@/_types/post/polling"
import classNames from "classNames"
import React, { useEffect, useState } from "react"
import CountUp from "react-countup"
import style from "./style.module.scss"
const cx = classNames.bind(style, candidateStyle)

function Candidate({
  isResultPage,
  candidate,
  index,
}: {
  isResultPage: boolean
  candidate: PollingCandidateType
  index: number
}) {
  const { count, description, listId, title, imageSrc } = candidate
  const [candidateStatus, setCandidateStatus] = useState<"add" | "delete" | "static">("add")
  const { newPost } = useNewPostStore()
  const { selectedCandidate, deleteCandidate, setSelectedCandidate } = usePollingStore()

  const onClickSelect = (e: any, candidate: PollingCandidateType) => {
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
    <div className={cx(style.title)}>
      <h3>{title.trim() ? title : "후보명 입력 (필수)"}</h3>
      {isResultPage && (
        <span className={cx(style.count)}>
          <CountUp prefix="(" suffix="표)" duration={4} end={count} />
        </span>
      )}
    </div>
  )

  const layoutStyle = newPost?.content.layout!

  return (
    <li
      className={cx(style["candidate-card"], {
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
      <div className={cx(style.border)} />
      {!isResultPage && (
        <button className={cx(style["delete-candidate"])}>
          <i className={cx("fa-solid", "fa-x", style["delete-icon"])} />
        </button>
      )}
      {/* memo: 결과 페이지만 적용 */}
      {isResultPage && <div className={cx(style.number, style.ranking)}>{index + 1}</div>}

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
          {layoutStyle === "image" && titleComponent()}
          {layoutStyle === "image" && <div className={cx(style.overlay)} />}
        </div>
        <div className={cx(style["text-info"])}>
          {titleComponent()}
          {!isResultPage && !description && <p className={cx(style["place-holder"])}>후보 설명 입력 (옵션)</p>}
          {description && <p>{description}</p>}
        </div>
      </div>
    </li>
  )
}

export default React.memo(Candidate)
