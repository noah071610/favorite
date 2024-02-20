"use client"

import { uploadImage } from "@/_queries/newPost"
import { useContestTypeStore } from "@/_store/newPost/contest"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import TextareaAutosize from "react-textarea-autosize"

import style from "@/(route)/post/contest/[postId]/candidate.module.scss"
import classNames from "classNames"
import _style from "./style.module.scss"
const cx = classNames.bind(style, _style)

export default function Dropzone({ direction }: { direction: "left" | "right" }) {
  const { leftCandidate, rightCandidate, setCandidate } = useContestTypeStore()
  const candidate = direction === "left" ? leftCandidate : rightCandidate

  const onChangeInput = (e: any) => {
    if (e.target.value.length >= 40) return
    setCandidate(direction, {
      title: e.target.value,
    })
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file: any) => {
        const formData = new FormData()
        formData.append("image", file)

        const { msg, imageSrc } = await uploadImage(formData)
        if (msg === "ok") {
          setCandidate(direction, { imageSrc })
        }
      })
    },
    [direction, setCandidate]
  )

  const onClickDeleteImage = () => {
    setCandidate(direction, {
      imageSrc: undefined,
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
    },
  })
  return (
    <>
      <div className={cx(style.candidate, style[direction])}>
        <div className={cx(style["candidate-inner"])}>
          {candidate.imageSrc ? (
            <>
              <button onClick={onClickDeleteImage} className={cx(_style.close)}>
                <i className={cx("fa-solid", "fa-close")}></i>
              </button>
              <div
                style={{
                  backgroundImage: `url('${candidate.imageSrc}')`,
                }}
                className={cx(style.thumbnail)}
              ></div>
              <div
                className={cx(style["thumbnail-overlay"])}
                style={{
                  backgroundImage: `url('${candidate.imageSrc}')`,
                }}
              ></div>
            </>
          ) : (
            <div className={cx(_style["thumbnail-drop-zone"])} {...getRootProps()}>
              <input {...getInputProps()} />
              <i className={cx("fa-solid", "fa-plus", { [style.active]: isDragActive })} />
            </div>
          )}
          <div className={cx(style.description)}>
            <div className={cx(style["title-wrapper"])}>
              <TextareaAutosize
                placeholder="후보명 입력 (필수)"
                className={cx(_style["title-input"])}
                value={candidate.title}
                onChange={onChangeInput}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
