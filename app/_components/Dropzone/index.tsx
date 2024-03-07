"use client"

import { uploadImage } from "@/_queries/newPost"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import TextareaAutosize from "react-textarea-autosize"

import { getImageUrl } from "@/_data"
import { useNewPostStore } from "@/_store/newPost"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Dropzone({ index }: { index: number }) {
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
  })
  // todo: lef right 클래스 네임 없어짐. 뭐가 달라졌을까
  return (
    <div className={cx("global-select")}>
      <div className={cx("global-select-inner")}>
        {candidate.imageSrc ? (
          <>
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
          </>
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
              placeholder="후보명 입력 (필수)"
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