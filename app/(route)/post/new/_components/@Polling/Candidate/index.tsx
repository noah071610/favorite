"use client"

import style from "@/(route)/post/polling/[postId]/_components/Candidate/style.module.scss"
import { useNewPostStore } from "@/_store/newPost"
import classNames from "classNames"
import React, { useEffect, useState } from "react"
import _style from "./style.module.scss"
const cx = classNames.bind(style)

function Candidate({ candidate, targetIndex }: { candidate: { [key: string]: any }; targetIndex: number }) {
  const { description, listId, title, imageSrc } = candidate
  const [candidateStatus, setCandidateStatus] = useState<"add" | "delete" | "static">("add")
  const {
    selectedCandidateIndex,
    setSelectedCandidateIndex,
    deleteCandidate,
    setContent,
    content: { layout },
  } = useNewPostStore()

  const onClickSelect = (e: any) => {
    if (!e.target.className.includes("delete-")) {
      setSelectedCandidateIndex(targetIndex)
    } else {
      setCandidateStatus("delete")
    }
  }

  useEffect(() => {
    if (candidateStatus === "delete") {
      setTimeout(() => {
        deleteCandidate({ index: targetIndex })
      }, 480)
    }
  }, [candidateStatus, listId, setContent, targetIndex])

  useEffect(() => {
    setTimeout(() => {
      setCandidateStatus("static")
    }, 500)
  }, [])

  const isSelected = selectedCandidateIndex === targetIndex

  const titleComponent = () => (
    <div className={cx(style.title)}>
      <h3>{title.trim() ? title : "후보명 입력 (필수)"}</h3>
    </div>
  )

  return (
    <li
      className={cx(style.candidate, style[`layout-${layout}`], {
        [style.selected]: isSelected,
      })}
      onClick={onClickSelect}
      style={{
        animation:
          candidateStatus === "delete"
            ? _style[(layout === "image" ? "image-" : "") + "candidate-delete"] + " 500ms forwards"
            : candidateStatus === "add"
            ? _style[(layout === "image" ? "image-" : "") + "candidate-add"] + " 500ms forwards"
            : "none",
        opacity: 1,
      }}
    >
      <div className={cx(style.border)} />
      <button className={cx(_style["delete-candidate"])}>
        <i className={cx("fa-solid", "fa-x", _style["delete-icon"])} />
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
          {layout === "image" && titleComponent()}
          {layout === "image" && <div className={cx(style.overlay)} />}
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
