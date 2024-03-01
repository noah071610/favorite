"use client"

import selectPartStyle from "@/(route)/post/polling/[postId]/_components/SelectPart/style.module.scss"
import { scaleUpAnimation } from "@/_styles/animation"
import TextareaAutosize from "react-textarea-autosize"

import { uploadImage } from "@/_queries/newPost"
import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Resizer from "react-image-file-resizer"

import style from "@/(route)/post/polling/[postId]/_components/SelectPart/style.module.scss"
import { useNewPostStore } from "@/_store/newPost"
import classNames from "classNames"
import _style from "./style.module.scss"
const cx = classNames.bind(style, selectPartStyle)

const resizeFile = (file: File) =>
  new Promise((res) => {
    Resizer.imageFileResizer(file, 1500, 1500, "JPEG", 60, 0, (uri) => res(uri), "base64")
  })

const CandidateInput = React.memo(() => {
  const { selectedCandidateIndex, setCandidate, candidates, content } = useNewPostStore()

  const onChangeInput = (e: any, type: "title" | "description") => {
    if (selectedCandidateIndex > -1) {
      if (type === "title" && e.target.value.length >= 30) return
      setCandidate({ index: selectedCandidateIndex, payload: e.target.value, type })
    }
  }

  const targetCandidate = candidates[selectedCandidateIndex]

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

export default function SelectPart() {
  const { selectedCandidateIndex, candidates, setCandidate, content } = useNewPostStore()
  const candidate = candidates[selectedCandidateIndex]

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (selectedCandidateIndex > -1) {
        acceptedFiles.forEach(async (file: File) => {
          const compressFile = (await resizeFile(file)) as File
          const formData = new FormData()
          formData.append("image", compressFile)

          const { msg, imageSrc } = await uploadImage(formData)
          if (msg === "ok") {
            setCandidate({ index: selectedCandidateIndex, payload: imageSrc, type: "imageSrc" })
          }
        })
      }
    },
    [selectedCandidateIndex, setCandidate]
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
      {candidate ? (
        <div key={candidate.listId} className={cx(style["select-part"])}>
          {content.layout !== "text" && (
            <div
              style={{
                background: `url('${candidate.imageSrc}') center / cover`,
                ...scaleUpAnimation(250),
              }}
              className={cx(style.image, _style["drop-zone"], { [_style.active]: isDragActive })}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <i className={cx("fa-solid", "fa-plus", { [_style.active]: isDragActive })} />
            </div>
          )}
          <div className={cx(_style["description-input"])}>
            <CandidateInput />
          </div>
        </div>
      ) : (
        <div className={cx(style.unselected)}>
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
