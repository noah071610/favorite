"use client"

import { uploadImage } from "@/_queries/newPost"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import TextareaAutosize from "react-textarea-autosize"

import { getImageUrl } from "@/_data"
import { useNewPostStore } from "@/_store/newPost"
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const lineMax = 5

export default function Dropzone({ index }: { index: number }) {
  const { t, i18n } = useTranslation(["content"])
  const { setCandidate, candidates } = useNewPostStore()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [originalTitle, setOriginalTitle] = useState("")
  const candidate = candidates[index]
  const textAreaHeight = () => {
    if (textareaRef?.current) {
      return textareaRef?.current.clientHeight ?? 0
    }
    return 0
  }

  useEffect(() => {
    if (!!originalTitle && textAreaHeight() > 150) {
      setCandidate({ index, payload: originalTitle, type: "title" })
      setOriginalTitle("")
    }
  })

  const onChangeInput = (e: any) => {
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

      setOriginalTitle(e.target.value.slice(0, -1))
      setCandidate({
        index,
        payload: e.target.value,
        type: "title",
      })
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(async (file: any) => {
      const formData = new FormData()
      formData.append("image", file)

      const { msg, imageSrc } = await uploadImage(formData)
      if (msg === "ok") {
        setCandidate({
          index,
          payload: imageSrc,
          type: "imageSrc",
        })
      }
    })
  }, [])

  const onClickDeleteImage = () => {
    setCandidate({
      index,
      payload: "",
      type: "imageSrc",
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
    },
    maxSize: 8000000,
  })

  const isBigFont = i18n.language === "ko" || i18n.language === "ja"

  return (
    <div className={cx("global-select")}>
      <div className={cx("global-select-inner")}>
        {candidate.imageSrc ? (
          <div className={cx(style.thumbnail)}>
            <button onClick={onClickDeleteImage} className={cx(style.close)}>
              <FontAwesomeIcon icon={faClose} />
            </button>
            <div
              style={{
                backgroundImage: getImageUrl({ url: candidate.imageSrc }),
              }}
              className={cx("thumbnail")}
            ></div>
            <div
              className={cx("thumbnail-overlay")}
              style={{
                backgroundImage: getImageUrl({ url: candidate.imageSrc }),
              }}
            ></div>
          </div>
        ) : (
          <div
            style={{
              background: getImageUrl({ url: "/images/post/no-image.png", isCenter: true }),
            }}
            className={cx(style["thumbnail-drop-zone"])}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <FontAwesomeIcon className={cx({ [style.active]: isDragActive })} icon={faPlus} />
          </div>
        )}
        <div className={cx("description")}>
          <div className={cx("title-wrapper")}>
            <TextareaAutosize
              placeholder={t("enterCandidateName")}
              className={cx(style["title-input"])}
              value={candidate.title}
              onChange={onChangeInput}
              maxLength={isBigFont ? 155 : 250}
              ref={textareaRef}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
