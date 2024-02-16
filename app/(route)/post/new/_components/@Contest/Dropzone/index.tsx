"use client"

import { uploadImage } from "@/_queries/newPost"
import { useContestTypeStore } from "@/_store/newPost/contest"
import classNames from "classnames"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import TextareaAutosize from "react-textarea-autosize"

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
    [direction]
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
      <div className="contest-candidate">
        <div
          style={{
            background: `url('${candidate.imageSrc}') center / cover`,
          }}
          className={classNames("thumbnail", { active: isDragActive })}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <i className={classNames("fa-solid fa-plus", { active: isDragActive })} />
        </div>
        <div className="description">
          <div className="title-wrapper">
            <TextareaAutosize
              placeholder="후보명 입력 (필수)"
              className=" title-input"
              value={candidate.title}
              onChange={onChangeInput}
            />
          </div>
        </div>
      </div>
    </>
  )
}
