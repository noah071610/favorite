"use client"

import style from "@/(route)/post/polling/[postId]/_components/Candidate/style.module.scss"
import { usePollingStore } from "@/_store/newPost/polling"
import { PollingCandidateType } from "@/_types/post/polling"
import classNames from "classNames"
import React, { useEffect, useState } from "react"
import CountUp from "react-countup"
import _style from "./style.module.scss"
const cx = classNames.bind(style)

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
  const { selectedCandidate, deleteCandidate, setSelectedCandidate, layoutType } = usePollingStore()

  const onClickSelect = (e: any, candidate: PollingCandidateType) => {
    if (!e.target.className.includes("delete-")) {
      setSelectedCandidate(candidate)
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

  return (
    <li
      className={cx(style.candidate, style[`layout-${layoutType}`], {
        [style.selected]: isSelected,
      })}
      onClick={(e) => onClickSelect(e, candidate)}
      style={{
        animation:
          candidateStatus === "delete"
            ? _style[(layoutType === "image" ? "image-" : "") + "candidate-delete"] + " 500ms forwards"
            : candidateStatus === "add"
            ? _style[(layoutType === "image" ? "image-" : "") + "candidate-add"] + " 500ms forwards"
            : "none",

        opacity: 1,
      }}
    >
      <div className={cx(style.border)} />
      <button className={cx(_style["delete-candidate"])}>
        <i className={cx("fa-solid", "fa-x", style["delete-icon"])} />
      </button>

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
        <div className={cx(style.content)}>
          {titleComponent()}
          {description ? <p>{description}</p> : <p className={cx(style["place-holder"])}>후보 설명 입력 (옵션)</p>}
        </div>
      </div>
    </li>
  )
}

export default React.memo(Candidate)
