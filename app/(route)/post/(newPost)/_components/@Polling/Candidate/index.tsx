"use client"

import { getImageUrl } from "@/_data"
import { noImageUrl } from "@/_data/post"
import { useNewPostStore } from "@/_store/newPost"
import classNames from "classNames"
import React, { useEffect, useState } from "react"
import style from "./style.module.scss"

function Candidate({
  candidate,
  targetIndex,
  setGrabDisplay,
}: {
  candidate: { [key: string]: any }
  targetIndex: number
  setGrabDisplay: (b: boolean) => void
}) {
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
    if (e.target.className.includes("delete-")) {
      setCandidateStatus("delete")
      setGrabDisplay(false)
    } else {
      setSelectedCandidateIndex(targetIndex === selectedCandidateIndex ? -1 : targetIndex)
    }
  }

  useEffect(() => {
    if (candidateStatus === "delete") {
      setTimeout(() => {
        deleteCandidate({ index: targetIndex })
      }, 480)
    }
  }, [candidateStatus, deleteCandidate, listId, setContent, targetIndex])

  useEffect(() => {
    setTimeout(() => {
      setCandidateStatus("static")
    }, 500)
  }, [])

  const isSelected = selectedCandidateIndex === targetIndex

  const titleComponent = () => (
    <div className={classNames("title")}>
      <h3>{title.trim() ? title : "후보명 입력 (필수)"}</h3>
    </div>
  )

  return (
    <div
      className={classNames("global-candidate", `layout-${layout}`, {
        ["selected"]: isSelected,
      })}
      onClick={onClickSelect}
      style={{
        animation:
          candidateStatus === "delete"
            ? style[(layout === "image" ? "image-" : "") + "candidate-delete"] + " 500ms forwards"
            : candidateStatus === "add"
            ? style[(layout === "image" ? "image-" : "") + "candidate-add"] + " 500ms forwards"
            : "none",
        opacity: 1,
      }}
    >
      <div className={classNames("border")} />
      <button className={classNames(style["delete-candidate"])}>
        <i className={classNames("fa-solid", "fa-x", style["delete-icon"])} />
      </button>

      <div className={classNames("inner")}>
        <div className={classNames("image-wrapper")}>
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
        <div className={classNames("content")}>
          {titleComponent()}
          {description ? <p>{description}</p> : <p className={classNames("place-holder")}>후보 설명 입력 (옵션)</p>}
        </div>
      </div>
    </div>
  )
}

export default React.memo(Candidate)
