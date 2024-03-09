"use client"

import { uploadImage } from "@/_queries/newPost"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import TextareaAutosize from "react-textarea-autosize"

import { getImageUrl } from "@/_data"
import { useNewPostStore } from "@/_store/newPost"
import classNames from "classNames"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Dropzone({ index }: { index: number }) {
  const { t } = useTranslation(["content"])
  const { setCandidate, candidates } = useNewPostStore()
  const candidate = candidates[index]

  const onChangeInput = (e: any) => {
    if (e.target.value.length >= 40) return
    setCandidate({
      index,
      payload: e.target.value,
      type: "title",
    })
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
  return (
    <div className={cx("global-select")}>
      <div className={cx("global-select-inner")}>
        {candidate.imageSrc ? (
          <div className={cx(style.thumbnail)}>
            <button onClick={onClickDeleteImage} className={cx(style.close)}>
              <i className={cx("fa-solid", "fa-close")}></i>
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
            <i className={cx("fa-solid", "fa-plus", { [style.active]: isDragActive })} />
          </div>
        )}
        <div className={cx("description")}>
          <div className={cx("title-wrapper")}>
            <TextareaAutosize
              placeholder={t("enterCandidateName")}
              className={cx(style["title-input"])}
              value={candidate.title}
              onChange={onChangeInput}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
