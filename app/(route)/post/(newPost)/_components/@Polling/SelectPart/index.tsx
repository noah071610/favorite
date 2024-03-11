"use client"

import TextareaAutosize from "react-textarea-autosize"

import { getImageUrl } from "@/_data"
import { uploadImage } from "@/_queries/newPost"
import { useNewPostStore } from "@/_store/newPost"
import { PollingCandidateType } from "@/_types/post/polling"
import classNames from "classNames"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const lineMax = 5

const CandidateInput = React.memo(({ index }: { index: number }) => {
  const { t, i18n } = useTranslation(["newPost"])
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { setCandidate, candidates } = useNewPostStore()
  const [originalDesc, setOriginalDesc] = useState("")
  const textAreaHeight = () => {
    if (textareaRef?.current) {
      return textareaRef?.current.clientHeight ?? 0
    }
    return 0
  }

  useEffect(() => {
    if (!!originalDesc && textAreaHeight() > 110) {
      setCandidate({ index, payload: originalDesc, type: "description" })
      setOriginalDesc("")
    }
  })

  const onChangeInput = (e: any, type: "title" | "description") => {
    const inputValue = e.target.value
    const lines = inputValue.split("\n")

    if (lines.length <= lineMax) {
      let newText = ""
      lines.forEach((line: string, index: number) => {
        if (line.length <= 100) {
          newText += line
          if (index !== lines.length - 1) {
            newText += "\n"
          }
        }
      })

      if (type === "description") {
        setOriginalDesc(e.target.value.slice(0, -1))
      }
      setCandidate({ index, payload: e.target.value, type })
    }
  }

  const targetCandidate = candidates[index]
  const isBigFont = i18n.language === "ko" || i18n.language === "ja"

  return (
    targetCandidate && (
      <>
        <input
          placeholder={t("enterCandidateTitle")}
          className={cx(style["title-input"])}
          value={targetCandidate.title}
          onChange={(e) => onChangeInput(e, "title")}
          maxLength={isBigFont ? 40 : 50}
        />
        <TextareaAutosize
          placeholder={t("enterCandidateDesc")}
          className={cx(style["description-input"])}
          value={targetCandidate.description}
          onChange={(e) => onChangeInput(e, "description")}
          maxLength={isBigFont ? 155 : 250}
          ref={textareaRef}
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
    maxSize: 8000000,
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
        <div className={cx(style["input-wrapper"])}>
          <CandidateInput index={index} />
        </div>
      </div>
    </>
  )
}
