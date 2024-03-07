"use client"

import TextareaAutosize from "react-textarea-autosize"

import { uploadImage } from "@/_queries/newPost"
import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"

import { getImageUrl } from "@/_data"
import { useNewPostStore } from "@/_store/newPost"
import { PollingCandidateType } from "@/_types/post/polling"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const CandidateInput = React.memo(({ index }: { index: number }) => {
  const { setCandidate, candidates } = useNewPostStore()

  const onChangeInput = (e: any, type: "title" | "description") => {
    if (type === "title" && e.target.value.length >= 30) return
    setCandidate({ index, payload: e.target.value, type })
  }

  const targetCandidate = candidates[index]

  return (
    targetCandidate && (
      <>
        <input
          placeholder="후보명 입력 (필수)"
          className={cx(style["title-input"])}
          value={targetCandidate.title}
          onChange={(e) => onChangeInput(e, "title")}
        />
        <TextareaAutosize
          placeholder="후보 설명 입력 (옵션)"
          className={cx(style["description-input"])}
          value={targetCandidate.description}
          onChange={(e) => onChangeInput(e, "description")}
          maxLength={180}
        />
      </>
    )
  )
})
CandidateInput.displayName = "CandidateInput"

export default function SelectPart({ index, candidate }: { index: number; candidate: PollingCandidateType }) {
  const { setCandidate, content, selectedCandidateIndex } = useNewPostStore()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file: File) => {
        const formData = new FormData()
        formData.append("image", file)

        const { msg, imageSrc } = await uploadImage(formData)
        if (msg === "ok") {
          setCandidate({ index, payload: imageSrc, type: "imageSrc" })
        }
      })
    },
    [setCandidate, index]
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
      <div
        key={candidate.listId}
        className={cx(style["select-part"], { [style.selected]: index === selectedCandidateIndex })}
      >
        {content.layout !== "text" && (
          <div
            style={{
              background: getImageUrl({ url: candidate.imageSrc, isCenter: true }),
            }}
            className={cx(style.image, style["drop-zone"], { [style.active]: isDragActive })}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <i className={cx("fa-solid", "fa-plus", { [style.active]: isDragActive })} />
          </div>
        )}
        <div className={cx(style["description-input"])}>
          <CandidateInput index={index} />
        </div>
      </div>
    </>
  )
}
