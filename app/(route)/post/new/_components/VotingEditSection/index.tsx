"use client"

import "@/(route)/post/[postId]/_components/Voting/style.scss"
import { scaleUpAnimation } from "@/_styles/animation"
import TextareaAutosize from "react-textarea-autosize"

import { uploadImage } from "@/_queries/post"
import { useNewPostStore } from "@/_store/newPost"
import classNames from "classnames"
import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Resizer from "react-image-file-resizer"
import "./style.scss"

const resizeFile = (file: File) =>
  new Promise((res) => {
    Resizer.imageFileResizer(file, 1500, 1500, "JPEG", 60, 0, (uri) => res(uri), "base64")
  })

const CandidateInput = React.memo(() => {
  const { changeCandidate, selectedCandidate, candidateDisplayType } = useNewPostStore()

  const onChangeInput = (e: any, type: "title" | "description") => {
    if (selectedCandidate) {
      if (type === "title" && e.target.value.length >= 30) return
      changeCandidate(selectedCandidate.listId, { [type]: e.target.value })
    }
  }
  return (
    selectedCandidate && (
      <>
        <input
          placeholder="후보명 입력 (필수)"
          className="title-input"
          value={selectedCandidate.title}
          onChange={(e) => onChangeInput(e, "title")}
        />
        <TextareaAutosize
          placeholder="후보 설명 입력 (옵션)"
          className="description-input"
          value={selectedCandidate.description}
          onChange={(e) => onChangeInput(e, "description")}
          maxLength={180}
        />
      </>
    )
  )
})
CandidateInput.displayName = "CandidateInput"

export default function VotingEditSection() {
  const { changeCandidate, selectedCandidate, candidateDisplayType } = useNewPostStore()
  const { listId, imageSrc } = selectedCandidate ?? {}

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (selectedCandidate) {
        acceptedFiles.forEach(async (file: File) => {
          const compressFile = (await resizeFile(file)) as File
          const formData = new FormData()
          formData.append("image", compressFile)

          const { msg, imageSrc } = await uploadImage(formData)
          if (msg === "ok") {
            changeCandidate(listId ?? "", { imageSrc })
          }
        })
      }
    },
    [selectedCandidate, changeCandidate, listId]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
    },
  })

  return (
    <>
      {selectedCandidate ? (
        <div key={listId} className={classNames("voting", { isTextType: candidateDisplayType === "text" })}>
          {candidateDisplayType !== "text" && (
            <div
              style={{
                background: `url('${imageSrc}') center / cover`,
                ...scaleUpAnimation(250),
              }}
              className={classNames("voting-image", { active: isDragActive })}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <i className={classNames("fa-solid fa-plus", { active: isDragActive })} />
            </div>
          )}
          <div className="voting-description">
            <CandidateInput />
          </div>
        </div>
      ) : (
        <div className="unselected">
          <div>
            <span>
              후보 편집창 입니다
              <br /> 후보를 선택해주세요
            </span>
          </div>
        </div>
      )}
    </>
  )
}
